'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAdmin } from '@/hooks/use-admin';
import { LayerManager } from '@/components/geo/layer-manager';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '../ui/button';
import { Globe, Layers, DraftingCompass } from 'lucide-react';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

export function MapContainer({
  mode = 'private',
  initialView = '2D',
}: {
  mode?: 'public' | 'private';
  initialView?: '2D' | '3D';
}) {
  const { viewAs } = useAdmin();
  const [viewMode, setViewMode] = useState(initialView);
  const [activeLayers, setActiveLayers] = useState<string[]>(['base-map']);

  // Placeholder for map data
  const [mapData, setMapData] = useState({
    markers: [],
    boundaries: [],
    pointClouds: [],
    satelliteImagery: [],
  });

  // Simulate loading map data based on role
  useEffect(() => {
    // In a real app, you would fetch data here based on user, role, and mode
    console.log(`Loading map data for role: ${viewAs} in mode: ${mode}`);
  }, [viewAs, mode]);

  return (
    <div className="h-full w-full grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr]">
      {/* --- Left Panel --- */}
      <Card className="rounded-none border-0 border-r flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe /> Map Controls
          </CardTitle>
          <CardDescription>
            Manage layers and tools for visualization.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-6 overflow-y-auto">
          <div className="flex items-center space-x-2">
            <Label htmlFor="view-mode" className="flex-1">2D View</Label>
            <Switch
              id="view-mode"
              checked={viewMode === '3D'}
              onCheckedChange={(checked: boolean) => setViewMode(checked ? '3D' : '2D')}
            />
            <Label htmlFor="view-mode" className="flex-1 text-right">3D View</Label>
          </div>
          <LayerManager
            activeLayers={activeLayers}
            onLayersChange={setActiveLayers}
            userRole={viewAs}
            mapMode={mode}
          />
        </CardContent>
      </Card>

      {/* --- Right Panel (Map Viewer) --- */}
      <div className="relative bg-muted/20">
        <Image
          src="https://images.unsplash.com/photo-1594904533829-fb23b4991d45?q=80&w=2940&auto=format&fit=crop"
          layout="fill"
          objectFit="cover"
          alt="Map Placeholder"
          data-ai-hint="satellite map"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="text-center text-white p-4 rounded-lg bg-black/50 backdrop-blur-sm">
            <h2 className="text-2xl font-bold">Map Viewer ({viewMode})</h2>
            <p className="text-muted-foreground">
              Map rendering would be here.
            </p>
            <p className="mt-2 text-xs">Active Layers: {activeLayers.join(', ')}</p>
          </div>
        </div>
        <div className="absolute top-2 right-2 flex flex-col gap-2">
            <Button size="icon" variant="secondary"><DraftingCompass /></Button>
            <Button size="icon" variant="secondary"><Layers/></Button>
        </div>
      </div>
    </div>
  );
}
