import React from 'react'
import Keyboard from './Keyboard';
import { dictionary } from '../data';
import type { GameState, Guess } from '../types';
// Today new Date().toJSON().split('T')[0]
const GREY = 'grey'
const GREEN = 'green'
const YELLOW = 'yellow'
export default function Game() {
    const [wordOfTheDay, setWordOfTheDay] = React.useState('sueño');
    const [currentGuess, setCurrentGuess] = React.useState<string[]>([]);
    const [today, setToday] = React.useState(new Date().toJSON().split('T')[0]);
    const [guesses, setGuesses] = React.useState<Guess[]>([]);
    const [guessedLetters, setGuessedLetters] = React.useState({})

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
                    }
                }
            */
            const { wordOfTheDay, guesses, guessedLetters } = result[today];
        } else {
            // load the word of the day
            setWordOfTheDay('sueño');
        }
    }, []);

    const onTap = (letter: string) => {
        setCurrentGuess([...currentGuess, letter]);
    }

    const onEnter = () => {
        const guessedWord = currentGuess.join('');
        // check dic
        if (!(guessedWord in dictionary)) {
            // toggle toast?
            return;
        }
        let allGreen = true;
        let i = 0;
        const lettersGuessed = [];
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
            }
            if (allGreen && (currGuess.status === GREY || currGuess.status === YELLOW)) {
                allGreen = false;
            }
            lettersGuessed.push(currGuess)
        }
        const finalGuess = guesses.length >= 5;
        setGuesses([...guesses, { guess: guessedWord, letters: lettersGuessed }])
        if (allGreen || finalGuess) {
            // end game
        }
    }

    const onDelete = () =>
        setCurrentGuess(currentGuess.slice(0, currentGuess.length - 1))

    return (
        <div className='flex flex-col justify-center h-screen bg-black'>
            <h1 className='text-gray-950'>Hello World</h1>
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