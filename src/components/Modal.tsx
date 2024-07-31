import React from 'react';
import type { ForwardedRef, ReactElement } from 'react';


export default React.forwardRef(function Modal({ children }: { children: ReactElement }, ref: ForwardedRef<HTMLElement>): ReactElement {
    return (
            <article ref={ref}
                className="absolute h-[100dvh] w-[100dvw] grid place-content-center bg-transparent"
            >
                {children}
            </article>
    )
});