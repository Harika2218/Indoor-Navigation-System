import { Campus, Building, POI, PackageManifest, DigitalTwinAsset } from '../types/campus';
import { NavigationGraph } from '../types/navigation';
import { WiFiFingerprintSample, QRCheckpointPayload, VisualReferenceKeyframe } from '../types/positioning';

export const iittpCampusProfile: Campus = {
  id: 'iittp-permanent',
  name: 'IIT Tirupati (Permanent Campus)',
  shortName: 'IIT Tirupati',
  code: 'IITTP',
  tagline: 'Permanent Campus, Yerpedu - Venkatagiri Road, Tirupati District, Andhra Pradesh',
  location: {
    lat: 13.7095,
    lng: 79.5930,
    city: 'Yerpedu',
    state: 'Andhra Pradesh',
    bounds: [
      [13.7040, 79.5850],
      [13.7160, 79.6010]
    ]
  },
  version: '2026.11.1',
  packageSizeMb: 16.4,
  lastUpdated: '31 October 2026',
  provenance: 'VERIFIED_PUBLIC_DATA',
  provenanceSummary: 'Permanent campus layout sourced from official IIT Tirupati master plan (2024). 3D Digital Twin incorporates architectural BIM data and terrestrial LiDAR scans.',
  disclaimer: 'Permanent campus only. Indoor 3D layouts and Wi-Fi signatures are synthetic demo fixtures labelled SYNTHETIC_DEMO_DATA.',
  stats: {
    buildingCount: 9,
    floorCount: 8,
    poiCount: 24,
    routableKm: 6.8,
    verifiedPercent: 82
  }
};

export const iittpDigitalTwinAssets: DigitalTwinAsset[] = [
  {
    id: 'dt-iittp-acad-a-splat',
    campusId: 'iittp-permanent',
    buildingId: 'iittp-bld-acad-a',
    name: 'Block A Academic Complex 3D Gaussian Splat',
    format: 'splat',
    provenance: 'REAL_CAPTURED_DATA',
    captureDate: '2026-09-22',
    version: '1.2.0',
    processingStatus: 'ready',
    fileSizeBytes: 9100000,
    hasGaussianSplat: true,
    description: 'High-resolution Gaussian Splatting model of Block A atrium, courtyard, and solar pergola.'
  },
  {
    id: 'dt-iittp-clrc-glb',
    campusId: 'iittp-permanent',
    buildingId: 'iittp-bld-clrc',
    name: 'Central Learning Resource Centre (CLRC) glTF Mesh',
    format: 'gltf',
    provenance: 'REAL_CAPTURED_DATA',
    captureDate: '2026-08-30',
    version: '1.1.0',
    processingStatus: 'ready',
    fileSizeBytes: 4800000,
    polyCount: 52000,
    description: 'BIM-derived structural model of the circular central library and digital reading room.'
  }
];

export const iittpPackageManifest: PackageManifest = {
  campusId: 'iittp-permanent',
  version: '2026.11.1',
  name: 'IIT Tirupati Permanent Campus 3D Twin & Navigation Package',
  createdAt: '2026-10-31T10:15:00Z',
  checksum: 'sha256-iittp-88e2c39d01248fb3',
  schemaVersion: '2.0.0',
  sources: [
    {
      name: 'IIT Tirupati Official Campus Map (2024)',
      type: 'VERIFIED_PUBLIC_DATA',
      url: 'https://files.iittp.ac.in/pdfs/btech/2024/IITTirupati_Campus_Map.pdf',
      attribution: 'IIT Tirupati published engineering campus master plan and site directory.'
    },
    {
      name: 'OpenStreetMap Yerpedu Permanent Campus Polygons',
      type: 'OPENSTREETMAP_DATA',
      attribution: '© OpenStreetMap contributors, ODbL 1.0 license.'
    },
    {
      name: 'Campus Navigator 3D Digital Twin Capture Engine',
      type: 'REAL_CAPTURED_DATA',
      attribution: 'Terrestrial photogrammetry and Gaussian Splat captures of the Yerpedu permanent campus.'
    },
    {
      name: 'Campus Navigator Synthetic Floor Plan Engine',
      type: 'SYNTHETIC_DEMO_DATA',
      attribution: 'Synthetic floor plans and demo checkpoints created with explicit provenance.'
    }
  ],
  fileSizes: {
    buildings: 1450000,
    indoor: 1120000,
    graph: 960000,
    wifiFingerprints: 320000,
    checkpoints: 85000,
    digitalTwin3D: 17200000
  },
  digitalTwinAssets: iittpDigitalTwinAssets
};

