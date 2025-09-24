<script>
  import { onMount } from 'svelte';
  import { scroll } from './scroll.js';
  import { getContext } from 'svelte';
  import { cvChapters } from './config.js';

  // Get the map control functions from the context provided by Map.svelte
  const { getMap, showLayers } = getContext('map');

  // Set the initial active chapter to the first one in the config
  let activeChapter = Object.keys(cvChapters)[0];

  /**
   * This function is called when a chapter enters the viewport.
   * It tells the map to fly to the chapter's location and display its layers.
   * @param {string} id - The ID of the chapter that has entered the view.
   */
  function handleChapterEnter(id) {
    activeChapter = id;
    const chapter = cvChapters[id];
    const map = getMap();

    if (map) {
      map.flyTo(chapter.location);
      if (showLayers) {
        showLayers(chapter.layers);
      }
    }
  }

  function handleChapterLeave(id) {
      // This function is called when a chapter leaves the viewport.
      // It's currently empty, but could be used for effects like hiding layers.
  }

  onMount(() => {
    // A short delay ensures the map is fully loaded and ready before we
    // trigger the first chapter's animation and layer loading.
    setTimeout(() => {
        handleChapterEnter(activeChapter);
    }, 500);
  });
</script>

<div class="narrative-panel">
    <!-- Loop through the chapters defined in config.js -->
    {#each Object.entries(cvChapters) as [id, chapter]}
        <!-- The `use:scroll` action connects this element to the Intersection Observer -->
        <div class="chapter" {id} use:scroll={{
            onEnter: () => handleChapterEnter(id),
            onLeave: () => handleChapterLeave(id)
        }} class:active={activeChapter === id}>
            <h2>{chapter.title}</h2>
            <p>{chapter.content}</p>
        </div>
    {/each}
</div>

<style>
  .narrative-panel {
    width: 33%;
    min-width: 300px;
    max-height: 100vh;
    overflow-y: auto;
    padding: 1rem 2rem;
    box-shadow: 2px 0 10px rgba(0,0,0,0.1);
    z-index: 10;
    background-color: white;
  }

  .chapter {
      padding-bottom: 25rem; /* Large padding to ensure scroll triggers */
      opacity: 0.4;
      transition: opacity 0.3s ease-in-out;
  }

  .chapter.active {
      opacity: 1;
  }

  @media (max-width: 768px) {
    .narrative-panel {
      padding: 0.5rem 1rem;
    }
  }
</style>