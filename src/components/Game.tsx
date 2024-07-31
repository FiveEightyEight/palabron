import React from 'react'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Guesses from './Guesses';
import Keyboard from './Keyboard';
import Modal from './Modal';
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

    const modalRef = React.useRef<HTMLElement>(null)
    const guessContainerRef = React.useRef<HTMLDivElement>(null);
    const toastRef = React.useRef<HTMLParagraphElement>(null);

    React.useEffect(() => {
        const tl = gsap.timeline({ paused: true });
        setTimeline(tl);
        const result: null | GameState = JSON.parse(localStorage.getItem(today) || 'null');
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
    }
    const onTap = (letter: string) => {
        if (gameOver || currentPosition >= 5) return;
        const newGuess = [...currentGuess]
        newGuess[currentPosition] = letter;
        setCurrentGuess(newGuess);
        setCurrentPosition((currentPosition) => Math.min((currentPosition + 1), 4));
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
    }

    const onDelete = () => {
        if (currentPosition === 4) {
            setCurrentGuess(currentGuess.slice(0, currentGuess.length - 1));
            setCurrentPosition(_ => Math.max((currentGuess.length - 1), 0));
            setDeleteAtCurrentPosition(false)
            return;
        }
        const positionToDelete = deleteAtCurrentPosition ? currentPosition : currentPosition - 1;
        const newCurrentGuess = [...currentGuess]
        newCurrentGuess[positionToDelete] = '';
        setCurrentGuess(newCurrentGuess);
        setCurrentPosition(_ => Math.max((positionToDelete), 0));
        setDeleteAtCurrentPosition(false)
    }

    const updateCurrentPosition = (position: number) => {
        setCurrentPosition(position)
        setDeleteAtCurrentPosition(true);
    }

    return (
        <>
            <div className='flex flex-col justify-between pt-1 pb-2 md:py-5 h-[100dvh] w-[100dvw] bg-black'>
                <section className='text-center'>
                    <div className='-mb-2'>
                        <h1 className='text-gray-50 text-center text-xl font-bold'>PALABRÓN</h1>
                        <span className='-mt-5 text-gray-300 text-center text-[.6rem] italic'>({packageJSON.version})</span>
                    </div>
                    <div className='py-1'>
                        <Guesses
                            ref={guessContainerRef}
                            guesses={guesses}
                            currentGuess={currentGuess}
                            transitionState={transitionState}
                            setCurrentPosition={updateCurrentPosition}
                        />
                    </div>
                </section>
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
                {
                    gameOver && (
                        <Modal ref={modalRef}>
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
                    )
                }

            </div>

        </>
    )
}