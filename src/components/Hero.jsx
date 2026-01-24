import React from 'react';
import TextType from './TextType';

const Hero = ({ content, theme }) => {
    const buttonHref = content.primaryCta.href;
    const isDownload = typeof buttonHref === 'string' && buttonHref.toLowerCase().endsWith('.pdf');

    return (
        <div className="flex flex-col gap-3 sm:gap-4 md:gap-6">
            {/* Hello tag */}
            <p
                className="text-xs sm:text-sm md:text-base"
                style={{
                    color: theme.colors.textSecondary,
                    fontWeight: theme.typography.fontWeights.hello,
                }}
            >
                {content.hello}
            </p>

            {/* Big name headline */}
            <div>
                <h1
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[1.1]"
                    style={{
                        color: theme.colors.textPrimary,
                        fontWeight: theme.typography.fontWeights.name,
                    }}
                >
                    {content.nameLine}
                </h1>
                <TextType
                    text="Software Engineer"
                    as="div"
                    typingSpeed={100}
                    pauseDuration={3000}
                    deletingSpeed={50}
                    loop={true}
                    showCursor={true}
                    cursorCharacter="|"
                    className="text-sm sm:text-base md:text-lg mt-1 sm:mt-2"
                    style={{
                        color: theme.colors.accent,
                        fontWeight: theme.typography.fontWeights.hello,
                    }}
                />
            </div>

            {/* Description paragraph */}
            <p
                className="text-xs sm:text-sm md:text-base max-w-md leading-relaxed"
                style={{
                    color: theme.colors.textSecondary,
                    fontWeight: theme.typography.fontWeights.body,
                }}
            >
                {content.description}
            </p>

            {/* Download Resume button */}
            <a
                href={buttonHref}
                className={`cursor-target ${theme.radius.button} inline-flex items-center justify-center px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 text-xs sm:text-sm md:text-base self-start`}
                style={{
                    backgroundColor: theme.colors.accent,
                    color: '#000',
                    fontWeight: theme.typography.fontWeights.button,
                }}
                download={isDownload ? '' : undefined}
                target={isDownload ? '_blank' : undefined}
                rel={isDownload ? 'noreferrer' : undefined}
            >
                {content.primaryCta.label}
            </a>
        </div>
    );
};

export default Hero;
