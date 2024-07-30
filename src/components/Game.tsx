import React from 'react'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Guesses from './Guesses';
import Keyboard from './Keyboard';
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
        timeline.add(
            gsap.set(toastRef.current, {
                y: guessContainerRef.current?.getBoundingClientRect()?.y + window.scrollY + 5,
            })
        )
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
    }
    const onTap = (letter: string) => {
        if (gameOver || currentGuess.length >= 5) return;
        setCurrentGuess([...currentGuess, letter]);
    }

    const onEnter = () => {
        if (gameOver) return;
        const guessedWord = currentGuess.join('');
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
        const greyMap: { [key: string]: string } = {}
        const yellowMap: { [key: string]: string } = {}
        while (i < 5) {
            const g = currentGuess[i];
            const w = wordOfTheDay[i];
            const currGuess = {
                letter: g,
                status: GREY
            }
            if (g === w) {
                currGuess.status = GREEN
            } else if (wordOfTheDay.includes(g)) {
                currGuess.status = YELLOW
                yellowMap[g] = YELLOW
            } else {
                greyMap[g] = GREY
            }
            if (allGreen && (currGuess.status === GREY || currGuess.status === YELLOW)) {
                allGreen = false;
            }
            lettersGuessed.push(currGuess)
            i++;
        }
        const finalGuess = guesses.length >= 5;
        setTransitionState({
            allGreen, finalGuess, greyMap, yellowMap, guessedWord, lettersGuessed
        });
    }

    const nextPhase = () => {
        const { allGreen, finalGuess, greyMap, yellowMap, guessedWord, lettersGuessed } = transitionState;
        setGuessedLetters(Object.assign(guessedLetters, greyMap, yellowMap))
        setGuesses([...guesses, { guess: guessedWord, letters: lettersGuessed }])

        if (allGreen || finalGuess) {
            // end game
            setRevealWord(!allGreen)
            setGameOver(true)
        }
        setCurrentGuess([])
        setTransitionState(null);
    }

    const onDelete = () =>
        setCurrentGuess(currentGuess.slice(0, currentGuess.length - 1))

    return (
        <div className='flex flex-col justify-between pt-1 pb-2 md:py-5 h-[100dvh] w-[100dvw] bg-black'>
            <section className='text-center'>
                <div className='-mb-2'>
                    <h1 className='text-gray-50 text-center text-xl font-bold'>PALABRÓN</h1>
                    <span className='-mt-5 text-gray-300 text-center text-[.6rem] italic'>(alpha-{packageJSON.version})</span>
                </div>
                <div className='py-1'>
                    <Guesses guesses={guesses} currentGuess={currentGuess} transitionState={transitionState} ref={guessContainerRef} />
                </div>
                {
                    gameOver && (
                        <>
                            {revealWord ?
                                <p className='text-gray-50 text-center text-xl font-bold'>La palabra fue <span className='text-yellow-400 font-extrabold'>{wordOfTheDay}</span></p>
                                : <p className='text-gray-50 text-center text-xl font-extrabold'>Nice!</p>
                            }
                            <button
                                className='rounded-xl w-36 h-14 border-2 border-gray-400 bg-slate-700 active:bg-slate-900 focus:bg-slate-900 text-gray-50 text-nowrap font-extrabold'
                                aria-label='Juega de nuevo'
                                onClick={playAgain}
                            >
                                Juega de Nuevo
                            </button>
                        </>
                    )
                }
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
        </div>
    )
}