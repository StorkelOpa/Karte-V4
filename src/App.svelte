<script>
  import Map from './lib/Map.svelte';
  import CV from './lib/CV.svelte';
  import About from './lib/About.svelte';

  let activePage = 'cv'; // 'cv' or 'about'
</script>

<main>
  <div class="navigation">
    <button on:click={() => activePage = 'cv'} class:active={activePage === 'cv'}>CV</button>
    <button on:click={() => activePage = 'about'} class:active={activePage === 'about'}>About Me</button>
  </div>

  {#if activePage === 'cv'}
    <CV />
  {:else}
    <About />
  {/if}

  <div class="map-panel">
    <Map />
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    background-color: #f8f9fa;
  }

  main {
    display: flex;
    width: 100vw;
    height: 100vh;
  }

  .map-panel {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .navigation {
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: 20;
    display: flex;
    gap: 0.5rem;
  }

  .navigation button {
      padding: 0.5rem 1rem;
      border: 1px solid #ccc;
      background-color: white;
      cursor: pointer;
      font-size: 1rem;
      border-radius: 4px;
      transition: background-color 0.2s;
  }

  .navigation button:hover {
      background-color: #f0f0f0;
  }

  .navigation button.active {
      background-color: #333;
      color: white;
      border-color: #333;
  }

  @media (max-width: 768px) {
    .narrative-panel {
      width: 100%;
      height: 50vh;
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 20;
      box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
    }
  }
</style>