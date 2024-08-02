import React, { type ReactNode } from 'react'
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


type GuessesProps = {
    guesses: Guess[];
    currentGuess: string[];
    currentPosition: number;
    setCurrentPosition: (n: number) => void;
    transitionState: any;
}

export default React.forwardRef(function Guesses({ guesses, currentGuess, currentPosition, setCurrentPosition, transitionState }: GuessesProps, guessContainerRef: any) {

    const firstLetter = React.useRef<HTMLButtonElement>(null);
    const secondLetter = React.useRef<HTMLButtonElement>(null);
    const thirdLetter = React.useRef<HTMLButtonElement>(null);
    const fourthLetter = React.useRef<HTMLButtonElement>(null);
    const fifthLetter = React.useRef<HTMLButtonElement>(null);

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

    type GuessBoxProps = {
        value?: string;
        hasValue: boolean;
        position: number;
        children: ReactNode;
        onMouseDown: () => void;
    }

    const GuessBox = React.forwardRef(({ children, onMouseDown, hasValue, position }: GuessBoxProps, ref: any) => {
        if (hasValue) {
            // has value
            return (
                <button
                    ref={ref}
                    aria-label={'guess position ' + position + 1}
                    className={'flip-exit grid place-items-center border-2 border-slate-500 hover:border-slate-400 active:border-slate-400 focus:border-slate-400 w-14 h-14 md:w-16 md:h-16 bg-black relative'}
                    key={'cg-l-' + position + 1}
                    onMouseDown={onMouseDown}
                >
                    {children}
                </button>
            )
        }
        // default - no value 
        return (
            <button
                ref={ref}
                aria-label={'guess position ' + position + 1}
                className={'flip-exit grid place-items-center border-2 hover:border-slate-500 active:border-slate-500 focus:border-slate-500 border-slate-800 w-14 h-14 md:w-16 md:h-16 bg-black relative'}
                key={'cg-l-' + position + 1}
                onMouseDown={onMouseDown}
            >
                {children}
            </button>
        )
    })

    const ActiveBar = ({ active }: { active: boolean }) => {
        if (active) {
            return (
                <span className='absolute z-0 box-border -bottom-2 w-full border-1 h-1 border-red-500  bg-red-500' />
            )
        }
        return null;
    }

    return (
        <section className='relative flex flex-col py-2 gap-[.4rem]'>
            {guessesToRender}
            <div ref={guessContainerRef} className='flex flex-row justify-center gap-[.4rem]'>
                {transitionState ?
                    <div className='relative'>
                        <button ref={firstLetter} className={'flip absolute  grid place-items-center border-2 border-slate-500 w-14 h-14 md:w-16 md:h-16 bg-black'}
                            key='cg-l-1-1'>
                            <span className='text-white text-3xl font-extrabold'>
                                {currentGuess[0] || ''}
                            </span>
                        </button>
                        {LetterToRender(transitionState.lettersGuessed[0])}
                    </div>
                    : <GuessBox
                        ref={firstLetter}
                        position={0}
                        hasValue={!!currentGuess[0]}
                        onMouseDown={() => setCurrentPosition(0)}
                    >
                        <>
                            <span className='text-white text-3xl font-extrabold'>
                                {currentGuess[0] || ''}
                            </span>
                            <ActiveBar active={currentPosition === 0} />
                        </>
                    </GuessBox>
                }
                {transitionState ?
                    <div className='relative'>
                        <button ref={secondLetter} className={'flip absolute  grid place-items-center border-2 border-slate-500 w-14 h-14 md:w-16 md:h-16 bg-black'}
                            key='cg-l-1-2'>
                            <span className='text-white text-3xl font-extrabold'>
                                {currentGuess[1] || ''}
                            </span>
                        </button>
                        {LetterToRender(transitionState.lettersGuessed[1])}
                    </div>
                    : <GuessBox
                        ref={secondLetter}
                        position={1}
                        hasValue={!!currentGuess[1]}
                        onMouseDown={() => setCurrentPosition(1)}
                    >
                        <span className='text-white text-3xl font-extrabold'>
                            {currentGuess[1] || ''}
                        </span>
                        <ActiveBar active={currentPosition === 1} />
                    </GuessBox>}
                {transitionState ?
                    <div className='relative'>
                        <button ref={thirdLetter} className={'flip absolute  grid place-items-center border-2 border-slate-500 w-14 h-14 md:w-16 md:h-16 bg-black'}
                            key='cg-l-1-3'>
                            <span className='text-white text-3xl font-extrabold'>
                                {currentGuess[2] || ''}
                            </span>
                        </button>
                        {LetterToRender(transitionState.lettersGuessed[2])}
                    </div>
                    : <GuessBox
                        ref={thirdLetter}
                        position={2}
                        hasValue={!!currentGuess[2]}
                        onMouseDown={() => setCurrentPosition(2)}
                    >
                        <>
                            <span className='text-white text-3xl font-extrabold'>
                                {currentGuess[2] || ''}
                            </span>
                            <ActiveBar active={currentPosition === 2} />
                        </>
                    </GuessBox>}
                {transitionState ?
                    <div className='relative'>
                        <button ref={fourthLetter} className={'flip absolute  grid place-items-center border-2 border-slate-500 w-14 h-14 md:w-16 md:h-16 bg-black'}
                            key='cg-l-1-4'>
                            <span className='text-white text-3xl font-extrabold'>
                                {currentGuess[3] || ''}
                            </span>
                        </button>
                        {LetterToRender(transitionState.lettersGuessed[3])}
                    </div>
                    : <GuessBox
                        ref={fourthLetter}
                        position={3}
                        hasValue={!!currentGuess[3]}
                        onMouseDown={() => setCurrentPosition(3)}
                    >
                        <>
                            <span className='text-white text-3xl font-extrabold'>
                                {currentGuess[3] || ''}
                            </span>
                            <ActiveBar active={currentPosition === 3} />
                        </>
                    </GuessBox>}
                {transitionState ?
                    <div className='relative'>
                        <button ref={fifthLetter} className={'flip absolute  grid place-items-center border-2 border-slate-500 w-14 h-14 md:w-16 md:h-16 bg-black'}
                            key='cg-l-1-5'>
                            <span className='text-white text-3xl font-extrabold'>
                                {currentGuess[4] || ''}
                            </span>
                        </button>
                        {LetterToRender(transitionState.lettersGuessed[4])}
                    </div>
                    : <GuessBox
                        ref={fifthLetter}
                        position={4}
                        hasValue={!!currentGuess[4]}
                        onMouseDown={() => setCurrentPosition(4)}
                    >
                        <>
                            <span className='text-white text-3xl font-extrabold'>
                                {currentGuess[4] || ''}
                            </span>
                            <ActiveBar active={currentPosition === 4} />
                        </>
                    </GuessBox>
                }
            </div>
            {blanksToRender}
        </section>
    )
})


{/* <button
                        ref={fifthLetter}
                        aria-label={'guess position 5'}
                        className={currentGuess[4] ? 'flip-exit grid place-items-center border-2 border-slate-500 hover:border-slate-400 active:border-slate-400 focus:border-slate-400 w-14 h-14 md:w-16 md:h-16 bg-black relative' : 'flip-exit grid place-items-center border-2 hover:border-slate-500 active:border-slate-500 focus:border-slate-500 border-slate-800 w-14 h-14 md:w-16 md:h-16 bg-black relative'}
                        key='cg-l-5'
                        onMouseDown={() => setCurrentPosition(4)}
                    >
                        </button> */}