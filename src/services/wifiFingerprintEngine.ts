import { CampusId } from '../types/campus';
import { WiFiFingerprintSample, PositioningEstimate } from '../types/positioning';
import { packageManager } from './packageManager';

export interface KNNMatchResult {
  sample: WiFiFingerprintSample;
  signalDistance: number; // Euclidean distance in dBm space
  weight: number;
}

export class WiFiFingerprintEngine {
  /**
   * Performs k-NN (k = 3) matching between a scanned/simulated RSSI reading and stored campus fingerprints.
   */
  estimatePosition(
    campusId: CampusId,
    observedReadings: Record<string, number>,
    k: number = 3
  ): PositioningEstimate | null {
    const pkg = packageManager.getActivePackage();
    if (pkg.campus.id !== campusId) return null;

    const storedSamples = pkg.wifiFingerprints.filter(s => s.campusId === campusId);
    if (storedSamples.length === 0) return null;

    // Calculate signal distances
    const matches: KNNMatchResult[] = [];

    for (const sample of storedSamples) {
      let sumSquaredDiff = 0;
      let sharedAps = 0;

      // Compare AP RSSIs
      const allBssids = new Set([...Object.keys(observedReadings), ...Object.keys(sample.readings)]);

      for (const bssid of allBssids) {
        const obsRssi = observedReadings[bssid] ?? -95; // default penalty for missing AP
        const refRssi = sample.readings[bssid] ?? -95;

        if (observedReadings[bssid] !== undefined && sample.readings[bssid] !== undefined) {
          sharedAps++;
        }

        const diff = obsRssi - refRssi;
        sumSquaredDiff += diff * diff;
      }

      // Penalty if no shared APs
      if (sharedAps === 0) {
        sumSquaredDiff += 10000;
      }

      const signalDistance = Math.sqrt(sumSquaredDiff);
      matches.push({
        sample,
        signalDistance,
        weight: 1 / (signalDistance + 1e-4)
      });
    }

    // Sort by smallest signal distance
    matches.sort((a, b) => a.signalDistance - b.signalDistance);

    const topK = matches.slice(0, Math.min(k, matches.length));
    if (topK.length === 0) return null;

    // Floor voting (majority or weighted)
    const floorVotes: Record<number, number> = {};
    for (const m of topK) {
      const fl = m.sample.floorNumber;
      floorVotes[fl] = (floorVotes[fl] || 0) + m.weight;
    }

    let bestFloor = topK[0].sample.floorNumber;
    let maxWeight = -1;
    for (const [flStr, wt] of Object.entries(floorVotes)) {
      if (wt > maxWeight) {
        maxWeight = wt;
        bestFloor = Number(flStr);
      }
    }

    // Filter top matches on best floor
    const floorMatches = topK.filter(m => m.sample.floorNumber === bestFloor);
    const primary = floorMatches[0] || topK[0];

    // Compute confidence: based on signal distance and AP overlap
    const bestDist = primary.signalDistance;
    // Euclidean dist < 15 dBm is high confidence (>0.85); > 50 dBm is low
    const confidence = Math.max(0.1, Math.min(0.96, Number((1 - bestDist / 60).toFixed(2))));

    // Weighted coordinate interpolation
    let sumX = 0;
    let sumY = 0;
    let sumW = 0;

    for (const m of floorMatches) {
      sumX += m.sample.indoorX * m.weight;
      sumY += m.sample.indoorY * m.weight;
      sumW += m.weight;
    }

    const indoorX = sumW > 0 ? Math.round(sumX / sumW) : primary.sample.indoorX;
    const indoorY = sumW > 0 ? Math.round(sumY / sumW) : primary.sample.indoorY;

    // Approximate accuracy in meters (indoor Wi-Fi fingerprinting typical is 3-6m)
    const accuracyMeters = Number((3.5 + bestDist * 0.08).toFixed(1));

    return {
      campusId,
      provider: 'SIMULATED_WIFI_KNN',
      isRealSensor: false, // MANDATORY HONESTY RULE
      timestamp: Date.now(),
      isIndoor: true,
      buildingId: primary.sample.buildingId,
      floorId: primary.sample.floorId,
      floorNumber: bestFloor,
      nodeId: primary.sample.nodeId,
      indoorX,
      indoorY,
      accuracyMeters,
      confidence,
      matchedFingerprintCount: topK.length,
      statusMessage: `SIMULATED WI-FI: Matched Floor ${bestFloor} via ${topK.length}-NN (Euclidean dist: ${bestDist.toFixed(1)} dBm)`
    };
  }

  /**
   * Generates a noisy simulated scan for a given indoor node or location
   */
  generateSimulatedScan(
    campusId: CampusId,
    targetNodeId: string,
    noiseStdDev: number = 2.5
  ): Record<string, number> {
    const pkg = packageManager.getActivePackage();
    const ref = pkg.wifiFingerprints.find(f => f.nodeId === targetNodeId) || pkg.wifiFingerprints[0];

    if (!ref) {
      return {
        [`${campusId.toUpperCase()}-AP-DEMO-01`]: -55,
        [`${campusId.toUpperCase()}-AP-DEMO-02`]: -64
      };
    }

    const noisyReadings: Record<string, number> = {};
    for (const [ap, rssi] of Object.entries(ref.readings)) {
      // Gaussian Box-Muller noise
      const u1 = Math.random() || 0.001;
      const u2 = Math.random() || 0.001;
      const gaussian = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      const noisyRssi = Math.round(rssi + gaussian * noiseStdDev);
      noisyReadings[ap] = Math.max(-95, Math.min(-30, noisyRssi));
    }

    return noisyReadings;
  }
}

export const wifiFingerprintEngine = new WiFiFingerprintEngine();
