export const profile = {
    name: 'victor wong',
    eyebrow: 'boston / looking to build new projects',
    headlineStart: 'builds',
    headlineStrong: 'data-driven, accessible digital experiences',
    headlineEnd: 'for the web and beyond.',
    intro: "I'm a data scientist, software engineer, and student researcher at Union College ('28). I have 4 years of experience in Python, from web development with Flask to data science with matplotlib, numpy, and pandas. In 2024, I dove into web development with HTML, CSS, JavaScript, and React. I love building meaningful projects and collaborating with others.",
    note: 'Outside of tech, I enjoy anime, ping pong, and chess.',
    email: 'victorwong315@gmail.com',
    resumeHref: '/personal_website/Victor_wong_resume (7).pdf',
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
            'Activities: Goldman Sachs Possibilities Summit, CodePath Interview Prep, freeCodeCamp, ICPC',
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
        description: 'Full-stack app that automates group grocery splitting. Users input shared and personal items to generate accurate cost breakdowns. Integrated Mistral AI for receipt scanning.',
        tech: ['React', 'JavaScript', 'Tailwind CSS', 'Passport.js', 'Mistral AI'],
    },
    {
        title: 'Spotify-Wrapped',
        url: 'https://github.com/VictorWong123/spotify-wrapped',
        description: 'Web app that generates 10+ interactive visualizations of Spotify listening data. Features secure login, personalized charts, and a compatibility score for comparing music tastes.',
        tech: ['React', 'Node.js', 'D3.js', 'Auth0', 'JavaScript', 'HTML', 'CSS'],
    },
    {
        title: 'WriteLight',
        url: 'https://github.com/freeCodeCamp-2025-Summer-Hackathon/purple-array',
        description: 'Full-stack app that helps users learn new vocabulary through daily reflection and action. Users receive a new word, use it meaningfully, and journal their experience through guided prompts.',
        tech: ['React', 'JavaScript', 'Tailwind CSS', 'DaisyUI'],
    },
    {
        title: 'LifeCents',
        url: 'https://github.com/VictorWong123/LifeCents',
        description: 'Chrome extension that converts online prices into estimated work time based on hourly wage. Uses DOM scraping to dynamically detect and replace prices across websites.',
        tech: ['JavaScript', 'HTML', 'CSS'],
    },
];