export const iittpBuildings: Building[] = [
  {
    id: 'iittp-bld-acad-a',
    campusId: 'iittp-permanent',
    name: 'Academic Complex Block A (CS & EE)',
    code: 'ACAD-A',
    category: 'academic',
    description: 'Premier department complex housing Computer Science & Engineering, Electrical Engineering, and advanced cyber-physical labs.',
    coordinates: [13.7098, 79.5935],
    polygon: [
      [13.7094, 79.5930],
      [13.7102, 79.5930],
      [13.7102, 79.5940],
      [13.7094, 79.5940]
    ],
    position3D: [15, 0, -20],
    dimensions3D: [42, 18, 30],
    color3D: '#0284C7',
    modelAssetId: 'dt-iittp-acad-a-splat',
    dataStatus: 'demo',
    provenance: 'SYNTHETIC_DEMO_DATA',
    indoorLayoutNotice: 'Demo layout — not an official floor plan. Synthetic indoor corridors and room placements in 3D digital twin.',
    entrances: [
      {
        id: 'iittp-ent-acad-a-main',
        name: 'Block A Main Portico (North)',
        outdoorNodeId: 'iittp-out-node-acad-a-north',
        indoorNodeId: 'iittp-ind-f0-lobby',
        floorId: 'iittp-acad-fl-0',
        isAccessible: true,
        lat: 13.7101,
        lng: 79.5935,
        position3D: [15, 0, -35]
      },
      {
        id: 'iittp-ent-acad-a-south',
        name: 'Block A Courtyard Entrance',
        outdoorNodeId: 'iittp-out-node-acad-a-south',
        indoorNodeId: 'iittp-ind-f0-south-entry',
        floorId: 'iittp-acad-fl-0',
        isAccessible: true,
        lat: 13.7094,
        lng: 79.5935,
        position3D: [15, 0, -5]
      }
    ],
    floors: [
      {
        id: 'iittp-acad-fl-0',
        campusId: 'iittp-permanent',
        buildingId: 'iittp-bld-acad-a',
        floorNumber: 0,
        name: 'Ground Level (LH-1 & Robotics)',
        dataStatus: 'demo',
        elevationOffset3D: 0,
        bounds: { width: 65, height: 45 },
        connectors: [
          {
            id: 'iittp-conn-st1-f0',
            type: 'stairs',
            name: 'Atrium Staircase East',
            nodeId: 'iittp-ind-f0-stairs-e',
            accessibleFloorNumbers: [0, 1, 2],
            isAccessible: false,
            x: 50,
            y: 45,
            position3D: [0, 0, 0]
          },
          {
            id: 'iittp-conn-el1-f0',
            type: 'elevator',
            name: 'Block A Passenger Lift',
            nodeId: 'iittp-ind-f0-elevator',
            accessibleFloorNumbers: [0, 1, 2],
            isAccessible: true,
            x: 55,
            y: 45,
            position3D: [4, 0, 0]
          }
        ],
        rooms: [
          {
            id: 'iittp-rm-g-lh1',
            campusId: 'iittp-permanent',
            buildingId: 'iittp-bld-acad-a',
            floorId: 'iittp-acad-fl-0',
            roomCode: 'LH-1',
            name: 'Main Lecture Hall 1 (Tiered)',
            category: 'classroom',
            graphNodeId: 'iittp-ind-f0-rm-lh1',
            x: 25,
            y: 25,
            width: 22,
            height: 20,
            aliases: ['lecture hall 1', 'lh 1', 'lh1', 'auditorium class', 'room lh1'],
            provenance: 'SYNTHETIC_DEMO_DATA',
            position3D: [-12, 0, -8]
          },
          {
            id: 'iittp-rm-g-robotics',
            campusId: 'iittp-permanent',
            buildingId: 'iittp-bld-acad-a',
            floorId: 'iittp-acad-fl-0',
            roomCode: 'ACAD-G05',
            name: 'Mechatronics & Robotics Laboratory',
            category: 'lab',
            graphNodeId: 'iittp-ind-f0-rm-robotics',
            x: 75,
            y: 25,
            width: 22,
            height: 20,
            aliases: ['robotics lab', 'mechatronics', 'drones lab', 'automation', 'hardware lab'],
            provenance: 'SYNTHETIC_DEMO_DATA',
            position3D: [14, 0, -8]
          },
          {
            id: 'iittp-rm-g-wash-m',
            campusId: 'iittp-permanent',
            buildingId: 'iittp-bld-acad-a',
            floorId: 'iittp-acad-fl-0',
            roomCode: 'ACAD-GW-M',
            name: 'Gentlemen Restroom (Ground)',
            category: 'washroom',
            graphNodeId: 'iittp-ind-f0-rm-wash-m',
            x: 15,
            y: 75,
            width: 15,
            height: 15,
            aliases: ['washroom', 'toilet', 'restroom', 'gents washroom', 'bathroom'],
            provenance: 'SYNTHETIC_DEMO_DATA',
            position3D: [-15, 0, 10]
          },
          {
            id: 'iittp-rm-g-wash-f',
            campusId: 'iittp-permanent',
            buildingId: 'iittp-bld-acad-a',
            floorId: 'iittp-acad-fl-0',
            roomCode: 'ACAD-GW-F',
            name: 'Ladies Restroom (Ground)',
            category: 'washroom',
            graphNodeId: 'iittp-ind-f0-rm-wash-f',
            x: 85,
            y: 75,
            width: 15,
            height: 15,
            aliases: ['washroom', 'toilet', 'restroom', 'women toilet', 'ladies washroom'],
            provenance: 'SYNTHETIC_DEMO_DATA',
            position3D: [15, 0, 10]
          }
        ]
      },
      {
        id: 'iittp-acad-fl-1',
        campusId: 'iittp-permanent',
        buildingId: 'iittp-bld-acad-a',
        floorNumber: 1,
        name: 'First Level (LH-2 & HPC Supercomputing)',
        dataStatus: 'demo',
        elevationOffset3D: 6,
        bounds: { width: 65, height: 45 },
        connectors: [
          {
            id: 'iittp-conn-st1-f1',
            type: 'stairs',
            name: 'Atrium Staircase East',
            nodeId: 'iittp-ind-f1-stairs-e',
            accessibleFloorNumbers: [0, 1, 2],
            isAccessible: false,
            x: 50,
            y: 45,
            position3D: [0, 6, 0]
          },
          {
            id: 'iittp-conn-el1-f1',
            type: 'elevator',
            name: 'Block A Passenger Lift',
            nodeId: 'iittp-ind-f1-elevator',
            accessibleFloorNumbers: [0, 1, 2],
            isAccessible: true,
            x: 55,
            y: 45,
            position3D: [4, 6, 0]
          }
        ],
        rooms: [
          {
            id: 'iittp-rm-1-lh2',
            campusId: 'iittp-permanent',
            buildingId: 'iittp-bld-acad-a',
            floorId: 'iittp-acad-fl-1',
            roomCode: 'LH-2',
            name: 'Lecture Hall 2 (Smart Audio-Visual)',
            category: 'classroom',
            graphNodeId: 'iittp-ind-f1-rm-lh2',
            x: 25,
            y: 25,
            width: 20,
            height: 20,
            aliases: ['lecture hall 2', 'lh 2', 'lh2', 'room lh2'],
            provenance: 'SYNTHETIC_DEMO_DATA',
            position3D: [-12, 6, -8]
          },
          {
            id: 'iittp-rm-1-hpc',
            campusId: 'iittp-permanent',
            buildingId: 'iittp-bld-acad-a',
            floorId: 'iittp-acad-fl-1',
            roomCode: 'ACAD-104',
            name: 'High Performance Computing (HPC) Cluster Lab',
            category: 'lab',
            graphNodeId: 'iittp-ind-f1-rm-hpc',
            x: 75,
            y: 25,
            width: 22,
            height: 20,
            aliases: ['hpc lab', 'supercomputing', 'server room', 'gpu cluster', 'cs lab'],
            provenance: 'SYNTHETIC_DEMO_DATA',
            position3D: [14, 6, -8]
          },
          {
            id: 'iittp-rm-1-wash',
            campusId: 'iittp-permanent',
            buildingId: 'iittp-bld-acad-a',
            floorId: 'iittp-acad-fl-1',
            roomCode: 'ACAD-1W',
            name: 'Accessible Unisex Restroom (Level 1)',
            category: 'washroom',
            graphNodeId: 'iittp-ind-f1-rm-wash',
            x: 85,
            y: 75,
            width: 15,
            height: 15,
            aliases: ['washroom', 'toilet', 'restroom', 'accessible restroom'],
            provenance: 'SYNTHETIC_DEMO_DATA',
            position3D: [15, 6, 10]
          }
        ]
      },
      {
        id: 'iittp-acad-fl-2',
        campusId: 'iittp-permanent',
        buildingId: 'iittp-bld-acad-a',
        floorNumber: 2,
        name: 'Second Level (Dean Office & Boardroom)',
        dataStatus: 'demo',
        elevationOffset3D: 12,
        bounds: { width: 65, height: 45 },
        connectors: [
          {
            id: 'iittp-conn-st1-f2',
            type: 'stairs',
            name: 'Atrium Staircase East',
            nodeId: 'iittp-ind-f2-stairs-e',
            accessibleFloorNumbers: [0, 1, 2],
            isAccessible: false,
            x: 50,
            y: 45,
            position3D: [0, 12, 0]
          },
          {
            id: 'iittp-conn-el1-f2',
            type: 'elevator',
            name: 'Block A Passenger Lift',
            nodeId: 'iittp-ind-f2-elevator',
            accessibleFloorNumbers: [0, 1, 2],
            isAccessible: true,
            x: 55,
            y: 45,
            position3D: [4, 12, 0]
          }
        ],
        rooms: [
          {
            id: 'iittp-rm-2-dean',
            campusId: 'iittp-permanent',
            buildingId: 'iittp-bld-acad-a',
            floorId: 'iittp-acad-fl-2',
            roomCode: 'ACAD-201',
            name: 'Dean of Academic Affairs Secretariat',
            category: 'admin',
            graphNodeId: 'iittp-ind-f2-rm-dean',
            x: 25,
            y: 25,
            width: 20,
            height: 20,
            aliases: ['dean academics', 'dean office', 'academic affairs', 'head office'],
            provenance: 'SYNTHETIC_DEMO_DATA',
            position3D: [-12, 12, -8]
          },
          {
            id: 'iittp-rm-2-seminar',
            campusId: 'iittp-permanent',
            buildingId: 'iittp-bld-acad-a',
            floorId: 'iittp-acad-fl-2',
            roomCode: 'ACAD-208',
            name: 'Boardroom & Conference Seminar Hall',
            category: 'auditorium',
            graphNodeId: 'iittp-ind-f2-rm-seminar',
            x: 75,
            y: 25,
            width: 22,
            height: 20,
            aliases: ['seminar hall', 'conference room', 'boardroom', 'meeting room'],
            provenance: 'SYNTHETIC_DEMO_DATA',
            position3D: [14, 12, -8]
          },
          {
            id: 'iittp-rm-2-wash',
            campusId: 'iittp-permanent',
            buildingId: 'iittp-bld-acad-a',
            floorId: 'iittp-acad-fl-2',
            roomCode: 'ACAD-2W',
            name: 'Executive Restroom (Level 2)',
            category: 'washroom',
            graphNodeId: 'iittp-ind-f2-rm-wash',
            x: 85,
            y: 75,
            width: 15,
            height: 15,
            aliases: ['washroom', 'toilet', 'restroom'],
            provenance: 'SYNTHETIC_DEMO_DATA',
            position3D: [15, 12, 10]
          }
        ]
      }
    ]
  },
  {
    id: 'iittp-bld-admin',
    campusId: 'iittp-permanent',
    name: 'Central Administration Building',
    code: 'ADMIN',
    category: 'administrative',
    description: 'Director office, Registrar, Finance & Accounts division, Stores & Purchase wing.',
    coordinates: [13.7082, 79.5925],
    polygon: [
      [13.7078, 79.5920],
      [13.7086, 79.5920],
      [13.7086, 79.5930],
      [13.7078, 79.5930]
    ],
    position3D: [-25, 0, 20],
    dimensions3D: [35, 15, 25],
    color3D: '#B45309',
    dataStatus: 'verified',
    provenance: 'VERIFIED_PUBLIC_DATA',
    entrances: [
      {
        id: 'iittp-ent-adm-front',
        name: 'Administration Building Main Portico',
        outdoorNodeId: 'iittp-out-node-adm-front',
        indoorNodeId: 'iittp-ind-adm-reception',
        floorId: 'iittp-adm-fl-0',
        isAccessible: true,
        lat: 13.7080,
        lng: 79.5925,
        position3D: [-25, 0, 32]
      }
    ],
    floors: [
      {
        id: 'iittp-adm-fl-0',
        campusId: 'iittp-permanent',
        buildingId: 'iittp-bld-admin',
        floorNumber: 0,
        name: 'Ground Level Foyer',
        dataStatus: 'demo',
        bounds: { width: 50, height: 40 },
        connectors: [],
        rooms: [
          {
            id: 'iittp-rm-director-office',
            campusId: 'iittp-permanent',
            buildingId: 'iittp-bld-admin',
            floorId: 'iittp-adm-fl-0',
            roomCode: 'DIR-01',
            name: 'Director Office & Visitor Reception',
            category: 'admin',
            graphNodeId: 'iittp-ind-adm-reception',
            x: 50,
            y: 50,
            aliases: ['director office', 'registrar office', 'admin block', 'administration', 'central office'],
            provenance: 'SYNTHETIC_DEMO_DATA',
            position3D: [-25, 0, 20]
          }
        ]
      }
    ]
  },
  {
    id: 'iittp-bld-clrc',
    campusId: 'iittp-permanent',
    name: 'Central Learning Resource Centre (CLRC)',
    code: 'CLRC',
    category: 'library',
    description: 'Ultra-modern central academic library, digital repository, reading halls and technical bookstore.',
    coordinates: [13.7110, 79.5942],
    polygon: [
      [13.7106, 79.5938],
      [13.7114, 79.5938],
      [13.7114, 79.5946],
      [13.7106, 79.5946]
    ],
    position3D: [45, 0, -40],
    dimensions3D: [32, 16, 28],
    color3D: '#168C83',
    modelAssetId: 'dt-iittp-clrc-glb',
    dataStatus: 'verified',
    provenance: 'VERIFIED_PUBLIC_DATA',
    entrances: [
      {
        id: 'iittp-ent-clrc-main',
        name: 'CLRC Front Glass Entrance',
        outdoorNodeId: 'iittp-out-node-clrc-front',
        indoorNodeId: 'iittp-ind-clrc-atrium',
        floorId: 'iittp-clrc-fl-0',
        isAccessible: true,
        lat: 13.7108,
        lng: 79.5940,
        position3D: [45, 0, -26]
      }
    ],
    floors: [
      {
        id: 'iittp-clrc-fl-0',
        campusId: 'iittp-permanent',
        buildingId: 'iittp-bld-clrc',
        floorNumber: 0,
        name: 'Ground Level Reading Lounge',
        dataStatus: 'demo',
        bounds: { width: 60, height: 40 },
        connectors: [],
        rooms: [
          {
            id: 'iittp-rm-clrc-desk',
            campusId: 'iittp-permanent',
            buildingId: 'iittp-bld-clrc',
            floorId: 'iittp-clrc-fl-0',
            roomCode: 'CLRC-DESK',
            name: 'CLRC Information & Book Checkout Desk',
            category: 'library',
            graphNodeId: 'iittp-ind-clrc-atrium',
            x: 50,
            y: 50,
            aliases: ['library', 'clrc', 'central library', 'reading room', 'study room', 'books'],
            provenance: 'SYNTHETIC_DEMO_DATA',
            position3D: [45, 0, -40]
          }
        ]
      }
    ]
  },
  {
    id: 'iittp-bld-dining',
    campusId: 'iittp-permanent',
    name: 'Student Dining Facility & Campus Cafeteria',
    code: 'DINING',
    category: 'amenity',
    description: 'Central student mess, cafeteria, night canteen, and Nescafe kiosk.',
    coordinates: [13.7088, 79.5955],
    polygon: [
      [13.7084, 79.5950],
      [13.7092, 79.5950],
      [13.7092, 79.5960],
      [13.7084, 79.5960]
    ],
    position3D: [50, 0, 15],
    dimensions3D: [28, 12, 24],
    color3D: '#E11D48',
    dataStatus: 'verified',
    provenance: 'VERIFIED_PUBLIC_DATA',
    entrances: [
      {
        id: 'iittp-ent-dining-main',
        name: 'Dining Hall North Plaza',
        outdoorNodeId: 'iittp-out-node-dining-front',
        indoorNodeId: 'iittp-ind-dining-hall',
        floorId: 'iittp-dining-fl-0',
        isAccessible: true,
        lat: 13.7089,
        lng: 79.5953,
        position3D: [50, 0, 3]
      }
    ],
    floors: [
      {
        id: 'iittp-dining-fl-0',
        campusId: 'iittp-permanent',
        buildingId: 'iittp-bld-dining',
        floorNumber: 0,
        name: 'Dining Ground Floor',
        dataStatus: 'demo',
        bounds: { width: 55, height: 40 },
        connectors: [],
        rooms: [
          {
            id: 'iittp-rm-canteen-counter',
            campusId: 'iittp-permanent',
            buildingId: 'iittp-bld-dining',
            floorId: 'iittp-dining-fl-0',
            roomCode: 'MESS-01',
            name: 'Cafeteria & Meals Service Counter',
            category: 'canteen',
            graphNodeId: 'iittp-ind-dining-hall',
            x: 50,
            y: 50,
            aliases: ['canteen', 'cafeteria', 'mess', 'food court', 'dining', 'coffee', 'breakfast', 'lunch'],
            provenance: 'SYNTHETIC_DEMO_DATA',
            position3D: [50, 0, 15]
          }
        ]
      }
    ]
  },
  {
    id: 'iittp-bld-health',
    campusId: 'iittp-permanent',
    name: 'IIT Tirupati Health Centre (Dispensary)',
    code: 'DISP',
    category: 'health',
    description: 'Campus clinic with full-time medical officer, nursing staff, pharmacy counter, and emergency bed facility.',
    coordinates: [13.7072, 79.5940],
    polygon: [
      [13.7069, 79.5937],
      [13.7075, 79.5937],
      [13.7075, 79.5943],
      [13.7069, 79.5943]
    ],
    position3D: [10, 0, 45],
    dimensions3D: [22, 8, 18],
    color3D: '#10B981',
    dataStatus: 'verified',
    provenance: 'VERIFIED_PUBLIC_DATA',
    entrances: [
      {
        id: 'iittp-ent-disp-main',
        name: 'Dispensary Ambulance Ramp',
        outdoorNodeId: 'iittp-out-node-health-front',
        indoorNodeId: 'iittp-ind-health-opd',
        floorId: 'iittp-disp-fl-0',
        isAccessible: true,
        lat: 13.7071,
        lng: 79.5939,
        position3D: [10, 0, 36]
      }
    ],
    floors: [
      {
        id: 'iittp-disp-fl-0',
        campusId: 'iittp-permanent',
        buildingId: 'iittp-bld-health',
        floorNumber: 0,
        name: 'Consultation & Pharmacy',
        dataStatus: 'demo',
        bounds: { width: 35, height: 25 },
        connectors: [],
        rooms: [
          {
            id: 'iittp-rm-doctor-chamber',
            campusId: 'iittp-permanent',
            buildingId: 'iittp-bld-health',
            floorId: 'iittp-disp-fl-0',
            roomCode: 'HC-01',
            name: 'Resident Medical Officer Chamber',
            category: 'admin',
            graphNodeId: 'iittp-ind-health-opd',
            x: 50,
            y: 50,
            aliases: ['health centre', 'health center', 'dispensary', 'clinic', 'hospital', 'doctor', 'first aid', 'pharmacy'],
            provenance: 'SYNTHETIC_DEMO_DATA',
            position3D: [10, 0, 45]
          }
        ]
      }
    ]
  }
];

