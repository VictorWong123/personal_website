export const profile = {
    name: 'Victor Wong',
    eyebrow: 'Boston / looking to build interesting projects',
    headline: 'Software Engineer.',
    intro: 'Always Learning. Always Building. Currently an Engineering Intern at Trexon and Undergraduate HCI Researcher at Union College. Previous SWE Intern at BIS Computer Solutions and EpiBuild. If interested in working together, reach out.',
    note: "When I don't code, you can find me playing chess or working out.",
    email: 'victorwong315@gmail.com',
    resumeHref: `${import.meta.env.BASE_URL}Victor_wong_resume (7).pdf`,
    links: {
        github: 'https://github.com/VictorWong123',
        linkedin: 'https://www.linkedin.com/in/victorw12/',
    },
};

export const workExperience = [
    {
        company: 'Trexon',
        title: 'Engineering Intern',
        date: 'Jun 2026 - Present',
        description: 'Reduced manual data entry time by building an OCR pipeline with Tesseract.js and Python to convert legacy paper records into structured Excel data.',
        tech: ['Python', 'Tesseract.js', 'OCR', 'Excel'],
    },
    {
        company: 'Union College',
        title: 'Undergraduate HCI Researcher',
        date: 'Oct 2024 - Present',
        description: "Programmed a real-time MediaPipe web app for gesture-based interaction, ran a user study, and launched CAP Lab's first website using Next.js.",
        tech: ['Next.js', 'MediaPipe', 'JavaScript', 'HCI Research'],
    },
    {
        company: 'BIS Computer Solutions',
        title: 'Software Engineering Intern',
        date: 'Apr 2026 - Jun 2026',
        description: 'Created a natural language-to-SQL engine with Gemini, TypeScript, and vector search, and automated support intake with an AI voice agent that creates structured Jira tickets.',
        tech: ['TypeScript', 'Gemini', 'postgreSQL', 'Jira'],
    },
    {
        company: 'EpiBuild',
        title: 'Software Engineering Intern',
        date: 'Feb 2025 - Jun 2025',
        description: 'Developed three D3.js visualizations for 20,000+ sales records, optimized SQL processing pipelines, and managed Heroku and AWS S3 deployment for historical sales data.',
        tech: ['D3.js', 'SQL', 'Javascript', 'AWS S3'],
    },
];

export const education = [
    {
        school: 'Union College',
        degree: 'B.S. in Computer Science',
        date: 'Expected June 2028',
        details: [
            'Relevant coursework: Intro to Computer Science, Multivariable Calculus, Set Theory, Data Visualization, Data Structures.',
            'Activities: CodePath Interview Prep, MLT Career Prep Fellow, ICPC',
        ],
    },
];
    
export const skillGroups = [
    {
        title: 'Languages',
        skills: ['Python', 'TypeScript', 'JavaScript', 'Java'],
    },
    {
        title: 'Tools & Frameworks',
        skills: ['React', 'Next.js', 'Node.js', 'Express.js', 'FastAPI', 'MongoDB', 'PostgreSQL', 'Supabase', 'Git', 'Docker'],
    },
];

