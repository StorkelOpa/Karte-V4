/**
 * Initializes the home page's interactive elements, including a boot sequence animation
 * and the subsequent display of the main menu and description.
 */
export function initHomePage() {
    const bootSequence = document.getElementById('boot-sequence');
    const mainMenu = document.getElementById('main-menu');
    const description = document.getElementById('description');

    if (!bootSequence || !mainMenu || !description) {
        console.error("Home page elements not found.");
        return;
    }

    // Ensure boot sequence is visible and others are hidden initially
    bootSequence.style.display = 'block';
    mainMenu.style.display = 'none';
    description.style.display = 'none';

    const bootLines = bootSequence.querySelectorAll('p');
    let delay = 0;
    const lineDelay = 300; // Milliseconds between lines
    const charDelay = 50; // Milliseconds between characters

    bootLines.forEach((line, index) => {
        const originalText = line.textContent;
        line.textContent = ''; // Clear text for typing effect
        line.style.display = 'block'; // Ensure line is visible

        setTimeout(() => {
            let i = 0;
            const typingInterval = setInterval(() => {
                if (i < originalText.length) {
                    line.textContent += originalText.charAt(i);
                    i++;
                } else {
                    clearInterval(typingInterval);
                }
            }, charDelay);
        }, delay);
        delay += originalText.length * charDelay + lineDelay; // Accumulate delay
    });

    // After all boot lines, show the main menu and description
    setTimeout(() => {
        bootSequence.style.display = 'none';
        mainMenu.style.display = 'block';
        description.style.display = 'block';
    }, delay + 500); // Add a small delay after the last line finishes typing
}
