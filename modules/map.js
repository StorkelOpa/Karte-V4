import { loadGeoJSON } from './data.js';

// This module is now only responsible for map-related logic.
// It does not handle UI events.

/**
 * Creates window-style popup content with terminal aesthetics
 * @param {object} properties - The feature properties from GeoJSON
 * @returns {HTMLElement} - The popup content element
 */
function createWindowPopupContent(properties) {
    const content = document.createElement('div');
    content.innerHTML = `
        <div class="popup-title-bar">
            <span>${properties.name}</span>
            <div class="buttons">
                <div class="button close-button">X</div>
            </div>
        </div>
        <div class="popup-body">
            <p>C:\\> dir</p>
            <p>FILENAME: &nbsp;&nbsp;LOCATION.DAT</p>
            <p>NAME: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${properties.name}</p>
            ${properties.beschreibung ? `<p>DESC: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${properties.beschreibung}</p>` : ''}
            ${properties.typ ? `<p>TYPE: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${properties.typ}</p>` : ''}
            <p>STATUS: &nbsp;&nbsp;&nbsp;&nbsp;LOADED_SUCCESSFULLY</p>
            <p>C:\\> <span class="cursor">_</span></p>
        </div>
    `;
    
    // Add event listener for close button
    const closeButton = content.querySelector('.close-button');
    closeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        // Find the popup element and close it
        const popup = e.target.closest('.leaflet-popup');
        if (popup && popup._source) {
            popup._source.closePopup();
        } else {
            // Fallback: find map instance and close popup
            const mapContainer = document.getElementById('map');
            if (mapContainer && mapContainer._leaflet_map) {
                mapContainer._leaflet_map.closePopup();
            }
        }
    });
    
    return content;
}


/**
 * Initializes the Leaflet map and loads all GeoJSON data sources.
 * @param {string} mapId The ID of the map container element.
 * @returns {Promise<{map: L.Map, geojsonLayers: object}>} A promise that resolves with the map instance and the layers object.
 */
export async function initMap(mapId) {
    const map = L.map(mapId).setView([52.1205, 11.6276], 13);
    const geojsonLayers = {};

    const baseLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    });
    
    baseLayer.addTo(map);

    const baseMaps = { "CartoDB Dark": baseLayer };
    const overlayMaps = {};

    const dataSources = [
        { name: "Büro 3DQR - Anker", path: "public/data/magdeburg/Buero_3DQR/1_anker.geojson", locationKey: "Büro 3DQR" },
        { name: "Büro 3DQR - Kontext", path: "public/data/magdeburg/Buero_3DQR/2_kontext.geojson", locationKey: "Büro 3DQR" },
        { name: "Büro 3DQR - Erzählung", path: "public/data/magdeburg/Buero_3DQR/3_erzaehlung.geojson", locationKey: "Büro 3DQR" },
        { name: "MDR - Anker", path: "public/data/magdeburg/Landesfunkhaus_des_MDR/1_anker.geojson", locationKey: "MDR" },
        { name: "MDR - Kontext", path: "public/data/magdeburg/Landesfunkhaus_des_MDR/2_MDR_Kontext.geojson", locationKey: "MDR" },
        { name: "MDR - Erzählung", path: "public/data/magdeburg/Landesfunkhaus_des_MDR/3_MDR_Erzaehlung.geojson", locationKey: "MDR" }
    ];

    for (const source of dataSources) {
        try {
            const data = await loadGeoJSON(source.path);
            if (data) {
                const layer = L.geoJSON(data, {
                    onEachFeature: (feature, layer) => {
                        if (feature.properties && feature.properties.name) {
                            const popupContent = createWindowPopupContent(feature.properties);
                            layer.bindPopup(popupContent);
                        }
                    },
                    pointToLayer: (feature, latlng) => {
                        const typ = feature.properties.typ;
                        const color = getRetroColor(typ);
                        
                        // Use retro icons for POI points
                        if (typ && (typ.includes('poi') || typ.includes('startpunkt'))) {
                            return L.marker(latlng, {
                                icon: createRetroIcon(typ)
                            });
                        }
                        
                        // Use enhanced circle markers for other points
                        const markerOptions = {
                            radius: typ === 'anker_polygon' ? 12 : 8,
                            fillColor: color,
                            color: '#000000',
                            weight: 2,
                            opacity: 1,
                            fillOpacity: 0.9
                        };
                        
                        return L.circleMarker(latlng, markerOptions);
                    },
                    style: (feature) => {
                        const typ = feature.properties.typ;
                        const color = getRetroColor(typ);
                        
                        let style = {
                            fillColor: color,
                            weight: 2,
                            opacity: 1,
                            color: '#00ff41', // Retro green border
                            fillOpacity: 0.4 // More transparent for better visibility
                        };
                        
                        // Special styling based on type
                        if (typ) {
                            switch (typ) {
                                case 'anker_polygon':
                                    style.fillOpacity = 0.5; // More transparent workplaces
                                    style.dashArray = null;
                                    style.color = '#ffffff'; // White border for workplaces
                                    style.weight = 2;
                                    break;
                                case 'kontext_flaeche_gruen':
                                    style.fillOpacity = 0.4; // More transparent parks
                                    style.dashArray = '5, 5'; // Dashed for parks
                                    style.weight = 2;
                                    break;
                                case 'kontext_flaeche_platz':
                                    style.fillOpacity = 0.5; // Urban areas slightly more visible
                                    style.dashArray = '3, 3';
                                    style.weight = 2;
                                    break;
                                case 'erzaehlung_route_fahrrad':
                                    style.color = color; // Use the actual color (green)
                                    style.weight = 4; // Solid line for bike
                                    style.dashArray = null; // Solid for bike routes
                                    style.opacity = 0.9;
                                    style.fillOpacity = 0;
                                    break;
                                case 'erzaehlung_route_tram':
                                    style.color = color; // Use the actual color (amber)
                                    style.weight = 6; // Thicker for tram
                                    style.dashArray = '12, 8'; // Dashed for tram
                                    style.opacity = 0.9;
                                    style.fillOpacity = 0;
                                    break;
                                case 'erzaehlung_route_fuss':
                                    style.color = color; // Use the actual color (cyan)
                                    style.weight = 3; // Thinner for walking
                                    style.dashArray = '3, 6'; // Dotted for walking
                                    style.opacity = 0.8;
                                    style.fillOpacity = 0;
                                    break;
                                default:
                                    style.dashArray = '3, 3';
                            }
                        }
                        
                        return style;
                    }
                });
                overlayMaps[source.name] = layer;
                geojsonLayers[source.name] = layer;
            }
        } catch (error) {
            console.error(`Failed to load ${source.name} from ${source.path}`, error);
        }
    }
    
    L.control.layers(baseMaps, overlayMaps).addTo(map);
    
    // Return the map and layers so the main app can control them
    return { map, geojsonLayers };
}

