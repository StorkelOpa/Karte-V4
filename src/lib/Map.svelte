<script>
  import { onMount, setContext } from 'svelte';

  let mapContainer;
  let map;
  let activeLayers = []; // Keep track of currently displayed GeoJSON layers

  /**
   * Animates the map to a new location.
   * @param {object} options - Mapbox flyTo options (e.g., center, zoom, pitch).
   */
  export function flyTo(options) {
    if (map) {
      map.flyTo(options);
    }
  }

  /**
   * Displays a set of GeoJSON layers on the map.
   * Removes any previously shown layers before adding new ones.
   * @param {Array<object>} layers - An array of layer objects to display.
   * Each object should have an id, a path to the GeoJSON file, and a color.
   */
  export async function showLayers(layers) {
    if (!map) return;

    // Remove old layers to ensure a clean slate for the new chapter
    activeLayers.forEach(layerId => {
        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getSource(layerId)) map.removeSource(layerId);
    });
    activeLayers = [];

    // Add new layers for the current chapter
    for (const layer of layers) {
        const layerId = layer.id;
        activeLayers.push(layerId);

        // Add the GeoJSON data source
        map.addSource(layerId, {
            type: 'geojson',
            data: layer.path
        });

        // Add the visual layer to render the data
        map.addLayer({
            id: layerId,
            type: 'fill',
            source: layerId,
            paint: {
                'fill-color': layer.color,
                'fill-opacity': 0.7
            }
        });
    }
  }

  onMount(() => {
    // The Mapbox access token is read from an environment variable for security.
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    if (!mapboxgl.accessToken) {
      alert('Mapbox access token is not set. Please create a .env file and add your token.');
    }

    map = new mapboxgl.Map({
      container: mapContainer,
      style: 'mapbox://styles/mapbox/light-v11', // A clean, minimalist style
      center: [11.5820, 48.1351], // Initial center on Munich
      zoom: 5,
    });

    // Once the map is fully loaded, provide the map instance and functions to other components.
    map.on('load', () => {
        setContext('map', {
          getMap: () => map,
          showLayers: showLayers,
        });
    });


    // Clean up the map instance when the component is destroyed.
    return () => {
      map.remove();
    };
  });
</script>

<div class="map-container" bind:this={mapContainer}></div>

<style>
  .map-container {
    width: 100%;
    height: 100vh;
  }
</style>