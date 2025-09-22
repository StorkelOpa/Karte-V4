import { flyToLocation } from './map.js';

const contentContainer = document.getElementById('content');
const startButton = document.querySelector('.start-button');
const startMenu = document.getElementById('start-menu');

function runBootSequence() {
    const bootSequence = document.getElementById('boot-sequence');
    const mainMenu = document.getElementById('main-menu');
    if (!bootSequence || !mainMenu) return;
    const paragraphs = bootSequence.querySelectorAll('p');
    let i = 0;

    paragraphs.forEach(p => p.style.display = 'none');

    function showLine() {
        if (i < paragraphs.length) {
            paragraphs[i].style.display = 'block';
            i++;
            setTimeout(showLine, Math.random() * 200 + 50);
        } else {
            setTimeout(() => {
                mainMenu.style.display = 'block';
                mainMenu.classList.add('fade-in-flicker');
            }, 300);
        }
    }

    showLine();
}

function loadContent(url) {
    const cacheBustUrl = url + '?t=' + new Date().getTime();
    return fetch(cacheBustUrl)
        .then(response => response.text())
        .then(html => {
            contentContainer.innerHTML = html;
            if (url === 'home.html') {
                runBootSequence();
            }
        })
        .catch(error => {
            console.error('Fehler beim Laden des Inhalts:', error);
            contentContainer.innerHTML = '<p>Inhalt konnte nicht geladen werden.</p>';
        });
}

function handleContentInteraction(e) {
    const target = e.target;
    const navItem = target.closest('.nav-item');
    const dataCoordsItem = target.closest('li[data-coords]');

    if (navItem) {
        e.preventDefault();
        
        const allNavItems = document.querySelectorAll('.nav-item');
        allNavItems.forEach(nav => nav.classList.remove('active'));
        
        navItem.classList.add('active');
        const contentUrl = navItem.getAttribute('data-content');
        if (contentUrl) {
            loadContent(contentUrl);
        }
        startMenu.style.display = 'none';
        return; 
    }

    if (dataCoordsItem) {
        const dataName = dataCoordsItem.getAttribute('data-name');
        if (dataName) {
            flyToLocation(dataName);
        }
    }
}

export function initUI() {
    contentContainer.addEventListener('click', handleContentInteraction);
    startMenu.addEventListener('click', handleContentInteraction);

    startButton.addEventListener('click', (e) => {
        e.stopPropagation();
        startMenu.style.display = startMenu.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', (e) => {
        if (!startMenu.contains(e.target) && e.target !== startButton) {
            startMenu.style.display = 'none';
        }
    });

    loadContent('home.html');
}
