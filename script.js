const titles = [
    'Data Scientist',
    'Software Engineer',
    'Student Researcher'
];
let currentTitle = 0;
let charIndex = 0;
let typingElement = document.getElementById('typing');

function typeTitle() {
    if (!typingElement) typingElement = document.getElementById('typing');
    if (charIndex < titles[currentTitle].length) {
        typingElement.textContent += titles[currentTitle].charAt(charIndex);
        charIndex++;
        setTimeout(typeTitle, 100);
    } else {
        setTimeout(eraseTitle, 1500);
    }
}

function eraseTitle() {
    if (charIndex > 0) {
        typingElement.textContent = titles[currentTitle].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(eraseTitle, 50);
    } else {
        currentTitle = (currentTitle + 1) % titles.length;
        setTimeout(typeTitle, 500);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    // Only run typing effect if #typing exists
    if (document.getElementById('typing')) {
        typeTitle();
    }
}); 