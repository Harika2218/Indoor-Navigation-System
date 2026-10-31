import React, { useState, useEffect } from 'react';
import { Campus, CampusId, Building, Floor, Room, POI } from './types/campus';
import { TravelMode, RouteResult } from './types/navigation';
import { PositioningEstimate } from './types/positioning';
import { packageManager } from './services/packageManager';
import { searchService, SearchResultItem } from './services/searchService';
import { routingEngine } from './services/routingEngine';
import { positioningService } from './services/positioningService';

// UI Components
import { AndroidFrame } from './components/phone/AndroidFrame';
import { Header } from './components/common/Header';
import { CampusMap } from './components/map/CampusMap';
import { IndoorFloorPlan } from './components/map/IndoorFloorPlan';
import { CampusDigitalTwin3D } from './components/digitaltwin/CampusDigitalTwin3D';
import { CameraAROverlay } from './components/ar/CameraAROverlay';
import { SearchOverlay } from './components/search/SearchOverlay';
import { NavigationSheet } from './components/navigation/NavigationSheet';
import { QRScannerModal } from './components/qr/QRScannerModal';
import { CORSComparisonModal } from './components/demo/CORSComparisonModal';
import { DemoControlPanel } from './components/demo/DemoControlPanel';
import { JudgingScenariosModal } from './components/demo/JudgingScenariosModal';
import { CampusSelectionModal } from './components/settings/CampusSelectionModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { AdminContentManagementModal } from './components/admin/AdminContentManagementModal';

