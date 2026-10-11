import { useEffect, useState } from 'react';

const query = '(prefers-reduced-motion: reduce)';

const usePrefersReducedMotion = () => {
    const [reducedMotion, setReducedMotion] = useState(() => (
        typeof window !== 'undefined' && window.matchMedia(query).matches
    ));

    useEffect(() => {
        const media = window.matchMedia(query);
        const updatePreference = event => setReducedMotion(event.matches);
        media.addEventListener('change', updatePreference);
        return () => media.removeEventListener('change', updatePreference);
    }, []);

    return reducedMotion;
};

export default usePrefersReducedMotion;