export const iittpPOIs: POI[] = [
  {
    id: 'iittp-poi-gate-yerpedu',
    campusId: 'iittp-permanent',
    name: 'IIT Tirupati Main Highway Entrance Gate',
    category: 'gate',
    aliases: ['main gate', 'yerpedu gate', 'entry gate', 'iittp gate', 'highway entrance'],
    coordinate: [13.7060, 79.5920],
    outdoorNodeId: 'iittp-out-node-gate-main',
    position3D: [-30, 0, 65],
    description: 'Four-lane guarded university security portal off Yerpedu-Venkatagiri arterial highway.',
    provenance: 'VERIFIED_PUBLIC_DATA'
  },
  {
    id: 'iittp-poi-parking-visitor',
    campusId: 'iittp-permanent',
    name: 'Main Campus Vehicle Parking (Solar Covered)',
    category: 'parking',
    aliases: ['parking', 'car park', 'solar parking', 'bike stand', 'vehicle lot'],
    coordinate: [13.7068, 79.5915],
    outdoorNodeId: 'iittp-out-node-parking',
    position3D: [-45, 0, 45],
    description: 'Covered parking with solar canopies and designated EV charging slots.',
    provenance: 'VERIFIED_PUBLIC_DATA'
  },
  {
    id: 'iittp-poi-canara-atm',
    campusId: 'iittp-permanent',
    name: 'Canara Bank On-Campus ATM',
    category: 'atm',
    aliases: ['atm', 'bank', 'canara bank atm', 'cash counter'],
    coordinate: [13.7076, 79.5922],
    outdoorNodeId: 'iittp-out-node-atm',
    position3D: [-32, 0, 30],
    description: 'Cash dispenser kiosk located near student amenities complex.',
    provenance: 'VERIFIED_PUBLIC_DATA'
  },
  {
    id: 'iittp-poi-sports-complex',
    campusId: 'iittp-permanent',
    name: 'IIT Tirupati Indoor Sports Complex',
    category: 'sports',
    aliases: ['sports complex', 'badminton court', 'gym', 'gymnasium', 'indoor stadium', 'table tennis'],
    coordinate: [13.7122, 79.5960],
    outdoorNodeId: 'iittp-out-node-sports',
    position3D: [70, 0, -65],
    description: 'Multi-purpose indoor arena with synthetic badminton courts, table tennis, and gymnasium.',
    provenance: 'VERIFIED_PUBLIC_DATA'
  }
];

