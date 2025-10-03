import { MapContainer } from '@/components/geo/map-container';

export default function MapPage() {
  return (
    <div className="flex flex-col gap-8 h-[calc(100vh-8.5rem)]">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">GeoVeraxis Map</h1>
            <p className="text-muted-foreground">
                Advanced Geospatial Data Visualization Platform
            </p>
        </div>
      </div>
      <div className="flex-1 rounded-lg border overflow-hidden">
        <MapContainer />
      </div>
    </div>
  );
}
