
/**
 * Data loading utilities for GeoJSON files
 * Provides robust error handling and logging for data operations
 */

/**
 * Loads and parses a GeoJSON file from the specified URL
 * @param {string} url - The URL of the GeoJSON file to load
 * @returns {Promise<object|null>} The parsed GeoJSON data or null if loading fails
 * @throws {Error} Throws detailed error information for debugging
 */
export async function loadGeoJSON(url) {
    try {
        console.log(`Loading GeoJSON from: ${url}`);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            const errorMessage = `Failed to fetch ${url}: ${response.status} ${response.statusText}`;
            console.error(errorMessage);
            throw new Error(errorMessage);
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && !contentType.includes('application/json') && !contentType.includes('text/plain')) {
            console.warn(`Unexpected content type for ${url}: ${contentType}`);
        }
        
        const data = await response.json();
        
        // Validate basic GeoJSON structure
        if (!data || typeof data !== 'object') {
            throw new Error(`Invalid GeoJSON data structure in ${url}`);
        }
        
        if (!data.type || (data.type !== 'FeatureCollection' && data.type !== 'Feature')) {
            console.warn(`GeoJSON from ${url} has unexpected type: ${data.type}`);
        }
        
        console.log(`Successfully loaded GeoJSON from ${url}:`, {
            type: data.type,
            features: data.features ? data.features.length : 'N/A'
        });
        
        return data;
        
    } catch (error) {
        console.error(`Error loading GeoJSON from ${url}:`, {
            message: error.message,
            stack: error.stack,
            url: url
        });
        
        // Return null instead of throwing to allow the application to continue
        // with other data sources
        return null;
    }
}

/**
 * Validates GeoJSON feature properties
 * @param {object} feature - The GeoJSON feature to validate
 * @returns {boolean} True if the feature has valid properties
 */
export function validateFeatureProperties(feature) {
    if (!feature || !feature.properties) {
        return false;
    }
    
    // Check for required properties
    const requiredProps = ['name'];
    for (const prop of requiredProps) {
        if (!feature.properties[prop]) {
            console.warn(`Feature missing required property: ${prop}`, feature);
            return false;
        }
    }
    
    return true;
}