// Track active locations for persistent visibility
let activeLocations = new Set();

/**
 * Activates and zooms to all layers associated with a location key.
 * @param {L.Map} map The map instance.
 * @param {object} geojsonLayers The object containing all layers.
 * @param {string} locationKey The key to identify which layers to activate (e.g., "MDR").
 */
export function flyToLocationAndActivateLayers(map, geojsonLayers, locationKey) {
    // Add to active locations
    activeLocations.add(locationKey);
    
    // Add layers for this location with proper z-index
    addLocationLayers(map, geojsonLayers, locationKey);
    
    // Zoom to show all active locations
    zoomToActiveLocations(map, geojsonLayers);
}

/**
 * Adds layers for a specific location with proper z-index ordering
 * @param {L.Map} map The map instance.
 * @param {object} geojsonLayers The object containing all layers.
 * @param {string} locationKey The location key.
 */
function addLocationLayers(map, geojsonLayers, locationKey) {
    const layerOrder = ['Kontext', 'Erzählung', 'Anker']; // Background to foreground
    
    layerOrder.forEach((layerType, index) => {
        for (const layerName in geojsonLayers) {
            if (layerName.includes(locationKey) && layerName.includes(layerType)) {
                const layer = geojsonLayers[layerName];
                if (!map.hasLayer(layer)) {
                    map.addLayer(layer);
                    // Set z-index based on layer type and content
                    setLayerZIndex(layer, layerType, layerName);
                }
            }
        }
    });
}

/**
 * Sets appropriate z-index for layers with proper hierarchy
 * @param {L.Layer} layer The layer to set z-index for.
 * @param {string} layerType The type of layer (Anker, Kontext, Erzählung).
 * @param {string} layerName The full layer name.
 */
