import React from 'react';

export default React.memo(function HowToPlay() {
    return (
        <article className='flex flex-col justify-around text-white text-left'>
            <ul className='flex flex-col justify-around'>
                <li className='list-disc'>
                    Adivina la palabra en 6 intentos.
                </li>
                <li className='list-disc'>
                    Cada intento debe ser una palabra válida de 5 letras.
                </li>
                <li className='list-disc'>
                    El color de las fichas cambiará para mostrar qué tan cerca estuvo tu intento de adivinar la palabra.
                </li>
            </ul>
            <h4 className='text-xl font-semibold'>
                Ejemplos
            </h4>
            <section className='flex flex-col justify-around gap-1'>
                <div>
                    <section className='flex flex-row  gap-[.4rem]'>
                        <div className={'flip grid place-items-center border-2 border-green-600 w-14 h-14 md:w-16 md:h-16 bg-green-600'}>
                            <span className='text-white text-3xl font-extrabold'>
                                G
                            </span>
                        </div>
                        <div
                            className={'flip-exit grid place-items-center border-2 border-slate-500 hover:border-slate-400 active:border-slate-400 focus:border-slate-400 w-14 h-14 md:w-16 md:h-16 bg-black relative'}
                        >
                            <span className='text-white text-3xl font-extrabold'>
                                A
                            </span>
                        </div>
                        <div
                            className={'flip-exit grid place-items-center border-2 border-slate-500 hover:border-slate-400 active:border-slate-400 focus:border-slate-400 w-14 h-14 md:w-16 md:h-16 bg-black relative'}
                        >
                            <span className='text-white text-3xl font-extrabold'>
                                S
                            </span>
                        </div>
                        <div
                            className={'flip-exit grid place-items-center border-2 border-slate-500 hover:border-slate-400 active:border-slate-400 focus:border-slate-400 w-14 h-14 md:w-16 md:h-16 bg-black relative'}
                        >
                            <span className='text-white text-3xl font-extrabold'>
                                T
                            </span>
                        </div>
                        <div
                            className={'flip-exit grid place-items-center border-2 border-slate-500 hover:border-slate-400 active:border-slate-400 focus:border-slate-400 w-14 h-14 md:w-16 md:h-16 bg-black relative'}
                        >
                            <span className='text-white text-3xl font-extrabold'>
                                O
                            </span>
                        </div>
                    </section>
                    <p className='font-semibold'>
                        La G está en la palabra y en el lugar correcto.
                    </p>
                </div>
                <div>
                    <section className='flex flex-row  gap-[.4rem]'>
                        <div
                            className={'flip-exit grid place-items-center border-2 border-slate-500 hover:border-slate-400 active:border-slate-400 focus:border-slate-400 w-14 h-14 md:w-16 md:h-16 bg-black relative'}
                        >
                            <span className='text-white text-3xl font-extrabold'>
                                L
                            </span>
                        </div>
                        <div
                            className={'flip grid place-items-center border-2 border-yellow-500 w-14 h-14 md:w-16 md:h-16 bg-yellow-500'}
                        >
                            <span className='text-white text-3xl font-extrabold'>
                                U
                            </span>
                        </div>
                        <div
                            className={'flip-exit grid place-items-center border-2 border-slate-500 hover:border-slate-400 active:border-slate-400 focus:border-slate-400 w-14 h-14 md:w-16 md:h-16 bg-black relative'}
                        >
                            <span className='text-white text-3xl font-extrabold'>
                                G
                            </span>
                        </div>
                        <div
                            className={'flip-exit grid place-items-center border-2 border-slate-500 hover:border-slate-400 active:border-slate-400 focus:border-slate-400 w-14 h-14 md:w-16 md:h-16 bg-black relative'}
                        >
                            <span className='text-white text-3xl font-extrabold'>
                                A
                            </span>
                        </div>
                        <div
                            className={'flip-exit grid place-items-center border-2 border-slate-500 hover:border-slate-400 active:border-slate-400 focus:border-slate-400 w-14 h-14 md:w-16 md:h-16 bg-black relative'}
                        >
                            <span className='text-white text-3xl font-extrabold'>
                                R
                            </span>
                        </div>
                    </section>
                    <p className='font-semibold'>
                        La U está en la palabra pero en el lugar equivocado.
                    </p>
                </div>
                <div>
                    <section className='flex flex-row  gap-[.4rem]'>
                        <div
                            className={'flip-exit grid place-items-center border-2 border-slate-500 hover:border-slate-400 active:border-slate-400 focus:border-slate-400 w-14 h-14 md:w-16 md:h-16 bg-black relative'}
                        >
                            <span className='text-white text-3xl font-extrabold'>
                                B
                            </span>
                        </div>
                        <div
                            className={'flip-exit grid place-items-center border-2 border-slate-500 hover:border-slate-400 active:border-slate-400 focus:border-slate-400 w-14 h-14 md:w-16 md:h-16 bg-black relative'}
                        >
                            <span className='text-white text-3xl font-extrabold'>
                                A
                            </span>
                        </div>
                        <div
                            className={'flip-exit grid place-items-center border-2 border-slate-500 hover:border-slate-400 active:border-slate-400 focus:border-slate-400 w-14 h-14 md:w-16 md:h-16 bg-black relative'}
                        >
                            <span className='text-white text-3xl font-extrabold'>
                                L
                            </span>
                        </div>
                        <div
                            className={'flip grid place-items-center border-2 border-slate-500 w-14 h-14 md:w-16 md:h-16 bg-slate-500'}
                        >
                            <span className='text-white text-3xl font-extrabold'>
                                Ó
                            </span>
                        </div>
                        <div
                            className={'flip-exit grid place-items-center border-2 border-slate-500 hover:border-slate-400 active:border-slate-400 focus:border-slate-400 w-14 h-14 md:w-16 md:h-16 bg-black relative'}
                        >
                            <span className='text-white text-3xl font-extrabold'>
                                N
                            </span>
                        </div>
                    </section>
                    <p className='font-semibold'>
                        La Ó no está en ningún lugar de la palabra.
                    </p>
                </div>
            </section>
        </article>
    )
});
