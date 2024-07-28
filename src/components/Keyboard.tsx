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
            className={
                type === 'grey' ? 'grid place-items-center bg-gray-800 text-gray-50 w-7 h-9 p-1 rounded-sm font-bold'
                    : 'grid place-items-center bg-slate-500 text-white w-7 h-9 p-1 rounded-sm font-bold'
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
export default function Keyboard({ guessedLetters, onTap, onEnter, onDelete }: KeyboardProps) {
    const accents = ['Á', 'É', 'Í', 'Ó', 'Ú', 'Ü'];
    const topRow = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P']
    const middleRow = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ']
    const lastRow = ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
    return (
        <section className='grid grid-rows-4 grid-cols-1 px-1 gap-[.35rem] max-w-full'>
            <div className='flex auto-cols-max gap-[.35rem] md:gap-2 justify-center'>
                {accents.map((letter: string, i: number) => (
                    <KeyboardButton
                        cb={() => onTap(letter)}
                        label={letter}
                        type={guessedLetters[letter]}
                        key={`accent-k-${i}`}
                    />
                ))}
            </div>
            <div className='grid grid-cols-10 auto-cols-max justify-center content-center'>
                {topRow.map((letter: string, i: number) => (
                    <KeyboardButton
                        cb={() => onTap(letter)}
                        label={letter}
                        type={guessedLetters[letter]}
                        key={`topRow-k-${i}`}
                    />
                ))}
            </div>
            <div className='grid grid-cols-10 auto-cols-max justify-center content-center'>
                {middleRow.map((letter: string, i: number) => (
                    <KeyboardButton
                        cb={() => onTap(letter)}
                        label={letter}
                        type={guessedLetters[letter]}
                        key={`middleRow-k-${i}`}
                    />
                ))}
            </div>
            <div className='flex flex-row gap-1 justify-center content-center'>
                <button
                    onMouseDown={onEnter}
                    className={
                        'grey' === 'grey' ? 'grid place-items-center bg-gray-700 text-gray-50 w-12 h-9 p-1 rounded-sm'
                            : 'grid place-items-center bg-gray-50 text-gray-700 w-12 h-9 p-1 rounded-sm'
                    }
                >
                    <span className='text-[.5rem] font-bold'>ACEPTAR</span>
                </button>
                <div className='grid grid-cols-7 auto-cols-max gap-1 justify-center content-center'>
                    {lastRow.map((letter: string, i: number) => (
                        <KeyboardButton
                            cb={() => onTap(letter)}
                            label={letter}
                            type={guessedLetters[letter]}
                            key={`lastRow-k-${i}`}
                        />
                    ))}
                </div>
                <button
                    onMouseDown={onDelete}
                    className={
                        'grey' === 'grey' ? 'grid place-items-center bg-gray-700 text-gray-50 w-12 h-9 p-1 rounded-sm'
                            : 'grid place-items-center bg-gray-50 text-gray-700 w-12 h-9 p-1 rounded-sm'
                    }
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 512 512">
                        <rect width="512" height="512" fill="none" />
                        <path fill="currentColor"
                            d="M227.313 363.313L312 278.627l84.687 84.686l22.626-22.626L334.627 256l84.686-84.687l-22.626-22.626L312 233.373l-84.687-84.686l-22.626 22.626L289.373 256l-84.686 84.687z" />
                        <path fill="currentColor"
                            d="M472 64H194.644a24.1 24.1 0 0 0-17.42 7.492L16 241.623v28.754l161.224 170.131a24.1 24.1 0 0 0 17.42 7.492H472a24.03 24.03 0 0 0 24-24V88a24.03 24.03 0 0 0-24-24m-8 352H198.084L48 257.623v-3.246L198.084 96H464Z" />
                    </svg>
                </button>
            </div>
        </section>
    )
}