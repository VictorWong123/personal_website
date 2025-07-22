# Victor Wong - Personal Website

A modern personal portfolio website built with React, featuring a dark blue theme with smooth animations and interactive elements.

## Features

- **React-based architecture** with component-based structure
- **React Router** for client-side navigation
- **Responsive design** that works on all devices
- **Typing animation** on the home page
- **Interactive project showcase** with technology tags
- **PDF resume viewer** with download functionality
- **Email copy functionality** with clipboard API
- **Modern CSS** with hover effects and animations

## Tech Stack

- **Frontend**: React 18, React Router DOM
- **Build Tool**: Vite
- **Styling**: CSS3 with custom animations
- **Deployment**: GitHub Pages ready

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Preview production build**:
   ```bash
   npm run preview
   ```

## Project Structure

```
src/
├── components/          # React components
│   ├── Navbar.jsx     # Navigation component
│   ├── Home.jsx       # Home page with typing effect
│   ├── About.jsx      # About page with experience
│   ├── Projects.jsx   # Projects showcase
│   └── Resume.jsx     # Resume viewer and download
├── images/            # Static images
├── pdfs/             # PDF files
├── styles.css        # Global styles
├── App.jsx           # Main app component
└── main.jsx          # React entry point
```

## Components

### Navbar
- Responsive navigation with active link highlighting
- Uses React Router for client-side navigation

### Home
- Typing animation effect using React hooks
- Social media links with hover effects
- Email copy functionality

### About
- Personal introduction and background
- Work experience section
- Technical skills showcase

### Projects
- Interactive project cards with hover effects
- Technology tags for each project
- Responsive grid layout

### Resume
- PDF viewer with iframe
- Download functionality
- Responsive design

## Deployment

The application is configured for GitHub Pages deployment. The build process creates optimized static files that can be served from any static hosting service.

## Development

- **Hot reload** enabled for development
- **ESLint** and **Prettier** ready
- **TypeScript** support available
- **CSS modules** support available

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
