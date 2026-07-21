import React, { useId } from 'react';

const NotebookPencil = ({ className = '' }) => {
    const idBase = useId().replaceAll(':', '');
    const paintGradientId = `notebook-pencil-paint-${idBase}`;
    const woodGradientId = `notebook-pencil-wood-${idBase}`;

    return (
        <svg
            className={`notebook-pencil ${className}`.trim()}
            viewBox="0 0 60 198"
            aria-hidden="true"
            focusable="false"
        >
            <defs>
                <linearGradient id={paintGradientId} x1="0" x2="1">
                    <stop offset="0" stopColor="#9f6521" />
                    <stop offset="0.25" stopColor="#f4c34f" />
                    <stop offset="0.55" stopColor="#ffe08a" />
                    <stop offset="1" stopColor="#a96a1e" />
                </linearGradient>
                <linearGradient id={woodGradientId} x1="0" x2="1">
                    <stop offset="0" stopColor="#b77b44" />
                    <stop offset="0.5" stopColor="#f1c48a" />
                    <stop offset="1" stopColor="#9a6035" />
                </linearGradient>
            </defs>
            <path d="M14 18 L46 18 L46 162 L14 162 Z" fill={`url(#${paintGradientId})`} />
            <path d="M14 18 L46 18 L42 7 L18 7 Z" fill="#d7a647" />
            <path d="M18 7 L42 7 L40 1 L20 1 Z" fill="#e3a6a6" />
            <path d="M14 162 L46 162 L30 193 Z" fill={`url(#${woodGradientId})`} />
            <path d="M25 184 L35 184 L30 197 Z" fill="#2f2922" />
            <path d="M20 24 L20 153" fill="none" stroke="#fff2aa" strokeWidth="3" opacity="0.58" />
            <path d="M14 162 L46 162" stroke="#7b481d" strokeWidth="2" opacity="0.42" />
        </svg>
    );
};

export default NotebookPencil;