export const projects = [
    {
        title: 'BioRT-Bench',
        category: 'ai benchmark',
        summary: 'Hackathon winning red-teaming benchmark for biosecurity.',
        description: 'Built an LLM red-teaming benchmark evaluating four frontier models across four jailbreak attacks and 40 biosecurity prompts, with a React dashboard for analyzing refusal, specificity, and actionability across 640 model responses.',
        tech: ['Python', 'PyRIT', 'React', 'TypeScript', 'FastAPI'],
    },
    {
        title: 'Viva',
        category: 'voice ai',
        summary: 'Real-time AI voice tutoring for classroom support.',
        description: "Built a real-time voice tutoring system using LiveKit WebRTC and FastAPI with sub-3s audio latency, Google Classroom OAuth integration, MongoDB token storage, and Gemini-powered personalization based on teachers' teaching styles.",
        tech: ['FastAPI', 'React', 'TypeScript', 'Python', 'LiveKit', 'MongoDB'],
    },
    {
        title: 'FlexFlow',
        category: 'health ai',
        summary: 'AI physical therapist with real-time session tracking.',
        description: "Architected a real-time AI physical therapist using MediaPipe landmarks, async audio streaming, Gemini summaries, Supabase, and a weighted image search engine for 873+ exercises to track users' progress.",
        tech: ['React', 'TypeScript', 'Python', 'FastAPI', 'LiveKit', 'Gemini', 'Supabase', 'Next.js'],
    },
    {
        title: 'strengthOS',
        category: 'fitness app',
        url: 'https://github.com/VictorWong123/strengthOS',
        summary: 'Fitness tracker with an MCP server.',
        description: 'Workout tracker with a FastMCP server, using Supabase, PostgreSQL and Typescript to connect to LLMs for real time feedback.',
        tech: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'FastAPI', 'FastMCP', 'Supabase', 'PostgreSQL', 'Vercel', 'Render'],
    },
    {
        title: 'VARify',
        category: 'computer vision',
        url: 'https://github.com/VictorWong123/VARify',
        summary: 'AI referee assistant for soccer card decisions.',
        description: 'Hackathon honorable mention where users upload match clips, the backend analyzes video, and the frontend displays a referee-style decision with timestamps, explanation, and evidence moments.',
        tech: ['React', 'TypeScript', 'Java', 'Spring Boot', 'Gemini', 'RocketRide', 'GMI Cloud'],
    },
    {
        title: 'Redline',
        category: 'llm-wiki',
        url: 'https://github.com/VictorWong123/llm-wiki',
        summary: 'Safety wiki and preflight layer for coding agents.',
        description: 'Redline is a hackathon project for a living safety wiki and preflight layer that stores trusted safety rules, checks proposed code or untrusted content before an agent acts, returns a safety verdict, and saves accepted catches as observed violations plus regression tests.',
        tech: ['Python', 'Redis', 'Cognee', 'OpenAI API'],
    },
    {
        title: 'Orbits',
        category: 'personal crm',
        url: 'https://github.com/VictorWong123/Orbits',
        summary: 'Private personal relationship manager.',
        description: 'Private personal relationship manager for keeping track of people, facts, preferences, interests, notes, and upcoming events. It works offline with localStorage and syncs to the cloud when signed in.',
        tech: ['Next.js', 'TypeScript', 'Supabase', 'Vercel', 'localStorage', 'Playwright'],
    },
    {
        title: 'multidoku',
        category: 'game',
        url: 'https://github.com/VictorWong123/multidoku',
        summary: 'Sudoku app with single-player puzzles and multiplayer rooms.',
        description: 'Sudoku web app with single-player puzzles and real-time multiplayer rooms using WebSockets.',
        tech: ['MongoDB', 'Express', 'React', 'Node.js', 'Socket.io', 'Vite', 'WebSockets'],
    },
    {
        title: 'ShopNSplit',
        category: 'full-stack web app',
        url: 'https://github.com/VictorWong123/shopNsplit',
        summary: 'Receipt-based grocery splitting for groups.',
        description: 'Full-stack app that automates group grocery splitting. Users input shared and personal items to generate accurate cost breakdowns. Integrated Gemini for receipt scanning.',
        tech: ['React', 'JavaScript', 'Tailwind CSS', 'Supabase', 'Gemiini'],
    },
    {
        title: 'Spotify-Wrapped',
        category: 'data visualization',
        url: 'https://github.com/VictorWong123/spotify-wrapped',
        summary: 'Personal Spotify listening data visualized.',
        description: 'Web app that generates 10+ interactive visualizations of Spotify listening data. Features secure login, personalized charts, and a compatibility score for comparing music tastes.',
        tech: ['React', 'Node.js', 'D3.js', 'JavaScript'],
    },
    {
        title: 'WriteLight',
        category: 'Full-stack writing app',
        url: 'https://github.com/freeCodeCamp-2025-Summer-Hackathon/purple-array',
        summary: 'Daily vocabulary learning through reflection.',
        description: 'Full-stack app that helps users learn new vocabulary through daily reflection and action. Users receive a new word, use it meaningfully, and journal their experience through guided prompts.',
        tech: ['React', 'JavaScript', 'Tailwind CSS', 'DaisyUI'],
    },
    {
        title: 'Screenly',
        category: 'productivity',
        url: 'https://github.com/VictorWong123/Screenly',
        summary: 'Productivity tracking dashboard with D3 analytics.',
        description: 'Smart productivity tracking app with manual time tracking, a React dashboard, D3.js analytics charts, leaderboards, Supabase authentication, and productivity insights.',
        tech: ['React', 'Vite', 'Tailwind CSS', 'D3.js', 'Supabase', 'PostgreSQL'],
    },
    {
        title: 'LifeCents',
        category: 'Chrome extension',
        url: 'https://github.com/VictorWong123/LifeCents',
        summary: 'Online prices translated into work time.',
        description: 'Chrome extension that converts online prices into estimated work time based on hourly wage. Uses DOM scraping to dynamically detect and replace prices across websites.',
        tech: ['JavaScript', 'HTML', 'CSS'],
    },
];
