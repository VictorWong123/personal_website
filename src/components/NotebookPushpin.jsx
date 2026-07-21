import React, { useId } from 'react';

const NotebookPushpin = () => {
    const gradientId = `notebook-pin-${useId().replaceAll(':', '')}`;

    return (
        <svg className="notebook-pushpin" data-notebook-pin viewBox="0 0 52 62" aria-hidden="true" focusable="false">
            <defs>
                <radialGradient id={gradientId} cx="34%" cy="24%" r="72%">
                    <stop offset="0" stopColor="#fff2c7" />
                    <stop offset="0.32" stopColor="#c7a55d" />
                    <stop offset="0.78" stopColor="#7d6030" />
                    <stop offset="1" stopColor="#4a351a" />
                </radialGradient>
            </defs>
            <ellipse cx="27" cy="55" rx="4" ry="6" fill="#15100a" opacity="0.35" />
            <path d="M18 11 C18 3 34 3 34 11 C34 17 39 19 42 23 L10 23 C13 19 18 17 18 11Z" fill={`url(#${gradientId})`} />
            <path d="M15 23 H37 L33 36 H19 Z" fill={`url(#${gradientId})`} />
            <path d="M26 36 L29 55 L25 55 L23 36 Z" fill="#8b6933" />
            <circle cx="26" cy="11" r="7" fill="none" stroke="#fff4ca" strokeWidth="1.5" opacity="0.5" />
        </svg>
    );
};

export default NotebookPushpin;
