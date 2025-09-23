import { MAP_CONFIG } from '../config/data-sources.js';
import { loadAllLayers } from './map-layers.js';

/**
 * Initializes the Leaflet map with base layer and controls
 * @param {string} mapId The ID of the map container element
 * @returns {Promise<{map: L.Map, geojsonLayers: object}>} Map instance and layers
 */
export async function initMap(mapId) {
    try {
        // Create map instance
        const map = L.map(mapId).setView(MAP_CONFIG.center, MAP_CONFIG.zoom);

        // Add base layer
        const baseLayer = L.tileLayer(MAP_CONFIG.baseLayer.url, {
            attribution: MAP_CONFIG.baseLayer.attribution,
            ...MAP_CONFIG.baseLayer.options
        });
        
        baseLayer.addTo(map);

        // Load all GeoJSON layers
        const { geojsonLayers, overlayMaps } = await loadAllLayers(map);

        // Set up layer control
        const baseMaps = { "CartoDB Dark": baseLayer };
        L.control.layers(baseMaps, overlayMaps).addTo(map);
        
        return { map, geojsonLayers };
        
    } catch (error) {
        console.error("Failed to initialize map:", error);
        throw error;
    }
}
