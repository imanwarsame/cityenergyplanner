import MapCanvas from '@/components/MapCanvas/MapCanvas';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';

export function HomePage() {
  return (
    <>
      <MapCanvas />
      <ColorSchemeToggle />
    </>
  );
}
