import React from 'react'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import { GREY, GREEN, YELLOW } from '../constants';
import type { Guess, LetterGuess, } from '../types';

function Blank(key: number) {
    return (
        <div className='flex flex-row justify-center gap-[.4rem]' key={`blank-${key}`}>
            <div className='border-2 border-slate-800 w-14 h-14 md:w-16 md:h-16' />
            <div className='border-2 border-slate-800 w-14 h-14 md:w-16 md:h-16' />
            <div className='border-2 border-slate-800 w-14 h-14 md:w-16 md:h-16' />
            <div className='border-2 border-slate-800 w-14 h-14 md:w-16 md:h-16' />
            <div className='border-2 border-slate-800 w-14 h-14 md:w-16 md:h-16' />
        </div>
    )
}

function LetterToRender({ letter, status }: LetterGuess) {
    switch (status) {
        case GREEN:
            return (
                <div className={'flip grid place-items-center border-2 border-green-600 w-14 h-14 md:w-16 md:h-16 bg-green-600'}>
                    <span className='text-white text-3xl font-extrabold'>
                        {letter}
                    </span>
                </div>
            )
        case YELLOW:
            return (
                <div className={'flip grid place-items-center border-2 border-yellow-500 w-14 h-14 md:w-16 md:h-16 bg-yellow-500'}>
                    <span className='text-white text-3xl font-extrabold'>
                        {letter}
                    </span>
                </div>
            )
        default:
            return (
                <div className={'flip grid place-items-center border-2 border-slate-500 w-14 h-14 md:w-16 md:h-16 bg-slate-500'}>
                    <span className='text-white text-3xl font-extrabold'>
                        {letter}
                    </span>
                </div>
            )
    }
}


