import type { PoiLocation } from "@/lib/map/poiTypes.js";
import { CollisionFilterExtension } from "@deck.gl/extensions";
import { ScatterplotLayer, TextLayer } from "@deck.gl/layers";

const POI_MIN_ZOOM = 8.5;

type CreatePoiLayersProps = {
    pois: ReadonlyArray<PoiLocation>;
    zoom: number;
    onSelectPoi: (poi: PoiLocation) => void;
};

// Helper to apply displayJitter
const getJitteredPosition = (d: PoiLocation): [number, number] => {
    const [lngDelta, latDelta] = d.displayJitter ?? [0, 0];
    return [d.longitude + lngDelta, d.latitude + latDelta];
};

export function createPoiLayers({ pois, zoom, onSelectPoi }: CreatePoiLayersProps) {
    if (zoom < POI_MIN_ZOOM) {
        return [];
    }

    const pointLayer = new ScatterplotLayer<PoiLocation>({
        id: 'poi-locations-points',
        data: pois,
        getPosition: getJitteredPosition,
        getRadius: 12,
        radiusScale: 1,
        radiusMinPixels: 6,
        radiusMaxPixels: 30,
        getFillColor: [255, 140, 0, 200],
        getLineColor: [255, 255, 255, 255],
        getLineWidth: 2,
        lineWidthMinPixels: 1,
        pickable: true,
        onClick: ({ object }) => object && onSelectPoi(object),
    });

    const labelLayer = new TextLayer<PoiLocation>({
        id: 'poi-locations-labels',
        data: pois,
        getPosition: getJitteredPosition,
        getText: (d) => `${d.code} · ${d.summary}`,
        getSize: 14,
        getColor: [0, 0, 0, 200],
        getBackgroundColor: [255, 255, 255, 180],
        getPixelOffset: (d) => d.labelOffsetPx ?? [0, -24],
        getCollisionPriority: (d) => d.priority ?? 0,
        collisionGroup: 'poi-labels',
        extensions: [new CollisionFilterExtension()],
        fontFamily: 'sans-serif',
        fontWeight: 600,
        outlineWidth: 6,
        outlineColor: [255, 255, 255, 180],
    });

    return [pointLayer, labelLayer];
}

export function getPoiTooltip(info: any) {
    if (info.layer?.id.startsWith('poi-locations-') && info.object) {
        const poi = info.object as PoiLocation;
        return {
            html: `
        <div style="max-width: 250px; padding: 8px; font-family: sans-serif; font-size: 12px; background-color: #333; color: #fff; border-radius: 4px;">
          <strong>${poi.name}</strong><br />
          Category: ${poi.category}<br />
          Coords: ${poi.latitude.toFixed(6)}, ${poi.longitude.toFixed(6)}
        </div>
      `,
        };
    }
    return null;
}
