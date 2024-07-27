import React from 'react';
import type { GuessedLetters } from '../types';

type KeyboardButtonProps = {
    cb: () => void;
    label: string;
    type: string;
}
const KeyboardButton: React.FC<KeyboardButtonProps> = ({ cb, label, type }) => {
    return (
        <button
            onMouseDown={cb}
            onTouchStart={cb}
            className={
                type === 'grey' ? 'grid place-items-center bg-gray-700 text-gray-50 w-7 h-9 p-1 rounded-sm'
                    : 'grid place-items-center bg-gray-50 text-gray-700 w-7 h-9 p-1 rounded-sm'
            }
        >
            <span>{label}</span>
        </button>
    )
}

type KeyboardProps = {
    guessedLetters: GuessedLetters;
    onTap: (letter: string) => void;
    onEnter: () => void;
    onDelete: () => void;
}
export default function Keyboard({ guessedLetters, onTap }: KeyboardProps) {
    const accents = ['á', 'é', 'í', 'ó', 'ú', 'ü'];
    const firstRow = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']
    const middleRow = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ñ']
    const lastRow = ['z', 'x', 'c', 'v', 'b', 'n', 'm']
    return (
        <section className='grid grid-rows-4 grid-cols-1 px-1 gap-1 max-w-full'>
            <div className='flex auto-cols-max gap-2 md:gap-4 justify-center'>
                {accents.map((letter: string) => (
                    <KeyboardButton
                        cb={() => onTap(letter)}
                        label={letter}
                        type={guessedLetters[letter]}
                    />
                ))}
            </div>
            <div className='grid grid-cols-10 auto-cols-max md:gap-2 justify-center content-center'>
                {firstRow.map((letter: string) => (
                    <KeyboardButton
                        cb={() => onTap(letter)}
                        label={letter}
                        type={guessedLetters[letter]}
                    />
                ))}
            </div>
            <div className='grid grid-cols-10 auto-cols-max md:gap-2 justify-center content-center'>
                {middleRow.map((letter: string) => (
                    <KeyboardButton
                        cb={() => onTap(letter)}
                        label={letter}
                        type={guessedLetters[letter]}
                    />
                ))}
            </div>
            <div className='flex flex-row gap-1 md:gap-2 justify-center content-center'>
                <button
                    // onMouseDown={cb}
                    // onTouchStart={cb}
                    className={
                        'grey' === 'grey' ? 'grid place-items-center bg-gray-700 text-gray-50 w-9 h-9 p-1 rounded-sm'
                            : 'grid place-items-center bg-gray-50 text-gray-700 w-9 h-9 p-1 rounded-sm'
                    }
                >
                    <span>E</span>
                </button>
                <div className='grid grid-cols-7 auto-cols-max gap-1 md:gap-2 justify-center content-center'>
                    {lastRow.map((letter: string) => (
                        <KeyboardButton
                            cb={() => onTap(letter)}
                            label={letter}
                            type={guessedLetters[letter]}
                        />
                    ))}
                </div>
                <button
                    // onMouseDown={cb}
                    // onTouchStart={cb}
                    className={
                        'grey' === 'grey' ? 'grid place-items-center bg-gray-700 text-gray-50 w-9 h-9 p-1 rounded-sm'
                            : 'grid place-items-center bg-gray-50 text-gray-700 w-9 h-9 p-1 rounded-sm'
                    }
                >
                    <span>D</span>
                </button>
            </div>
        </section>
    )
}