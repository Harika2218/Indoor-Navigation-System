import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Campus, Building, Floor, Room, POI } from '../../types/campus';
import { RouteResult, NavigationNode } from '../../types/navigation';
import { PositioningEstimate } from '../../types/positioning';
import { ProvenanceBadge } from '../common/ProvenanceBadge';
import { 
  Box, 
  Layers, 
  Eye, 
  Maximize2, 
  Rotate3d, 
  Sparkles, 
  Sliders, 
  ChevronUp, 
  ChevronDown, 
  Navigation,
  Compass,
  Footprints
} from 'lucide-react';

interface CampusDigitalTwin3DProps {
  campus: Campus;
  buildings: Building[];
  pois: POI[];
  selectedBuilding: Building | null;
  selectedFloor: Floor | null;
  selectedRoom: Room | null;
  activeRoute: RouteResult | null;
  currentEstimate: PositioningEstimate | null;
  onSelectBuilding: (building: Building) => void;
  onSelectFloor: (floor: Floor) => void;
  onSelectRoom: (room: Room) => void;
  onSelectPoi: (poi: POI) => void;
  onEnterAR: () => void;
}

export const CampusDigitalTwin3D: React.FC<CampusDigitalTwin3DProps> = ({
  campus,
  buildings,
  pois,
  selectedBuilding,
  selectedFloor,
  selectedRoom,
  activeRoute,
  currentEstimate,
  onSelectBuilding,
  onSelectFloor,
  onSelectRoom,
  onSelectPoi,
  onEnterAR
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // 3D Scene Controls
  const [viewMode, setViewMode] = useState<'campus' | 'building_exploded'>('campus');
  const [floorSeparation, setFloorSeparation] = useState<number>(14); // Exploded floor offset in meters
  const [wireframeMode, setWireframeMode] = useState<boolean>(false);
  const [splatMode, setSplatMode] = useState<boolean>(false);

  // Meshes & Objects dictionary for raycasting
  const buildingMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const floorGroupRef = useRef<THREE.Group | null>(null);
  const routeLineRef = useRef<THREE.Line | null>(null);
  const userMarker3DRef = useRef<THREE.Group | null>(null);

  // Orbit rotation state
  const isDraggingRef = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const cameraTargetRef = useRef(new THREE.Vector3(0, 5, 0));
  const sphericalRef = useRef({ radius: 120, theta: Math.PI / 4, phi: Math.PI / 3.2 });

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#F0F2EE'); // Warm off-white
    scene.fog = new THREE.FogExp2('#F0F2EE', 0.0035);
    sceneRef.current = scene;

    // 2. Camera Setup
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 1000);
    cameraRef.current = camera;
    updateCameraPosition();

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // 4. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x99DFC8, 0.6);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(50, 100, 50);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    // 5. Ground Plane & Grid
    const groundGeo = new THREE.PlaneGeometry(350, 350);
    const groundMat = new THREE.MeshStandardMaterial({
      color: '#E8ECE6',
      roughness: 0.9,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const grid = new THREE.GridHelper(300, 30, '#168C83', '#CBD5E1');
    grid.position.y = 0.05;
    scene.add(grid);

    // 6. User Marker in 3D
    const userMarkerGroup = new THREE.Group();
    const pinGeo = new THREE.SphereGeometry(2, 16, 16);
    const pinMat = new THREE.MeshBasicMaterial({ color: '#168C83' });
    const pinMesh = new THREE.Mesh(pinGeo, pinMat);
    userMarkerGroup.add(pinMesh);

    const ringGeo = new THREE.RingGeometry(2.5, 3.5, 24);
    const ringMat = new THREE.MeshBasicMaterial({ color: '#168C83', side: THREE.DoubleSide });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = -1.8;
    userMarkerGroup.add(ringMesh);
    userMarkerGroup.position.set(0, 2.5, 40);
    scene.add(userMarkerGroup);
    userMarker3DRef.current = userMarkerGroup;

    // 7. Render Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Gentle floating animation for user pin
      if (userMarker3DRef.current) {
        userMarker3DRef.current.position.y = 2.5 + Math.sin(Date.now() * 0.003) * 0.4;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, [campus.id]);

  const updateCameraPosition = () => {
    if (!cameraRef.current) return;
    const s = sphericalRef.current;
    const target = cameraTargetRef.current;

    cameraRef.current.position.x = target.x + s.radius * Math.sin(s.phi) * Math.sin(s.theta);
    cameraRef.current.position.y = target.y + s.radius * Math.cos(s.phi);
    cameraRef.current.position.z = target.z + s.radius * Math.sin(s.phi) * Math.cos(s.theta);
    cameraRef.current.lookAt(target);
  };

  // Rebuild 3D Campus Buildings or Exploded Floor Stack
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Clear previous building meshes
    buildingMeshesRef.current.forEach(mesh => scene.remove(mesh));
    buildingMeshesRef.current.clear();

    if (floorGroupRef.current) {
      scene.remove(floorGroupRef.current);
      floorGroupRef.current = null;
    }

    if (viewMode === 'campus') {
      // CAMPUS OVERVIEW MODE: 3D Architectural Masses for all buildings
      buildings.forEach(bld => {
        const [w, h, d] = bld.dimensions3D || [30, 16, 24];
        const [x, y, z] = bld.position3D || [0, 0, 0];
        const isSelected = selectedBuilding?.id === bld.id;

        const geo = new THREE.BoxGeometry(w, h, d);
        const mat = new THREE.MeshStandardMaterial({
          color: isSelected ? '#168C83' : bld.color3D || '#64748B',
          wireframe: wireframeMode,
          roughness: 0.4,
          metalness: 0.15,
          transparent: true,
          opacity: isSelected ? 0.92 : 0.82
        });

        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, h / 2, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData = { buildingId: bld.id };

        // Roof Accent Crown
        const roofGeo = new THREE.BoxGeometry(w + 1.5, 1, d + 1.5);
        const roofMat = new THREE.MeshStandardMaterial({ color: isSelected ? '#116F68' : '#334155' });
        const roof = new THREE.Mesh(roofGeo, roofMat);
        roof.position.y = h / 2 + 0.5;
        mesh.add(roof);

        // Entrance Portico Marker
        const porticoGeo = new THREE.BoxGeometry(8, 5, 4);
        const porticoMat = new THREE.MeshStandardMaterial({ color: '#DDF3EC' });
        const portico = new THREE.Mesh(porticoGeo, porticoMat);
        portico.position.set(0, -h / 2 + 2.5, d / 2 + 2);
        mesh.add(portico);

        scene.add(mesh);
        buildingMeshesRef.current.set(bld.id, mesh);
      });
    } else if (viewMode === 'building_exploded' && selectedBuilding) {
      // EXPLODED MULTI-FLOOR 3D DIGITAL TWIN
      const bldGroup = new THREE.Group();
      const [bx, by, bz] = selectedBuilding.position3D || [0, 0, 0];
      bldGroup.position.set(bx, 0, bz);

      // Render vertical glass outer curtain shell
      const totalH = selectedBuilding.floors.length * (floorSeparation + 4);
      const glassGeo = new THREE.BoxGeometry(45, totalH, 35);
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: '#E0F2FE',
        transparent: true,
        opacity: 0.15,
        roughness: 0.1,
        transmission: 0.8
      });
      const glassShell = new THREE.Mesh(glassGeo, glassMat);
      glassShell.position.set(0, totalH / 2, 0);
      bldGroup.add(glassShell);

      // Render Vertical Connector Shafts (Elevator & Stairs)
      const liftShaftGeo = new THREE.BoxGeometry(6, totalH, 6);
      const liftShaftMat = new THREE.MeshStandardMaterial({
        color: '#0284C7',
        transparent: true,
        opacity: 0.5,
        wireframe: true
      });
      const liftShaft = new THREE.Mesh(liftShaftGeo, liftShaftMat);
      liftShaft.position.set(4, totalH / 2, 0);
      bldGroup.add(liftShaft);

      // Render each individual floor slab with rooms
      selectedBuilding.floors.forEach((floor, flIdx) => {
        const floorY = flIdx * floorSeparation + 2;
        const isFloorActive = selectedFloor?.id === floor.id;

        // Floor Slab Base
        const slabGeo = new THREE.BoxGeometry(40, 1.2, 30);
        const slabMat = new THREE.MeshStandardMaterial({
          color: isFloorActive ? '#DDF3EC' : '#F1F5F9',
          roughness: 0.5
        });
        const slab = new THREE.Mesh(slabGeo, slabMat);
        slab.position.set(0, floorY, 0);

        // Rooms on this floor
        floor.rooms.forEach(room => {
          const isRoomSelected = selectedRoom?.id === room.id;
          const [rx, ry, rz] = room.position3D || [0, 0, 0];

          const roomGeo = new THREE.BoxGeometry(10, 4, 8);
          const roomMat = new THREE.MeshStandardMaterial({
            color: isRoomSelected ? '#168C83' : room.category === 'washroom' ? '#38BDF8' : '#CBD5E1',
            roughness: 0.3
          });
          const roomMesh = new THREE.Mesh(roomGeo, roomMat);
          roomMesh.position.set(rx, 2.5, rz);
          slab.add(roomMesh);
        });

        bldGroup.add(slab);
      });

      scene.add(bldGroup);
      floorGroupRef.current = bldGroup;
    }
  }, [buildings, selectedBuilding, selectedFloor, selectedRoom, viewMode, floorSeparation, wireframeMode]);

  // Render 3D Route Polyline
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (routeLineRef.current) {
      scene.remove(routeLineRef.current);
      routeLineRef.current = null;
    }

    if (!activeRoute) return;

    // Convert route nodes into 3D points
    const points: THREE.Vector3[] = [];
    activeRoute.nodes.forEach(node => {
      if (node.lat !== undefined && node.lng !== undefined) {
        // Map geo coords to scene center offset
        const dx = (node.lng - campus.location.lng) * 111000 * Math.cos((campus.location.lat * Math.PI) / 180) * 0.4;
        const dz = -(node.lat - campus.location.lat) * 111000 * 0.4;
        points.push(new THREE.Vector3(dx, 1.2, dz));
      } else if (node.buildingId && node.floorNumber !== undefined) {
        // Multi-floor indoor 3D point
        const bld = buildings.find(b => b.id === node.buildingId);
        const [bx, by, bz] = bld?.position3D || [0, 0, 0];
        const flY = viewMode === 'building_exploded' ? node.floorNumber * floorSeparation + 3 : node.floorNumber * 4 + 2;
        points.push(new THREE.Vector3(bx + ((node.x || 50) - 50) * 0.5, flY, bz + ((node.y || 50) - 50) * 0.4));
      }
    });

    if (points.length > 1) {
      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.8, 8, false);
      const tubeMat = new THREE.MeshBasicMaterial({ color: '#168C83' });
      const routeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      scene.add(routeMesh);
      routeLineRef.current = routeMesh as any;
    }
  }, [activeRoute, viewMode, floorSeparation]);

  // Pointer Drag Orbit Controls
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;

    sphericalRef.current.theta -= deltaX * 0.008;
    sphericalRef.current.phi = Math.max(0.2, Math.min(Math.PI / 2.05, sphericalRef.current.phi - deltaY * 0.008));

    previousMousePosition.current = { x: e.clientX, y: e.clientY };
    updateCameraPosition();
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    sphericalRef.current.radius = Math.max(25, Math.min(220, sphericalRef.current.radius + e.deltaY * 0.12));
    updateCameraPosition();
  };

  // Zoom to building or reset view
  const focusOnBuilding = (bld: Building) => {
    onSelectBuilding(bld);
    const [bx, by, bz] = bld.position3D || [0, 0, 0];
    cameraTargetRef.current.set(bx, 10, bz);
    sphericalRef.current.radius = 65;
    updateCameraPosition();
  };

  const resetCampusView = () => {
    setViewMode('campus');
    cameraTargetRef.current.set(0, 5, 0);
    sphericalRef.current = { radius: 120, theta: Math.PI / 4, phi: Math.PI / 3.2 };
    updateCameraPosition();
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#F0F2EE',
        overflow: 'hidden',
        userSelect: 'none'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* Top 3D Control Ribbon */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: 14,
          right: 14,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'none',
          zIndex: 400
        }}
      >
        {/* Mode Selector Pill */}
        <div
          style={{
            display: 'flex',
            gap: 6,
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(8px)',
            padding: '4px 6px',
            borderRadius: 20,
            border: '1px solid #D1D5DB',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            pointerEvents: 'auto'
          }}
        >
          <button
            onClick={resetCampusView}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '6px 12px',
              borderRadius: 16,
              border: 'none',
              backgroundColor: viewMode === 'campus' ? '#168C83' : 'transparent',
              color: viewMode === 'campus' ? '#FFFFFF' : '#374151',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Box size={14} />
            <span>Campus 3D</span>
          </button>

          {selectedBuilding && (
            <button
              onClick={() => setViewMode('building_exploded')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '6px 12px',
                borderRadius: 16,
                border: 'none',
                backgroundColor: viewMode === 'building_exploded' ? '#168C83' : 'transparent',
                color: viewMode === 'building_exploded' ? '#FFFFFF' : '#374151',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Layers size={14} />
              <span>Exploded Twin</span>
            </button>
          )}
        </div>

        {/* Camera AR Guidance Launch Button */}
        <button
          onClick={onEnterAR}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            backgroundColor: '#168C83',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 20,
            padding: '7px 14px',
            fontSize: 11,
            fontWeight: 800,
            boxShadow: '0 4px 14px rgba(22, 140, 131, 0.35)',
            cursor: 'pointer',
            pointerEvents: 'auto'
          }}
          title="Launch Live Camera AR Wayfinding Overlay"
        >
          <Compass size={15} />
          <span>Camera AR</span>
        </button>
      </div>

      {/* Floating 3D Controls Bar */}
      <div
        style={{
          position: 'absolute',
          right: 14,
          top: 68,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          zIndex: 400
        }}
      >
        <button
          onClick={() => setWireframeMode(!wireframeMode)}
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            backgroundColor: wireframeMode ? '#168C83' : '#FFFFFF',
            color: wireframeMode ? '#FFFFFF' : '#252A2B',
            border: '1px solid #D1D5DB',
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          title="Toggle Wireframe BIM Mesh"
        >
          <Rotate3d size={18} />
        </button>

        <button
          onClick={() => setSplatMode(!splatMode)}
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            backgroundColor: splatMode ? '#D97706' : '#FFFFFF',
            color: splatMode ? '#FFFFFF' : '#252A2B',
            border: '1px solid #D1D5DB',
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          title="Toggle Gaussian Splatting Simulation"
        >
          <Sparkles size={18} />
        </button>
      </div>

      {/* Exploded Floor Separation Slider (When viewing interior exploded twin) */}
      {viewMode === 'building_exploded' && (
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(8px)',
            borderRadius: 20,
            padding: '8px 16px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            border: '1px solid #E5E7EB',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            zIndex: 400
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 700, color: '#374151' }}>
            Floor Separation: {floorSeparation}m
          </span>
          <input
            type="range"
            min="6"
            max="26"
            step="2"
            value={floorSeparation}
            onChange={e => setFloorSeparation(Number(e.target.value))}
            style={{ width: 110 }}
          />
        </div>
      )}

      {/* Interactive Quick Building Selector Pills (Bottom Left) */}
      <div
        style={{
          position: 'absolute',
          bottom: 16,
          left: 14,
          display: 'flex',
          gap: 6,
          overflowX: 'auto',
          maxWidth: '80%',
          paddingBottom: 4,
          zIndex: 400
        }}
      >
        {buildings.slice(0, 4).map(bld => {
          const isSelected = selectedBuilding?.id === bld.id;
          return (
            <button
              key={bld.id}
              onClick={() => focusOnBuilding(bld)}
              style={{
                backgroundColor: isSelected ? '#168C83' : 'rgba(255, 255, 255, 0.92)',
                color: isSelected ? '#FFFFFF' : '#252A2B',
                border: isSelected ? 'none' : '1px solid #D1D5DB',
                borderRadius: 14,
                padding: '6px 10px',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}
            >
              {bld.code}: {bld.name.split(' ')[0]}
            </button>
          );
        })}
      </div>
    </div>
  );
};
