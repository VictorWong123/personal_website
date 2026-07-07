import React, { useState } from 'react';
import { profile } from '../data/siteData';

const CopyEmailButton = ({ className = 'text-button', label = 'say hello.' }) => {
    const [copied, setCopied] = useState(false);

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(profile.email);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
        } catch {
            setCopied(false);
        }
    };

    return (
        <button
            type="button"
            className={className}
            onClick={copyEmail}
            aria-label={`Copy email address ${profile.email}`}
        >
            {copied ? 'copied.' : label}
        </button>
    );
};

export default CopyEmailButton;
