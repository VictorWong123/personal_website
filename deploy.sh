#!/bin/bash

# Build the React application
npm run build

# Create a new branch for deployment (if it doesn't exist)
git checkout -b gh-pages 2>/dev/null || git checkout gh-pages

# Remove all files except .git
git rm -rf . 2>/dev/null || true

# Copy the built files
cp -r dist/* .

# Add all files
git add .

# Commit the changes
git commit -m "Deploy to GitHub Pages"

# Push to GitHub
git push origin gh-pages

# Switch back to main branch
git checkout main

echo "Deployment completed! Your site should be available at https://victorwong123.github.io/personal_website/" 