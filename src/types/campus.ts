// Campus, Entity, and Digital Twin Types

export type ProvenanceType = 
  | 'REAL_CAPTURED_DATA'
  | 'VERIFIED_PUBLIC_DATA'
  | 'OPENSTREETMAP_DATA'
  | 'SYNTHETIC_DEMO_DATA'
  | 'UNVERIFIED_DATA';

export type CampusId = 'mbu-tirupati' | 'iittp-permanent';

export interface Campus {
  id: CampusId;
  name: string;
  shortName: string;
  code: string;
  tagline: string;
  location: {
    lat: number;
    lng: number;
    city: string;
    state: string;
    bounds: [[number, number], [number, number]]; // [southWest, northEast]
  };
  version: string;
  packageSizeMb: number;
  lastUpdated: string;
  provenance: ProvenanceType;
  provenanceSummary: string;
  disclaimer?: string;
  stats: {
    buildingCount: number;
    floorCount: number;
    poiCount: number;
    routableKm: number;
    verifiedPercent: number;
  };
}

export type BuildingDataStatus = 'verified' | 'partial' | 'demo' | 'unavailable';

export interface BuildingEntrance {
  id: string;
  name: string;
  outdoorNodeId: string;
  indoorNodeId: string;
  floorId: string;
  isAccessible: boolean;
  lat: number;
  lng: number;
  position3D?: [number, number, number]; // [x, y, z] in 3D twin space
}

export interface Building {
  id: string;
  campusId: CampusId;
  name: string;
  code: string;
  category: 'academic' | 'administrative' | 'hostel' | 'amenity' | 'sports' | 'library' | 'health';
  description: string;
  coordinates: [number, number]; // center [lat, lng]
  polygon: [number, number][]; // footprint boundaries
  floors: Floor[];
  entrances: BuildingEntrance[];
  dataStatus: BuildingDataStatus;
  provenance: ProvenanceType;
  indoorLayoutNotice?: string;
  // 3D Twin properties
  position3D?: [number, number, number]; // [x, y, z] in scene
  dimensions3D?: [number, number, number]; // [width, height, depth]
  color3D?: string;
  modelAssetId?: string;
}

export interface Floor {
  id: string;
  campusId: CampusId;
  buildingId: string;
  floorNumber: number; // 0 for Ground, 1 for 1st, etc.
  name: string;
  planAssetUrl?: string;
  dataStatus: BuildingDataStatus;
  rooms: Room[];
  connectors: VerticalConnector[];
  bounds: {
    width: number; // meters
    height: number; // meters
  };
  elevationOffset3D?: number; // meters in 3D exploded view
}

export interface VerticalConnector {
  id: string;
  type: 'stairs' | 'elevator' | 'ramp';
  name: string;
  nodeId: string;
  accessibleFloorNumbers: number[];
  isAccessible: boolean;
  x: number; // floor coordinate 0..100
  y: number; // floor coordinate 0..100
  position3D?: [number, number, number];
}

export interface Room {
  id: string;
  campusId: CampusId;
  buildingId: string;
  floorId: string;
  roomCode: string;
  name: string;
  category: 'classroom' | 'lab' | 'washroom' | 'faculty' | 'admin' | 'canteen' | 'auditorium' | 'library' | 'utility';
  graphNodeId: string;
  x: number; // floor coordinate %
  y: number; // floor coordinate %
  width?: number;
  height?: number;
  aliases: string[];
  provenance: ProvenanceType;
  position3D?: [number, number, number];
}

export interface POI {
  id: string;
  campusId: CampusId;
  name: string;
  category: 'gate' | 'dining' | 'sports' | 'atm' | 'health' | 'library' | 'parking' | 'landmark' | 'washroom' | 'bus_stop';
  aliases: string[];
  coordinate: [number, number]; // [lat, lng]
  buildingId?: string;
  floorId?: string;
  indoorNodeId?: string;
  outdoorNodeId?: string;
  description: string;
  provenance: ProvenanceType;
  position3D?: [number, number, number];
}

// 3D Digital Twin Asset Registration Specification (Brief Section D & K)
export type DigitalTwinAssetFormat = 'gltf' | 'glb' | 'ply' | 'splat' | 'procedural_twin';
export type DigitalTwinProcessingStatus = 'ready' | 'processing' | 'failed' | 'registered';

export interface DigitalTwinAsset {
  id: string;
  campusId: CampusId;
  buildingId?: string;
  floorId?: string;
  name: string;
  format: DigitalTwinAssetFormat;
  provenance: ProvenanceType;
  captureDate: string;
  version: string;
  processingStatus: DigitalTwinProcessingStatus;
  fileSizeBytes: number;
  modelUrl?: string;
  polyCount?: number;
  lodLevels?: number;
  description: string;
  hasGaussianSplat?: boolean;
}

export interface PackageManifest {
  campusId: CampusId;
  version: string;
  name: string;
  createdAt: string;
  checksum: string;
  schemaVersion: string;
  sources: {
    name: string;
    type: ProvenanceType;
    url?: string;
    attribution: string;
  }[];
  fileSizes: {
    buildings: number;
    indoor: number;
    graph: number;
    wifiFingerprints: number;
    checkpoints: number;
    digitalTwin3D?: number;
  };
  digitalTwinAssets?: DigitalTwinAsset[];
}
