import React from 'react';
import { Link } from 'react-router-dom';

// Icon components with thin stroke
const iconStrokeProps = {
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    fill: 'none',
};

const IconFolder = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
        <path {...iconStrokeProps} d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
        <path {...iconStrokeProps} d="M8 13.5c1.2-1.2 3.8-1.2 5 0 1.2 1.2 3.8 1.2 5 0" />
    </svg>
);

const IconUser = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
        <path {...iconStrokeProps} d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4z" />
        <path {...iconStrokeProps} d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" />
    </svg>
);

const IconEdit = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
        <path {...iconStrokeProps} d="M12 20h9" />
        <path {...iconStrokeProps} d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
);

const IconMail = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
        <path {...iconStrokeProps} d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
        <path {...iconStrokeProps} d="M22 8l-10 7L2 8" />
    </svg>
);

const iconMap = {
    'folder-heart': IconFolder,
    'user-hex': IconUser,
    edit: IconEdit,
    mail: IconMail,
};

const NavCard = ({ href, label, icon, theme }) => {
    const IconComponent = iconMap[icon] || IconFolder;
    const isInternal = typeof href === 'string' && href.startsWith('/');
    const CardLink = isInternal ? Link : 'a';
    const linkProps = isInternal ? { to: href } : { href: href || '#' };

    const cardStyle = {
        backgroundColor: theme.colors.panel,
        borderColor: theme.colors.panelBorder,
        color: theme.colors.textSecondary,
    };

    return (
        <CardLink
            {...linkProps}
            aria-label={label}
            className={`cursor-target ${theme.radius.card} flex min-h-[100px] sm:min-h-[120px] md:min-h-[140px] items-center justify-center border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 block`}
            style={{
                ...cardStyle,
                '--tw-ring-color': theme.colors.accent,
                '--tw-ring-offset-color': theme.colors.bg,
            }}
        >
            <div className="flex flex-col items-center gap-2 sm:gap-3 text-center px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6">
                {/* Icon circle */}
                <div
                    className="flex h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 items-center justify-center rounded-full border transition-colors duration-200"
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                        borderColor: theme.colors.panelBorder,
                        color: theme.colors.textPrimary,
                    }}
                >
                    <IconComponent className="h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                </div>

                {/* Label */}
                <span
                    className="text-xs sm:text-sm md:text-base"
                    style={{
                        fontWeight: theme.typography.fontWeights.cardLabel,
                        color: theme.colors.textSecondary,
                    }}
                >
                    {label}
                </span>
            </div>
        </CardLink>
    );
};

export default NavCard;
