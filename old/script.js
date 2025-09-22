document.addEventListener('DOMContentLoaded', function () {

    const map = L.map('map', {
        center: [52.1218616, 11.6386996],
        zoom: 15,
        zoomControl: false,
        zoomSnap: 1
    });

    // Define the menu tree structure
    const menuTree = {
        'HOME': { content: 'home' }, // This will load the original home.html content if we create it
        'LEBENSLAUF': { content: 'lebenslauf' },
        'PROJEKTE': {
            children: {
                'WEB': { content: 'projects_web' },
                'GIS': { content: 'projects_gis' }
            }
        },
        'KONTAKT': { content: 'contact' },
        'EINSTELLUNGEN': { content: 'settings' } // New placeholder
    };

    // Apply fade-in-flicker to main elements
    document.getElementById('map').classList.add('fade-in-flicker');
    document.getElementById('sidebar').classList.add('fade-in-flicker');
    document.querySelector('.taskbar').classList.add('fade-in-flicker');

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    const buildingLayers = {};
    let currentBuildingLayer = null;

    function createPopupContent(title) {
        const content = document.createElement('div');
        content.innerHTML = `
            <div class="popup-title-bar">
                <span>${title}</span>
                <div class="buttons">
                    <div class="button minimize-button">_</div>
                    <div class="button">[]</div>
                    <div class="button close-button">X</div>
                </div>
            </div>
            <div class="popup-body">
                <p>C:\> dir</p>
                <p>FILENAME: &nbsp;&nbsp;LOCATION.DAT</p>
                <p>SIZE: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;42 BYTES</p>
                <p>DATE: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;09-21-2025</p>
                <p>STATUS: &nbsp;&nbsp;&nbsp;&nbsp;LOADED_SUCCESSFULLY</p>
                <p>C:\> <span class="cursor">_</span></p>
            </div>
        `;
        content.querySelector('.minimize-button').addEventListener('click', () => minimizeWindow(title));
        content.querySelector('.close-button').addEventListener('click', () => map.closePopup());
        return content;
    }

    async function loadGeoJSON(url, options) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return L.geoJSON(data, options).addTo(map);
        } catch (error) {
            console.error(`Error loading GeoJSON from ${url}:`, error);
        }
    }

    loadGeoJSON('data/data/Magdeburg/Building.geojson', {
        style: function (feature) {
            switch (feature.properties.name) {
                case 'Landesfunkhaus des MDR': return { color: '#007bff', weight: 2 };
                case 'Hasselbachpassage': return { color: '#dc3545', weight: 2 };
                default: return { color: '#ffffff', weight: 1 };
            }
        },
        onEachFeature: function (feature, layer) {
            if (feature.properties && feature.properties.name) {
                layer.bindPopup(createPopupContent(feature.properties.name));
                buildingLayers[feature.properties.name] = layer;
            }
        }
    }).then(layerGroup => {
        // Initially remove all building layers from the map
        layerGroup.eachLayer(layer => {
            map.removeLayer(layer);
        });
    });

    let tramLayer = null; // Variable to store the tram layer
    let tramStationLayer = null; // Variable to store the tram station layer

    function createTramStationPopupContent(feature) {
        return `
            <div class="popup-title-bar">
                <span>Tram Station</span>
                <div class="buttons">
                    <div class="button minimize-button">_</div>
                    <div class="button">[]</div>
                    <div class="button close-button">X</div>
                </div>
            </div>
            <div class="popup-body">
                <p>C:\> dir</p>
                <p>STATION: &nbsp;&nbsp;${feature.properties.name || 'N/A'}</p>
                <p>OPERATOR: &nbsp;${feature.properties.operator || 'N/A'}</p>
                <p>C:\> <span class="cursor">_</span></p>
            </div>
        `;
    }

    loadGeoJSON('data/data/Magdeburg/tram station.geojson', {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: 4,
                fillColor: '#FF0000',
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function (feature, layer) {
            if (feature.properties) {
                layer.bindPopup(createTramStationPopupContent(feature));
            }
        }
    }).then(layer => {
        tramStationLayer = layer;
        map.removeLayer(tramStationLayer); // Initially hide the tram station layer
    });

    loadGeoJSON('data/data/Magdeburg/Tram.geojson', {
        style: function (feature) {
            return { color: '#FFFF00', weight: 1 }; // Thinner yellow color for tram lines
        },
        onEachFeature: function (feature, layer) {
            if (feature.properties) {
                let popupContent = `
                    <div class="popup-title-bar">
                        <span>Tram Line</span>
                        <div class="buttons">
                            <div class="button minimize-button">_</div>
                            <div class="button">[]</div>
                            <div class="button close-button">X</div>
                        </div>
                    </div>
                    <div class="popup-body">
                        <p>C:\> dir</p>
                        <p>RAILWAY: &nbsp;&nbsp;${feature.properties.railway || 'N/A'}</p>
                        <p>VOLTAGE: &nbsp;&nbsp;${feature.properties.voltage || 'N/A'}</p>
                        <p>ONEWAY: &nbsp;&nbsp;&nbsp;${feature.properties.oneway || 'N/A'}</p>
                        <p>C:\> <span class="cursor">_</span></p>
                    </div>
                `;
                layer.bindPopup(popupContent);
            }
        }
    }).then(layer => {
        tramLayer = layer;
        map.removeLayer(tramLayer); // Initially hide the tram layer
    });

    function setupCvItemEventListeners() {
        document.querySelectorAll('li[data-coords]').forEach(item => {
            item.addEventListener('click', function () {
                const coords = this.getAttribute('data-coords').split(',').map(Number);
                const buildingName = this.getAttribute('data-name');

                // Close any currently open popup
                map.closePopup();

                // Check if the selected location is in Magdeburg (approximate coordinates)
                const isMagdeburg = (coords[0] > 52.0 && coords[0] < 52.2 && coords[1] > 11.5 && coords[1] < 11.7);

                // Manage tram layer visibility
                if (tramLayer) {
                    if (isMagdeburg) {
                        map.addLayer(tramLayer);
                        map.addLayer(tramStationLayer);
                    } else {
                        map.removeLayer(tramLayer);
                        map.removeLayer(tramStationLayer);
                    }
                }

                if (buildingName && buildingLayers[buildingName]) {
                    if (!map.hasLayer(buildingLayers[buildingName])) {
                        map.addLayer(buildingLayers[buildingName]);
                    }
                    buildingLayers[buildingName].openPopup();
                }

                document.querySelectorAll('li[data-coords]').forEach(i => i.style.backgroundColor = 'transparent');
                this.style.backgroundColor = '#2c2c2c';

                map.setZoom(5);
                map.setView(coords, 17);
            });
        });
    }

    function renderTree(node, parentElement) {
        for (const key in node) {
            const item = node[key];
            const li = document.createElement('li');
            li.textContent = key;
            li.classList.add('tree-item');
            if (item.content) {
                li.dataset.content = item.content;
                li.addEventListener('click', (event) => {
                    event.stopPropagation(); // Prevent parent click
                    loadContent(item.content);
                });
            }
            if (item.children) {
                li.classList.add('has-children');
                const ul = document.createElement('ul');
                ul.classList.add('tree-children');
                renderTree(item.children, ul);
                li.appendChild(ul);
                li.addEventListener('click', (event) => {
                    event.stopPropagation();
                    li.classList.toggle('expanded');
                });
            }
            parentElement.appendChild(li);
        }
    }

    let activeTaskbarButton = null;

    async function loadContent(page) {
        const sidebar = document.getElementById('sidebar');
        try {
            // Clean up map state when loading new content
            map.closePopup();
            for (const key in buildingLayers) {
                if (map.hasLayer(buildingLayers[key])) {
                    map.removeLayer(buildingLayers[key]);
                }
            }
            if (tramLayer && map.hasLayer(tramLayer)) {
                map.removeLayer(tramLayer);
                map.removeLayer(tramStationLayer);
            }

            // Remove active class from previous button
            if (activeTaskbarButton) {
                activeTaskbarButton.classList.remove('active-taskbar-item');
            }

            if (page === 'home') {
                sidebar.innerHTML = '<div class="cv-content"><h1>MENU</h1><ul id="main-menu-tree"></ul></div>';
                renderTree(menuTree, document.getElementById('main-menu-tree'));
                activeTaskbarButton = document.getElementById('home-button');
            } else {
                const response = await fetch(`./${page}.html`);
                if (!response.ok) {
                    throw new Error(`Could not load ${page}.html`);
                }
                sidebar.innerHTML = await response.text();
                if (page === 'lebenslauf') {
                    setupCvItemEventListeners();
                    const cvButton = document.getElementById('cv-button');
                    cvButton.style.display = 'flex'; // Show CV button as flex container
                    cvButton.querySelector('.close-cv-button').addEventListener('click', (event) => {
                        event.stopPropagation();
                        loadContent('home');
                        cvButton.style.display = 'none';
                    }, { once: true }); // Ensure event listener is added only once
                    activeTaskbarButton = cvButton;
                }
            }

            // Add active class to current button
            if (activeTaskbarButton) {
                activeTaskbarButton.classList.add('active-taskbar-item');
            }

        } catch (error) {
            sidebar.innerHTML = `<div class="cv-content"><h1>Error</h1><p>${error.message}</p></div>`;
        }
    }

    document.getElementById('home-button').addEventListener('click', () => loadContent('home'));
    document.getElementById('cv-button').addEventListener('click', () => loadContent('lebenslauf'));

    loadContent('home'); // Load home page by default

    function minimizeWindow(title) {
        map.closePopup();
        const minimizedContainer = document.getElementById('minimized-windows');
        const minimizedButton = document.createElement('div');
        minimizedButton.className = 'minimized-window';

        const titleSpan = document.createElement('span');
        titleSpan.textContent = title;
        minimizedButton.appendChild(titleSpan);

        const closeButton = document.createElement('span');
        closeButton.textContent = 'X';
        closeButton.className = 'close-minimized-window';
        closeButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent restoring the window when clicking 'X'
            minimizedContainer.removeChild(minimizedButton);
            if (buildingLayers[title] && map.hasLayer(buildingLayers[title])) {
                map.removeLayer(buildingLayers[title]);
            }
        });
        minimizedButton.appendChild(closeButton);

        minimizedButton.addEventListener('click', (event) => {
            if (event.target === closeButton) {
                return; // Do nothing if the click was on the close button
            }
            if (buildingLayers[title]) {
                map.addLayer(buildingLayers[title]);
                buildingLayers[title].openPopup();
                // minimizedContainer.removeChild(minimizedButton); // Removed: Should remain in taskbar
            }
        });
        minimizedContainer.appendChild(minimizedButton);
    }

    function updateClock() {
        const clockElement = document.getElementById('clock');
        if (clockElement) {
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            clockElement.textContent = timeString;
        }
    }


    document.getElementById('search-button').addEventListener('click', () => {
        const query = document.getElementById('search-input').value;
        if (query) {
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
                .then(response => response.json())
                .then(data => {
                    if (data && data.length > 0) {
                        const lat = data[0].lat;
                        const lon = data[0].lon;
                        const marker = L.marker([lat, lon]).addTo(map);
                        map.setView([lat, lon], 13);
                    } else {
                        alert('Location not found');
                    }
                })
                .catch(error => {
                    console.error('Error fetching location:', error);
                    alert('Error fetching location');
                });
        }
    });

    setInterval(updateClock, 1000);
    updateClock();
});