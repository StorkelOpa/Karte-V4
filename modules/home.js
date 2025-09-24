/**
 * Initializes the home page's interactive elements, skipping the boot sequence
 * and immediately displaying the main menu and description.
 */
export function initHomePage() {
    const bootSequence = document.getElementById('boot-sequence');
    const mainMenu = document.getElementById('main-menu');
    const description = document.getElementById('description');

    if (!bootSequence || !mainMenu || !description) {
        console.error("Home page elements not found.");
        return;
    }

    // Hide boot sequence and immediately show main content
    bootSequence.style.display = 'none';
    mainMenu.style.display = 'block';
    description.style.display = 'block';
}
