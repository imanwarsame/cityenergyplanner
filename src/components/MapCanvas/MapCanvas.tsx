import { FillExtrusionLayerSpecification } from 'mapbox-gl';
import Map, { Layer } from 'react-map-gl';

const buildingsLayer: FillExtrusionLayerSpecification = {
  id: 'add-3d-buildings',
  source: 'composite',
  'source-layer': 'building',
  filter: ['==', 'extrude', 'true'],
  type: 'fill-extrusion',
  minzoom: 15,
  paint: {
    'fill-extrusion-color': '#aaa',
    'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'height']],
    'fill-extrusion-base': [
      'interpolate',
      ['linear'],
      ['zoom'],
      15,
      0,
      15.05,
      ['get', 'min_height'],
    ],
    'fill-extrusion-opacity': 0.6,
  },
};

export default function MapCanvas() {
  return (
    <Map
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
      initialViewState={{
        longitude: -0.1,
        latitude: 51.5074,
        zoom: 16,
        pitch: 60,
      }}
      style={{ width: '100%', height: '100vh' }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    >
      <Layer {...buildingsLayer} />
    </Map>
  );
}
