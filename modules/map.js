/**
 * Refactored map module - now uses modular architecture
 * This module serves as the main interface for map functionality
 */

// Import the new modular components
import { initMap } from './map-core.js';
import { 
    flyToLocationAndActivateLayers, 
    hideLocationLayers, 
    focusOnLocation, 
    toggleLayer 
} from './map-layers.js';

// Re-export all the functions that the main app expects
export { 
    initMap, 
    flyToLocationAndActivateLayers, 
    hideLocationLayers, 
    focusOnLocation, 
    toggleLayer 
};