function setLayerZIndex(layer, layerType, layerName) {
    let zIndex = 100; // Default
    
    // POINTS always get highest z-index (above everything)
    if (layerType === 'Kontext' && layerName.toLowerCase().includes('poi')) {
        zIndex = 600; // Points above all
    }
    else if (layerType === 'Erzählung' && layerName.toLowerCase().includes('punkt')) {
        zIndex = 550; // Story points
    }
    // LINES get medium-high z-index
    else if (layerType === 'Erzählung' && layerName.toLowerCase().includes('route')) {
        zIndex = 400; // Transport routes
    }
    // POLYGONS get lower z-index
    else if (layerType === 'Anker') {
        zIndex = 300; // Workplace buildings
    }
    else if (layerType === 'Kontext' && layerName.toLowerCase().includes('flaeche')) {
        zIndex = 100; // Background areas (parks, etc.)
    }
    // Default context layers
    else if (layerType === 'Kontext') {
        zIndex = 200;
    }
    else if (layerType === 'Erzählung') {
        zIndex = 350;
    }
    
    // Apply z-index if layer supports it
    if (layer.setZIndex) {
        layer.setZIndex(zIndex);
    } else if (layer.eachLayer) {
        layer.eachLayer(sublayer => {
            if (sublayer.setZIndex) {
                sublayer.setZIndex(zIndex);
            }
        });
    }
}

/**
 * Gets authentic retro-style color based on feature type
 * @param {string} typ The feature type
 * @returns {string} Color code
 */
function getRetroColor(typ) {
    const retroPalette = {
        // Authentic Terminal Colors
        'terminal_green': '#00ff41',      // Primary terminal green
        'terminal_dark_green': '#00cc33', // Secondary green
        'terminal_grey': '#808080',       // Neutral grey
        'terminal_dark_grey': '#404040',  // Dark grey
        'retro_blue': '#0080ff',         // Muted retro blue
        'amber': '#ffaa00',              // Classic amber
        'cyan': '#00ffff',               // Terminal cyan
        
        // Specific feature colors
        'anker_polygon': '#0080ff',              // Retro blue for workplaces
        'erzaehlung_route_fahrrad': '#00ff41',   // Terminal green for bike
        'erzaehlung_route_tram': '#ffaa00',      // Amber for tram
        'erzaehlung_route_fuss': '#00ffff',      // Cyan for walking
        'kontext_flaeche_gruen': '#00cc33',      // Dark green for parks
        'kontext_flaeche_platz': '#808080',      // Grey for urban areas (Hasselbachplatz)
        'erzaehlung_startpunkt': '#00ff41',      // Terminal green for start points
        
        // All POI icons use unified terminal green
        'kontext_poi_bank': '#00ff41',
        'kontext_poi_gastro': '#00ff41',
        'kontext_poi_tram': '#00ff41',
        'kontext_poi_shop': '#00ff41',
        
        // Default
        'default': '#00ff41'
    };
    
    // Special handling for Hasselbachplatz
    if (typ === 'kontext_flaeche_gruen' && 
        (typ.includes('platz') || typ.includes('Hasselbach'))) {
        return retroPalette.terminal_grey;
    }
    
    return retroPalette[typ] || retroPalette.default;
}

/**
 * Creates simple monochrome SVG icon based on type
 * @param {string} typ The feature type
 * @returns {L.DivIcon} Custom SVG icon
 */
function createRetroIcon(typ) {
    let svgContent = '';
    let className = 'retro-marker';
    
    switch (typ) {
        case 'kontext_poi_bank':
            // Simple bench/seat icon
            svgContent = `<svg width="16" height="16" viewBox="0 0 16 16" fill="#00ff41">
                <rect x="2" y="10" width="12" height="2"/>
                <rect x="1" y="8" width="2" height="6"/>
                <rect x="13" y="8" width="2" height="6"/>
            </svg>`;
            className += ' poi-bench';
            break;
        case 'kontext_poi_gastro':
            // Simple food/restaurant icon
            svgContent = `<svg width="16" height="16" viewBox="0 0 16 16" fill="#00ff41">
                <circle cx="8" cy="8" r="6"/>
                <rect x="6" y="6" width="4" height="4"/>
            </svg>`;
            className += ' poi-food';
            break;
        case 'kontext_poi_tram':
            // Simple tram/transport icon
            svgContent = `<svg width="16" height="16" viewBox="0 0 16 16" fill="#00ff41">
                <rect x="3" y="4" width="10" height="8"/>
                <circle cx="6" cy="13" r="1"/>
                <circle cx="10" cy="13" r="1"/>
                <rect x="5" y="6" width="6" height="3"/>
            </svg>`;
            className += ' poi-tram';
            break;
        case 'kontext_poi_shop':
            // Simple shop icon
            svgContent = `<svg width="16" height="16" viewBox="0 0 16 16" fill="#00ff41">
                <rect x="2" y="6" width="12" height="8"/>
                <polygon points="2,6 8,2 14,6"/>
                <rect x="6" y="10" width="4" height="4"/>
            </svg>`;
            className += ' poi-shop';
            break;
        case 'erzaehlung_startpunkt':
            // Simple home icon
            svgContent = `<svg width="16" height="16" viewBox="0 0 16 16" fill="#00ff41">
                <polygon points="8,2 2,8 2,14 6,14 6,10 10,10 10,14 14,14 14,8"/>
            </svg>`;
            className += ' story-start';
            break;
        case 'anker_polygon':
            // Simple building icon
            svgContent = `<svg width="16" height="16" viewBox="0 0 16 16" fill="#00ff41">
                <rect x="3" y="4" width="10" height="10"/>
                <rect x="5" y="6" width="2" height="2"/>
                <rect x="9" y="6" width="2" height="2"/>
                <rect x="5" y="9" width="2" height="2"/>
                <rect x="9" y="9" width="2" height="2"/>
            </svg>`;
            className += ' workplace';
            break;
        default:
            // Simple default pin
            svgContent = `<svg width="16" height="16" viewBox="0 0 16 16" fill="#00ff41">
                <circle cx="8" cy="6" r="4"/>
                <polygon points="8,10 6,14 10,14"/>
            </svg>`;
            className += ' default';
    }
    
    return L.divIcon({
        html: `<div class="retro-icon-content">${svgContent}</div>`,
        className: className,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
    });
}

