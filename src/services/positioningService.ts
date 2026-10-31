import { CampusId } from '../types/campus';
import { PositioningEstimate, PositioningProviderType, QRCheckpointPayload } from '../types/positioning';
import { NavigationNode, RouteResult } from '../types/navigation';
import { packageManager } from './packageManager';
import { wifiFingerprintEngine } from './wifiFingerprintEngine';

export interface PositioningConfig {
  activeProvider: PositioningProviderType;
  gpsNoiseMeters: number; // 0 to 20m
  gpsDriftFactor: number; // 0 to 1
  simulatedSpeedMultiplier: number; // 1x, 2x, 5x
  simulateSignalLoss: boolean;
  simulateRouteDeviation: boolean;
}

export type PositioningSubscriber = (estimate: PositioningEstimate) => void;

class PositioningService {
  private config: PositioningConfig = {
    activeProvider: 'SIMULATED_GPS',
    gpsNoiseMeters: 4.0,
    gpsDriftFactor: 0.2,
    simulatedSpeedMultiplier: 1.5,
    simulateSignalLoss: false,
    simulateRouteDeviation: false
  };

  private subscribers: Set<PositioningSubscriber> = new Set();
  private currentEstimate: PositioningEstimate | null = null;
  private simulationIntervalId: number | null = null;
  private watchPositionId: number | null = null;

  // Simulated route playback state
  private playbackRoute: RouteResult | null = null;
  private currentStepIndex: number = 0;
  private stepFraction: number = 0; // 0.0 to 1.0 along current edge

  constructor() {
    this.initDefaultEstimate('mbu-tirupati');
  }

  private initDefaultEstimate(campusId: CampusId) {
    const pkg = packageManager.getActivePackage();
    const firstPoi = pkg.pois[0];
    const initialLat = firstPoi ? firstPoi.coordinate[0] : 13.6268;
    const initialLng = firstPoi ? firstPoi.coordinate[1] : 79.2974;

    this.currentEstimate = {
      campusId,
      provider: 'SIMULATED_GPS',
      isRealSensor: false,
      timestamp: Date.now(),
      lat: initialLat,
      lng: initialLng,
      accuracyMeters: 4.5,
      isIndoor: false,
      confidence: 0.92,
      statusMessage: 'SIMULATED GPS: Fixed at Campus Main Gate'
    };
  }

