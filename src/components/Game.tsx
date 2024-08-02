import React from 'react'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Guesses from './Guesses';
import Keyboard from './Keyboard';
import Modal from './Modal';
import HowToPlay from './HowToPlay';
import { dictionary } from '../data';
import { GREY, GREEN, YELLOW } from '../constants';
import type { GameState, Guess, GuessedLetters } from '../types';
import packageJSON from '../../package.json'
// Today new Date().toJSON().split('T')[0]
export default function Game() {
    const [wordOfTheDay, setWordOfTheDay] = React.useState<string>('');
    const [currentGuess, setCurrentGuess] = React.useState<string[]>([]);
    const [today, setToday] = React.useState(new Date().toJSON().split('T')[0]);
    const [guesses, setGuesses] = React.useState<Guess[]>([]);
    const [guessedLetters, setGuessedLetters] = React.useState<GuessedLetters>({})
    const [transitionState, setTransitionState] = React.useState<any>(null);
    const [revealWord, setRevealWord] = React.useState<boolean>(false);
    const [guessedWordDoesNotExist, setGuessedWordDoesNotExist] = React.useState<boolean>(false);
    const [gameOver, setGameOver] = React.useState(false);
    const [timeline, setTimeline] = React.useState<any>(null);
    const [currentPosition, setCurrentPosition] = React.useState<number>(0);
    const [deleteAtCurrentPosition, setDeleteAtCurrentPosition] = React.useState<boolean>(false);
    const [lastLetterSet, setLastLetterSet] = React.useState<boolean>(false);
    const [showInstructions, setShowInstructions] = React.useState<boolean>(false);

    const modalRef = React.useRef<HTMLButtonElement>(null)
    const guessContainerRef = React.useRef<HTMLDivElement>(null);
    const toastRef = React.useRef<HTMLParagraphElement>(null);

    React.useEffect(() => {
        const tl = gsap.timeline({ paused: true });
        setTimeline(tl);
        const result: null | GameState = JSON.parse(localStorage.getItem(today) || 'null');
        try {
            const instructionsSeen: boolean = JSON.parse(localStorage.getItem('instructions') || 'null');
            if (!instructionsSeen) {
                setShowInstructions(true);
                localStorage.setItem('instructions', JSON.stringify(true));
            }
        } catch (err) {
            console.log('err', err)
        }

        if (result) {
            /*
                "2024-07-26": {
                    "wordOfTheDay":  "sueño", // hide this?
                    "guesses": [
                        {
                            "guess": "parís",
                            "letters": [
                                {
                                    "letter": "p",
                                    "status": "grey",
                                },
                                {
                                    "letter": "a",
                                    "status": "grey",
                                },
                                {
                                    "letter": "r",
                                    "status": "grey",
                                },
                                {
                                    "letter": "í",
                                    "status": "grey",
                                },
                                {
                                    "letter": "s",
                                    "status": "yellow",
                                }
                            ]
                        }
                    ],
                    "guessedLetters": {
                        "p": "grey",
                        "a": "grey",
                        "r": "grey",
                        "í": "grey",
                        "s": "yellow" - just track letters that are grey
                    },
                    "gameOver": false
                }
            */
            const { wordOfTheDay, guesses, guessedLetters } = result[today];
        } else {
            // load the word of the day
            // setWordOfTheDay('SUEÑO');
            selectNewWord()
        }
    }, []);

    useGSAP(() => {
        if (!transitionState) return;
        timeline.clear()
        gsap.utils.toArray(".flip").forEach((block: any, i, arr) => {
            const end = arr.length - 1 === i;
            if (i % 2) {
                timeline.add(
                    gsap.from(block, {
                        rotationX: 90,
                        stagger: 0.09,
                        delay: 0.2,
                        duration: 0.25,
                        onComplete: end ? nextPhase : () => { },
                    }),
                    "<"
                )
            } else {
                timeline.add(
                    gsap.to(block, {
                        rotationX: 90,
                        stagger: 0.09,
                        delay: 0.2,
                        duration: 0.25,
                    }),
                    "<"
                )
            }
        })
        timeline.play()
    }, { scope: guessContainerRef, dependencies: transitionState })

    useGSAP(() => {
        // wrong guess animation
        if (!guessedWordDoesNotExist) return;
        timeline.clear();
        timeline.add(
            gsap.to(guessContainerRef.current, {
                x: 15,
                duration: .1,
            })
        )
        timeline.add(
            gsap.to(guessContainerRef.current, {
                x: -15,
                duration: .1,
            })
        )
        timeline.add(
            gsap.to(guessContainerRef.current, {
                x: 0,
                duration: .1,
                onComplete: () => setGuessedWordDoesNotExist(false)
            })
        )
        if (guessContainerRef.current) {
            timeline.add(
                gsap.set(toastRef.current, {
                    y: guessContainerRef.current?.getBoundingClientRect()?.y + window.scrollY + 5,
                })
            )
        }
        timeline.add(
            gsap.to(toastRef.current, {
                opacity: 1,
                duration: 1.2,
                ease: "power3.out"
            }
            ), "<"
        )
        timeline.add(
            gsap.to(toastRef.current, {
                opacity: 0,
                duration: .5,
                ease: "power3.out"
            })
        )
        timeline.play()
    }, { scope: guessContainerRef, dependencies: [guessedWordDoesNotExist] })

    useGSAP(() => {
        if (!gameOver) return;
        timeline.clear();
        timeline.add(
            gsap.from(modalRef.current, {
                y: -100,
                opacity: 0,
                duration: .8,
                ease: "power3.out"
            })
        )
        timeline.play();
    }, { scope: modalRef, dependencies: [gameOver] })

    const selectNewWord = () => {
        const keys = Object.keys(dictionary)
        const word = keys[Math.floor(Math.random() * keys.length)]
        setWordOfTheDay(word);
    }

    const playAgain = () => {
        selectNewWord();
        setGuesses([])
        setGuessedLetters({})
        setGameOver(false);
        setCurrentPosition(0);
        setLastLetterSet(false);
    }
    const onTap = (letter: string) => {
        if (gameOver || currentPosition >= 5 || lastLetterSet) return;
        const newGuess = [...currentGuess]
        newGuess[currentPosition] = letter;
        setCurrentGuess(newGuess);
        setCurrentPosition((currentPosition) => Math.min((currentPosition + 1), 4));
        if ((currentPosition + 1) === 5) {
            setLastLetterSet(true);
        }
    }

    const onEnter = () => {
        if (gameOver) return;
        const guessedWord = currentGuess.join('');
        const wordOfTheDaySplit = wordOfTheDay.split('');
        // check dic
        if (guessedWord.length < 5) return;
        if (!(guessedWord in dictionary)) {
            // toggle toast?
            setGuessedWordDoesNotExist(true)
            return;
        }
        let allGreen = true;
        let i = 0;
        const lettersGuessed = [];
        const greenMap: { [key: string]: string } = {}
        const greyMap: { [key: string]: string } = {}
        const yellowMap: { [key: string]: string } = {}

        // find greens;
        while (i < 5) {
            const g = currentGuess[i];
            const w = wordOfTheDay[i];
            if (g === w) {
                greenMap[g] = GREEN
                wordOfTheDaySplit[i] = '';
                const currGuess = {
                    letter: g,
                    status: GREEN
                }
                lettersGuessed[i] = currGuess;
            } else if (allGreen) {
                allGreen = false
            }
            i++;
        }
        const finalGuess = guesses.length >= 5;
        if (allGreen) {
            setTransitionState({
                allGreen, finalGuess, greenMap, greyMap, yellowMap, guessedWord, lettersGuessed
            });
            return;
        }
        allGreen = false;
        i = 0;
        while (i < 5) {
            if (lettersGuessed[i]) {
                i++
                continue;
            }
            const g = currentGuess[i];
            const currGuess = {
                letter: g,
                status: GREY
            }
            if (wordOfTheDaySplit.includes(g)) {
                currGuess.status = YELLOW
                yellowMap[g] = YELLOW
            } else {
                greyMap[g] = GREY
            }
            lettersGuessed[i] = currGuess;
            i++;
        }

        setTransitionState({
            allGreen, finalGuess, greenMap, greyMap, yellowMap, guessedWord, lettersGuessed
        });

    }

    const endGame = (allGreen: boolean): void => {
        setRevealWord(!allGreen)
        setGameOver(true)
    }

    const nextPhase = () => {
        const { allGreen, finalGuess, greenMap, greyMap, yellowMap, guessedWord, lettersGuessed } = transitionState;
        setGuessedLetters(Object.assign(guessedLetters, greyMap, yellowMap, greenMap))
        setGuesses([...guesses, { guess: guessedWord, letters: lettersGuessed }])

        if (allGreen || finalGuess) {
            // end game
            endGame(allGreen)
        }
        setCurrentGuess([])
        setTransitionState(null);
        setCurrentPosition(0)
        setLastLetterSet(false)
    }

    const onDelete = () => {
        if (currentPosition === 4) {
            setCurrentGuess(currentGuess.slice(0, currentGuess.length - 1));
            setCurrentPosition(_ => Math.max((currentGuess.length - 1), 0));
            setDeleteAtCurrentPosition(false)
            setLastLetterSet(false);
            return;
        }
        const positionToDelete = deleteAtCurrentPosition ? currentPosition : currentPosition - 1;
        const newCurrentGuess = [...currentGuess]
        newCurrentGuess[positionToDelete] = '';
        setCurrentGuess(newCurrentGuess);
        setCurrentPosition(_ => Math.max((positionToDelete), 0));
        setDeleteAtCurrentPosition(false)
        setLastLetterSet(false);
    }

    const updateCurrentPosition = (position: number) => {
        setCurrentPosition(position)
        setDeleteAtCurrentPosition(true);
        setLastLetterSet(false);
    }

    return (
        <>
            <div className='flex flex-col justify-between pt-1 pb-2 md:py-5 h-[100dvh] w-[100dvw] bg-black'>
                <section className='flex justify-between text-center border-b-2 border-opacity-30 border-slate-400 pb-2 '>
                    <div className='w-10 h-10' />
                    <div className='-mb-2 '>
                        <h1 className='text-gray-50 text-center text-xl font-bold'>PALABRÓN</h1>
                        <span className='-mt-5 text-gray-300 text-center text-[.6rem] italic'>({packageJSON.version})</span>
                    </div>
                    <button
                        aria-label='cómo jugar'
                        className='grid place-content-center text-white w-10 h-10'
                        onMouseDown={() => setShowInstructions(!showInstructions)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24"><rect width="24" height="24" fill="none" /><g fill="none"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" /><path fill="currentColor" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m0 2a8 8 0 1 0 0 16a8 8 0 0 0 0-16m0 12a1 1 0 1 1 0 2a1 1 0 0 1 0-2m0-9.5a3.625 3.625 0 0 1 1.348 6.99a.8.8 0 0 0-.305.201c-.044.05-.051.114-.05.18L13 14a1 1 0 0 1-1.993.117L11 14v-.25c0-1.153.93-1.845 1.604-2.116a1.626 1.626 0 1 0-2.229-1.509a1 1 0 1 1-2 0A3.625 3.625 0 0 1 12 6.5" /></g></svg>
                    </button>
                </section>
                <div className='grid place-content-center py-1'>
                    <Guesses
                        ref={guessContainerRef}
                        guesses={guesses}
                        currentGuess={currentGuess}
                        transitionState={transitionState}
                        currentPosition={currentPosition}
                        setCurrentPosition={updateCurrentPosition}
                    />
                </div>
                <Keyboard
                    guessedLetters={guessedLetters}
                    onTap={onTap}
                    onEnter={onEnter}
                    onDelete={onDelete}
                />
                <p
                    ref={toastRef}
                    className="absolute place-self-center w-52 h-8 bg-white border-2 border-slate-200 text-nowrap text-black text-center align-middle pt-[.1rem] pb-[.2rem] font-extrabold rounded-2xl"
                    style={{ opacity: 0 }}
                >
                    Palabra no existe
                </p>
                {gameOver && (
                    <Modal
                        ref={modalRef}
                        onClose={playAgain}
                    >
                        <div className="bg-black bg-t border-4 bg-opacity-85 border-opacity-50 border-slate-500 p-4 rounded-2xl h-auto w-auto place-content-center">
                            <h3 className="text-gray-50 text-center text-2xl font-bold pt-4"> Game Over! </h3>
                            {revealWord ?
                                <p className='text-gray-50 text-center text-xl font-bold p-4'>La palabra fue <span className='text-yellow-400 font-extrabold'>{wordOfTheDay}</span></p>
                                : <p className='text-gray-50 text-center text-xl font-extrabold p-4'>Descifraste <span className='text-yellow-400 font-extrabold'>{wordOfTheDay}</span> 🎉</p>
                            }
                            <div className="flex justify-center p-4">
                                <button
                                    className='rounded-xl w-36 h-14 border-2 border-gray-400 bg-slate-700 active:bg-slate-900 focus:bg-slate-900 text-gray-50 text-nowrap font-extrabold'
                                    aria-label='Juega de nuevo'
                                    onClick={playAgain}
                                >
                                    Juega de Nuevo
                                </button>
                            </div>
                        </div>
                    </Modal>
                )}
                {showInstructions && (
                    <Modal
                        ref={modalRef}
                        onClose={() => setShowInstructions(!showInstructions)}
                    >
                        <div className="bg-black bg-t border-4 bg-opacity-85 border-opacity-50 border-slate-500 p-4 rounded-2xl h-auto w-auto place-content-center">
                            <h3 className="text-gray-50 text-center text-2xl font-bold pt-4">
                                Cómo Jugar
                            </h3>
                            <div className="flex flex-col justify-between p-3">
                                <HowToPlay />
                                <div className='flex justify-center mt-1 -mb-2'>
                                    <button
                                        className='rounded-xl w-36 h-14 border-2 border-gray-400 bg-slate-700 active:bg-slate-900 focus:bg-slate-900 text-gray-50 text-nowrap font-extrabold'
                                        aria-label='Juega de nuevo'
                                        onMouseDown={() => setShowInstructions(!showInstructions)}
                                    >
                                        Listo!
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Modal>
                )}
            </div>
        </>
    )
}