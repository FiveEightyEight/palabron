import React from 'react'

import { GREY, GREEN, YELLOW } from '../constants';
import type { Guess, LetterGuess, } from '../types';

function Blank(key: number) {
    return (
        <div className='flex flex-row justify-center gap-1' key={`blank-${key}`}>
            <div className='border-2 border-slate-500 w-10 h-10' />
            <div className='border-2 border-slate-500 w-10 h-10' />
            <div className='border-2 border-slate-500 w-10 h-10' />
            <div className='border-2 border-slate-500 w-10 h-10' />
            <div className='border-2 border-slate-500 w-10 h-10' />
        </div>
    )
}

function LetterToRender({ letter, status }: LetterGuess) {
    switch (status) {
        case GREEN:
            return (
                <div className='grid place-items-center border-2 border-slate-500 w-10 h-10 bg-green-600'>
                    <span className='text-white'>
                        {letter}
                    </span>
                </div>
            )
        case YELLOW:
            return (
                <div className='grid place-items-center border-2 border-slate-500 w-10 h-10 bg-yellow-500'>
                    <span className='text-white'>
                        {letter}
                    </span>
                </div>
            )
        default:
            return (
                <div className='grid place-items-center border-2 border-slate-500 w-10 h-10 bg-gray-500'>
                    <span className='text-white'>
                        {letter}
                    </span>
                </div>
            )
    }
}


export default function Guesses({ guesses, currentGuess }: { guesses: Guess[], currentGuess: string[] }) {
    // <div className='grid grid-cols-5 gap-1'>
    const blanksToRender = React.useMemo(() => {
        const blanksToGenerate = 5 - guesses.length;
        const blanks = [];
        let i = 0;
        while (i < blanksToGenerate) {
            i++
            blanks.push(Blank(i))
        }
        return blanks;
    }, [guesses])

    const guessesToRender = React.useMemo(() => {
        return guesses.map(({ letters }, index) => (
            <div className='flex flex-row justify-center gap-1' key={`guess-${index}`}>
                {LetterToRender(letters[0])}
                {LetterToRender(letters[1])}
                {LetterToRender(letters[2])}
                {LetterToRender(letters[3])}
                {LetterToRender(letters[4])}
            </div>
        ))
    }, [guesses])

    if (guesses.length === 6) {
        return (
            <section className='flex flex-col py-2 gap-1'>
                {guessesToRender}
            </section>
        )
    }
    return (
        <section className='flex flex-col py-2 gap-1'>
            {guessesToRender}
            <div className='flex flex-row justify-center gap-1'>
                <div className='grid place-items-center border-2 border-slate-500 w-10 h-10 bg-black' key='cg-l-1'>
                    <span className='text-white'>
                        {currentGuess[0] || ''}
                    </span>
                </div>
                <div className='grid place-items-center border-2 border-slate-500 w-10 h-10 bg-black' key='cg-l-2'>
                    <span className='text-white'>
                        {currentGuess[1] || ''}
                    </span>
                </div>
                <div className='grid place-items-center border-2 border-slate-500 w-10 h-10 bg-black' key='cg-l-3'>
                    <span className='text-white'>
                        {currentGuess[2] || ''}
                    </span>
                </div>
                <div className='grid place-items-center border-2 border-slate-500 w-10 h-10 bg-black' key='cg-l-4'>
                    <span className='text-white'>
                        {currentGuess[3] || ''}
                    </span>
                </div>
                <div className='grid place-items-center border-2 border-slate-500 w-10 h-10 bg-black' key='cg-l-5'>
                    <span className='text-white'>
                        {currentGuess[4] || ''}
                    </span>
                </div>
            </div>
            {blanksToRender}
        </section>
    )
}


// {
//     guesses.map((guess) => (
//         <div className='grid grid-cols-5 gap-1'>
//             {guess.letters.map((guess) => (
//                 <div
//                     className={
//                         guess.status === 'grey' ? 'bg-gray-700 text-gray-50 w-7 h-9 p-1 rounded-sm'
//                             : guess.status === 'yellow' ? 'bg-yellow text-black w-7 h-9 p-1 rounded-sm'
//                                 : 'bg-gray-50 text-gray-700 w-7 h-9 p-1 rounded-sm'
//                     }
//                 >
//                     <span>{guess.letter}</span>
//                 </div>
//             ))}
//         </div>
//     ))
// }