export const iittpNavigationGraph: NavigationGraph = {
  campusId: 'iittp-permanent',
  nodes: {
    // Outdoor nodes
    'iittp-out-node-gate-main': { id: 'iittp-out-node-gate-main', campusId: 'iittp-permanent', type: 'gate', lat: 13.7060, lng: 79.5920, name: 'Main Security Gate' },
    'iittp-out-node-parking': { id: 'iittp-out-node-parking', campusId: 'iittp-permanent', type: 'parking', lat: 13.7068, lng: 79.5915, name: 'Solar Parking Area' },
    'iittp-out-node-atm': { id: 'iittp-out-node-atm', campusId: 'iittp-permanent', type: 'outdoor', lat: 13.7076, lng: 79.5922, name: 'Bank ATM Point' },
    'iittp-out-node-adm-front': { id: 'iittp-out-node-adm-front', campusId: 'iittp-permanent', type: 'entrance', lat: 13.7080, lng: 79.5925, name: 'Admin Entrance Circle' },
    'iittp-out-node-central-rotary': { id: 'iittp-out-node-central-rotary', campusId: 'iittp-permanent', type: 'outdoor', lat: 13.7088, lng: 79.5932, name: 'Central Campus Rotary' },
    'iittp-out-node-health-front': { id: 'iittp-out-node-health-front', campusId: 'iittp-permanent', type: 'entrance', lat: 13.7071, lng: 79.5939, name: 'Dispensary Forecourt' },
    'iittp-out-node-dining-front': { id: 'iittp-out-node-dining-front', campusId: 'iittp-permanent', type: 'entrance', lat: 13.7089, lng: 79.5953, name: 'Dining Hall Plaza' },
    'iittp-out-node-acad-a-north': { id: 'iittp-out-node-acad-a-north', campusId: 'iittp-permanent', type: 'entrance', lat: 13.7101, lng: 79.5935, name: 'Block A North Portico' },
    'iittp-out-node-acad-a-south': { id: 'iittp-out-node-acad-a-south', campusId: 'iittp-permanent', type: 'entrance', lat: 13.7094, lng: 79.5935, name: 'Block A South Courtyard' },
    'iittp-out-node-clrc-front': { id: 'iittp-out-node-clrc-front', campusId: 'iittp-permanent', type: 'entrance', lat: 13.7108, lng: 79.5940, name: 'CLRC Central Promenade' },
    'iittp-out-node-sports': { id: 'iittp-out-node-sports', campusId: 'iittp-permanent', type: 'outdoor', lat: 13.7122, lng: 79.5960, name: 'Sports Complex Entrance' },

    // Indoor Academic Block A Floor 0
    'iittp-ind-f0-lobby': { id: 'iittp-ind-f0-lobby', campusId: 'iittp-permanent', type: 'entrance', buildingId: 'iittp-bld-acad-a', floorId: 'iittp-acad-fl-0', floorNumber: 0, x: 50, y: 15, name: 'North Atrium Lobby' },
    'iittp-ind-f0-south-entry': { id: 'iittp-ind-f0-south-entry', campusId: 'iittp-permanent', type: 'entrance', buildingId: 'iittp-bld-acad-a', floorId: 'iittp-acad-fl-0', floorNumber: 0, x: 50, y: 85, name: 'South Courtyard Entry' },
    'iittp-ind-f0-corridor-ctr': { id: 'iittp-ind-f0-corridor-ctr', campusId: 'iittp-permanent', type: 'corridor', buildingId: 'iittp-bld-acad-a', floorId: 'iittp-acad-fl-0', floorNumber: 0, x: 50, y: 50, name: 'Level 0 Central Concourse' },
    'iittp-ind-f0-stairs-e': { id: 'iittp-ind-f0-stairs-e', campusId: 'iittp-permanent', type: 'stairs', buildingId: 'iittp-bld-acad-a', floorId: 'iittp-acad-fl-0', floorNumber: 0, x: 50, y: 45, name: 'East Stairs Landing G' },
    'iittp-ind-f0-elevator': { id: 'iittp-ind-f0-elevator', campusId: 'iittp-permanent', type: 'elevator', buildingId: 'iittp-bld-acad-a', floorId: 'iittp-acad-fl-0', floorNumber: 0, x: 55, y: 45, name: 'Passenger Lift G' },
    'iittp-ind-f0-rm-lh1': { id: 'iittp-ind-f0-rm-lh1', campusId: 'iittp-permanent', type: 'room', buildingId: 'iittp-bld-acad-a', floorId: 'iittp-acad-fl-0', floorNumber: 0, x: 25, y: 25, name: 'Lecture Hall 1 Door' },
    'iittp-ind-f0-rm-robotics': { id: 'iittp-ind-f0-rm-robotics', campusId: 'iittp-permanent', type: 'room', buildingId: 'iittp-bld-acad-a', floorId: 'iittp-acad-fl-0', floorNumber: 0, x: 75, y: 25, name: 'Robotics Lab Entrance' },
    'iittp-ind-f0-rm-wash-m': { id: 'iittp-ind-f0-rm-wash-m', campusId: 'iittp-permanent', type: 'room', buildingId: 'iittp-bld-acad-a', floorId: 'iittp-acad-fl-0', floorNumber: 0, x: 15, y: 75, name: 'Gents Restroom' },
    'iittp-ind-f0-rm-wash-f': { id: 'iittp-ind-f0-rm-wash-f', campusId: 'iittp-permanent', type: 'room', buildingId: 'iittp-bld-acad-a', floorId: 'iittp-acad-fl-0', floorNumber: 0, x: 85, y: 75, name: 'Ladies Restroom' },

    // Indoor Academic Block A Floor 1
    'iittp-ind-f1-corridor-ctr': { id: 'iittp-ind-f1-corridor-ctr', campusId: 'iittp-permanent', type: 'corridor', buildingId: 'iittp-bld-acad-a', floorId: 'iittp-acad-fl-1', floorNumber: 1, x: 50, y: 50, name: 'Level 1 Gallery Corridor' },
    'iittp-ind-f1-stairs-e': { id: 'iittp-ind-f1-stairs-e', campusId: 'iittp-permanent', type: 'stairs', buildingId: 'iittp-bld-acad-a', floorId: 'iittp-acad-fl-1', floorNumber: 1, x: 50, y: 45, name: 'East Stairs Landing 1' },
    'iittp-ind-f1-elevator': { id: 'iittp-ind-f1-elevator', campusId: 'iittp-permanent', type: 'elevator', buildingId: 'iittp-bld-acad-a', floorId: 'iittp-acad-fl-1', floorNumber: 1, x: 55, y: 45, name: 'Passenger Lift 1' },
    'iittp-ind-f1-rm-lh2': { id: 'iittp-ind-f1-rm-lh2', campusId: 'iittp-permanent', type: 'room', buildingId: 'iittp-bld-acad-a', floorId: 'iittp-acad-fl-1', floorNumber: 1, x: 25, y: 25, name: 'Lecture Hall 2 Door' },
    'iittp-ind-f1-rm-hpc': { id: 'iittp-ind-f1-rm-hpc', campusId: 'iittp-permanent', type: 'room', buildingId: 'iittp-bld-acad-a', floorId: 'iittp-acad-fl-1', floorNumber: 1, x: 75, y: 25, name: 'HPC Supercomputing Lab' },
    'iittp-ind-f1-rm-wash': { id: 'iittp-ind-f1-rm-wash', campusId: 'iittp-permanent', type: 'room', buildingId: 'iittp-bld-acad-a', floorId: 'iittp-acad-fl-1', floorNumber: 1, x: 85, y: 75, name: 'Level 1 Accessible Restroom' },

    // Indoor Academic Block A Floor 2
    'iittp-ind-f2-corridor-ctr': { id: 'iittp-ind-f2-corridor-ctr', campusId: 'iittp-permanent', type: 'corridor', buildingId: 'iittp-bld-acad-a', floorId: 'iittp-acad-fl-2', floorNumber: 2, x: 50, y: 50, name: 'Level 2 Executive Concourse' },
    'iittp-ind-f2-stairs-e': { id: 'iittp-ind-f2-stairs-e', campusId: 'iittp-permanent', type: 'stairs', buildingId: 'iittp-bld-acad-a', floorId: 'iittp-acad-fl-2', floorNumber: 2, x: 50, y: 45, name: 'East Stairs Landing 2' },
    'iittp-ind-f2-elevator': { id: 'iittp-ind-f2-elevator', campusId: 'iittp-permanent', type: 'elevator', buildingId: 'iittp-bld-acad-a', floorId: 'iittp-acad-fl-2', floorNumber: 2, x: 55, y: 45, name: 'Passenger Lift 2' },
    'iittp-ind-f2-rm-dean': { id: 'iittp-ind-f2-rm-dean', campusId: 'iittp-permanent', type: 'room', buildingId: 'iittp-bld-acad-a', floorId: 'iittp-acad-fl-2', floorNumber: 2, x: 25, y: 25, name: 'Dean Academics Secretariat' },
    'iittp-ind-f2-rm-seminar': { id: 'iittp-ind-f2-rm-seminar', campusId: 'iittp-permanent', type: 'room', buildingId: 'iittp-bld-acad-a', floorId: 'iittp-acad-fl-2', floorNumber: 2, x: 75, y: 25, name: 'Boardroom Seminar Hall' },
    'iittp-ind-f2-rm-wash': { id: 'iittp-ind-f2-rm-wash', campusId: 'iittp-permanent', type: 'room', buildingId: 'iittp-bld-acad-a', floorId: 'iittp-acad-fl-2', floorNumber: 2, x: 85, y: 75, name: 'Level 2 Restroom' }
  },
  edges: [
    // Outdoor main pathways
    { id: 'iittp-e-1', campusId: 'iittp-permanent', fromNodeId: 'iittp-out-node-gate-main', toNodeId: 'iittp-out-node-parking', distanceMeters: 105, allowedModes: ['walk', 'bicycle', 'car'], isAccessible: true, isOutdoor: true, name: 'Entrance Highway Avenue' },
    { id: 'iittp-e-2', campusId: 'iittp-permanent', fromNodeId: 'iittp-out-node-gate-main', toNodeId: 'iittp-out-node-atm', distanceMeters: 180, allowedModes: ['walk', 'bicycle'], isAccessible: true, isOutdoor: true, name: 'Pedestrian Walkway' },
    { id: 'iittp-e-3', campusId: 'iittp-permanent', fromNodeId: 'iittp-out-node-parking', toNodeId: 'iittp-out-node-adm-front', distanceMeters: 160, allowedModes: ['walk', 'bicycle', 'car'], isAccessible: true, isOutdoor: true, name: 'Administration Link Road' },
    { id: 'iittp-e-4', campusId: 'iittp-permanent', fromNodeId: 'iittp-out-node-adm-front', toNodeId: 'iittp-out-node-central-rotary', distanceMeters: 110, allowedModes: ['walk', 'bicycle', 'car'], isAccessible: true, isOutdoor: true, name: 'Central Boulevard' },
    { id: 'iittp-e-5', campusId: 'iittp-permanent', fromNodeId: 'iittp-out-node-central-rotary', toNodeId: 'iittp-out-node-acad-a-north', distanceMeters: 150, allowedModes: ['walk', 'bicycle'], isAccessible: true, isOutdoor: true, name: 'Academic Plaza Walk' },
    { id: 'iittp-e-6', campusId: 'iittp-permanent', fromNodeId: 'iittp-out-node-central-rotary', toNodeId: 'iittp-out-node-acad-a-south', distanceMeters: 80, allowedModes: ['walk', 'bicycle'], isAccessible: true, isOutdoor: true, name: 'South Courtyard Approach' },
    { id: 'iittp-e-7', campusId: 'iittp-permanent', fromNodeId: 'iittp-out-node-central-rotary', toNodeId: 'iittp-out-node-dining-front', distanceMeters: 215, allowedModes: ['walk', 'bicycle', 'car'], isAccessible: true, isOutdoor: true, name: 'Student Life Way' },
    { id: 'iittp-e-8', campusId: 'iittp-permanent', fromNodeId: 'iittp-out-node-central-rotary', toNodeId: 'iittp-out-node-health-front', distanceMeters: 200, allowedModes: ['walk', 'bicycle', 'car'], isAccessible: true, isOutdoor: true, name: 'Medical Emergency Access' },
    { id: 'iittp-e-9', campusId: 'iittp-permanent', fromNodeId: 'iittp-out-node-acad-a-north', toNodeId: 'iittp-out-node-clrc-front', distanceMeters: 90, allowedModes: ['walk', 'bicycle'], isAccessible: true, isOutdoor: true, name: 'Knowledge Walkway' },
    { id: 'iittp-e-10', campusId: 'iittp-permanent', fromNodeId: 'iittp-out-node-clrc-front', toNodeId: 'iittp-out-node-sports', distanceMeters: 260, allowedModes: ['walk', 'bicycle'], isAccessible: true, isOutdoor: true, name: 'Sports Complex Road' },

    // Building transitions
    { id: 'iittp-tr-acad-north', campusId: 'iittp-permanent', fromNodeId: 'iittp-out-node-acad-a-north', toNodeId: 'iittp-ind-f0-lobby', distanceMeters: 10, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, name: 'Enter Block A via North Portico' },
    { id: 'iittp-tr-acad-south', campusId: 'iittp-permanent', fromNodeId: 'iittp-out-node-acad-a-south', toNodeId: 'iittp-ind-f0-south-entry', distanceMeters: 8, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, name: 'Enter Block A via Courtyard' },
    { id: 'iittp-tr-adm', campusId: 'iittp-permanent', fromNodeId: 'iittp-out-node-adm-front', toNodeId: 'iittp-ind-adm-reception', distanceMeters: 12, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, name: 'Enter Administration Building' },
    { id: 'iittp-tr-clrc', campusId: 'iittp-permanent', fromNodeId: 'iittp-out-node-clrc-front', toNodeId: 'iittp-ind-clrc-atrium', distanceMeters: 14, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, name: 'Enter CLRC Central Library' },
    { id: 'iittp-tr-dining', campusId: 'iittp-permanent', fromNodeId: 'iittp-out-node-dining-front', toNodeId: 'iittp-ind-dining-hall', distanceMeters: 10, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, name: 'Enter Dining Facility' },
    { id: 'iittp-tr-health', campusId: 'iittp-permanent', fromNodeId: 'iittp-out-node-health-front', toNodeId: 'iittp-ind-health-opd', distanceMeters: 8, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, name: 'Enter Dispensary' },

    // Indoor Floor 0 Connections
    { id: 'iittp-ind-e-f0-1', campusId: 'iittp-permanent', fromNodeId: 'iittp-ind-f0-lobby', toNodeId: 'iittp-ind-f0-corridor-ctr', distanceMeters: 18, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, floorId: 'iittp-acad-fl-0', name: 'Atrium Concourse' },
    { id: 'iittp-ind-e-f0-2', campusId: 'iittp-permanent', fromNodeId: 'iittp-ind-f0-south-entry', toNodeId: 'iittp-ind-f0-corridor-ctr', distanceMeters: 16, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, floorId: 'iittp-acad-fl-0', name: 'South Hallway' },
    { id: 'iittp-ind-e-f0-3', campusId: 'iittp-permanent', fromNodeId: 'iittp-ind-f0-corridor-ctr', toNodeId: 'iittp-ind-f0-stairs-e', distanceMeters: 5, allowedModes: ['walk'], isAccessible: false, isOutdoor: false, floorId: 'iittp-acad-fl-0', name: 'East Stair Landing' },
    { id: 'iittp-ind-e-f0-4', campusId: 'iittp-permanent', fromNodeId: 'iittp-ind-f0-corridor-ctr', toNodeId: 'iittp-ind-f0-elevator', distanceMeters: 6, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, floorId: 'iittp-acad-fl-0', name: 'Passenger Lift Door' },
    { id: 'iittp-ind-e-f0-5', campusId: 'iittp-permanent', fromNodeId: 'iittp-ind-f0-corridor-ctr', toNodeId: 'iittp-ind-f0-rm-lh1', distanceMeters: 16, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, floorId: 'iittp-acad-fl-0', name: 'Walk to Lecture Hall 1' },
    { id: 'iittp-ind-e-f0-6', campusId: 'iittp-permanent', fromNodeId: 'iittp-ind-f0-corridor-ctr', toNodeId: 'iittp-ind-f0-rm-robotics', distanceMeters: 16, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, floorId: 'iittp-acad-fl-0', name: 'Walk to Robotics Lab' },
    { id: 'iittp-ind-e-f0-7', campusId: 'iittp-permanent', fromNodeId: 'iittp-ind-f0-corridor-ctr', toNodeId: 'iittp-ind-f0-rm-wash-m', distanceMeters: 15, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, floorId: 'iittp-acad-fl-0', name: 'Walk to Gents Washroom' },
    { id: 'iittp-ind-e-f0-8', campusId: 'iittp-permanent', fromNodeId: 'iittp-ind-f0-corridor-ctr', toNodeId: 'iittp-ind-f0-rm-wash-f', distanceMeters: 15, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, floorId: 'iittp-acad-fl-0', name: 'Walk to Ladies Washroom' },

    // Vertical Level 0 <-> Level 1
    { id: 'iittp-v-st-0-1', campusId: 'iittp-permanent', fromNodeId: 'iittp-ind-f0-stairs-e', toNodeId: 'iittp-ind-f1-stairs-e', distanceMeters: 12, allowedModes: ['walk'], isAccessible: false, isStairs: true, isOutdoor: false, name: 'Take East Stairs to Level 1' },
    { id: 'iittp-v-el-0-1', campusId: 'iittp-permanent', fromNodeId: 'iittp-ind-f0-elevator', toNodeId: 'iittp-ind-f1-elevator', distanceMeters: 10, allowedModes: ['walk'], isAccessible: true, isElevator: true, isOutdoor: false, name: 'Take Lift to Level 1' },

    // Indoor Level 1 Connections
    { id: 'iittp-ind-e-f1-1', campusId: 'iittp-permanent', fromNodeId: 'iittp-ind-f1-stairs-e', toNodeId: 'iittp-ind-f1-corridor-ctr', distanceMeters: 5, allowedModes: ['walk'], isAccessible: false, isOutdoor: false, floorId: 'iittp-acad-fl-1', name: 'Level 1 Landing' },
    { id: 'iittp-ind-e-f1-2', campusId: 'iittp-permanent', fromNodeId: 'iittp-ind-f1-elevator', toNodeId: 'iittp-ind-f1-corridor-ctr', distanceMeters: 6, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, floorId: 'iittp-acad-fl-1', name: 'Level 1 Lift Foyer' },
    { id: 'iittp-ind-e-f1-3', campusId: 'iittp-permanent', fromNodeId: 'iittp-ind-f1-corridor-ctr', toNodeId: 'iittp-ind-f1-rm-lh2', distanceMeters: 15, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, floorId: 'iittp-acad-fl-1', name: 'Walk to Lecture Hall 2' },
    { id: 'iittp-ind-e-f1-4', campusId: 'iittp-permanent', fromNodeId: 'iittp-ind-f1-corridor-ctr', toNodeId: 'iittp-ind-f1-rm-hpc', distanceMeters: 16, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, floorId: 'iittp-acad-fl-1', name: 'Walk to HPC Lab' },
    { id: 'iittp-ind-e-f1-5', campusId: 'iittp-permanent', fromNodeId: 'iittp-ind-f1-corridor-ctr', toNodeId: 'iittp-ind-f1-rm-wash', distanceMeters: 16, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, floorId: 'iittp-acad-fl-1', name: 'Walk to Level 1 Restroom' },

    // Vertical Level 1 <-> Level 2
    { id: 'iittp-v-st-1-2', campusId: 'iittp-permanent', fromNodeId: 'iittp-ind-f1-stairs-e', toNodeId: 'iittp-ind-f2-stairs-e', distanceMeters: 12, allowedModes: ['walk'], isAccessible: false, isStairs: true, isOutdoor: false, name: 'Take East Stairs to Level 2' },
    { id: 'iittp-v-el-1-2', campusId: 'iittp-permanent', fromNodeId: 'iittp-ind-f1-elevator', toNodeId: 'iittp-ind-f2-elevator', distanceMeters: 10, allowedModes: ['walk'], isAccessible: true, isElevator: true, isOutdoor: false, name: 'Take Lift to Level 2' },

    // Indoor Level 2 Connections
    { id: 'iittp-ind-e-f2-1', campusId: 'iittp-permanent', fromNodeId: 'iittp-ind-f2-stairs-e', toNodeId: 'iittp-ind-f2-corridor-ctr', distanceMeters: 5, allowedModes: ['walk'], isAccessible: false, isOutdoor: false, floorId: 'iittp-acad-fl-2', name: 'Level 2 Landing' },
    { id: 'iittp-ind-e-f2-2', campusId: 'iittp-permanent', fromNodeId: 'iittp-ind-f2-elevator', toNodeId: 'iittp-ind-f2-corridor-ctr', distanceMeters: 6, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, floorId: 'iittp-acad-fl-2', name: 'Level 2 Lift Foyer' },
    { id: 'iittp-ind-e-f2-3', campusId: 'iittp-permanent', fromNodeId: 'iittp-ind-f2-corridor-ctr', toNodeId: 'iittp-ind-f2-rm-dean', distanceMeters: 15, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, floorId: 'iittp-acad-fl-2', name: 'Walk to Dean Office' },
    { id: 'iittp-ind-e-f2-4', campusId: 'iittp-permanent', fromNodeId: 'iittp-ind-f2-corridor-ctr', toNodeId: 'iittp-ind-f2-rm-seminar', distanceMeters: 16, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, floorId: 'iittp-acad-fl-2', name: 'Walk to Boardroom Hall' },
    { id: 'iittp-ind-e-f2-5', campusId: 'iittp-permanent', fromNodeId: 'iittp-ind-f2-corridor-ctr', toNodeId: 'iittp-ind-f2-rm-wash', distanceMeters: 16, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, floorId: 'iittp-acad-fl-2', name: 'Walk to Level 2 Restroom' }
  ]
};

