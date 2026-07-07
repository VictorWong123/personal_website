export const profile = {
    name: 'Victor Wong',
    eyebrow: 'Boston / looking to build interesting projects',
    headline: 'Software Engineer.',
    intro: "Always Learning. Always Building. Currently interning at The First Electronics Corporation. Previous SWE Intern at BIS Computer Solutions and EpiBuild. If interested in working together, reach out.",
    note: "When I don't code, you can find me playing chess or working out.",
    email: 'victorwong315@gmail.com',
    resumeHref: `${import.meta.env.BASE_URL}Victor_wong_resume (7).pdf`,
    links: {
        github: 'https://github.com/VictorWong123',
        linkedin: 'https://www.linkedin.com/in/victor-wong-58029a238/',
    },
};

export const workExperience = [
    {
        company: 'Union College',
        title: 'Research Assistant',
        date: 'Oct 2024 - Present',
        description: 'Helped design and launch the first-ever website for Union College CAP Lab using Next.js and Tailwind CSS. Studied gesture-based interactions with MediaPipe, reviewed UI/UX research papers, and collaborated with an 8-person team through GitHub and weekly design reviews.',
        tech: ['Next.js', 'Tailwind CSS', 'MediaPipe', 'JavaScript', 'Research'],
    },
    {
        company: 'EpiBuild',
        title: 'Software Developer',
        date: 'Feb 2025 - Jun 2025',
        description: 'Built three D3.js visualizations of over 20,000 woodworking sales records, implemented Passport.js authentication for internal dashboards, contributed Figma interface work, deployed on Heroku, and integrated Amazon S3 for historical data.',
        tech: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'D3'],
    },
];

export const education = [
    {
        school: 'Union College',
        degree: 'B.S. in Computer Science',
        date: 'Expected June 2028',
        details: [
            'Relevant coursework: Intro to Computer Science, Multivariable Calculus, Set Theory, Data Visualization',
            'Activities: CodePath Interview Prep, MLT Career Prep Fellow, ICPC',
        ],
    },
];
    
export const skillGroups = [
    {
        title: 'Programming Languages',
        skills: ['Python', 'JavaScript', 'R'],
    },
    {
        title: 'Databases',
        skills: ['MongoDB', 'SQL', 'Postgres'],
    },
    {
        title: 'Frameworks & Libraries',
        skills: ['React', 'Next.js', 'Express.js', 'Node.js', 'Tailwind', 'D3', 'Pandas', 'Matplotlib'],
    },
    {
        title: 'Other',
        skills: ['HTML', 'CSS', 'Git', 'Figma', 'Heroku', 'Data Structures and Algorithms'],
    },
];

export const projects = [
    {
        title: 'ShopNSplit',
        url: 'https://github.com/VictorWong123/shopNsplit',
        summary: 'Receipt-based grocery splitting for groups.',
        description: 'Full-stack app that automates group grocery splitting. Users input shared and personal items to generate accurate cost breakdowns. Integrated Mistral AI for receipt scanning.',
        tech: ['React', 'JavaScript', 'Tailwind CSS', 'Passport.js', 'Mistral AI'],
    },
    {
        title: 'Spotify-Wrapped',
        url: 'https://github.com/VictorWong123/spotify-wrapped',
        summary: 'Personal Spotify listening data visualized.',
        description: 'Web app that generates 10+ interactive visualizations of Spotify listening data. Features secure login, personalized charts, and a compatibility score for comparing music tastes.',
        tech: ['React', 'Node.js', 'D3.js', 'Auth0', 'JavaScript', 'HTML', 'CSS'],
    },
    {
        title: 'WriteLight',
        url: 'https://github.com/freeCodeCamp-2025-Summer-Hackathon/purple-array',
        summary: 'Daily vocabulary learning through reflection.',
        description: 'Full-stack app that helps users learn new vocabulary through daily reflection and action. Users receive a new word, use it meaningfully, and journal their experience through guided prompts.',
        tech: ['React', 'JavaScript', 'Tailwind CSS', 'DaisyUI'],
    },
    {
        title: 'LifeCents',
        url: 'https://github.com/VictorWong123/LifeCents',
        summary: 'Online prices translated into work time.',
        description: 'Chrome extension that converts online prices into estimated work time based on hourly wage. Uses DOM scraping to dynamically detect and replace prices across websites.',
        tech: ['JavaScript', 'HTML', 'CSS'],
    },
];
