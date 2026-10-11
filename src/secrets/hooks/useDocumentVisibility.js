import { useEffect, useState } from 'react';

const getIsVisible = () => typeof document === 'undefined' || document.visibilityState !== 'hidden';

const useDocumentVisibility = () => {
    const [visible, setVisible] = useState(getIsVisible);

    useEffect(() => {
        const updateVisibility = () => setVisible(getIsVisible());
        document.addEventListener('visibilitychange', updateVisibility);
        return () => document.removeEventListener('visibilitychange', updateVisibility);
    }, []);

    return visible;
};

export default useDocumentVisibility;
