'use client';

import React, { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type Layer = {
  id: string;
  name: string;
  description: string;
  type: 'vector' | 'raster' | 'pointcloud' | 'measurement';
  requires?: string[];
  public?: boolean;
};

const allLayers: Record<string, Layer[]> = {
  'Public Layers': [
    {
      id: 'base-map',
      name: 'Base Map',
      description: 'Standard OpenStreetMap vector layer.',
      type: 'vector',
      public: true,
    },
    {
      id: 'satellite-basic',
      name: 'Satellite Imagery',
      description: 'Sentinel-2 satellite imagery at 10m resolution.',
      type: 'raster',
      public: true,
    },
  ],
  'Premium Layers': [
    {
      id: 'satellite-premium',
      name: 'High-Res Satellite',
      description: 'Maxar satellite imagery at 0.5m resolution.',
      type: 'raster',
      requires: ['Premium', 'Enterprise', 'Superadmin'],
    },
    {
      id: 'lidar-surface',
      name: 'LiDAR DTM',
      description: 'Digital Terrain Model from LiDAR scans.',
      type: 'pointcloud',
      requires: ['Professional', 'Enterprise', 'Superadmin'],
    },
  ],
  'Institutional Layers': [
    {
      id: 'cadastral-layer',
      name: 'Cadastral Information',
      description: 'Official property boundaries and parcel data.',
      type: 'vector',
      requires: ['Notary', 'PublicRegistrar', 'Superadmin'],
    },
    {
      id: 'property-records',
      name: 'Property Records',
      description: 'Legal records associated with properties.',
      type: 'vector',
      requires: ['Notary', 'PublicRegistrar', 'Superadmin'],
    },
  ],
  'User Layers': [
    {
      id: 'user-properties',
      name: 'My Properties',
      description: 'Properties associated with your account.',
      type: 'vector',
      requires: ['Client', 'Notary', 'PublicRegistrar', 'Superadmin'],
    },
    {
      id: 'user-measurements',
      name: 'My Measurements',
      description: 'Saved measurements and annotations.',
      type: 'measurement',
      requires: ['Client', 'Notary', 'PublicRegistrar', 'Superadmin'],
    },
  ],
};

type LayerManagerProps = {
  activeLayers: string[];
  onLayersChange: (layers: string[]) => void;
  userRole: string;
  mapMode: 'public' | 'private';
};

export function LayerManager({
  activeLayers,
  onLayersChange,
  userRole,
  mapMode,
}: LayerManagerProps) {
  const canAccessLayer = (layer: Layer) => {
    if (mapMode === 'public' && !layer.public) return false;
    if (!layer.requires) return true; // public or no roles required
    return layer.requires.includes(userRole);
  };

  const handleLayerToggle = (layerId: string, checked: boolean) => {
    if (checked) {
      onLayersChange([...activeLayers, layerId]);
    } else {
      onLayersChange(activeLayers.filter((id) => id !== layerId));
    }
  };

  return (
    <Accordion type="multiple" defaultValue={['Public Layers']} className="w-full">
      {Object.entries(allLayers)
        .filter(([category, layers]) => layers.some(canAccessLayer))
        .map(([category, layers]) => (
          <AccordionItem value={category} key={category}>
            <AccordionTrigger>{category}</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pl-2">
                {layers
                  .filter(canAccessLayer)
                  .map((layer) => (
                    <div key={layer.id} className="flex items-start space-x-2">
                      <Checkbox
                        id={layer.id}
                        checked={activeLayers.includes(layer.id)}
                        onCheckedChange={(checked: boolean) => handleLayerToggle(layer.id, !!checked)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor={layer.id} className="font-medium">
                          {layer.name}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {layer.description}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
    </Accordion>
  );
}
