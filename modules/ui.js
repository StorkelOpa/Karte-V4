// This module handles all UI interactions for the lebenslauf page.
// It does not know about the map directly, it only calls the handlers it's given.

/**
 * Creates a taskbar button for a CV location
 * @param {string} locationName - The name of the CV location
 */
function createTaskbarButton(locationName) {
    const minimizedContainer = document.querySelector('.minimized-windows');
    if (!minimizedContainer) return;
    
    // Check if button already exists
    const existing = minimizedContainer.querySelector(`[data-location="${locationName}"]`);
    if (existing) return;
    
    const taskbarButton = document.createElement('div');
    taskbarButton.className = 'minimized-window active-taskbar-item';
    taskbarButton.setAttribute('data-location', locationName);
    
    const titleSpan = document.createElement('span');
    titleSpan.textContent = locationName;
    taskbarButton.appendChild(titleSpan);
    
    const closeButton = document.createElement('span');
    closeButton.textContent = 'X';
    closeButton.className = 'close-minimized-window';
    closeButton.addEventListener('click', (event) => {
        event.stopPropagation();
        // Remove taskbar button
        minimizedContainer.removeChild(taskbarButton);
        // Hide associated layers
        hideLocationLayers(locationName);
        // Update checkboxes
        updateCheckboxesForLocation(locationName, false);
    });
    taskbarButton.appendChild(closeButton);
    
    // Click to focus/zoom to this location
    taskbarButton.addEventListener('click', (event) => {
        if (event.target === closeButton) return;
        // Focus on this location
        focusOnLocation(locationName);
    });
    
    minimizedContainer.appendChild(taskbarButton);
    
    // Update checkboxes for this location
    updateCheckboxesForLocation(locationName, true);
}

/**
 * Updates checkboxes for a specific location
 * @param {string} locationName - The name of the location
 * @param {boolean} checked - Whether checkboxes should be checked
 */
function updateCheckboxesForLocation(locationName, checked) {
    const cvItems = document.querySelectorAll(`#lebenslauf-liste li[data-name="${locationName}"]`);
    cvItems.forEach(item => {
        const checkboxes = item.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            const layerName = checkbox.dataset.layer;
            const isAnker = layerName.endsWith(' - Anker');

            if (checked) {
                // If activating, check only the "Anker" checkbox
                checkbox.checked = isAnker;
            } else {
                // If deactivating, uncheck all
                checkbox.checked = false;
            }

            // Manually trigger the change event to update the map
            const event = new Event('change', { bubbles: true });
            checkbox.dispatchEvent(event);
        });
    });
}

/**
 * Synchronizes all checkboxes based on active taskbar buttons
 */
function synchronizeAllCheckboxes() {
    const minimizedContainer = document.querySelector('.minimized-windows');
    if (!minimizedContainer) return;
    
    // Get all active locations from taskbar
    const activeLocations = new Set();
    const taskbarButtons = minimizedContainer.querySelectorAll('[data-location]');
    taskbarButtons.forEach(button => {
        activeLocations.add(button.dataset.location);
    });
    
    // Update all checkboxes based on active locations
    const allCheckboxes = document.querySelectorAll('#lebenslauf-liste .layer-controls input[type="checkbox"]');
    allCheckboxes.forEach(checkbox => {
        checkbox.checked = false; // Reset all first
    });
    
    // Set checkboxes for active locations
    activeLocations.forEach(locationName => {
        updateCheckboxesForLocation(locationName, true);
    });
}

/**
 * Hides layers for a specific location
 * @param {string} locationName - The name of the location
 */
function hideLocationLayers(locationName) {
    // Dispatch custom event to notify map module
    window.dispatchEvent(new CustomEvent('hideLocationLayers', { 
        detail: { locationName } 
    }));
}

/**
 * Focuses on a specific location
 * @param {string} locationName - The name of the location
 */
function focusOnLocation(locationName) {
    // Dispatch custom event to notify map module
    window.dispatchEvent(new CustomEvent('focusOnLocation', { 
        detail: { locationName } 
    }));
}

/**
 * Loads HTML content from a given URL into a specified target element.
 * @param {string} url - The URL of the HTML content to load.
 * @param {string} targetElementId - The ID of the element where the content should be loaded.
 */
export async function loadContent(url, targetElementId) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const content = await response.text();
        document.getElementById(targetElementId).innerHTML = content;
        return Promise.resolve(); // Resolve the promise on successful load
    } catch (error) {
        console.error(`Failed to load content from ${url}:`, error);
        document.getElementById(targetElementId).innerHTML = `<p style="color: red;">Error loading content.</p>`;
        return Promise.reject(error); // Reject the promise on error
    }
}

/**
 * Initializes the UI event listeners for the CV page.
 * @param {function(string): void} onCvItemClick - Handler to call when a CV item is clicked.
 * @param {function(string, boolean): void} onLayerToggle - Handler to call when a checkbox is toggled.
 */
export function initUI(onCvItemClick, onLayerToggle) {
    const allCheckboxes = document.querySelectorAll('#lebenslauf-liste .layer-controls input[type="checkbox"]');
    
    allCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (event) => {
            const layerName = event.target.dataset.layer;
            onLayerToggle(layerName, event.target.checked);
        });
    });

    const listItems = document.querySelectorAll('#lebenslauf-liste li');
    listItems.forEach(item => {
        const header = item.querySelector('.lebenslauf-header');
        const toggle = item.querySelector('.details-toggle');

        if (header) {
            header.addEventListener('click', () => {
                listItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                const dataName = item.dataset.name;
                onCvItemClick(dataName);
                createTaskbarButton(dataName);
                updateCheckboxesForLocation(dataName, true);
            });
        }

        if (toggle) {
            toggle.addEventListener('click', (event) => {
                event.stopPropagation();
                const details = item.querySelector('.lebenslauf-details');
                if (details) {
                    details.style.display = details.style.display === 'none' ? 'block' : 'none';
                }
            });
        }
    });
}
