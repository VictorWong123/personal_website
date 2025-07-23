import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Best practice for GitHub Pages: output to docs/ and set base to repo name
export default defineConfig({
    base: '/personal_website/',
    build: {
        outDir: 'docs', // GitHub Pages will serve from /docs on main branch
    },
    plugins: [react()],
    server: {
        port: 3000,
        open: true
    }
}); 