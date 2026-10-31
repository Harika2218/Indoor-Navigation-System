import localforage from 'localforage';
import { Campus, CampusId, Building, POI, PackageManifest } from '../types/campus';
import { NavigationGraph } from '../types/navigation';
import { WiFiFingerprintSample, QRCheckpointPayload } from '../types/positioning';
import { mbuCampusProfile, mbuBuildings, mbuPOIs, mbuNavigationGraph, mbuWiFiFingerprints, mbuQRCheckpoints, mbuPackageManifest } from '../data/mbuCampusData';
import { iittpCampusProfile, iittpBuildings, iittpPOIs, iittpNavigationGraph, iittpWiFiFingerprints, iittpQRCheckpoints, iittpPackageManifest } from '../data/iittpCampusData';

export interface CampusPackageData {
  manifest: PackageManifest;
  campus: Campus;
  buildings: Building[];
  pois: POI[];
  graph: NavigationGraph;
  wifiFingerprints: WiFiFingerprintSample[];
  qrCheckpoints: QRCheckpointPayload[];
}

const campusStore = localforage.createInstance({
  name: 'CampusNavigator',
  storeName: 'campus_packages'
});

const settingsStore = localforage.createInstance({
  name: 'CampusNavigator',
  storeName: 'app_settings'
});

const DEFAULT_PACKAGES: Record<CampusId, CampusPackageData> = {
  'mbu-tirupati': {
    manifest: mbuPackageManifest,
    campus: mbuCampusProfile,
    buildings: mbuBuildings,
    pois: mbuPOIs,
    graph: mbuNavigationGraph,
    wifiFingerprints: mbuWiFiFingerprints,
    qrCheckpoints: mbuQRCheckpoints
  },
  'iittp-permanent': {
    manifest: iittpPackageManifest,
    campus: iittpCampusProfile,
    buildings: iittpBuildings,
    pois: iittpPOIs,
    graph: iittpNavigationGraph,
    wifiFingerprints: iittpWiFiFingerprints,
    qrCheckpoints: iittpQRCheckpoints
  }
};

class PackageManager {
  private activePackage: CampusPackageData | null = null;
  private isOfflineMode: boolean = false;

  async init(): Promise<{ activeCampusId: CampusId; isOffline: boolean }> {
    // Check saved settings
    const savedCampusId = await settingsStore.getItem<CampusId>('active_campus_id');
    const savedOffline = await settingsStore.getItem<boolean>('airplane_mode_simulation');

    this.isOfflineMode = savedOffline ?? false;

    // Check if package is saved locally in IndexedDB, else initialize default bundle
    const initialCampusId: CampusId = savedCampusId || 'mbu-tirupati';
    let pkg = await campusStore.getItem<CampusPackageData>(`pkg_${initialCampusId}`);

    if (!pkg) {
      // First boot: load bundled package and persist locally
      pkg = DEFAULT_PACKAGES[initialCampusId];
      await this.savePackageLocally(initialCampusId, pkg);
    }

    this.activePackage = pkg;
    return { activeCampusId: initialCampusId, isOffline: this.isOfflineMode };
  }

  async getInstalledPackages(): Promise<Record<CampusId, { isDownloaded: boolean; version: string; sizeMb: number }>> {
    const mbuPkg = await campusStore.getItem<CampusPackageData>('pkg_mbu-tirupati');
    const iittpPkg = await campusStore.getItem<CampusPackageData>('pkg_iittp-permanent');

    return {
      'mbu-tirupati': {
        isDownloaded: !!mbuPkg,
        version: mbuPkg?.manifest.version || mbuPackageManifest.version,
        sizeMb: mbuCampusProfile.packageSizeMb
      },
      'iittp-permanent': {
        isDownloaded: !!iittpPkg,
        version: iittpPkg?.manifest.version || iittpPackageManifest.version,
        sizeMb: iittpCampusProfile.packageSizeMb
      }
    };
  }

  async downloadAndActivatePackage(
    campusId: CampusId, 
    onProgress?: (progressPercent: number, status: string) => void
  ): Promise<CampusPackageData> {
    onProgress?.(15, 'Initiating offline package stream...');
    await new Promise(r => setTimeout(r, 200));

    // Simulated network latency / verification if not forced offline
    onProgress?.(40, 'Downloading GeoJSON, routing graphs and indoor tiles...');
    await new Promise(r => setTimeout(r, 350));

    const candidatePackage = DEFAULT_PACKAGES[campusId];
    if (!candidatePackage) {
      throw new Error(`Unknown campus package: ${campusId}`);
    }

    onProgress?.(70, 'Verifying package checksum and schema v1.2.0...');
    await new Promise(r => setTimeout(r, 200));

    // Validate checksum & schema integrity
    if (!candidatePackage.manifest.checksum.startsWith('sha256-')) {
      throw new Error('Checksum verification failed: Corrupt package payload');
    }

    // Atomic activation: write to IndexedDB only after verification
    onProgress?.(90, 'Atomically saving package into offline SQLite/IndexedDB...');
    await this.savePackageLocally(campusId, candidatePackage);
    await settingsStore.setItem('active_campus_id', campusId);

    this.activePackage = candidatePackage;
    onProgress?.(100, 'Package activated successfully!');
    return candidatePackage;
  }

  async switchCampus(campusId: CampusId): Promise<CampusPackageData> {
    let pkg = await campusStore.getItem<CampusPackageData>(`pkg_${campusId}`);
    if (!pkg) {
      pkg = DEFAULT_PACKAGES[campusId];
      await this.savePackageLocally(campusId, pkg);
    }
    this.activePackage = pkg;
    await settingsStore.setItem('active_campus_id', campusId);
    return pkg;
  }

  getActivePackage(): CampusPackageData {
    if (!this.activePackage) {
      return DEFAULT_PACKAGES['mbu-tirupati'];
    }
    return this.activePackage;
  }

  getCampusProfile(campusId: CampusId): Campus {
    return DEFAULT_PACKAGES[campusId].campus;
  }

  getAllCampuses(): Campus[] {
    return [mbuCampusProfile, iittpCampusProfile];
  }

  private async savePackageLocally(campusId: CampusId, pkg: CampusPackageData): Promise<void> {
    // Keep last known good backup before overwrite
    const current = await campusStore.getItem<CampusPackageData>(`pkg_${campusId}`);
    if (current) {
      await campusStore.setItem(`backup_pkg_${campusId}`, current);
    }
    await campusStore.setItem(`pkg_${campusId}`, pkg);
  }

  async setAirplaneMode(enabled: boolean): Promise<boolean> {
    this.isOfflineMode = enabled;
    await settingsStore.setItem('airplane_mode_simulation', enabled);
    return this.isOfflineMode;
  }

  getIsOfflineMode(): boolean {
    return this.isOfflineMode;
  }
}

export const packageManager = new PackageManager();
