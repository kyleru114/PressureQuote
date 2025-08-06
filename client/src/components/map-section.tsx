import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Info } from 'lucide-react';
import type { PlaceDetails } from '@/lib/google-places';

declare global {
  interface Window {
    L: any;
    turf: any;
  }
}

interface MapSectionProps {
  place: PlaceDetails;
  onAreaCalculated: (area: number, polygon: [number, number][]) => void;
  onContinue: () => void;
}

export default function MapSection({ place, onAreaCalculated, onContinue }: MapSectionProps) {
  const [calculatedArea, setCalculatedArea] = useState(0);
  const [canContinue, setCanContinue] = useState(false);
  const mapRef = useRef<any>(null);
  const drawnItemsRef = useRef<any>(null);
  const distanceLabelsRef = useRef<any[]>([]);

  useEffect(() => {
    if (!window.L || !place) return;

    // Initialize map
    const map = window.L.map('leaflet-map', {
      center: [place.lat, place.lng],
      zoom: 19,
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      touchZoom: true,
    });

    // Add satellite tile layer
    window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 20,
    }).addTo(map);

    // Initialize draw controls
    const drawnItems = new window.L.FeatureGroup();
    map.addLayer(drawnItems);
    drawnItemsRef.current = drawnItems;

    const drawControl = new window.L.Control.Draw({
      position: 'topright',
      draw: {
        polygon: {
          allowIntersection: false,
          drawError: {
            color: '#e1e100',
            message: '<strong>Oh snap!</strong> you can\'t draw that!'
          },
          shapeOptions: {
            color: '#2563EB',
            weight: 3,
            fillOpacity: 0.3,
          },
          icon: new window.L.DivIcon({
            iconSize: new window.L.Point(8, 8),
            className: 'leaflet-div-icon leaflet-editing-icon'
          }),
          touchIcon: new window.L.DivIcon({
            iconSize: new window.L.Point(12, 12),
            className: 'leaflet-div-icon leaflet-editing-icon leaflet-touch-icon'
          })
        },
        circle: false,
        rectangle: false,
        marker: false,
        circlemarker: false,
        polyline: false,
      },
      edit: {
        featureGroup: drawnItems,
        remove: false, // Disable remove to prevent accidental deletion
        edit: false    // Disable editing once polygon is complete
      }
    });
    map.addControl(drawControl);

    // Function to clear distance labels
    const clearDistanceLabels = () => {
      distanceLabelsRef.current.forEach(label => map.removeLayer(label));
      distanceLabelsRef.current = [];
    };

    // Function to add distance label for a line segment
    const addDistanceLabel = (point1: [number, number], point2: [number, number]) => {
      if (!window.turf) return;
      
      // Calculate distance using Turf.js
      const from = window.turf.point([point1[1], point1[0]]); // Note: Turf uses [lng, lat]
      const to = window.turf.point([point2[1], point2[0]]);
      const distance = window.turf.distance(from, to, { units: 'feet' });
      
      // Calculate midpoint for label placement
      const midLat = (point1[0] + point2[0]) / 2;
      const midLng = (point1[1] + point2[1]) / 2;
      
      // Create label
      const label = window.L.marker([midLat, midLng], {
        icon: window.L.divIcon({
          html: `<div class="distance-label">${Math.round(distance)}'</div>`,
          className: 'distance-label-container',
          iconSize: [40, 20],
          iconAnchor: [20, 10]
        })
      }).addTo(map);
      
      distanceLabelsRef.current.push(label);
    };

    // Track drawing state
    let isDrawing = false;

    // Store drawing points as they're added
    let drawingPoints: Array<{lat: number, lng: number}> = [];

    // Handle drawing start
    map.on(window.L.Draw.Event.DRAWSTART, (event: any) => {
      clearDistanceLabels();
      drawingPoints = [];
      isDrawing = true;
    });

    // Handle drawing stop
    map.on(window.L.Draw.Event.DRAWSTOP, () => {
      isDrawing = false;
    });

    // Listen for map clicks during drawing to track vertices
    map.on('click', (event: any) => {
      if (!isDrawing) return;
      
      const clickPoint = { lat: event.latlng.lat, lng: event.latlng.lng };
      drawingPoints.push(clickPoint);
      
      // Add distance label for the latest segment if we have at least 2 points
      if (drawingPoints.length >= 2) {
        clearDistanceLabels();
        
        // Add labels for all segments drawn so far
        for (let i = 0; i < drawingPoints.length - 1; i++) {
          addDistanceLabel([drawingPoints[i].lat, drawingPoints[i].lng], [drawingPoints[i + 1].lat, drawingPoints[i + 1].lng]);
        }
      }
    });

    // Handle draw events
    map.on(window.L.Draw.Event.CREATED, (event: any) => {
      const layer = event.layer;
      const coordinates = layer.getLatLngs()[0];
      
      drawnItems.clearLayers();
      drawnItems.addLayer(layer);
      
      // Calculate area using Turf.js
      if (window.turf && coordinates) {
        const turfCoordinates = coordinates.map((latlng: any) => [latlng.lng, latlng.lat]);
        turfCoordinates.push(turfCoordinates[0]); // Close the polygon
        
        const polygon = window.turf.polygon([turfCoordinates]);
        const areaInSquareMeters = window.turf.area(polygon);
        const areaInSquareFeet = Math.round(areaInSquareMeters * 10.764);
        
        // Add distance labels for all segments of the completed polygon
        clearDistanceLabels();
        for (let i = 0; i < coordinates.length; i++) {
          const current = coordinates[i];
          const next = coordinates[(i + 1) % coordinates.length]; // Wrap around to first point
          addDistanceLabel([current.lat, current.lng], [next.lat, next.lng]);
        }
        
        setCalculatedArea(areaInSquareFeet);
        setCanContinue(true);
        onAreaCalculated(areaInSquareFeet, turfCoordinates.slice(0, -1));
      }
    });

    map.on(window.L.Draw.Event.DELETED, () => {
      clearDistanceLabels();
      setCalculatedArea(0);
      setCanContinue(false);
    });

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [place, onAreaCalculated]);

  return (
    <div className="bg-white rounded-2xl vintage-shadow p-6 quote-card">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white" style={{ backgroundColor: 'var(--nebraska-red)' }}>
          2
        </div>
        <h3 className="text-lg font-semibold brand-text" style={{ color: 'var(--nebraska-black)' }}>Draw Your Driveway</h3>
      </div>
      
      <div className="space-y-4">
        <div className="rounded-lg p-4" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--nebraska-red)' }} />
            <div>
              <p className="text-sm font-medium brand-text" style={{ color: 'var(--nebraska-black)' }}>How to draw your driveway:</p>
              <ol className="text-sm mt-1 space-y-1 brand-text" style={{ color: '#6B7280' }}>
                <li>1. Tap the polygon tool in the top right of the map</li>
                <li>2. Tap around your driveway to create points</li>
                <li>3. Close the shape by tapping the first point</li>
                <li>4. We'll calculate the area automatically</li>
              </ol>
            </div>
          </div>
        </div>
        
        {/* Map Container */}
        <div className="map-container">
          <div 
            id="leaflet-map" 
            className="w-full h-80 rounded-lg border border-slate-300"
          ></div>
        </div>
        
        {/* Area Display */}
        {calculatedArea > 0 && (
          <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--nebraska-bg)' }}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium brand-text" style={{ color: 'var(--nebraska-black)' }}>Driveway Area:</span>
              <span className="text-lg font-bold brand-text" style={{ color: 'var(--nebraska-red)' }}>{calculatedArea.toLocaleString()} sq ft</span>
            </div>
          </div>
        )}
        
        <button 
          onClick={onContinue}
          disabled={!canContinue}
          className={`btn-nebraska w-full flex items-center justify-center space-x-2 ${
            !canContinue ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <span>Continue to Quote</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
