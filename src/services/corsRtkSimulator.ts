import { CORSStation, RTKComparisonMetrics } from '../types/positioning';
import { CampusId } from '../types/campus';

export interface CORSStationInfo {
  station: CORSStation;
  description: string;
  hardwareRequirements: string[];
}

export const ANDHRA_CORS_STATIONS: Record<CampusId, CORSStationInfo> = {
  'mbu-tirupati': {
    station: {
      id: 'AP-TPT-CORS01',
      name: 'Tirupati University Ground Station (Survey of India)',
      network: 'Survey of India National CORS Network',
      lat: 13.6288,
      lng: 79.4192,
      elevationMeters: 161.4,
      status: 'ONLINE',
      distanceKm: 12.8,
      format: 'RTCM 3.3 MSM7',
      latencySeconds: 0.6
    },
    description: 'Reference base station providing continuous carrier-phase differential corrections across Tirupati and Chandragiri.',
    hardwareRequirements: [
      'Multi-band GNSS Receiver (L1/L2/L5 GPS + NavIC/Galileo)',
      'NTRIP Client Software over 4G/5G cellular link',
      'Survey-grade Geodetic Antenna with ground plane',
      'Subscribed credentials to Survey of India CORS Portal'
    ]
  },
  'iittp-permanent': {
    station: {
      id: 'AP-REN-CORS02',
      name: 'Renigunta / Yerpedu Reference Node',
      network: 'Survey of India National CORS Network',
      lat: 13.6521,
      lng: 79.5210,
      elevationMeters: 104.2,
      status: 'ONLINE',
      distanceKm: 9.4,
      format: 'RTCM 3.3 MSM7',
      latencySeconds: 0.5
    },
    description: 'Permanent reference GNSS monument station for Eastern Tirupati basin and Yerpedu technology corridor.',
    hardwareRequirements: [
      'Dual-frequency RTK Rover (e.g., u-blox ZED-F9P or Trimble BD990)',
      'RTCM3 RTK correction stream decoding engine',
      'Active NTRIP mountpoint connection with low packet jitter (<1s latency)',
      'Multipath-resistant choke-ring antenna'
    ]
  }
};

export class CORSRTKSimulator {
  /**
   * Generates illustrative comparative points between standard standalone GPS and RTK corrected positioning
   */
  generateComparison(campusId: CampusId, centerLat: number, centerLng: number): RTKComparisonMetrics {
    const cors = ANDHRA_CORS_STATIONS[campusId];

    // Standalone GNSS has 3 to 9 meters of ionospheric, tropospheric, and clock drift
    const standaloneErrorMeters = Number((3.5 + Math.random() * 4.2).toFixed(2));
    const standaloneAngle = Math.random() * 2 * Math.PI;
    const standaloneLatOffset = (Math.cos(standaloneAngle) * standaloneErrorMeters) / 111000;
    const standaloneLngOffset = (Math.sin(standaloneAngle) * standaloneErrorMeters) / (111000 * Math.cos((centerLat * Math.PI) / 180));

    // RTK carrier-phase differential reduces error to sub-decimeter (~0.03m to 0.08m in good conditions)
    const correctedErrorMeters = Number((0.02 + Math.random() * 0.04).toFixed(3));
    const correctedAngle = Math.random() * 2 * Math.PI;
    const correctedLatOffset = (Math.cos(correctedAngle) * correctedErrorMeters) / 111000;
    const correctedLngOffset = (Math.sin(correctedAngle) * correctedErrorMeters) / (111000 * Math.cos((centerLat * Math.PI) / 180));

    const improvementFactor = Math.round(standaloneErrorMeters / correctedErrorMeters);

    return {
      standaloneLat: centerLat + standaloneLatOffset,
      standaloneLng: centerLng + standaloneLngOffset,
      standaloneErrorMeters,
      correctedLat: centerLat + correctedLatOffset,
      correctedLng: centerLng + correctedLngOffset,
      correctedErrorMeters,
      improvementFactor,
      satellitesInView: 18 + Math.floor(Math.random() * 6),
      hdop: Number((0.8 + Math.random() * 0.4).toFixed(2)),
      correctionAgeSec: cors ? cors.station.latencySeconds : 0.7,
      baselineLengthKm: cors ? cors.station.distanceKm : 11.2,
      carrierPhaseLock: true,
      fixStatus: 'RTK_FIX_ILLUSTRATIVE',
      disclaimer: 'ILLUSTRATIVE CORS/RTK — NOT A LIVE CORRECTION FEED. Hardware GNSS receiver & RTCM3 correction stream required for actual cm-level fix.'
    };
  }

  generateScatterCloud(centerLat: number, centerLng: number, count: number = 30): {
    standaloneCloud: [number, number][];
    rtkCloud: [number, number][];
  } {
    const standaloneCloud: [number, number][] = [];
    const rtkCloud: [number, number][] = [];

    for (let i = 0; i < count; i++) {
      // Standalone scatter (spread 2-8m)
      const u1 = Math.random();
      const u2 = Math.random();
      const rStandalone = Math.sqrt(-2 * Math.log(u1 || 0.01)) * 3.5;
      const thetaStandalone = 2 * Math.PI * u2;
      const sLat = centerLat + (rStandalone * Math.cos(thetaStandalone)) / 111000;
      const sLng = centerLng + (rStandalone * Math.sin(thetaStandalone)) / 111000;
      standaloneCloud.push([sLat, sLng]);

      // RTK scatter (sub-decimeter tight cluster 0.02-0.06m)
      const rRtk = (0.015 + Math.random() * 0.035);
      const thetaRtk = Math.random() * 2 * Math.PI;
      const rLat = centerLat + (rRtk * Math.cos(thetaRtk)) / 111000;
      const rLng = centerLng + (rRtk * Math.sin(thetaRtk)) / 111000;
      rtkCloud.push([rLat, rLng]);
    }

    return { standaloneCloud, rtkCloud };
  }
}

export const corsRtkSimulator = new CORSRTKSimulator();
