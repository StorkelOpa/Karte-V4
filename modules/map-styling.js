import { RETRO_COLORS } from '../config/data-sources.js';

/**
 * Gets authentic retro-style color based on feature type
 * @param {string} typ The feature type
 * @returns {string} Color code
 */
export function getRetroColor(typ) {
    // Special handling for Hasselbachplatz
    if (typ === 'kontext_flaeche_gruen' && 
        (typ.includes('platz') || typ.includes('Hasselbach'))) {
        return RETRO_COLORS.terminal_grey;
    }
    
    return RETRO_COLORS[typ] || RETRO_COLORS.default;
}

/**
 * Creates simple monochrome SVG icon based on type
 * @param {string} typ The feature type
 * @returns {L.DivIcon} Custom SVG icon
 */
export function createRetroIcon(typ) {
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
 * Gets style configuration for GeoJSON features
 * @param {object} feature The GeoJSON feature
 * @returns {object} Leaflet style object
 */
export function getFeatureStyle(feature) {
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

/**
 * Creates point-to-layer function for GeoJSON layers
 * @param {object} feature The GeoJSON feature
 * @param {L.LatLng} latlng The coordinates
 * @returns {L.Layer} Leaflet layer
 */
export function createPointLayer(feature, latlng) {
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
}