export const App: React.FC = () => {
  // Application State
  const [activeCampusId, setActiveCampusId] = useState<CampusId>('mbu-tirupati');
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isFrameEnabled, setIsFrameEnabled] = useState<boolean>(true);

  // Main Viewer Mode: 3D Digital Twin (Primary) vs 2D Map
  const [mainViewMode, setMainViewMode] = useState<'3d_twin' | '2d_map'>('3d_twin');

  // Active Campus Data Package
  const [currentCampus, setCurrentCampus] = useState<Campus>(packageManager.getCampusProfile('mbu-tirupati'));
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [pois, setPois] = useState<POI[]>([]);

  // Navigation & Spatial Selection State
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isIndoorFloorPlanOpen, setIsIndoorFloorPlanOpen] = useState<boolean>(false);

  // Routing State
  const [travelMode, setTravelMode] = useState<TravelMode>('walk');
  const [activeRoute, setActiveRoute] = useState<RouteResult | null>(null);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);

  // Positioning Provider State
  const [currentEstimate, setCurrentEstimate] = useState<PositioningEstimate | null>(null);

  // Modal Dialogs
  const [isCampusModalOpen, setIsCampusModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isCORSModalOpen, setIsCORSModalOpen] = useState(false);
  const [isDemoLabOpen, setIsDemoLabOpen] = useState(false);
  const [isJudgingModalOpen, setIsJudgingModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isCameraAROpen, setIsCameraAROpen] = useState(false);

  // Toast / Status banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Initialize Package, QR Deep Link, and Positioning Service
  useEffect(() => {
    const initApp = async () => {
      const { activeCampusId: initialId, isOffline: initialOffline } = await packageManager.init();
      loadCampusData(initialId);
      setIsOffline(initialOffline);

      // Check QR Deep Link URL parameters (e.g. ?checkpoint=CP-MBU-SOC-G-ENT)
      const urlParams = new URLSearchParams(window.location.search);
      const cpParam = urlParams.get('checkpoint');
      if (cpParam) {
        const pkg = packageManager.getActivePackage();
        const found = pkg.qrCheckpoints.find(c => c.checkpoint_id === cpParam);
        if (found) {
          positioningService.applyQRCheckpoint(found);
          showToast(`QR Deep Link Resolved: Calibrated at ${found.label}`);
        }
      }
    };

    initApp();

    const unsubscribe = positioningService.subscribe(estimate => {
      setCurrentEstimate(estimate);
    });

    return () => unsubscribe();
  }, []);

  const loadCampusData = (campusId: CampusId) => {
    const pkg = packageManager.getActivePackage();
    setActiveCampusId(campusId);
    setCurrentCampus(pkg.campus);
    setBuildings(pkg.buildings);
    setPois(pkg.pois);

    // Default select main multi-floor demo building
    const demoBld = pkg.buildings[0];
    if (demoBld) {
      setSelectedBuilding(demoBld);
      setSelectedFloor(demoBld.floors[0] || null);
    }

    setActiveRoute(null);
    setIsNavigating(false);
    setIsIndoorFloorPlanOpen(false);
  };

  const handleSwitchCampus = async (newCampusId: CampusId) => {
    await packageManager.switchCampus(newCampusId);
    loadCampusData(newCampusId);
    showToast(`Switched to ${newCampusId === 'mbu-tirupati' ? 'MBU Tirupati' : 'IIT Tirupati (Permanent Campus)'}`);
  };

  // Route Planning Function
  const planRouteToNode = (targetNodeId: string, customMode?: TravelMode) => {
    const mode = customMode || travelMode;
    const pkg = packageManager.getActivePackage();

    let startNodeId = pkg.pois[0]?.outdoorNodeId || Object.keys(pkg.graph.nodes)[0];
    if (currentEstimate?.nodeId && pkg.graph.nodes[currentEstimate.nodeId]) {
      startNodeId = currentEstimate.nodeId;
    }

    const route = routingEngine.findRoute(activeCampusId, startNodeId, targetNodeId, mode);
    if (!route) {
      showToast('No valid route found between these points for the selected mode.');
      return;
    }

    setActiveRoute(route);

    // If destination is indoor, ensure building and floor are highlighted
    const lastNode = route.nodes[route.nodes.length - 1];
    if (lastNode && lastNode.buildingId) {
      const bld = buildings.find(b => b.id === lastNode.buildingId);
      if (bld) {
        setSelectedBuilding(bld);
        const fl = bld.floors.find(f => f.id === lastNode.floorId) || bld.floors[0];
        setSelectedFloor(fl);
      }
    }
  };

  const handleSelectSearchResult = (result: SearchResultItem) => {
    if (result.type === 'building' && result.buildingId) {
      const bld = buildings.find(b => b.id === result.buildingId);
      if (bld) {
        setSelectedBuilding(bld);
        setSelectedFloor(bld.floors[0] || null);
        showToast(`Selected 3D Twin for ${bld.name}`);
      }
    } else if (result.isIndoor && result.buildingId) {
      const bld = buildings.find(b => b.id === result.buildingId);
      if (bld) {
        setSelectedBuilding(bld);
        const fl = bld.floors.find(f => f.id === result.floorId) || bld.floors[0];
        setSelectedFloor(fl);

        const rm = fl?.rooms.find(r => r.id === result.id);
        if (rm) setSelectedRoom(rm);
      }
    }
  };

  const handleStartRouteFromSearch = (result: SearchResultItem) => {
    planRouteToNode(result.targetNodeId);
  };

  const handleModeChange = (mode: TravelMode) => {
    setTravelMode(mode);
    if (activeRoute) {
      planRouteToNode(activeRoute.destinationNodeId, mode);
    }
  };

  const handleStartNavigation = () => {
    if (!activeRoute) return;
    setIsNavigating(true);
    positioningService.startRoutePlayback(activeRoute);
    showToast('Turn guidance started with simulated route playback.');
  };

  const handleStopNavigation = () => {
    setIsNavigating(false);
    positioningService.stopWatchers();
    setActiveRoute(null);
    showToast('Navigation ended.');
  };

  // Automated Judging Replay Flow
  const handleRunJudgingScenario = async (scenarioId: string) => {
    switch (scenarioId) {
      case 'scenario_mbu_washroom':
        await handleSwitchCampus('mbu-tirupati');
        const washResults = searchService.search('Where is the washroom?', 'mbu-tirupati');
        if (washResults[0]) {
          planRouteToNode(washResults[0].targetNodeId, 'walk');
          showToast('Disambiguated: Routing to School of Computing Washroom');
        }
        break;

      case 'scenario_mbu_gps_walk':
        await handleSwitchCampus('mbu-tirupati');
        const gateNode = 'mbu-out-node-gate1';
        const socEntrance = 'mbu-out-node-soc-front';
        const walkRoute = routingEngine.findRoute('mbu-tirupati', gateNode, socEntrance, 'walk');
        if (walkRoute) {
          setActiveRoute(walkRoute);
          setIsNavigating(true);
          positioningService.startRoutePlayback(walkRoute);
          showToast('Playing back walking GPS movement towards Computing Block');
        }
        break;

      case 'scenario_mbu_indoor_floor':
        await handleSwitchCampus('mbu-tirupati');
        const socBld = buildings.find(b => b.id === 'mbu-bld-computing') || buildings[0];
        setSelectedBuilding(socBld);
        setSelectedFloor(socBld.floors[3]); // Floor 3 Room 304
        setMainViewMode('3d_twin');
        showToast('Viewing 3D Exploded Twin: Floor 3 (Room 304 Robotics)');
        break;

      case 'scenario_wifi_qr_fallback':
        positioningService.triggerSimulatedWiFiScan('mbu-ind-f1-corridor-ctr');
        setTimeout(() => {
          setIsQRModalOpen(true);
        }, 1200);
        showToast('Estimated Floor 1 via Wi-Fi k-NN! Opening QR checkpoint verification...');
        break;

      case 'scenario_iittp_isolation':
        await handleSwitchCampus('iittp-permanent');
        const lhResults = searchService.search('Lecture Hall 1', 'iittp-permanent');
        if (lhResults[0]) {
          planRouteToNode(lhResults[0].targetNodeId, 'walk');
          showToast('Isolated IITTP package: Routing from Yerpedu gate to LH-1');
        }
        break;

      case 'scenario_cors_rtk':
        setIsCORSModalOpen(true);
        break;
    }
  };

  return (
    <AndroidFrame
      isFrameEnabled={isFrameEnabled}
      onToggleFrame={() => setIsFrameEnabled(!isFrameEnabled)}
      isOffline={isOffline}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Top Header */}
        <Header
          currentCampus={currentCampus}
          isOffline={isOffline}
          activeMainView={mainViewMode}
          onToggleMainView={setMainViewMode}
          onOpenCampusSwitcher={() => setIsCampusModalOpen(true)}
          onOpenDemoLab={() => setIsDemoLabOpen(true)}
          onOpenCORSComparison={() => setIsCORSModalOpen(true)}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onOpenJudgingGuide={() => setIsJudgingModalOpen(true)}
          onOpenAdmin={() => setIsAdminModalOpen(true)}
        />

        {/* Floating Natural Language Search Bar */}
        {!activeRoute && !isIndoorFloorPlanOpen && (
          <SearchOverlay
            campusId={activeCampusId}
            onSelectResult={handleSelectSearchResult}
            onStartRoute={handleStartRouteFromSearch}
          />
        )}

        {/* Main Spatial View: 3D Digital Twin or 2D Map or 2D Vector Floor Plan */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          {isIndoorFloorPlanOpen && selectedBuilding && selectedFloor ? (
            <IndoorFloorPlan
              building={selectedBuilding}
              floor={selectedFloor}
              currentEstimate={currentEstimate}
              selectedRoom={selectedRoom}
              onSelectRoom={rm => {
                setSelectedRoom(rm);
                planRouteToNode(rm.graphNodeId);
              }}
              activePathNodes={activeRoute?.nodes || []}
            />
          ) : mainViewMode === '3d_twin' ? (
            <CampusDigitalTwin3D
              campus={currentCampus}
              buildings={buildings}
              pois={pois}
              selectedBuilding={selectedBuilding}
              selectedFloor={selectedFloor}
              selectedRoom={selectedRoom}
              activeRoute={activeRoute}
              currentEstimate={currentEstimate}
              onSelectBuilding={bld => {
                setSelectedBuilding(bld);
                setSelectedFloor(bld.floors[0] || null);
                showToast(`Selected 3D Twin: ${bld.name}`);
              }}
              onSelectFloor={fl => setSelectedFloor(fl)}
              onSelectRoom={rm => {
                setSelectedRoom(rm);
                planRouteToNode(rm.graphNodeId);
              }}
              onSelectPoi={poi => {
                const targetNode = poi.outdoorNodeId || poi.indoorNodeId;
                if (targetNode) {
                  planRouteToNode(targetNode);
                  showToast(`Selected ${poi.name}`);
                }
              }}
              onEnterAR={() => setIsCameraAROpen(true)}
            />
          ) : (
            <CampusMap
              campus={currentCampus}
              buildings={buildings}
              pois={pois}
              currentEstimate={currentEstimate}
              activeRoute={activeRoute}
              selectedBuilding={selectedBuilding}
              onSelectBuilding={bld => {
                setSelectedBuilding(bld);
                setSelectedFloor(bld.floors[0] || null);
                showToast(`Inspecting ${bld.name}`);
              }}
              onSelectPoi={poi => {
                const targetNode = poi.outdoorNodeId || poi.indoorNodeId;
                if (targetNode) {
                  planRouteToNode(targetNode);
                  showToast(`Selected ${poi.name}`);
                }
              }}
              onRecenter={() => showToast('Centered on user position')}
              isIndoorMode={isIndoorFloorPlanOpen}
              onToggleIndoor={() => setIsIndoorFloorPlanOpen(!isIndoorFloorPlanOpen)}
            />
          )}

          {/* Floor Switcher Widget (When viewing indoor layout) */}
          {isIndoorFloorPlanOpen && selectedBuilding && (
            <div
              style={{
                position: 'absolute',
                right: 14,
                top: 70,
                backgroundColor: '#FFFFFF',
                borderRadius: 24,
                boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
                padding: '6px 4px',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                zIndex: 450,
                border: '1px solid #E5E7EB'
              }}
            >
              {selectedBuilding.floors.map(fl => {
                const isSelected = selectedFloor?.id === fl.id;
                return (
                  <button
                    key={fl.id}
                    onClick={() => setSelectedFloor(fl)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: isSelected ? '#168C83' : '#F7F7F2',
                      color: isSelected ? '#FFFFFF' : '#252A2B',
                      border: 'none',
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                    title={`Floor ${fl.floorNumber}: ${fl.name}`}
                  >
                    F{fl.floorNumber}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Turn-by-Turn Navigation Sheet (When route active) */}
        {activeRoute && (
          <NavigationSheet
            route={activeRoute}
            selectedMode={travelMode}
            onSelectMode={handleModeChange}
            isNavigating={isNavigating}
            onStartNavigation={handleStartNavigation}
            onStopNavigation={handleStopNavigation}
            onOpenQRScanner={() => setIsQRModalOpen(true)}
            currentEstimate={currentEstimate}
            onRecalculate={() => planRouteToNode(activeRoute.destinationNodeId)}
          />
        )}

        {/* Toast Notification Banner */}
        {toastMessage && (
          <div
            style={{
              position: 'absolute',
              top: 54,
              left: 16,
              right: 16,
              backgroundColor: '#1E2325',
              color: '#FFFFFF',
              borderRadius: 14,
              padding: '10px 16px',
              fontSize: 12,
              fontWeight: 600,
              zIndex: 1500,
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}
            className="animate-fadeIn"
          >
            {toastMessage}
          </div>
        )}

        {/* Modals */}
        <CampusSelectionModal
          isOpen={isCampusModalOpen}
          onClose={() => setIsCampusModalOpen(false)}
          activeCampusId={activeCampusId}
          onCampusChanged={handleSwitchCampus}
        />

        <QRScannerModal
          campusId={activeCampusId}
          isOpen={isQRModalOpen}
          onClose={() => setIsQRModalOpen(false)}
          onSuccess={msg => showToast(msg)}
        />

        <CameraAROverlay
          campusId={activeCampusId}
          activeRoute={activeRoute}
          isOpen={isCameraAROpen}
          onClose={() => setIsCameraAROpen(false)}
          onScanQR={() => {
            setIsCameraAROpen(false);
            setIsQRModalOpen(true);
          }}
        />

        <CORSComparisonModal
          campusId={activeCampusId}
          isOpen={isCORSModalOpen}
          onClose={() => setIsCORSModalOpen(false)}
          centerLat={currentCampus.location.lat}
          centerLng={currentCampus.location.lng}
        />

        <DemoControlPanel
          campusId={activeCampusId}
          isOpen={isDemoLabOpen}
          onClose={() => setIsDemoLabOpen(false)}
          currentEstimate={currentEstimate}
          onTriggerWiFiScan={() => {
            positioningService.triggerSimulatedWiFiScan();
            showToast('Simulated Wi-Fi scan completed with k-NN matching!');
          }}
          onOpenQRScanner={() => setIsQRModalOpen(true)}
        />

        <JudgingScenariosModal
          isOpen={isJudgingModalOpen}
          onClose={() => setIsJudgingModalOpen(false)}
          campusId={activeCampusId}
          onRunScenario={handleRunJudgingScenario}
        />

        <AdminContentManagementModal
          campus={currentCampus}
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          onRefreshData={() => loadCampusData(activeCampusId)}
        />

        <SettingsModal
          campus={currentCampus}
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          isOffline={isOffline}
          onToggleOffline={async enabled => {
            await packageManager.setAirplaneMode(enabled);
            setIsOffline(enabled);
            showToast(enabled ? 'Airplane Mode ENABLED (Offline operation verified)' : 'Airplane Mode DISABLED');
          }}
        />
      </div>
    </AndroidFrame>
  );
};

export default App;
