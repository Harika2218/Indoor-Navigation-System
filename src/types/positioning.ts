import { CampusId, ProvenanceType } from './campus';

export type PositioningProviderType = 
  | 'REAL_GPS'
  | 'SIMULATED_GPS'
  | 'SIMULATED_WIFI_KNN'
  | 'QR_CHECKPOINT'
  | 'VISUAL_POSITIONING_VPS'
  | 'MANUAL_SELECTION'
  | 'ILLUSTRATIVE_CORS_RTK';

export interface PositioningEstimate {
  campusId: CampusId;
  provider: PositioningProviderType;
  isRealSensor: boolean; // Must be false for all simulated values!
  timestamp: number;
  // Outdoor
  lat?: number;
  lng?: number;
  accuracyMeters: number;
  altitudeMeters?: number;
  headingDegrees?: number;
  speedMps?: number;
  // Indoor
  isIndoor: boolean;
  buildingId?: string;
  floorId?: string;
  floorNumber?: number;
  nodeId?: string;
  indoorX?: number; // 0..100%
  indoorY?: number; // 0..100%
  // 3D pose
  position3D?: [number, number, number];
  rotation3D?: [number, number, number];
  // Quality & confidence
  confidence: number; // 0.0 to 1.0
  matchedFingerprintCount?: number;
  statusMessage: string;
}

export interface WiFiAccessPoint {
  bssid: string;
  ssid: string;
  frequencyMhz: number;
  rssi: number; // in dBm (-30 to -95)
}

export interface WiFiFingerprintSample {
  id: string;
  campusId: CampusId;
  buildingId: string;
  floorId: string;
  floorNumber: number;
  nodeId: string;
  indoorX: number;
  indoorY: number;
  readings: Record<string, number>; // bssid -> rssi in dBm
  sampleType: 'SYNTHETIC_DEMO_DATA';
}

export interface QRCheckpointPayload {
  version: string;
  campus_id: CampusId;
  building_id: string;
  floor_id: string;
  checkpoint_id: string;
  node_id: string;
  label: string;
  createdAt?: string;
  isActive?: boolean;
  lastVerifiedAt?: string;
  provenance?: ProvenanceType;
}

// Visual Positioning System (VPS) Specification (Brief Section F)
export interface Pose6DoF {
  x: number; // relative coordinate
  y: number;
  z: number;
  pitch: number; // degrees
  yaw: number;
  roll: number;
}

export interface VisualLocalizationResult {
  isLocalized: boolean;
  confidence: number; // 0.0 to 1.0
  campusId: CampusId;
  buildingId?: string;
  floorId?: string;
  floorNumber?: number;
  nodeId?: string;
  pose6DoF?: Pose6DoF;
  matchedKeypoints: number;
  referenceKeyframeId?: string;
  uncertaintyMeters: number;
  timestamp: number;
  latencyMs: number;
  providerName: string;
  statusText: string;
  isExperimental: boolean;
}

export interface VisualReferenceKeyframe {
  id: string;
  campusId: CampusId;
  buildingId: string;
  floorId: string;
  nodeId: string;
  title: string;
  landmarkDescription: string;
  thumbnailUrl: string;
  featureSignature: string; // simulated descriptor hash
  groundTruthPose: Pose6DoF;
  provenance: ProvenanceType;
}

export interface VisualLocalizationProvider {
  name: string;
  isExperimental: boolean;
  init(referenceData: VisualReferenceKeyframe[]): Promise<boolean>;
  localize(frameOrSignature: string): Promise<VisualLocalizationResult>;
  getStatus(): { isReady: boolean; referenceCount: number };
}

// Camera and AR Wayfinding Specification (Brief Section G)
export interface CameraCapability {
  hasWebcam: boolean;
  hasWebXR: boolean;
  hasDeviceOrientation: boolean;
  permissionState: 'prompt' | 'granted' | 'denied';
}

export interface ARWaypoint {
  id: string;
  label: string;
  distanceMeters: number;
  directionAngleDeg: number; // -180 to 180 relative to camera heading
  pitchAngleDeg: number;
  isDestination: boolean;
  action?: string;
}

export interface CORSStation {
  id: string;
  name: string;
  network: string; // e.g. "Survey of India / Andhra Pradesh CORS Network"
  lat: number;
  lng: number;
  elevationMeters: number;
  status: 'ONLINE' | 'STANDBY';
  distanceKm: number;
  format: 'RTCM 3.3 MSM7';
  latencySeconds: number;
}

export interface RTKComparisonMetrics {
  standaloneLat: number;
  standaloneLng: number;
  standaloneErrorMeters: number;
  correctedLat: number;
  correctedLng: number;
  correctedErrorMeters: number;
  improvementFactor: number;
  satellitesInView: number;
  hdop: number;
  correctionAgeSec: number;
  baselineLengthKm: number;
  carrierPhaseLock: boolean;
  fixStatus: 'RTK_FIX_ILLUSTRATIVE' | 'RTK_FLOAT_ILLUSTRATIVE' | 'STANDALONE_GPS';
  disclaimer: string;
}