export default React.forwardRef(function Guesses({ guesses, currentGuess, transitionState }: { guesses: Guess[], currentGuess: string[], transitionState: any }, guessContainerRef: any) {

    const firstLetter = React.useRef<HTMLDivElement>(null);
    const secondLetter = React.useRef<HTMLDivElement>(null);
    const thirdLetter = React.useRef<HTMLDivElement>(null);
    const fourthLetter = React.useRef<HTMLDivElement>(null);
    const fifthLetter = React.useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!currentGuess[0]) return;
        gsap.from(firstLetter.current,
            { scale: 1.15 },
        )
    }, { dependencies: [currentGuess[0]] })

    useGSAP(() => {
        if (!currentGuess[1]) return;
        gsap.from(secondLetter.current,
            { scale: 1.15 },
        )
    }, { dependencies: [currentGuess[1]] })

    useGSAP(() => {
        if (!currentGuess[2]) return;
        gsap.from(thirdLetter.current,
            { scale: 1.15 },
        )
    }, { dependencies: [currentGuess[2]] })

    useGSAP(() => {
        if (!currentGuess[3]) return;
        gsap.from(fourthLetter.current,
            { scale: 1.15 },
        )
    }, { dependencies: [currentGuess[3]] })

    useGSAP(() => {
        if (!currentGuess[4]) return;
        gsap.from(fifthLetter.current,
            { scale: 1.15 },
        )
    }, { dependencies: [currentGuess[4]] })



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
            <div className='flex flex-row justify-center gap-[.4rem]' key={`guess-${index}`}>
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
        <section className='relative flex flex-col py-2 gap-[.4rem]'>
            {guessesToRender}
            <div ref={guessContainerRef} className='flex flex-row justify-center gap-[.4rem]'>
                {transitionState ?
                    <div className='relative'>
                        <div ref={firstLetter} className={'flip absolute  grid place-items-center border-2 border-slate-500 w-14 h-14 md:w-16 md:h-16 bg-black'} key='cg-l-1'>
                            <span className='text-white text-3xl font-extrabold'>
                                {currentGuess[0] || ''}
                            </span>
                        </div>
                        {LetterToRender(transitionState.lettersGuessed[0])}
                    </div>
                    : <div ref={firstLetter} className={currentGuess[0] ? 'flip-exit grid place-items-center border-2 border-slate-500 w-14 h-14 md:w-16 md:h-16 bg-black' : 'flip-exit grid place-items-center border-2 border-slate-800 w-14 h-14 md:w-16 md:h-16 bg-black'} key='cg-l-1'>
                        <span className='text-white text-3xl font-extrabold'>
                            {currentGuess[0] || ''}
                        </span>
                    </div>
                }
                {transitionState ?
                    <div className='relative'>
                        <div ref={firstLetter} className={'flip absolute  grid place-items-center border-2 border-slate-500 w-14 h-14 md:w-16 md:h-16 bg-black'} key='cg-l-1'>
                            <span className='text-white text-3xl font-extrabold'>
                                {currentGuess[1] || ''}
                            </span>
                        </div>
                        {LetterToRender(transitionState.lettersGuessed[1])}
                    </div>
                    : <div ref={secondLetter} className={currentGuess[1] ? 'flip-exit grid place-items-center border-2 border-slate-500 w-14 h-14 md:w-16 md:h-16 bg-black' : 'flip-exit grid place-items-center border-2 border-slate-800 w-14 h-14 md:w-16 md:h-16 bg-black'} key='cg-l-2'>
                        <span className='text-white text-3xl font-extrabold'>
                            {currentGuess[1] || ''}
                        </span>
                    </div>}
                {transitionState ?
                    <div className='relative'>
                        <div ref={firstLetter} className={'flip absolute  grid place-items-center border-2 border-slate-500 w-14 h-14 md:w-16 md:h-16 bg-black'} key='cg-l-1'>
                            <span className='text-white text-3xl font-extrabold'>
                                {currentGuess[2] || ''}
                            </span>
                        </div>
                        {LetterToRender(transitionState.lettersGuessed[2])}
                    </div>
                    : <div ref={thirdLetter} className={currentGuess[2] ? 'flip-exit grid place-items-center border-2 border-slate-500 w-14 h-14 md:w-16 md:h-16 bg-black' : 'flip-exit grid place-items-center border-2 border-slate-800 w-14 h-14 md:w-16 md:h-16 bg-black'} key='cg-l-3'>
                        <span className='text-white text-3xl font-extrabold'>
                            {currentGuess[2] || ''}
                        </span>
                    </div>}
                {transitionState ?
                    <div className='relative'>
                        <div ref={firstLetter} className={'flip absolute  grid place-items-center border-2 border-slate-500 w-14 h-14 md:w-16 md:h-16 bg-black'} key='cg-l-1'>
                            <span className='text-white text-3xl font-extrabold'>
                                {currentGuess[3] || ''}
                            </span>
                        </div>
                        {LetterToRender(transitionState.lettersGuessed[3])}
                    </div>
                    : <div ref={fourthLetter} className={currentGuess[3] ? 'flip-exit grid place-items-center border-2 border-slate-500 w-14 h-14 md:w-16 md:h-16 bg-black' : 'flip-exit grid place-items-center border-2 border-slate-800 w-14 h-14 md:w-16 md:h-16 bg-black'} key='cg-l-4'>
                        <span className='text-white text-3xl font-extrabold'>
                            {currentGuess[3] || ''}
                        </span>
                    </div>}
                {transitionState ?
                    <div className='relative'>
                        <div ref={firstLetter} className={'flip absolute  grid place-items-center border-2 border-slate-500 w-14 h-14 md:w-16 md:h-16 bg-black'} key='cg-l-1'>
                            <span className='text-white text-3xl font-extrabold'>
                                {currentGuess[4] || ''}
                            </span>
                        </div>
                        {LetterToRender(transitionState.lettersGuessed[4])}
                    </div>
                    : <div ref={fifthLetter} className={currentGuess[4] ? 'flip-exit grid place-items-center border-2 border-slate-500 w-14 h-14 md:w-16 md:h-16 bg-black' : 'flip-exit grid place-items-center border-2 border-slate-800 w-14 h-14 md:w-16 md:h-16 bg-black'} key='cg-l-5'>
                        <span className='text-white text-3xl font-extrabold'>
                            {currentGuess[4] || ''}
                        </span>
                    </div>}
            </div>
            {blanksToRender}
        </section>
    )
})
