# Interactive CV Portfolio

This is a modern, interactive portfolio for showcasing professional projects, designed with urban planners and GIS enthusiasts in mind. It uses a scrollytelling interface to guide users through a geographical narrative of your work.

## Features

-   **Modern Tech Stack:** Built with Svelte, Vite, and Mapbox GL JS.
-   **Interactive Map:** A dynamic Mapbox map serves as the centerpiece of the portfolio.
-   **Scrollytelling Narrative:** As you scroll through the CV, the map automatically pans, zooms, and displays relevant GeoJSON data layers.
-   **Data-Driven:** The CV content and map layers are driven by a simple configuration file (`src/lib/config.js`), making it easy to update.
-   **Responsive Design:** The layout is optimized for both desktop and mobile viewing.

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Your Mapbox Access Token

This project requires a Mapbox access token to display the map.

1.  **Get a token:** If you don't have one, sign up for a free account at [mapbox.com](https://www.mapbox.com/) and find your "Default public token" on your account page.
2.  **Create an environment file:** In the root of the project, create a new file named `.env`.
3.  **Add your token:** Add the following line to your `.env` file, replacing `YOUR_TOKEN_HERE` with the token you just copied:

    ```
    VITE_MAPBOX_ACCESS_TOKEN=YOUR_TOKEN_HERE
    ```

    The `.gitignore` file is already configured to prevent this file from being committed to git, keeping your token secure.

### 3. Run the Development Server

```bash
npm run dev
```

This will start a local development server. Open your browser to the address provided (usually `http://localhost:5173`) to see your portfolio in action.

## Customizing the Portfolio

-   **CV Content:** To edit the content of your CV, modify the `cvChapters` object in `src/lib/config.js`. You can change the titles, text, map locations, and paths to your GeoJSON files.
-   **"About Me" Page:** The content for the "About Me" page can be edited in `src/lib/About.svelte`.