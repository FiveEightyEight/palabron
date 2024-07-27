import React from 'react'
import Keyboard from './Keyboard';
import type { GameState } from '../types';
// Today new Date().toJSON().split('T')[0]
export default function Game() {
    const [wordOfTheDay, setWordOfTheDay] = React.useState('sueño');
    const [today, setToday] = React.useState(new Date().toJSON().split('T')[0]);
    const [guesses, setGuesses] = React.useState([]);
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

    return (
        <div className='flex flex-col justify-center h-screen bg-black'>
            <h1 className='text-gray-950'>Hello World</h1>
            <div className='flex justify-center min-w-full'>
                <Keyboard
                    guessedLetters={guessedLetters}
                    onTap={(letter: string) => { }}
                    onEnter={() => { }}
                    onDelete={() => { }}
                />
            </div>
        </div>
    )
}