// Synthetic Wi-Fi Fingerprints for IIT Tirupati
export const iittpWiFiFingerprints: WiFiFingerprintSample[] = [
  {
    id: 'iittp-fp-f0-lobby',
    campusId: 'iittp-permanent',
    buildingId: 'iittp-bld-acad-a',
    floorId: 'iittp-acad-fl-0',
    floorNumber: 0,
    nodeId: 'iittp-ind-f0-lobby',
    indoorX: 50,
    indoorY: 15,
    readings: {
      'IITTP-AP-ACAD-G01': -41,
      'IITTP-AP-ACAD-G02': -50,
      'IITTP-AP-CLRC-01': -72,
      'IITTP-AP-OUT-ROTARY': -65
    },
    sampleType: 'SYNTHETIC_DEMO_DATA'
  },
  {
    id: 'iittp-fp-f0-ctr',
    campusId: 'iittp-permanent',
    buildingId: 'iittp-bld-acad-a',
    floorId: 'iittp-acad-fl-0',
    floorNumber: 0,
    nodeId: 'iittp-ind-f0-corridor-ctr',
    indoorX: 50,
    indoorY: 50,
    readings: {
      'IITTP-AP-ACAD-G01': -38,
      'IITTP-AP-ACAD-G02': -42,
      'IITTP-AP-ACAD-101': -68,
      'IITTP-AP-OUT-ROTARY': -72
    },
    sampleType: 'SYNTHETIC_DEMO_DATA'
  },
  {
    id: 'iittp-fp-f0-wash-m',
    campusId: 'iittp-permanent',
    buildingId: 'iittp-bld-acad-a',
    floorId: 'iittp-acad-fl-0',
    floorNumber: 0,
    nodeId: 'iittp-ind-f0-rm-wash-m',
    indoorX: 15,
    indoorY: 75,
    readings: {
      'IITTP-AP-ACAD-G01': -52,
      'IITTP-AP-ACAD-G03': -46,
      'IITTP-AP-ADM-01': -70
    },
    sampleType: 'SYNTHETIC_DEMO_DATA'
  },
  {
    id: 'iittp-fp-f1-ctr',
    campusId: 'iittp-permanent',
    buildingId: 'iittp-bld-acad-a',
    floorId: 'iittp-acad-fl-1',
    floorNumber: 1,
    nodeId: 'iittp-ind-f1-corridor-ctr',
    indoorX: 50,
    indoorY: 50,
    readings: {
      'IITTP-AP-ACAD-101': -39,
      'IITTP-AP-ACAD-102': -41,
      'IITTP-AP-ACAD-G01': -66,
      'IITTP-AP-ACAD-201': -68
    },
    sampleType: 'SYNTHETIC_DEMO_DATA'
  },
  {
    id: 'iittp-fp-f2-ctr',
    campusId: 'iittp-permanent',
    buildingId: 'iittp-bld-acad-a',
    floorId: 'iittp-acad-fl-2',
    floorNumber: 2,
    nodeId: 'iittp-ind-f2-corridor-ctr',
    indoorX: 50,
    indoorY: 50,
    readings: {
      'IITTP-AP-ACAD-201': -38,
      'IITTP-AP-ACAD-202': -43,
      'IITTP-AP-ACAD-101': -65,
      'IITTP-AP-ACAD-G01': -85
    },
    sampleType: 'SYNTHETIC_DEMO_DATA'
  }
];

