import { initMap } from './modules/map-core.js';
import { flyToLocationAndActivateLayers, toggleLayer, hideLocationLayers, focusOnLocation } from './modules/map-layers.js';
import { initUI, loadContent } from './modules/ui.js';
import { initHomePage } from './modules/home.js';

// Clock functionality
function initClock() {
    const clockElement = document.getElementById('clock');
    if (!clockElement) return;

    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('de-DE', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        clockElement.textContent = timeString;
    }

    // Update immediately and then every minute
    updateClock();
    setInterval(updateClock, 60000);
}

// Main application entry point

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 1. Initialize the map and wait for it to be ready
        const { map, geojsonLayers } = await initMap('map');

        // 2. Define handlers that connect UI events to map actions
        const handleCvItemClick = (locationKey) => {
            flyToLocationAndActivateLayers(map, geojsonLayers, locationKey);
        };

        const handleLayerToggle = (layerName, isVisible) => {
            toggleLayer(map, geojsonLayers, layerName, isVisible);
        };

        // 3. Load home.html by default
        await loadContent('pages/home.html', 'content');
        initHomePage();

        // Add event listeners for navigation items
        const navItems = document.querySelectorAll('.nav-item');
        const startButton = document.querySelector('.start-button');
        const startMenu = document.getElementById('start-menu');

        startButton.addEventListener('click', () => {
            const isHidden = startMenu.style.display === 'none' || startMenu.style.display === '';
            startMenu.style.display = isHidden ? 'block' : 'none';
        });

        navItems.forEach(item => {
            item.addEventListener('click', async (event) => {
                const contentUrl = `pages/${item.dataset.content}`;
                if (contentUrl) {
                    await loadContent(contentUrl, 'content');
                    if (contentUrl === 'pages/home.html') {
                        initHomePage();
                    } else if (contentUrl === 'pages/lebenslauf.html') {
                        // Initialize UI only when lebenslauf page is loaded
                        initUI(handleCvItemClick, handleLayerToggle);
                    }
                    startMenu.style.display = 'none'; // Hide start menu after selection
                }
            });
        });

        // Initialize clock
        initClock();

        // Add event listeners for custom events from UI module
        window.addEventListener('hideLocationLayers', (event) => {
            hideLocationLayers(map, geojsonLayers, event.detail.locationName);
        });

        window.addEventListener('focusOnLocation', (event) => {
            focusOnLocation(map, geojsonLayers, event.detail.locationName);
        });

    } catch (error) {
        console.error("Failed to initialize the application:", error);
        // Optionally, display an error message to the user on the page
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            mapContainer.innerHTML = '<p style="color: red; text-align: center;">Error: Could not load map components.</p>';
        }
    }
});
