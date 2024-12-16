# Optimal Power Plant Location Planner

This project is a web application that visualises 3D buildings using Mapbox GL, providing insights into the optimal locations for power plants. Built with **React**, **TypeScript**, **Vite**, and styled with **Mantine**, the app leverages geospatial data to determine optimal locations for energy installations.

## Features

- Visualise 3D buildings with distinct colours based on their land use type.
- Calculate and highlight building suitability for solar panel installations based on their type and volume.
- Dynamic querying of Mapbox layers for feature data.
- Interactive controls to toggle map layers and clear markers.
- Automatic zoom to user location.

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (version 16 or later recommended)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository_url>
cd cityenergyplanner
```

### 2. Install Dependencies

Install the required packages using npm:

```bash
npm install
```

### 3. Create Environment Variables File

Create a `.env` file in the root directory of the project and add the following environment variables:

```env
VITE_MAPBOX_TOKEN=<your_mapbox_access_token>
```

Replace `<your_mapbox_access_token>` with your personal Mapbox access token. You can generate this token by logging into your [Mapbox account](https://www.mapbox.com/).

### 4. Start the Development Server

Run the following command to start the development server:

```bash
npm run dev
```

This will launch the app in development mode. Open your browser and navigate to `http://localhost:5173/` to view the app.

## Project Structure

```plaintext
src/
├── components/
│   ├── MapCanvas.tsx   # Main map component
│   ├── MapLayers.tsx   # Layer management for the Mapbox map
│   └── Controls.tsx    # Interactive UI controls
├── styles/             # Custom styles (if any)
├── utils/              # Helper functions, such as suitability calculations
├── App.tsx             # Entry point for the application
├── main.tsx            # React and Vite integration
└── vite-env.d.ts       # Vite environment variables declaration

public/                 # Static assets
.env                    # Environment variables
vite.config.ts          # Vite configuration
```

## Available Scripts

### `npm run dev`

Runs the app in development mode. Open `http://localhost:5173/` to view it in your browser.

### `npm run build`

Builds the app for production. The compiled files will be located in the `dist` directory.

### `npm run preview`

Locally previews the production build.

## Technologies Used

- **React**: JavaScript library for building user interfaces.
- **TypeScript**: Superset of JavaScript for type-safe programming.
- **Vite**: Fast and modern build tool for web applications.
- **Mantine**: UI library for React with built-in hooks and components.
- **Mapbox GL**: JavaScript library for interactive, high-performance maps.
- **Turf.js**: Geospatial analysis library for geometry operations.

## Development Notes

### Accessing User Location

Ensure the browser has permissions enabled to access the user’s location. This feature will centre the map on the user’s current coordinates.

### Adding Map Layers

To customise or add layers, edit the `MapLayers.tsx` file. You can add new layers for additional data visualisation.

### Adjusting Suitability Criteria

Modify the `getBuildingSuitabilityScore` function in `utils/suitability.ts` to update the scoring logic for building suitability.

## Contributing

1. Fork the repository.
2. Create a new branch for your feature: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m "Add feature-name"`.
4. Push to the branch: `git push origin feature-name`.
5. Submit a pull request.

---

Happy coding! 🎉
