import React, { useEffect, useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import WorkList from '../components/WorkList';
import EducationList from '../components/EducationList';
import SkillsList from '../components/SkillsList';

const Work = () => {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const updateScrollProgress = () => {
            const scrollTop = window.scrollY;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;

            setScrollProgress(Math.min(Math.max(progress, 0), 1));
        };

        updateScrollProgress();
        window.addEventListener('scroll', updateScrollProgress, { passive: true });
        window.addEventListener('resize', updateScrollProgress);

        return () => {
            window.removeEventListener('scroll', updateScrollProgress);
            window.removeEventListener('resize', updateScrollProgress);
        };
    }, []);

    return (
        <>
            <div className="work-scroll-progress" aria-hidden="true">
                <span style={{ transform: `scaleY(${scrollProgress})` }} />
            </div>
            <SectionHeading
                eyebrow="experience / education / skills"
                title="work shaped by research, data, and web systems."
            />
            <WorkList />
            <EducationList />
            <SkillsList />
        </>
    );
};

export default Work;
