
import { loadGeoJSON } from './data.js';

let map;
let geojsonLayer;

export function initMap(mapId) {
    map = L.map(mapId).setView([52.1205, 11.6276], 13); // Startansicht Magdeburg

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    loadGeoJSON('data/lebenslauf_orte.geojson').then(data => {
        if (data) {
            geojsonLayer = L.geoJSON(data).addTo(map);
        }
    });

    return map;
}

export function flyToLocation(dataName) {
    if (dataName && geojsonLayer) {
        geojsonLayer.eachLayer(layer => {
            if (layer.feature.properties.name === dataName) {
                map.flyToBounds(layer.getBounds());
            }
        });
    }
}
