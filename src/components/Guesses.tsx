import React from 'react'

import { GREY, GREEN, YELLOW } from '../constants';
import type { Guess, LetterGuess, } from '../types';

function Blank(key: number) {
    return (
        <div className='flex flex-row justify-center gap-1' key={`blank-${key}`}>
            <div className='border-2 border-slate-700 w-14 h-14 md:w-16 md:h-16' />
            <div className='border-2 border-slate-700 w-14 h-14 md:w-16 md:h-16' />
            <div className='border-2 border-slate-700 w-14 h-14 md:w-16 md:h-16' />
            <div className='border-2 border-slate-700 w-14 h-14 md:w-16 md:h-16' />
            <div className='border-2 border-slate-700 w-14 h-14 md:w-16 md:h-16' />
        </div>
    )
}

function LetterToRender({ letter, status }: LetterGuess) {
    switch (status) {
        case GREEN:
            return (
                <div className='grid place-items-center border-2 border-slate-500 w-14 h-14 md:w-16 md:h-16 bg-green-600'>
                    <span className='text-white'>
                        {letter}
                    </span>
                </div>
            )
        case YELLOW:
            return (
                <div className='grid place-items-center border-2 border-slate-500 w-14 h-14 md:w-16 md:h-16 bg-yellow-500'>
                    <span className='text-white'>
                        {letter}
                    </span>
                </div>
            )
        default:
            return (
                <div className='grid place-items-center border-2 border-slate-500 w-14 h-14 md:w-16 md:h-16 bg-gray-500'>
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
                <div className={currentGuess[0] ? 'grid place-items-center border-2 border-slate-500 w-14 h-14 md:w-16 md:h-16 bg-black' : 'grid place-items-center border-2 border-slate-700 w-14 h-14 md:w-16 md:h-16 bg-black'} key='cg-l-1'>
                    <span className='text-white'>
                        {currentGuess[0] || ''}
                    </span>
                </div>
                <div className={currentGuess[1] ? 'grid place-items-center border-2 border-slate-500 w-14 h-14 md:w-16 md:h-16 bg-black' : 'grid place-items-center border-2 border-slate-700 w-14 h-14 md:w-16 md:h-16 bg-black'} key='cg-l-2'>
                    <span className='text-white'>
                        {currentGuess[1] || ''}
                    </span>
                </div>
                <div className={currentGuess[2] ? 'grid place-items-center border-2 border-slate-500 w-14 h-14 md:w-16 md:h-16 bg-black' : 'grid place-items-center border-2 border-slate-700 w-14 h-14 md:w-16 md:h-16 bg-black'} key='cg-l-3'>
                    <span className='text-white'>
                        {currentGuess[2] || ''}
                    </span>
                </div>
                <div className={currentGuess[3] ? 'grid place-items-center border-2 border-slate-500 w-14 h-14 md:w-16 md:h-16 bg-black' : 'grid place-items-center border-2 border-slate-700 w-14 h-14 md:w-16 md:h-16 bg-black'} key='cg-l-4'>
                    <span className='text-white'>
                        {currentGuess[3] || ''}
                    </span>
                </div>
                <div className={currentGuess[4] ? 'grid place-items-center border-2 border-slate-500 w-14 h-14 md:w-16 md:h-16 bg-black' : 'grid place-items-center border-2 border-slate-700 w-14 h-14 md:w-16 md:h-16 bg-black'} key='cg-l-5'>
                    <span className='text-white'>
                        {currentGuess[4] || ''}
                    </span>
                </div>
            </div>
            {blanksToRender}
        </section>
    )
}
