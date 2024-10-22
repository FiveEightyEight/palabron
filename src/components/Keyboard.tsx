import React from 'react';
import { GREY, GREEN, YELLOW } from '../constants';
import type { GuessedLetters } from '../types';

type KeyboardButtonProps = {
    cb: () => void;
    label: string;
    type: string;
}
const KeyboardButton: React.FC<KeyboardButtonProps> = ({ cb, label, type }) => {
    const vibrate = () => {
        if (navigator.vibrate) {
            navigator.vibrate(200);
        }
    };

    switch (type) {
        case GREEN:
            return (
                <button
                    onClick={vibrate}
                    onMouseDown={cb}
                    className={'grid place-items-center bg-green-600 focus:bg-green-700 active:bg-green-700 text-gray-50 w-9 h-14 md:w-9 md:h-14 p-1 rounded-sm font-bold'}
                    aria-label={label}
                >
                    <span>{label}</span>
                </button>
            );
        case YELLOW:
            return (
                <button
                    onClick={vibrate}
                    onMouseDown={cb}
                    className={'grid place-items-center bg-yellow-500 focus:bg-yellow-600 active:bg-yellow-600 text-gray-50 w-9 h-14 md:w-9 md:h-14 p-1 rounded-sm font-bold'}
                    aria-label={label}
                >
                    <span>{label}</span>
                </button>
            );
        case GREY:
            return (
                <button
                    onClick={vibrate}
                    onMouseDown={cb}
                    className={'grid place-items-center bg-gray-800 focus:bg-gray-950 active:bg-gray-950 text-gray-50 w-9 h-14 md:w-9 md:h-14 p-1 rounded-sm font-bold'}
                    aria-label={label}
                >
                    <span>{label}</span>
                </button>
            );
        default:
            return (
                <button
                    onClick={vibrate}
                    onMouseDown={cb}
                    className={'grid place-items-center bg-slate-500 focus:bg-slate-700 active:bg-slate-700 text-white w-9 h-14 md:w-9 md:h-14 p-1 rounded-sm font-bold'}
                    aria-label={label}
                >
                    <span>{label}</span>
                </button>
            );
    }
}

type KeyboardProps = {
    guessedLetters: GuessedLetters;
    onTap: (letter: string) => void;
    onEnter: () => void;
    onDelete: () => void;
}
export default React.memo(function Keyboard({ guessedLetters, onTap, onEnter, onDelete }: KeyboardProps) {
    const accents = ['Á', 'É', 'Í', 'Ó', 'Ú', 'Ü'];
    const topRow = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P']
    const middleRow = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ']
    const lastRow = ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
    // max-w-[97dvw]
    return (
        <section className='grid grid-rows-4 grid-cols-1 place-items-center gap-[.35rem] safe-bottom'>
            <div className='flex gap-[.35rem] md:gap-2 justify-center'>
                {accents.map((letter: string, i: number) => (
                    <KeyboardButton
                        cb={() => onTap(letter)}
                        label={letter}
                        type={guessedLetters[letter]}
                        key={`accent-k-${i}`}
                    />
                ))}
            </div>
            <div className='grid grid-cols-10 gap-[.35rem] justify-center content-center'>
                {topRow.map((letter: string, i: number) => (
                    <KeyboardButton
                        cb={() => onTap(letter)}
                        label={letter}
                        type={guessedLetters[letter]}
                        key={`topRow-k-${i}`}
                    />
                ))}
            </div>
            <div className='grid grid-cols-10 gap-[.35rem] justify-center content-center'>
                {middleRow.map((letter: string, i: number) => (
                    <KeyboardButton
                        cb={() => onTap(letter)}
                        label={letter}
                        type={guessedLetters[letter]}
                        key={`middleRow-k-${i}`}
                    />
                ))}
            </div>
            <div className='flex flex-row gap-[.35rem] justify-center content-center'>
                <button
                    onMouseDown={onEnter}
                    className={'grid place-items-center bg-gray-700 text-white focus:bg-gray-900 active:bg-gray-900 w-14 h-14 md:w-16 md:h-14 p-1 rounded-sm'}
                    aria-label="aceptar"
                >
                    <span className='text-[.5rem] font-bold'>ACEPTAR</span>
                </button>
                <div className='grid grid-cols-7 gap-[.35rem] justify-center content-center'>
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
                    className={'grid place-items-center bg-gray-700 text-white focus:bg-gray-900 active:bg-gray-900 w-14 h-14 md:w-16 md:h-14 p-1 rounded-sm'}
                    aria-label="borrar"
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
})
