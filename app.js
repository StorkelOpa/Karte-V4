import { initMap } from './modules/map.js';
import { initUI } from './modules/ui.js';

document.addEventListener('DOMContentLoaded', () => {
    initMap('map');
    initUI();
});