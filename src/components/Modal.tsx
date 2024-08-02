import React from 'react';
import type { ForwardedRef, ReactElement } from 'react';


export default React.forwardRef(function Modal({ children, onClose }: { children: ReactElement; onClose: () => void; }, ref: ForwardedRef<HTMLButtonElement>): ReactElement {
    return (
            <button
                ref={ref}
                onMouseDown={onClose}
                className="absolute h-[100dvh] w-[100dvw] grid place-content-center bg-transparent"
            >
                {children}
            </button>
    )
});