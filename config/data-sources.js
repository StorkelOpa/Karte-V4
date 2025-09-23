/**
 * Configuration for GeoJSON data sources
 * This file centralizes all data source definitions for better maintainability
 */

export const DATA_SOURCES = [
    {
        name: "Büro 3DQR - Anker",
        path: "public/data/magdeburg/Buero_3DQR/1_anker.geojson",
        locationKey: "Büro 3DQR",
        type: "anker",
        zIndex: 300
    },
    {
        name: "Büro 3DQR - Kontext",
        path: "public/data/magdeburg/Buero_3DQR/2_kontext.geojson",
        locationKey: "Büro 3DQR",
        type: "kontext",
        zIndex: 200
    },
    {
        name: "Büro 3DQR - Erzählung",
        path: "public/data/magdeburg/Buero_3DQR/3_erzaehlung.geojson",
        locationKey: "Büro 3DQR",
        type: "erzaehlung",
        zIndex: 350
    },
    {
        name: "MDR - Anker",
        path: "public/data/magdeburg/Landesfunkhaus_des_MDR/1_anker.geojson",
        locationKey: "MDR",
        type: "anker",
        zIndex: 300
    },
    {
        name: "MDR - Kontext",
        path: "public/data/magdeburg/Landesfunkhaus_des_MDR/2_MDR_Kontext.geojson",
        locationKey: "MDR",
        type: "kontext",
        zIndex: 200
    },
    {
        name: "MDR - Erzählung",
        path: "public/data/magdeburg/Landesfunkhaus_des_MDR/3_MDR_Erzaehlung.geojson",
        locationKey: "MDR",
        type: "erzaehlung",
        zIndex: 350
    }
];

/**
 * Map configuration settings
 */
export const MAP_CONFIG = {
    // Default map view
    center: [52.1205, 11.6276],
    zoom: 13,
    
    // Base layer configuration
    baseLayer: {
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        options: {
            subdomains: 'abcd',
            maxZoom: 20
        }
    },
    
    // Layer rendering order (background to foreground)
    layerOrder: ['kontext', 'erzaehlung', 'anker'],
    
    // Zoom and pan settings
    flyToBounds: {
        padding: [50, 50]
    }
};

/**
 * Retro color palette for consistent styling
 */
export const RETRO_COLORS = {
    // Authentic Terminal Colors
    terminal_green: '#00ff41',
    terminal_dark_green: '#00cc33',
    terminal_grey: '#808080',
    terminal_dark_grey: '#404040',
    retro_blue: '#0080ff',
    amber: '#ffaa00',
    cyan: '#00ffff',
    
    // Feature-specific colors
    anker_polygon: '#0080ff',
    erzaehlung_route_fahrrad: '#00ff41',
    erzaehlung_route_tram: '#ffaa00',
    erzaehlung_route_fuss: '#00ffff',
    kontext_flaeche_gruen: '#00cc33',
    kontext_flaeche_platz: '#808080',
    erzaehlung_startpunkt: '#00ff41',
    
    // POI colors (unified terminal green)
    kontext_poi_bank: '#00ff41',
    kontext_poi_gastro: '#00ff41',
    kontext_poi_tram: '#00ff41',
    kontext_poi_shop: '#00ff41',
    
    // Default fallback
    default: '#00ff41'
};
