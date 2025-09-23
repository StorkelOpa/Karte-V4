import { DATA_SOURCES, MAP_CONFIG } from '../config/data-sources.js';
import { loadGeoJSON } from './data.js';
import { getFeatureStyle, createPointLayer } from './map-styling.js';

// Track active locations for persistent visibility
let activeLocations = new Set();

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
 * Loads all GeoJSON data sources and creates layers
 * @param {L.Map} map The map instance
 * @returns {Promise<object>} Object containing all created layers
 */
export async function loadAllLayers(map) {
    const geojsonLayers = {};
    const overlayMaps = {};

    for (const source of DATA_SOURCES) {
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
                    pointToLayer: createPointLayer,
                    style: getFeatureStyle
                });
                
                overlayMaps[source.name] = layer;
                geojsonLayers[source.name] = layer;
            }
        } catch (error) {
            console.error(`Failed to load ${source.name} from ${source.path}`, error);
        }
    }
    
    return { geojsonLayers, overlayMaps };
}

/**
 * Sets appropriate z-index for layers with proper hierarchy
 * @param {L.Layer} layer The layer to set z-index for.
 * @param {string} layerType The type of layer (anker, kontext, erzaehlung).
 * @param {string} layerName The full layer name.
 */
function setLayerZIndex(layer, layerType, layerName) {
    let zIndex = 100; // Default
    
    // POINTS always get highest z-index (above everything)
    if (layerType === 'kontext' && layerName.toLowerCase().includes('poi')) {
        zIndex = 600; // Points above all
    }
    else if (layerType === 'erzaehlung' && layerName.toLowerCase().includes('punkt')) {
        zIndex = 550; // Story points
    }
    // LINES get medium-high z-index
    else if (layerType === 'erzaehlung' && layerName.toLowerCase().includes('route')) {
        zIndex = 400; // Transport routes
    }
    // POLYGONS get lower z-index
    else if (layerType === 'anker') {
        zIndex = 300; // Workplace buildings
    }
    else if (layerType === 'kontext' && layerName.toLowerCase().includes('flaeche')) {
        zIndex = 100; // Background areas (parks, etc.)
    }
    // Default context layers
    else if (layerType === 'kontext') {
        zIndex = 200;
    }
    else if (layerType === 'erzaehlung') {
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
 * Adds layers for a specific location with proper z-index ordering
 * @param {L.Map} map The map instance.
 * @param {object} geojsonLayers The object containing all layers.
 * @param {string} locationKey The location key.
 */
function addLocationLayers(map, geojsonLayers, locationKey) {
    MAP_CONFIG.layerOrder.forEach((layerType, index) => {
        for (const layerName in geojsonLayers) {
            if (layerName.includes(locationKey) && layerName.toLowerCase().includes(layerType)) {
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
        map.flyToBounds(bounds, MAP_CONFIG.flyToBounds);
    }
}

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
 * Hides layers for a specific location
 * @param {L.Map} map The map instance.
 * @param {object} geojsonLayers The object containing all layers.
 * @param {string} locationKey The location key to hide.
 */
export function hideLocationLayers(map, geojsonLayers, locationKey) {
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
 * Focuses on a specific location
 * @param {L.Map} map The map instance.
 * @param {object} geojsonLayers The object containing all layers.
 * @param {string} locationKey The location key to focus on.
 */
export function focusOnLocation(map, geojsonLayers, locationKey) {
    const bounds = L.latLngBounds([]);
    let hasValidBounds = false;
    
    for (const layerName in geojsonLayers) {
        if (layerName.includes(locationKey) && map.hasLayer(geojsonLayers[layerName])) {
            bounds.extend(geojsonLayers[layerName].getBounds());
            hasValidBounds = true;
        }
    }
    
    if (hasValidBounds) {
        map.flyToBounds(bounds, MAP_CONFIG.flyToBounds);
    }
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
