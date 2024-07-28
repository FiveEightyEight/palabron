import React from 'react'
import Guesses from './Guesses';
import Keyboard from './Keyboard';
import { dictionary } from '../data';
import { GREY, GREEN, YELLOW } from '../constants';
import type { GameState, Guess } from '../types';
// Today new Date().toJSON().split('T')[0]
export default function Game() {
    const [wordOfTheDay, setWordOfTheDay] = React.useState('sueño');
    const [currentGuess, setCurrentGuess] = React.useState<string[]>([]);
    const [today, setToday] = React.useState(new Date().toJSON().split('T')[0]);
    const [guesses, setGuesses] = React.useState<Guess[]>([]);
    const [guessedLetters, setGuessedLetters] = React.useState({})
    const [gameOver, setGameOver] = React.useState(false);
    React.useEffect(() => {

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
            setWordOfTheDay('sueño');
        }
    }, []);

    const onTap = (letter: string) => {
        if (gameOver || currentGuess.length >= 5) return;
        setCurrentGuess([...currentGuess, letter]);
    }

    const onEnter = () => {
        if (gameOver) return;
        const guessedWord = currentGuess.join('');
        // check dic
        if (!(guessedWord in dictionary) || guessedWord.length < 5) {
            // toggle toast?
            console.log('nope')
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
        setGuessedLetters(Object.assign(guessedLetters, greyMap, yellowMap))
        setGuesses([...guesses, { guess: guessedWord, letters: lettersGuessed }])

        if (allGreen || finalGuess) {
            // end game
            setGameOver(true)
        }
        setCurrentGuess([])
    }

    const onDelete = () =>
        setCurrentGuess(currentGuess.slice(0, currentGuess.length - 1))

    return (
        <div className='flex flex-col justify-between py-1 md:py-5 h-screen bg-black'>
            <section className='text-center'>
                <h1 className='text-gray-50 text-center text-xl font-bold'>PALABRON</h1>
                <span className='text-gray-300 text-center text-[.6rem] italic'>(pre-alpha)</span>
                <div className='py-1'>
                    <Guesses guesses={guesses} currentGuess={currentGuess} />
                </div>
            </section>
            <div className='flex justify-center min-w-full'>
                <Keyboard
                    guessedLetters={guessedLetters}
                    onTap={onTap}
                    onEnter={onEnter}
                    onDelete={onDelete}
                />
            </div>
        </div>
    )
}