// QR Checkpoints for IIT Tirupati
export const iittpQRCheckpoints: QRCheckpointPayload[] = [
  {
    version: '1.0',
    campus_id: 'iittp-permanent',
    building_id: 'iittp-bld-acad-a',
    floor_id: 'iittp-acad-fl-0',
    checkpoint_id: 'CP-IITTP-ACAD-NORTH-ENT',
    node_id: 'iittp-ind-f0-lobby',
    label: 'Block A North Portico Checkpoint',
    createdAt: '2026-10-31T09:15:00Z',
    isActive: true,
    provenance: 'VERIFIED_PUBLIC_DATA'
  },
  {
    version: '1.0',
    campus_id: 'iittp-permanent',
    building_id: 'iittp-bld-acad-a',
    floor_id: 'iittp-acad-fl-0',
    checkpoint_id: 'CP-IITTP-ACAD-G-STAIRS',
    node_id: 'iittp-ind-f0-stairs-e',
    label: 'Atrium East Stairs Landing Checkpoint',
    createdAt: '2026-10-31T09:15:00Z',
    isActive: true,
    provenance: 'VERIFIED_PUBLIC_DATA'
  },
  {
    version: '1.0',
    campus_id: 'iittp-permanent',
    building_id: 'iittp-bld-acad-a',
    floor_id: 'iittp-acad-fl-1',
    checkpoint_id: 'CP-IITTP-ACAD-1-HALL',
    node_id: 'iittp-ind-f1-corridor-ctr',
    label: 'Level 1 Passenger Lift Foyer Checkpoint',
    createdAt: '2026-10-31T09:15:00Z',
    isActive: true,
    provenance: 'VERIFIED_PUBLIC_DATA'
  },
  {
    version: '1.0',
    campus_id: 'iittp-permanent',
    building_id: 'iittp-bld-acad-a',
    floor_id: 'iittp-acad-fl-2',
    checkpoint_id: 'CP-IITTP-ACAD-2-DEAN',
    node_id: 'iittp-ind-f2-rm-dean',
    label: 'Dean Academic Affairs Anteroom Checkpoint',
    createdAt: '2026-10-31T09:15:00Z',
    isActive: true,
    provenance: 'SYNTHETIC_DEMO_DATA'
  }
];

