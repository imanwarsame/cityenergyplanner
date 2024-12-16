import { useEffect, useState } from 'react';
import Map from 'react-map-gl';
import { notifications } from '@mantine/notifications';
import MapLayers from '../MapLayers/MapLayers';

export default function MapCanvas() {
  //#region Hooks

  const [userLocation, setUserLocation] = useState<{
    longitude: number;
    latitude: number;
  }>({
    longitude: -0.1,
    latitude: 51.5074,
  });

  useEffect(() => {
    // Check if Geolocation API is available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Set user location in state
          setUserLocation({
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
          });
        },
        () => {
          notifications.show({
            title: 'Error',
            message: 'Unable to get user location',
            color: 'red',
          });
        }
      );
    }
  }, []);

  //#endregion

  return (
    <div style={{ position: 'relative' }}>
      {/* Map */}
      <Map
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        initialViewState={{
          longitude: userLocation?.longitude,
          latitude: userLocation?.latitude,
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
