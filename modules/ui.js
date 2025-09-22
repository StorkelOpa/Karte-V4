
import { flyToLocation } from './map.js';

const contentContainer = document.getElementById('content');
const navItems = document.querySelectorAll('.nav-item');

function loadContent(url) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            contentContainer.innerHTML = html;
        })
        .catch(error => {
            console.error('Fehler beim Laden des Inhalts:', error);
            contentContainer.innerHTML = '<p>Inhalt konnte nicht geladen werden.</p>';
        });
}

function handleNavClick(e) {
    e.preventDefault();
    navItems.forEach(nav => nav.classList.remove('active'));
    const item = e.currentTarget;
    item.classList.add('active');
    const contentUrl = item.getAttribute('data-content');
    if (contentUrl) {
        loadContent(contentUrl);
    }
}

function handleContentClick(e) {
    if (e.target.tagName === 'LI') {
        const dataName = e.target.getAttribute('data-name');
        if (dataName) {
            flyToLocation(dataName);
        }
    }
}

export function initUI() {
    navItems.forEach(item => {
        item.addEventListener('click', handleNavClick);
    });

    contentContainer.addEventListener('click', handleContentClick);

    // Initialen Inhalt laden (HOME)
    loadContent('home.html');
}