  subscribe(callback: PositioningSubscriber): () => void {
    this.subscribers.add(callback);
    if (this.currentEstimate) {
      callback(this.currentEstimate);
    }
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notify() {
    if (!this.currentEstimate) return;
    for (const sub of this.subscribers) {
      sub(this.currentEstimate);
    }
  }

  getCurrentEstimate(): PositioningEstimate | null {
    return this.currentEstimate;
  }

  getConfig(): PositioningConfig {
    return { ...this.config };
  }

  updateConfig(partial: Partial<PositioningConfig>) {
    this.config = { ...this.config, ...partial };
    if (partial.activeProvider) {
      this.switchProvider(partial.activeProvider);
    }
  }

  switchProvider(provider: PositioningProviderType) {
    this.config.activeProvider = provider;
    this.stopWatchers();

    if (provider === 'REAL_GPS') {
      this.startRealGPS();
    } else if (provider === 'SIMULATED_GPS') {
      this.startSimulatedGPS();
    } else if (provider === 'SIMULATED_WIFI_KNN') {
      this.triggerSimulatedWiFiScan();
    }
  }

  // --- Real Device HTML5 GPS Provider ---
  private startRealGPS() {
    if (!navigator.geolocation) {
      this.updateEstimate({
        provider: 'REAL_GPS',
        isRealSensor: true,
        confidence: 0,
        accuracyMeters: 999,
        statusMessage: 'HTML5 Geolocation not supported on this device/browser.'
      });
      return;
    }

    this.watchPositionId = navigator.geolocation.watchPosition(
      (pos) => {
        const pkg = packageManager.getActivePackage();
        this.updateEstimate({
          campusId: pkg.campus.id,
          provider: 'REAL_GPS',
          isRealSensor: true, // REAL DEVICE SENSOR
          timestamp: pos.timestamp || Date.now(),
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracyMeters: Math.round(pos.coords.accuracy),
          altitudeMeters: pos.coords.altitude || undefined,
          headingDegrees: pos.coords.heading || undefined,
          speedMps: pos.coords.speed || undefined,
          isIndoor: false,
          confidence: Math.max(0.2, Math.min(0.99, Number((1 - pos.coords.accuracy / 80).toFixed(2)))),
          statusMessage: `REAL GPS: Live device satellite fix (±${Math.round(pos.coords.accuracy)}m)`
        });
      },
      (err) => {
        this.updateEstimate({
          provider: 'REAL_GPS',
          isRealSensor: true,
          confidence: 0,
          accuracyMeters: 999,
          statusMessage: `REAL GPS Error: ${err.message}. Switch to SIMULATED GPS for testing.`
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 3000
      }
    );
  }

  // --- Simulated GPS Route Playback ---
  startRoutePlayback(route: RouteResult) {
    this.playbackRoute = route;
    this.currentStepIndex = 0;
    this.stepFraction = 0;
    this.config.activeProvider = 'SIMULATED_GPS';
    this.startSimulatedGPS();
  }

  private startSimulatedGPS() {
    this.stopWatchers();

    this.simulationIntervalId = window.setInterval(() => {
      if (this.config.simulateSignalLoss) {
        this.updateEstimate({
          provider: 'SIMULATED_GPS',
          isRealSensor: false,
          confidence: 0.1,
          accuracyMeters: 85,
          statusMessage: 'SIMULATED GPS: [Signal Loss] Tunnel / heavy tree canopy obstruction'
        });
        return;
      }

      if (!this.playbackRoute || this.playbackRoute.nodes.length < 2) {
        // Idle drift around current position
        if (this.currentEstimate && this.currentEstimate.lat && this.currentEstimate.lng) {
          const noise = this.config.gpsNoiseMeters * 0.000009; // degrees
          const noisyLat = this.currentEstimate.lat + (Math.random() - 0.5) * noise;
          const noisyLng = this.currentEstimate.lng + (Math.random() - 0.5) * noise;

          this.updateEstimate({
            lat: noisyLat,
            lng: noisyLng,
            provider: 'SIMULATED_GPS',
            isRealSensor: false,
            timestamp: Date.now(),
            accuracyMeters: Number((this.config.gpsNoiseMeters + Math.random() * 2).toFixed(1)),
            statusMessage: 'SIMULATED GPS: Idle marker with configurable noise jitter'
          });
        }
        return;
      }

      // Step along route nodes
      const nodes = this.playbackRoute.nodes;
      if (this.currentStepIndex >= nodes.length - 1) {
        // Route complete
        const lastNode = nodes[nodes.length - 1];
        this.handleNodeArrival(lastNode);
        return;
      }

      const fromNode = nodes[this.currentStepIndex];
      const toNode = nodes[this.currentStepIndex + 1];

      // Advance fraction
      const stepIncrement = 0.08 * this.config.simulatedSpeedMultiplier;
      this.stepFraction += stepIncrement;

      if (this.stepFraction >= 1.0) {
        this.stepFraction = 0;
        this.currentStepIndex++;
        this.handleNodeArrival(toNode);
        return;
      }

      // Interpolate position
      if (fromNode.lat !== undefined && toNode.lat !== undefined) {
        let lat = fromNode.lat + (toNode.lat - fromNode.lat) * this.stepFraction;
        let lng = fromNode.lng! + (toNode.lng! - fromNode.lng!) * this.stepFraction;

        // Apply intentional route deviation if toggled
        if (this.config.simulateRouteDeviation && this.currentStepIndex === 1) {
          lat += 0.0005; // 55m perpendicular drift
          lng += 0.0004;
        }

        // Apply realistic Gaussian noise
        const noiseDeg = (this.config.gpsNoiseMeters / 111000) * (Math.random() - 0.5);
        lat += noiseDeg;
        lng += noiseDeg;

        this.updateEstimate({
          campusId: this.playbackRoute.campusId,
          provider: 'SIMULATED_GPS',
          isRealSensor: false,
          timestamp: Date.now(),
          lat,
          lng,
          isIndoor: false,
          buildingId: undefined,
          floorId: undefined,
          accuracyMeters: Number((this.config.gpsNoiseMeters + Math.random() * 1.5).toFixed(1)),
          confidence: 0.94,
          speedMps: 1.4 * this.config.simulatedSpeedMultiplier,
          statusMessage: `SIMULATED GPS: Moving towards ${toNode.name || 'next waypoint'}`
        });
      } else if (fromNode.buildingId && toNode.buildingId) {
        // Moving indoors! Seamlessly switch positioning to indoor simulation
        const x = (fromNode.x || 50) + ((toNode.x || 50) - (fromNode.x || 50)) * this.stepFraction;
        const y = (fromNode.y || 50) + ((toNode.y || 50) - (fromNode.y || 50)) * this.stepFraction;

        this.updateEstimate({
          campusId: this.playbackRoute.campusId,
          provider: 'SIMULATED_WIFI_KNN',
          isRealSensor: false,
          timestamp: Date.now(),
          isIndoor: true,
          buildingId: toNode.buildingId,
          floorId: toNode.floorId,
          floorNumber: toNode.floorNumber,
          nodeId: toNode.id,
          indoorX: Math.round(x),
          indoorY: Math.round(y),
          accuracyMeters: 3.5,
          confidence: 0.88,
          statusMessage: `SIMULATED WI-FI: Indoor Corridor Floor ${toNode.floorNumber ?? 0}`
        });
      }
    }, 600);
  }

  private handleNodeArrival(node: NavigationNode) {
    if (node.buildingId && node.floorId) {
      // Switched indoor
      this.updateEstimate({
        provider: 'SIMULATED_WIFI_KNN',
        isRealSensor: false,
        timestamp: Date.now(),
        isIndoor: true,
        buildingId: node.buildingId,
        floorId: node.floorId,
        floorNumber: node.floorNumber,
        nodeId: node.id,
        indoorX: node.x,
        indoorY: node.y,
        accuracyMeters: 3.2,
        confidence: 0.92,
        statusMessage: `SIMULATED WI-FI: Arrived at ${node.name || 'Indoor Point'}`
      });
    } else {
      this.updateEstimate({
        provider: 'SIMULATED_GPS',
        isRealSensor: false,
        timestamp: Date.now(),
        lat: node.lat,
        lng: node.lng,
        isIndoor: false,
        accuracyMeters: 4.0,
        confidence: 0.95,
        statusMessage: `SIMULATED GPS: Reached ${node.name || 'Waypoint'}`
      });
    }
  }

  triggerSimulatedWiFiScan(nodeId?: string) {
    const pkg = packageManager.getActivePackage();
    const targetNode = nodeId || pkg.wifiFingerprints[0]?.nodeId || 'mbu-ind-f0-lobby';
    const scan = wifiFingerprintEngine.generateSimulatedScan(pkg.campus.id, targetNode);
    const estimate = wifiFingerprintEngine.estimatePosition(pkg.campus.id, scan);

    if (estimate) {
      this.updateEstimate(estimate);
    }
  }

  // --- QR Checkpoint Validation & Processing ---
  applyQRCheckpoint(payload: QRCheckpointPayload): { success: boolean; message: string } {
    const pkg = packageManager.getActivePackage();

    // 1. Validate campus isolation: Reject wrong-campus QR code
    if (payload.campus_id !== pkg.campus.id) {
      return {
        success: false,
        message: `WRONG CAMPUS: This QR code belongs to "${payload.campus_id}", but your current active campus is "${pkg.campus.id}". Please switch campuses first.`
      };
    }

    // 2. Validate payload schema
    if (!payload.building_id || !payload.floor_id || !payload.node_id) {
      return {
        success: false,
        message: 'MALFORMED QR: Payload missing mandatory spatial keys (building_id/floor_id/node_id).'
      };
    }

    // Find node in active campus graph
    const node = pkg.graph.nodes[payload.node_id];
    const building = pkg.buildings.find(b => b.id === payload.building_id);
    const floor = building?.floors.find(f => f.id === payload.floor_id);

    this.updateEstimate({
      campusId: pkg.campus.id,
      provider: 'QR_CHECKPOINT',
      isRealSensor: false,
      timestamp: Date.now(),
      isIndoor: true,
      buildingId: payload.building_id,
      floorId: payload.floor_id,
      floorNumber: floor?.floorNumber ?? 0,
      nodeId: payload.node_id,
      indoorX: node?.x ?? 50,
      indoorY: node?.y ?? 50,
      accuracyMeters: 0.5, // QR checkpoint ground truth is sub-meter verified
      confidence: 1.0,
      statusMessage: `QR CHECKPOINT VERIFIED: ${payload.label} (${payload.checkpoint_id})`
    });

    return {
      success: true,
      message: `Verified at ${payload.label} on Floor ${floor?.floorNumber ?? 0}!`
    };
  }

  // --- Manual Floor & Node Setting ---
  setManualLocation(buildingId: string, floorId: string, floorNumber: number, x: number, y: number, label: string) {
    const pkg = packageManager.getActivePackage();
    this.updateEstimate({
      campusId: pkg.campus.id,
      provider: 'MANUAL_SELECTION',
      isRealSensor: false,
      timestamp: Date.now(),
      isIndoor: true,
      buildingId,
      floorId,
      floorNumber,
      indoorX: x,
      indoorY: y,
      accuracyMeters: 1.0,
      confidence: 0.95,
      statusMessage: `MANUAL CONFIRMATION: Set to ${label} (Floor ${floorNumber})`
    });
  }

  private updateEstimate(partial: Partial<PositioningEstimate>) {
    if (!this.currentEstimate) {
      const pkg = packageManager.getActivePackage();
      this.initDefaultEstimate(pkg.campus.id);
    }
    this.currentEstimate = { ...this.currentEstimate!, ...partial };
    this.notify();
  }

  stopWatchers() {
    if (this.simulationIntervalId !== null) {
      clearInterval(this.simulationIntervalId);
      this.simulationIntervalId = null;
    }
    if (this.watchPositionId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(this.watchPositionId);
      this.watchPositionId = null;
    }
  }
}

export const positioningService = new PositioningService();