/**
 * Zooms to show all active locations
 * @param {L.Map} map The map instance.
 * @param {object} geojsonLayers The object containing all layers.
 */
function zoomToActiveLocations(map, geojsonLayers) {
    const bounds = L.latLngBounds([]);
    let hasValidBounds = false;
    
    activeLocations.forEach(locationKey => {
        for (const layerName in geojsonLayers) {
            if (layerName.includes(locationKey) && map.hasLayer(geojsonLayers[layerName])) {
                bounds.extend(geojsonLayers[layerName].getBounds());
                hasValidBounds = true;
            }
        }
    });
    
    if (hasValidBounds) {
        map.flyToBounds(bounds, { padding: [50, 50] });
    }
}

/**
 * Hides layers for a specific location (internal)
 * @param {L.Map} map The map instance.
 * @param {object} geojsonLayers The object containing all layers.
 * @param {string} locationKey The location key to hide.
 */
function hideLocationLayersInternal(map, geojsonLayers, locationKey) {
    // Remove from active locations
    activeLocations.delete(locationKey);
    
    // Remove layers for this location
    for (const layerName in geojsonLayers) {
        if (layerName.includes(locationKey)) {
            const layer = geojsonLayers[layerName];
            if (map.hasLayer(layer)) {
                map.removeLayer(layer);
            }
        }
    }
    
    // Zoom to remaining active locations
    if (activeLocations.size > 0) {
        zoomToActiveLocations(map, geojsonLayers);
    }
}

/**
 * Focuses on a specific location (internal)
 * @param {L.Map} map The map instance.
 * @param {object} geojsonLayers The object containing all layers.
 * @param {string} locationKey The location key to focus on.
 */
function focusOnLocationInternal(map, geojsonLayers, locationKey) {
    const bounds = L.latLngBounds([]);
    let hasValidBounds = false;
    
    for (const layerName in geojsonLayers) {
        if (layerName.includes(locationKey) && map.hasLayer(geojsonLayers[layerName])) {
            bounds.extend(geojsonLayers[layerName].getBounds());
            hasValidBounds = true;
        }
    }
    
    if (hasValidBounds) {
        map.flyToBounds(bounds, { padding: [50, 50] });
    }
}

/**
 * Hides layers for a specific location (exported)
 * @param {L.Map} map The map instance.
 * @param {object} geojsonLayers The object containing all layers.
 * @param {string} locationKey The location key to hide.
 */
export function hideLocationLayers(map, geojsonLayers, locationKey) {
    hideLocationLayersInternal(map, geojsonLayers, locationKey);
}

/**
 * Focuses on a specific location (exported)
 * @param {L.Map} map The map instance.
 * @param {object} geojsonLayers The object containing all layers.
 * @param {string} locationKey The location key to focus on.
 */
export function focusOnLocation(map, geojsonLayers, locationKey) {
    focusOnLocationInternal(map, geojsonLayers, locationKey);
}

/**
 * Toggles the visibility of a specific layer.
 * @param {L.Map} map The map instance.
 * @param {object} geojsonLayers The object containing all layers.
 * @param {string} layerName The name of the layer to toggle.
 * @param {boolean} visible The desired visibility state.
 */
export function toggleLayer(map, geojsonLayers, layerName, visible) {
    const layer = geojsonLayers[layerName];
    if (layer) {
        if (visible && !map.hasLayer(layer)) {
            map.addLayer(layer);
        } else if (!visible && map.hasLayer(layer)) {
            map.removeLayer(layer);
        }
    }
}
