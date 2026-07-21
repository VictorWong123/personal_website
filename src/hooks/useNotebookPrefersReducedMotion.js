import { useEffect, useState } from 'react';

const getPreference = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const useNotebookPrefersReducedMotion = () => {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(getPreference);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const updatePreference = event => setPrefersReducedMotion(event.matches);

        mediaQuery.addEventListener('change', updatePreference);
        return () => mediaQuery.removeEventListener('change', updatePreference);
    }, []);

    return prefersReducedMotion;
};

export default useNotebookPrefersReducedMotion;
