# Interactive CV Map - Carl Vogler

A retro terminal-style interactive CV application built with Leaflet.js, featuring a map-based navigation system for exploring career locations and experiences.

## 🚀 Features

- **Retro Terminal Aesthetic**: Windows 95-inspired interface with terminal-style popups
- **Interactive Map**: Leaflet-based map showing career locations in Magdeburg
- **Modular Architecture**: Clean, maintainable code structure
- **Responsive Design**: Works across different screen sizes
- **Layer Management**: Toggle different types of location data (workplaces, context, stories)

## 📁 Project Structure

```
├── index.html              # Main HTML entry point
├── app.js                  # Application initialization and event handling
├── config/
│   └── data-sources.js     # Configuration for data sources and styling
├── modules/
│   ├── data.js            # Data loading utilities with error handling
│   ├── map.js             # Main map functionality (legacy, being refactored)
│   ├── map-core.js        # Core map initialization
│   ├── map-layers.js      # Layer management and interactions
│   ├── map-styling.js     # Styling and icon generation
│   ├── ui.js              # UI components and interactions
│   └── home.js            # Home page functionality
├── css/
│   ├── base.css           # Base styles and typography
│   ├── layout.css         # Layout and positioning
│   ├── components.css     # Component-specific styles
│   └── effects.css        # Animations and visual effects
├── pages/
│   ├── home.html          # Home page content
│   ├── lebenslauf.html    # CV/Resume page
│   ├── projekte.html      # Projects overview
│   ├── projekte_gis.html  # GIS projects
│   ├── projekte_web.html  # Web projects
│   └── kontakt.html       # Contact information
└── public/
    └── data/
        └── magdeburg/     # GeoJSON data files for map locations
```

## 🛠️ Technical Architecture

### Modular Design

The application follows a modular architecture pattern:

- **Configuration Layer** (`config/`): Centralized configuration for data sources, styling, and map settings
- **Data Layer** (`modules/data.js`): Robust data loading with error handling and validation
- **Presentation Layer** (`modules/map-*.js`): Separated concerns for map initialization, layer management, and styling
- **UI Layer** (`modules/ui.js`, `modules/home.js`): User interface components and interactions

### Key Components

#### Map System
- **map-core.js**: Basic map initialization and base layer setup
- **map-layers.js**: Layer management, z-index handling, and location-based interactions
- **map-styling.js**: Feature styling, color palettes, and custom icon generation

#### Data Management
- **data-sources.js**: Centralized configuration for all GeoJSON data sources
- **data.js**: Robust data loading with comprehensive error handling and validation

#### Styling System
- Retro color palette with authentic terminal colors
- Custom SVG icons for different feature types
- Responsive design with CSS Grid and Flexbox

## 🎨 Design System

### Color Palette
- **Terminal Green**: `#00ff41` (Primary)
- **Retro Blue**: `#0080ff` (Workplaces)
- **Amber**: `#ffaa00` (Tram routes)
- **Cyan**: `#00ffff` (Walking routes)
- **Dark Green**: `#00cc33` (Parks)
- **Grey**: `#808080` (Urban areas)

### Typography
- **Primary Font**: VT323 (Retro terminal font)
- **Fallback**: Monospace system fonts

## 🚀 Getting Started

### Prerequisites
- Modern web browser with ES6 module support
- Local web server (Python, Node.js, or similar)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/StorkelOpa/Karte-V4.git
cd Karte-V4
```

2. Start a local web server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

3. Open your browser and navigate to:
```
http://localhost:8000
```

## 📊 Data Structure

The application uses GeoJSON files organized by location and layer type:

```
public/data/magdeburg/
├── Buero_3DQR/
│   ├── 1_anker.geojson      # Workplace building
│   ├── 2_kontext.geojson    # Surrounding context (POIs, areas)
│   └── 3_erzaehlung.geojson # Story elements (routes, points)
└── Landesfunkhaus_des_MDR/
    ├── 1_anker.geojson
    ├── 2_MDR_Kontext.geojson
    └── 3_MDR_Erzaehlung.geojson
```

### Layer Types
- **Anker** (Anchor): Main workplace buildings
- **Kontext** (Context): Surrounding POIs, parks, urban areas
- **Erzählung** (Story): Routes, start points, narrative elements

## 🔧 Configuration

### Adding New Locations

1. Add GeoJSON files to `public/data/magdeburg/[location-name]/`
2. Update `config/data-sources.js` with new data source entries:

```javascript
{
    name: "New Location - Anker",
    path: "public/data/magdeburg/new-location/1_anker.geojson",
    locationKey: "New Location",
    type: "anker",
    zIndex: 300
}
```

### Customizing Styles

Update the `RETRO_COLORS` object in `config/data-sources.js` to modify the color scheme:

```javascript
export const RETRO_COLORS = {
    terminal_green: '#00ff41',
    retro_blue: '#0080ff',
    // Add your custom colors here
};
```

## 🧪 Development

### Code Structure Guidelines

- **Separation of Concerns**: Each module has a single responsibility
- **Error Handling**: Comprehensive error handling with graceful degradation
- **Documentation**: JSDoc comments for all public functions
- **Configuration**: Externalized configuration for easy maintenance

### Adding New Features

1. **New Map Layers**: Add to `config/data-sources.js` and update styling in `map-styling.js`
2. **UI Components**: Add to `modules/ui.js` with proper event handling
3. **Pages**: Create HTML files in `pages/` and update navigation in `app.js`

## 🐛 Troubleshooting

### Common Issues

**Map not loading:**
- Check browser console for JavaScript errors
- Verify all GeoJSON files are accessible
- Ensure local server is running

**Styling issues:**
- Check CSS file loading order in `index.html`
- Verify font loading from Google Fonts
- Check for CSS conflicts in browser dev tools

**Data loading errors:**
- Check network tab for failed requests
- Verify GeoJSON file structure and validity
- Check console for detailed error messages

## 📝 License

This project is part of Carl Vogler's personal portfolio. All rights reserved.

## 🤝 Contributing

This is a personal portfolio project. For suggestions or feedback, please contact Carl Vogler directly.

## 📞 Contact

- **Email**: [Contact information]
- **LinkedIn**: [LinkedIn profile]
- **GitHub**: [GitHub profile]

---

*Built with ❤️ using Leaflet.js, vanilla JavaScript, and a lot of retro nostalgia.*
