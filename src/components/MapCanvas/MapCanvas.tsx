import { useState } from 'react';
import { FillExtrusionLayerSpecification, FillLayerSpecification } from 'mapbox-gl';
import Map, { Layer, NavigationControl } from 'react-map-gl';
import { Card, Stack, Switch, Title } from '@mantine/core';

const buildingsLayer: FillExtrusionLayerSpecification = {
  id: 'add-3d-buildings',
  source: 'composite',
  'source-layer': 'building',
  filter: ['==', 'extrude', 'true'],
  type: 'fill-extrusion',
  minzoom: 5,
  paint: {
    'fill-extrusion-color': [
      'match',
      ['get', 'type'], // Match the 'type' property
      'commercial',
      '#33c7ff', // Commercial in blue
      'train_station',
      '#FFCFEF', // Train stations in pink
      'apartments',
      '#00ff00', // Apartments in green
      'residential',
      '#00ff00', // Residential in green
      'school',
      '#D3F1DF', //Schools in pale green
      'university',
      '#D3F1DF', //Universities in pale green
      'hospital',
      '#FF7F3E',
      'sports_centre',
      '#0A97B0', //Schools in pale green
      'industrial',
      '#f03b20', // Industrial in yellow
      'government',
      '#432E54',
      'public',
      '#432E54',
      'office',
      '#7E1891', // Offices in purple
      '#aaa', // Default colour for other types
    ],
    'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 5, 0, 5.05, ['get', 'height']],
    'fill-extrusion-base': ['interpolate', ['linear'], ['zoom'], 5, 0, 5.05, ['get', 'min_height']],
    'fill-extrusion-opacity': 0.8,
  },
};

const landUseLayer: FillLayerSpecification = {
  id: 'land-use',
  source: 'composite',
  'source-layer': 'landuse', // Replace with the actual source-layer name for land use
  type: 'fill',
  paint: {
    'fill-color': [
      'match',
      ['get', 'class'], // Match the 'class' or similar property for land use
      'residential',
      '#a8ddb5', // Residential in green
      'commercial',
      '#43a2ca', // Commercial in blue
      'industrial',
      '#f03b20', // Industrial in red
      'agriculture',
      '#fee391', // Agriculture in yellow
      '#ddd', // Default colour for undefined classes
    ],
    'fill-opacity': 0.25, // Adjust opacity for better visibility
  },
};

export default function MapCanvas() {
  //#region Hooks

  const [visibleLayers, setVisibleLayers] = useState({
    buildings: true,
    landUse: true,
  });

  //#endregion

  //#region Functions

  const toggleLayer = (layer: 'buildings' | 'landUse') => {
    setVisibleLayers((prev) => ({
      ...prev,
      [layer]: !prev[layer],
    }));
  };

  //#endregion

  return (
    <div style={{ position: 'relative' }}>
      {/* Map */}
      <Map
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        initialViewState={{
          longitude: -0.1,
          latitude: 51.5074,
          zoom: 16,
          pitch: 45,
        }}
        style={{ width: '100%', height: '100vh' }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
      >
        <NavigationControl />
        {/* Conditional Rendering of Layers */}
        {visibleLayers.landUse && <Layer {...landUseLayer} />}
        {visibleLayers.buildings && <Layer {...buildingsLayer} />}
      </Map>

      {/* Mantine Layer Toggle Controls */}
      <Card
        shadow="sm"
        p="md"
        radius="md"
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          backgroundColor: 'white',
        }}
      >
        <Title order={4}>Toggle Layers</Title>
        <Stack gap="sm" mt="sm">
          <Switch
            checked={visibleLayers.landUse}
            onChange={() => toggleLayer('landUse')}
            label="Land Use"
          />
          <Switch
            checked={visibleLayers.buildings}
            onChange={() => toggleLayer('buildings')}
            label="3D Buildings"
          />
        </Stack>
      </Card>
    </div>
  );
}
