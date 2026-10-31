import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Campus, Building, POI } from '../../types/campus';
import { PositioningEstimate } from '../../types/positioning';
import { RouteResult, NavigationNode } from '../../types/navigation';
import { Locate, Compass, Building2, MapPin } from 'lucide-react';

interface CampusMapProps {
  campus: Campus;
  buildings: Building[];
  pois: POI[];
  currentEstimate: PositioningEstimate | null;
  activeRoute: RouteResult | null;
  selectedBuilding: Building | null;
  onSelectBuilding: (building: Building) => void;
  onSelectPoi: (poi: POI) => void;
  onRecenter: () => void;
  isIndoorMode: boolean;
  onToggleIndoor: () => void;
}

export const CampusMap: React.FC<CampusMapProps> = ({
  campus,
  buildings,
  pois,
  currentEstimate,
  activeRoute,
  selectedBuilding,
  onSelectBuilding,
  onSelectPoi,
  onRecenter,
  isIndoorMode,
  onToggleIndoor
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);
  const buildingLayersRef = useRef<L.Polygon[]>([]);
  const poiMarkersRef = useRef<L.Marker[]>([]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [campus.location.lat, campus.location.lng],
        zoom: 16,
        zoomControl: false,
        attributionControl: false
      });

      // Add OpenStreetMap vector tile layer (with local offline fallback)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([campus.location.lat, campus.location.lng], 16);
    }

    return () => {
      // Keep map alive or clean up
    };
  }, [campus.id]);

  // Render Building Polygons
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old layers
    buildingLayersRef.current.forEach(l => l.remove());
    buildingLayersRef.current = [];

    buildings.forEach(bld => {
      const isSelected = selectedBuilding?.id === bld.id;
      const poly = L.polygon(bld.polygon, {
        color: isSelected ? '#168C83' : '#334155',
        fillColor: isSelected ? '#99DFC8' : '#CBD5E1',
        fillOpacity: isSelected ? 0.65 : 0.45,
        weight: isSelected ? 3 : 2
      }).addTo(map);

      poly.on('click', () => {
        onSelectBuilding(bld);
      });

      // Tooltip label
      poly.bindTooltip(bld.name, {
        permanent: false,
        direction: 'center',
        className: 'campus-bld-tooltip'
      });

      buildingLayersRef.current.push(poly);
    });
  }, [buildings, selectedBuilding]);

  // Render POI Pins
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    poiMarkersRef.current.forEach(m => m.remove());
    poiMarkersRef.current = [];

    pois.forEach(poi => {
      const poiIcon = L.divIcon({
        className: 'poi-custom-pin',
        html: `
          <div style="
            background-color: #168C83;
            color: #FFFFFF;
            width: 26px;
            height: 26px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            border: 2px solid #FFFFFF;
          ">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 26]
      });

      const marker = L.marker(poi.coordinate, { icon: poiIcon }).addTo(map);
      marker.on('click', () => onSelectPoi(poi));
      marker.bindTooltip(poi.name, { direction: 'top', offset: [0, -20] });
      poiMarkersRef.current.push(marker);
    });
  }, [pois]);

  // Render Active Navigation Route Polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
      routeLayerRef.current = null;
    }

    if (!activeRoute) return;

    // Filter outdoor points with lat/lng
    const outdoorCoords: [number, number][] = activeRoute.nodes
      .filter((n): n is NavigationNode & { lat: number; lng: number } => n.lat !== undefined && n.lng !== undefined)
      .map(n => [n.lat, n.lng]);

    if (outdoorCoords.length > 1) {
      const isCar = activeRoute.mode === 'car';
      const isBike = activeRoute.mode === 'bicycle';

      const polyline = L.polyline(outdoorCoords, {
        color: isCar ? '#2563EB' : isBike ? '#D97706' : '#168C83',
        weight: 6,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round',
        dashArray: isCar ? undefined : isBike ? '6, 8' : '2, 6'
      }).addTo(map);

      routeLayerRef.current = polyline;
      map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
    }
  }, [activeRoute]);

  // Update User Location Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !currentEstimate) return;

    if (currentEstimate.lat !== undefined && currentEstimate.lng !== undefined) {
      const latlng: [number, number] = [currentEstimate.lat, currentEstimate.lng];
      const isSimulated = !currentEstimate.isRealSensor;

      if (!userMarkerRef.current) {
        const userIcon = L.divIcon({
          className: 'user-marker-container',
          html: `
            <div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
              <div class="user-pulse-ring" style="background: ${isSimulated ? 'rgba(245, 158, 11, 0.4)' : 'rgba(22, 140, 131, 0.4)'}"></div>
              <div class="user-location-dot ${isSimulated ? 'user-simulated-dot' : ''}"></div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        userMarkerRef.current = L.marker(latlng, { icon: userIcon, zIndexOffset: 1000 }).addTo(map);
      } else {
        userMarkerRef.current.setLatLng(latlng);
      }

      // Accuracy radius circle
      const acc = currentEstimate.accuracyMeters || 5;
      if (!accuracyCircleRef.current) {
        accuracyCircleRef.current = L.circle(latlng, {
          radius: acc,
          color: isSimulated ? '#F59E0B' : '#168C83',
          fillColor: isSimulated ? '#FDE68A' : '#DDF3EC',
          fillOpacity: 0.25,
          weight: 1
        }).addTo(map);
      } else {
        accuracyCircleRef.current.setLatLng(latlng);
        accuracyCircleRef.current.setRadius(acc);
      }
    }
  }, [currentEstimate]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Map Container */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Floating Map Controls */}
      <div
        style={{
          position: 'absolute',
          right: 14,
          bottom: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          zIndex: 400
        }}
      >
        {/* Recenter Button */}
        <button
          onClick={onRecenter}
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#168C83',
            cursor: 'pointer'
          }}
          title="Recenter Map to User Position"
        >
          <Locate size={20} />
        </button>

        {/* Indoor View Toggle (if near or in a building) */}
        {selectedBuilding && selectedBuilding.floors.length > 0 && (
          <button
            onClick={onToggleIndoor}
            style={{
              padding: '8px 12px',
              borderRadius: 22,
              backgroundColor: isIndoorMode ? '#168C83' : '#FFFFFF',
              color: isIndoorMode ? '#FFFFFF' : '#252A2B',
              border: '1px solid #D1D5DB',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer'
            }}
            title="Toggle Indoor Floor Plans"
          >
            <Building2 size={16} />
            <span>{isIndoorMode ? 'Outdoor Map' : 'Floor Plan'}</span>
          </button>
        )}
      </div>

      {/* Attribution & Provenance Strip */}
      <div
        style={{
          position: 'absolute',
          left: 10,
          bottom: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(4px)',
          padding: '3px 8px',
          borderRadius: 6,
          fontSize: 9,
          color: '#64748B',
          zIndex: 400,
          pointerEvents: 'none'
        }}
      >
        <span>© OpenStreetMap • {campus.code} Public Spatial Grid</span>
      </div>
    </div>
  );
};
