import Map from 'react-map-gl';
import MapLayers from '../MapLayers/MapLayers';

export default function MapCanvas() {
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
        mapStyle="mapbox://styles/mapbox/light-v11"
      >
        <MapLayers />
      </Map>
    </div>
  );
}
