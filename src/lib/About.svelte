<script>
  import { onMount } from 'svelte';
  import { getContext } from 'svelte';

  const { getMap } = getContext('map');

  onMount(() => {
    const map = getMap();
    if (map) {
      // Fly to a default location for the about page
      map.flyTo({
        center: [10.4515, 51.1657], // Germany
        zoom: 5,
        pitch: 0,
      });
    }
  });
</script>

<div class="narrative-panel">
    <div class="content">
        <h2>About Me</h2>
        <p>This is the "About Me" page. Here, you can share more personal information, like your hobbies and interests. We will add hiking routes to the map on this page.</p>
    </div>
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

  .content {
      padding-bottom: 5rem;
  }

  @media (max-width: 768px) {
    .narrative-panel {
      padding: 0.5rem 1rem;
    }
  }
</style>