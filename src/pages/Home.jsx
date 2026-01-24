import React from 'react';
import Hero from '../components/Hero';
import NavCard from '../components/NavCard';
import landingSpec from '../../landing_page.json';

/*
Relevant files reviewed (scrape-first workflow):
- /Users/victorwong/Downloads/personal_website/src/App.jsx (Router config, landing route = '/')
- /Users/victorwong/Downloads/personal_website/src/pages/Home.jsx (this component)
- /Users/victorwong/Downloads/personal_website/src/components/Hero.jsx
- /Users/victorwong/Downloads/personal_website/src/components/NavCard.jsx
- /Users/victorwong/Downloads/personal_website/landing_page.json (spec source)
*/

const Home = () => {
    const { theme, content } = landingSpec;

    return (
        <main
            className="min-h-screen flex items-center justify-center py-20 sm:py-24 md:py-28"
            style={{
                backgroundColor: theme.colors.bg,
                color: theme.colors.textPrimary,
                fontFamily: theme.typography.fontFamily,
            }}
        >
            <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
                    {/* Left: Hero */}
                    <div className="lg:pr-4 md:lg:pr-8">
                        <Hero content={content.hero} theme={theme} />
                    </div>

                    {/* Right: 2x2 Nav Cards */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                        {content.navCards.map(card => (
                            <NavCard
                                key={card.id}
                                href={card.href}
                                label={card.label}
                                icon={card.icon}
                                theme={theme}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Home;
