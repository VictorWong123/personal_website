import React, { useEffect, useRef } from 'react';
import WorkList from '../components/WorkList';
import EducationList from '../components/EducationList';
import SkillsList from '../components/SkillsList';

const Work = () => {
    const progressRef = useRef(null);

    useEffect(() => {
        let frameId = null;

        const updateScrollProgress = () => {
            if (!progressRef.current) return;

            const scrollTop = window.scrollY;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;

            progressRef.current.style.transform = `scaleY(${Math.min(Math.max(progress, 0), 1)})`;
        };

        const requestUpdate = () => {
            if (frameId) return;

            frameId = window.requestAnimationFrame(() => {
                frameId = null;
                updateScrollProgress();
            });
        };

        updateScrollProgress();
        window.addEventListener('scroll', requestUpdate, { passive: true });
        window.addEventListener('resize', requestUpdate);

        return () => {
            if (frameId) {
                window.cancelAnimationFrame(frameId);
            }
            window.removeEventListener('scroll', requestUpdate);
            window.removeEventListener('resize', requestUpdate);
        };
    }, []);

    return (
        <div className="work-page">
            <div className="work-scroll-progress" aria-hidden="true">
                <span ref={progressRef} />
            </div>
            <section className="page-section">
                <h1 className="page-title">work.</h1>
                <WorkList showHeading={false} />
            </section>
            <section className="page-section">
                <h1 className="page-title">education.</h1>
                <EducationList showHeading={false} />
            </section>
            <section className="page-section skills-page-section">
                <h1 className="page-title">skills.</h1>
                <SkillsList showHeading={false} />
            </section>
        </div>
    );
};

export default Work;
