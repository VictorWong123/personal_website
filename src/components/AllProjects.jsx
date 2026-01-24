import React from 'react';
import Stack from './Stack';
import projectData from '../../project_UI.json';

// Icon components
const iconStrokeProps = {
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    fill: 'none',
};

const IconGithub = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
);

const IconArrow = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
        <path {...iconStrokeProps} d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);

// Featured Project Card for Stack (with image placeholder)
const FeaturedStackCard = ({ project }) => {
    // Image placeholder - you can replace this src with your actual image later
    const imageSrc = project.image || null;

    return (
        <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-[#3A3A3A] bg-[#1B1B1B] shadow-2xl">
            {/* Image Area - White placeholder until you add images */}
            <div className="w-full h-[55%] bg-white flex items-center justify-center">
                {imageSrc ? (
                    <img
                        src={imageSrc}
                        alt={project.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-gray-400 text-sm">Image coming soon</span>
                )}
            </div>

            {/* Content Area */}
            <div className="p-5 h-[45%] flex flex-col">
                <h3 className="text-lg sm:text-xl font-bold text-[#F2F2F2]">
                    {project.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-[#B9B9B9] line-clamp-2 flex-grow">
                    {project.description}
                </p>

                {/* Tech Tags */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.tech?.slice(0, 3).map((tech, i) => (
                        <span
                            key={i}
                            className="px-2 py-0.5 text-[10px] sm:text-xs text-[#8A8A8A] border border-[#3A3A3A] rounded-full"
                        >
                            {tech}
                        </span>
                    ))}
                </div>

                {/* GitHub Link */}
                <div className="mt-3 flex items-center gap-2 text-[#D9C26A] text-xs sm:text-sm">
                    <IconGithub className="w-4 h-4" />
                    <span>View on GitHub</span>
                </div>
            </div>
        </div>
    );
};

const AllProjects = () => {
    const { page, featuredStack, allProjects } = projectData;

    // Handle card click - open GitHub link
    const handleStackCardClick = (cardData) => {
        const project = featuredStack.projects[cardData.id];
        if (project?.links?.github && project.links.github !== 'lorem-ipsum') {
            window.open(project.links.github, '_blank');
        }
    };

    // Create stack cards from featured projects
    const stackCards = featuredStack.projects.map((project, index) => (
        <FeaturedStackCard key={project.id} project={project} />
    ));

    return (
        <div
            className="min-h-screen py-24 sm:py-28 md:py-32"
            style={{ backgroundColor: '#141414' }}
        >
            <div className="max-w-6xl mx-auto px-6 md:px-10">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#F2F2F2]">
                        {page.title}
                    </h1>
                    <p className="mt-4 text-base md:text-lg text-[#B9B9B9] max-w-2xl mx-auto">
                        {page.subtitle}
                    </p>
                </div>

                {/* Featured Projects Stack */}
                <section className="mt-10 md:mt-14">
                    <h2 className="text-xl md:text-2xl font-semibold text-[#F2F2F2] mb-2">
                        {featuredStack.title}
                    </h2>
                    <p className="text-sm text-[#8A8A8A] mb-8">
                        {featuredStack.description}
                    </p>

                    {/* Stack Container - centered */}
                    <div className="flex justify-center">
                        <div className="w-[280px] h-[380px] sm:w-[340px] sm:h-[440px] md:w-[400px] md:h-[500px]">
                            <Stack
                                cards={stackCards}
                                randomRotation={false}
                                sensitivity={200}
                                sendToBackOnClick={true}
                                autoplay={false}
                                autoplayDelay={3000}
                                pauseOnHover={false}
                                onCardClick={handleStackCardClick}
                            />
                        </div>
                    </div>

                    <p className="text-center text-xs text-[#8A8A8A] mt-6">
                        Click cards to cycle through
                    </p>
                </section>

                {/* All Projects Grid */}
                <section className="mt-16 md:mt-24">
                    <h2 className="text-xl md:text-2xl font-semibold text-[#F2F2F2] mb-2">
                        {allProjects.title}
                    </h2>
                    <p className="text-sm text-[#8A8A8A] mb-8">
                        Everything else I've been working on.
                    </p>

                    {/* Project Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {allProjects.projects.map((project, index) => (
                            <a
                                key={project.id}
                                href={project.links?.primary !== 'lorem-ipsum' ? project.links?.primary : '#'}
                                target={project.links?.primary !== 'lorem-ipsum' ? '_blank' : undefined}
                                rel="noopener noreferrer"
                                className="cursor-target group relative bg-[#1B1B1B] border border-[#3A3A3A] rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-[#D9C26A]/30 focus:outline-none focus:ring-2 focus:ring-[#D9C26A]/40 min-h-[180px]"
                            >
                                {/* Number */}
                                <span className="text-sm tracking-widest text-[#8A8A8A] font-mono">
                                    #{String(index + 1).padStart(3, '0')}
                                </span>

                                {/* Title */}
                                <h3 className="mt-3 text-xl font-semibold text-[#F2F2F2] group-hover:text-[#D9C26A] transition-colors">
                                    {project.title}
                                </h3>

                                {/* Description */}
                                <p className="mt-2 text-sm leading-relaxed text-[#B9B9B9]">
                                    {project.description}
                                </p>

                                {/* Tags */}
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {project.tags?.map((tag, i) => (
                                        <span
                                            key={i}
                                            className="inline-flex items-center px-3 py-1 text-xs text-[#8A8A8A] border border-[#3A3A3A] rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Arrow indicator */}
                                <div className="absolute right-5 top-5 w-8 h-8 rounded-full border border-[#3A3A3A] bg-black/20 flex items-center justify-center group-hover:border-[#D9C26A]/50 group-hover:bg-[#D9C26A]/10 transition-colors">
                                    <IconArrow className="w-4 h-4 text-[#8A8A8A] group-hover:text-[#D9C26A] transition-colors" />
                                </div>
                            </a>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AllProjects;