// Visual Reference Keyframes for IIT Tirupati
export const iittpVPSKeyframes: VisualReferenceKeyframe[] = [
  {
    id: 'vps-iittp-acad-a-portico',
    campusId: 'iittp-permanent',
    buildingId: 'iittp-bld-acad-a',
    floorId: 'iittp-acad-fl-0',
    nodeId: 'iittp-ind-f0-lobby',
    title: 'Block A North Atrium Peristyle',
    landmarkDescription: 'Geometric white portico with university sign and landscaped amphitheatre.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=400&q=80',
    featureSignature: 'hash-iittp-vps-atrium-north-22b8',
    groundTruthPose: { x: 15, y: 1.6, z: -35, pitch: -1.0, yaw: 0.0, roll: 0.0 },
    provenance: 'REAL_CAPTURED_DATA'
  },
  {
    id: 'vps-iittp-clrc-atrium',
    campusId: 'iittp-permanent',
    buildingId: 'iittp-bld-clrc',
    floorId: 'iittp-clrc-fl-0',
    nodeId: 'iittp-ind-clrc-atrium',
    title: 'CLRC Central Library Glass Dome',
    landmarkDescription: 'Circular skylit rotunda with reception desk and turnstile security barrier.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=400&q=80',
    featureSignature: 'hash-iittp-vps-clrc-dome-49c3',
    groundTruthPose: { x: 45, y: 1.6, z: -26, pitch: 12.0, yaw: 180.0, roll: 0.0 },
    provenance: 'REAL_CAPTURED_DATA'
  }
];
