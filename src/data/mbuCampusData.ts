import { Campus, Building, POI, PackageManifest, DigitalTwinAsset } from '../types/campus';
import { NavigationGraph } from '../types/navigation';
import { WiFiFingerprintSample, QRCheckpointPayload, VisualReferenceKeyframe } from '../types/positioning';

export const mbuCampusProfile: Campus = {
  id: 'mbu-tirupati',
  name: 'Mohan Babu University (MBU)',
  shortName: 'MBU Tirupati',
  code: 'MBU',
  tagline: 'Sree Sainath Nagar, A.Rangampet, Tirupati, Andhra Pradesh',
  location: {
    lat: 13.6268,
    lng: 79.2974,
    city: 'Tirupati',
    state: 'Andhra Pradesh',
    bounds: [
      [13.6210, 79.2910],
      [13.6330, 79.3050]
    ]
  },
  version: '2026.11.1',
  packageSizeMb: 14.8,
  lastUpdated: '31 October 2026',
  provenance: 'VERIFIED_PUBLIC_DATA',
  provenanceSummary: 'Outdoor layout referenced from verified campus open spatial data. 3D Digital Twin comprises procedural architectural twins and registered Gaussian Splatting / glTF assets.',
  disclaimer: 'Indoor floor plans, 3D meshes, and Wi-Fi fingerprints are synthetic demo digital-twin assets created for demonstration integrity. Official outdoor coordinates verified.',
  stats: {
    buildingCount: 8,
    floorCount: 9,
    poiCount: 22,
    routableKm: 5.6,
    verifiedPercent: 78
  }
};

export const mbuDigitalTwinAssets: DigitalTwinAsset[] = [
  {
    id: 'dt-mbu-campus-splat-01',
    campusId: 'mbu-tirupati',
    name: 'MBU Central Spine Gaussian Splat Model',
    format: 'splat',
    provenance: 'REAL_CAPTURED_DATA',
    captureDate: '2026-09-14',
    version: '1.4.0',
    processingStatus: 'ready',
    fileSizeBytes: 8400000,
    hasGaussianSplat: true,
    description: 'High-density 3D Gaussian Splatting capture of the academic boulevard and Computing Block portico.'
  },
  {
    id: 'dt-mbu-soc-glb-lod1',
    campusId: 'mbu-tirupati',
    buildingId: 'mbu-bld-computing',
    name: 'School of Computing Multi-Floor 3D Twin (glTF/GLB)',
    format: 'glb',
    provenance: 'SYNTHETIC_DEMO_DATA',
    captureDate: '2026-10-20',
    version: '2.1.0',
    processingStatus: 'ready',
    fileSizeBytes: 4200000,
    polyCount: 48500,
    lodLevels: 3,
    description: 'Multi-floor BIM/CAD architectural model with exploded floor stack, room divisions, and stair/elevator shafts.'
  },
  {
    id: 'dt-mbu-admin-ply-cloud',
    campusId: 'mbu-tirupati',
    buildingId: 'mbu-bld-admin',
    name: 'Administrative Building Point Cloud (PLY)',
    format: 'ply',
    provenance: 'REAL_CAPTURED_DATA',
    captureDate: '2026-08-10',
    version: '1.0.0',
    processingStatus: 'ready',
    fileSizeBytes: 3100000,
    polyCount: 125000,
    description: 'LiDAR terrestrial scanner point cloud capture of front façade and visitor portico.'
  }
];

export const mbuPackageManifest: PackageManifest = {
  campusId: 'mbu-tirupati',
  version: '2026.11.1',
  name: 'MBU Tirupati 3D Digital Twin & Navigation Package',
  createdAt: '2026-10-31T10:00:00Z',
  checksum: 'sha256-mbu-9f4a13e610bb481d',
  schemaVersion: '2.0.0',
  sources: [
    {
      name: 'Mohan Babu University Campus Public Spatial Data',
      type: 'VERIFIED_PUBLIC_DATA',
      url: 'https://www.mbu.asia/',
      attribution: 'Mohan Babu University institutional directory and official publications.'
    },
    {
      name: 'OpenStreetMap Campus Outline & Roads',
      type: 'OPENSTREETMAP_DATA',
      attribution: '© OpenStreetMap contributors, ODbL 1.0 license.'
    },
    {
      name: 'Campus Navigator 3D Digital Twin Capture Engine',
      type: 'REAL_CAPTURED_DATA',
      attribution: 'High-resolution terrestrial scans, 3D Gaussian Splatting assets, and photogrammetric models.'
    },
    {
      name: 'Campus Navigator Synthetic Floor Plan Engine',
      type: 'SYNTHETIC_DEMO_DATA',
      attribution: 'Synthetic multi-floor interior BIM models, Wi-Fi RSSI signatures, and demo QR checkpoints.'
    }
  ],
  fileSizes: {
    buildings: 1204000,
    indoor: 980000,
    graph: 840000,
    wifiFingerprints: 280000,
    checkpoints: 75000,
    digitalTwin3D: 15700000
  },
  digitalTwinAssets: mbuDigitalTwinAssets
};

export const mbuBuildings: Building[] = [
  {
    id: 'mbu-bld-computing',
    campusId: 'mbu-tirupati',
    name: 'School of Computing (CSE / AI Block)',
    code: 'SOC',
    category: 'academic',
    description: 'Houses Department of Computer Science & Engineering, AI & ML laboratories, lecture halls, and faculty rooms.',
    coordinates: [13.6272, 79.2970],
    polygon: [
      [13.6268, 79.2965],
      [13.6276, 79.2965],
      [13.6276, 79.2975],
      [13.6268, 79.2975]
    ],
    position3D: [12, 0, -18],
    dimensions3D: [38, 20, 28],
    color3D: '#168C83',
    modelAssetId: 'dt-mbu-soc-glb-lod1',
    dataStatus: 'demo',
    provenance: 'SYNTHETIC_DEMO_DATA',
    indoorLayoutNotice: 'Demo layout — not an official floor plan. Synthetic indoor corridors and room placements in 3D digital twin.',
    entrances: [
      {
        id: 'mbu-ent-soc-main',
        name: 'School of Computing Main Entrance (South)',
        outdoorNodeId: 'mbu-out-node-soc-front',
        indoorNodeId: 'mbu-ind-f0-lobby',
        floorId: 'mbu-soc-fl-0',
        isAccessible: true,
        lat: 13.6268,
        lng: 79.2970,
        position3D: [12, 0, -4]
      },
      {
        id: 'mbu-ent-soc-east',
        name: 'School of Computing East Ramp Entrance',
        outdoorNodeId: 'mbu-out-node-soc-east',
        indoorNodeId: 'mbu-ind-f0-east-ramp',
        floorId: 'mbu-soc-fl-0',
        isAccessible: true,
        lat: 13.6272,
        lng: 79.2975,
        position3D: [31, 0, -18]
      }
    ],
    floors: [
      {
        id: 'mbu-soc-fl-0',
        campusId: 'mbu-tirupati',
        buildingId: 'mbu-bld-computing',
        floorNumber: 0,
        name: 'Ground Floor (Lobby & DSA Lab)',
        dataStatus: 'demo',
        elevationOffset3D: 0,
        bounds: { width: 60, height: 40 },
        connectors: [
          {
            id: 'mbu-conn-soc-st1-f0',
            type: 'stairs',
            name: 'Central Staircase A',
            nodeId: 'mbu-ind-f0-stairs-a',
            accessibleFloorNumbers: [0, 1, 2, 3],
            isAccessible: false,
            x: 50,
            y: 45,
            position3D: [0, 0, 0]
          },
          {
            id: 'mbu-conn-soc-el1-f0',
            type: 'elevator',
            name: 'Main Elevator (Accessible)',
            nodeId: 'mbu-ind-f0-elevator',
            accessibleFloorNumbers: [0, 1, 2, 3],
            isAccessible: true,
            x: 55,
            y: 45,
            position3D: [4, 0, 0]
          }
        ],
        rooms: [
          {
            id: 'mbu-rm-g01',
            campusId: 'mbu-tirupati',
            buildingId: 'mbu-bld-computing',
            floorId: 'mbu-soc-fl-0',
            roomCode: 'SOC-G01',
            name: 'Dean / HOD Office (School of Computing)',
            category: 'admin',
            graphNodeId: 'mbu-ind-f0-rm-dean',
            x: 25,
            y: 25,
            width: 18,
            height: 18,
            aliases: ['hod office', 'dean cabin', 'cse head', 'department office'],
            provenance: 'SYNTHETIC_DEMO_DATA',
            position3D: [-10, 0, -8]
          },
          {
            id: 'mbu-rm-g02',
            campusId: 'mbu-tirupati',
            buildingId: 'mbu-bld-computing',
            floorId: 'mbu-soc-fl-0',
            roomCode: 'SOC-G02',
            name: 'Data Structures & Algorithms Lab',
            category: 'lab',
            graphNodeId: 'mbu-ind-f0-rm-dsa',
            x: 75,
            y: 25,
            width: 20,
            height: 20,
            aliases: ['computing lab 1', 'coding lab', 'dsa lab', 'programming lab'],
            provenance: 'SYNTHETIC_DEMO_DATA',
            position3D: [12, 0, -8]
          },
          {
            id: 'mbu-rm-g-wash-m',
            campusId: 'mbu-tirupati',
            buildingId: 'mbu-bld-computing',
            floorId: 'mbu-soc-fl-0',
            roomCode: 'SOC-GW-M',
            name: 'Gents Washroom (Ground Floor)',
            category: 'washroom',
            graphNodeId: 'mbu-ind-f0-rm-wash-m',
            x: 15,
            y: 75,
            width: 14,
            height: 14,
            aliases: ['washroom', 'toilet', 'restroom', 'loo', 'gents toilet', 'bathroom'],
            provenance: 'SYNTHETIC_DEMO_DATA',
            position3D: [-14, 0, 10]
          },
          {
            id: 'mbu-rm-g-wash-f',
            campusId: 'mbu-tirupati',
            buildingId: 'mbu-bld-computing',
            floorId: 'mbu-soc-fl-0',
            roomCode: 'SOC-GW-F',
            name: 'Ladies Washroom (Ground Floor)',
            category: 'washroom',
            graphNodeId: 'mbu-ind-f0-rm-wash-f',
            x: 85,
            y: 75,
            width: 14,
            height: 14,
            aliases: ['washroom', 'toilet', 'restroom', 'ladies toilet', 'women washroom'],
            provenance: 'SYNTHETIC_DEMO_DATA',
            position3D: [14, 0, 10]
          }
        ]
      },
      {
        id: 'mbu-soc-fl-1',
        campusId: 'mbu-tirupati',
        buildingId: 'mbu-bld-computing',
        floorNumber: 1,
        name: 'First Floor (AI Lab & Smart Class 101)',
        dataStatus: 'demo',
        elevationOffset3D: 6,
        bounds: { width: 60, height: 40 },
        connectors: [
          {
            id: 'mbu-conn-soc-st1-f1',
            type: 'stairs',
            name: 'Central Staircase A',
            nodeId: 'mbu-ind-f1-stairs-a',
            accessibleFloorNumbers: [0, 1, 2, 3],
            isAccessible: false,
            x: 50,
            y: 45,
            position3D: [0, 6, 0]
          },
          {
            id: 'mbu-conn-soc-el1-f1',
            type: 'elevator',
            name: 'Main Elevator (Accessible)',
            nodeId: 'mbu-ind-f1-elevator',
            accessibleFloorNumbers: [0, 1, 2, 3],
            isAccessible: true,
            x: 55,
            y: 45,
            position3D: [4, 6, 0]
          }
        ],
        rooms: [
          {
            id: 'mbu-rm-101',
            campusId: 'mbu-tirupati',
            buildingId: 'mbu-bld-computing',
            floorId: 'mbu-soc-fl-1',
            roomCode: 'SOC-101',
            name: 'Smart Lecture Hall 101',
            category: 'classroom',
            graphNodeId: 'mbu-ind-f1-rm-101',
            x: 25,
            y: 25,
            width: 18,
            height: 18,
            aliases: ['room 101', 'class 101', 'lecture hall 101', 'soc 101'],
            provenance: 'SYNTHETIC_DEMO_DATA',
            position3D: [-10, 6, -8]
          },
          {
            id: 'mbu-rm-102',
            campusId: 'mbu-tirupati',
            buildingId: 'mbu-bld-computing',
            floorId: 'mbu-soc-fl-1',
            roomCode: 'SOC-102',
            name: 'Artificial Intelligence & Deep Learning Lab',
            category: 'lab',
            graphNodeId: 'mbu-ind-f1-rm-ai-lab',
            x: 75,
            y: 25,
            width: 22,
            height: 20,
            aliases: ['ai lab', 'ml lab', 'deep learning lab', 'gpu lab', 'room 102'],
            provenance: 'SYNTHETIC_DEMO_DATA',
            position3D: [12, 6, -8]
          },
          {
            id: 'mbu-rm-1-wash',
            campusId: 'mbu-tirupati',
            buildingId: 'mbu-bld-computing',
            floorId: 'mbu-soc-fl-1',
            roomCode: 'SOC-1W',
            name: 'All-Gender Accessible Restroom (Floor 1)',
            category: 'washroom',
            graphNodeId: 'mbu-ind-f1-rm-wash',
            x: 15,
            y: 75,
            width: 15,
            height: 15,
            aliases: ['washroom', 'toilet', 'restroom', 'accessible washroom', 'wheelchair toilet'],
            provenance: 'SYNTHETIC_DEMO_DATA',
            position3D: [-14, 6, 10]
          }
        ]
      },
      {
        id: 'mbu-soc-fl-2',
        campusId: 'mbu-tirupati',
        buildingId: 'mbu-bld-computing',
        floorNumber: 2,
        name: 'Second Floor (Seminar 204 & Cloud Lab)',
        dataStatus: 'demo',
        elevationOffset3D: 12,
        bounds: { width: 60, height: 40 },
        connectors: [
          {
            id: 'mbu-conn-soc-st1-f2',
            type: 'stairs',
            name: 'Central Staircase A',
            nodeId: 'mbu-ind-f2-stairs-a',
            accessibleFloorNumbers: [0, 1, 2, 3],
            isAccessible: false,
            x: 50,
            y: 45,
            position3D: [0, 12, 0]
          },
          {
            id: 'mbu-conn-soc-el1-f2',
            type: 'elevator',
            name: 'Main Elevator (Accessible)',
            nodeId: 'mbu-ind-f2-elevator',
            accessibleFloorNumbers: [0, 1, 2, 3],
            isAccessible: true,
            x: 55,
            y: 45,
            position3D: [4, 12, 0]
          }
        ],
        rooms: [
          {
            id: 'mbu-rm-204',
            campusId: 'mbu-tirupati',
            buildingId: 'mbu-bld-computing',
            floorId: 'mbu-soc-fl-2',
            roomCode: 'SOC-204',
            name: 'Seminar & Capstone Presentation Room 204',
            category: 'classroom',
            graphNodeId: 'mbu-ind-f2-rm-204',
            x: 25,
            y: 25,
            width: 18,
            height: 18,
            aliases: ['room 204', 'seminar room 204', 'presentation hall', 'soc 204'],
            provenance: 'SYNTHETIC_DEMO_DATA',
            position3D: [-10, 12, -8]
          },
          {
            id: 'mbu-rm-205',
            campusId: 'mbu-tirupati',
            buildingId: 'mbu-bld-computing',
            floorId: 'mbu-soc-fl-2',
            roomCode: 'SOC-205',
            name: 'Cloud Computing & Cyber Security Research Lab',
            category: 'lab',
            graphNodeId: 'mbu-ind-f2-rm-cloud',
            x: 75,
            y: 25,
            width: 22,
            height: 20,
            aliases: ['cloud lab', 'cyber lab', 'security lab', 'networking lab', 'room 205'],
            provenance: 'SYNTHETIC_DEMO_DATA',
            position3D: [12, 12, -8]
          },
          {
            id: 'mbu-rm-2-wash',
            campusId: 'mbu-tirupati',
            buildingId: 'mbu-bld-computing',
            floorId: 'mbu-soc-fl-2',
            roomCode: 'SOC-2W',
            name: 'Washroom Facilities (Floor 2)',
            category: 'washroom',
            graphNodeId: 'mbu-ind-f2-rm-wash',
            x: 85,
            y: 75,
            width: 14,
            height: 14,
            aliases: ['washroom', 'toilet', 'restroom', 'loo'],
            provenance: 'SYNTHETIC_DEMO_DATA',
            position3D: [14, 12, 10]
          }
        ]
      },
      {
        id: 'mbu-soc-fl-3',
        campusId: 'mbu-tirupati',
        buildingId: 'mbu-bld-computing',
        floorNumber: 3,
        name: 'Third Floor (Robotics Room 304)',
        dataStatus: 'demo',
        elevationOffset3D: 18,
        bounds: { width: 60, height: 40 },
        connectors: [
          {
            id: 'mbu-conn-soc-st1-f3',
            type: 'stairs',
            name: 'Central Staircase A',
            nodeId: 'mbu-ind-f3-stairs-a',
            accessibleFloorNumbers: [0, 1, 2, 3],
            isAccessible: false,
            x: 50,
            y: 45,
            position3D: [0, 18, 0]
          },
          {
            id: 'mbu-conn-soc-el1-f3',
            type: 'elevator',
            name: 'Main Elevator (Accessible)',
            nodeId: 'mbu-ind-f3-elevator',
            accessibleFloorNumbers: [0, 1, 2, 3],
            isAccessible: true,
            x: 55,
            y: 45,
            position3D: [4, 18, 0]
          }
        ],
        rooms: [
          {
            id: 'mbu-rm-304',
            campusId: 'mbu-tirupati',
            buildingId: 'mbu-bld-computing',
            floorId: 'mbu-soc-fl-3',
            roomCode: 'SOC-304',
            name: 'Room 304 (Advanced Robotics & Autonomous Systems)',
            category: 'classroom',
            graphNodeId: 'mbu-ind-f3-rm-304',
            x: 25,
            y: 25,
            width: 20,
            height: 20,
            aliases: ['room 304', 'soc 304', '304', 'robotics lab 304', 'class 304'],
            provenance: 'SYNTHETIC_DEMO_DATA',
            position3D: [-10, 18, -8]
          },
          {
            id: 'mbu-rm-305',
            campusId: 'mbu-tirupati',
            buildingId: 'mbu-bld-computing',
            floorId: 'mbu-soc-fl-3',
            roomCode: 'SOC-305',
            name: 'Faculty Lounge & Research Scholar Cabin',
            category: 'faculty',
            graphNodeId: 'mbu-ind-f3-rm-faculty',
            x: 75,
            y: 25,
            width: 20,
            height: 20,
            aliases: ['faculty lounge', 'professors room', 'staff room', 'phd scholars'],
            provenance: 'SYNTHETIC_DEMO_DATA',
            position3D: [12, 18, -8]
          },
          {
            id: 'mbu-rm-3-wash',
            campusId: 'mbu-tirupati',
            buildingId: 'mbu-bld-computing',
            floorId: 'mbu-soc-fl-3',
            roomCode: 'SOC-3W',
            name: 'Restrooms (Floor 3)',
            category: 'washroom',
            graphNodeId: 'mbu-ind-f3-rm-wash',
            x: 85,
            y: 75,
            width: 14,
            height: 14,
            aliases: ['washroom', 'toilet', 'restroom'],
            provenance: 'SYNTHETIC_DEMO_DATA',
            position3D: [14, 18, 10]
          }
        ]
      }
    ]
  },
  {
    id: 'mbu-bld-admin',
    campusId: 'mbu-tirupati',
    name: 'University Administrative Block',
    code: 'ADMIN',
    category: 'administrative',
    description: 'Vice Chancellor secretariat, Registrar office, admissions desk, fee counters, and examination wing.',
    coordinates: [13.6255, 79.2965],
    polygon: [
      [13.6252, 79.2960],
      [13.6258, 79.2960],
      [13.6258, 79.2970],
      [13.6252, 79.2970]
    ],
    position3D: [-20, 0, 24],
    dimensions3D: [32, 14, 24],
    color3D: '#B45309',
    modelAssetId: 'dt-mbu-admin-ply-cloud',
    dataStatus: 'partial',
    provenance: 'VERIFIED_PUBLIC_DATA',
    entrances: [
      {
        id: 'mbu-ent-admin-main',
        name: 'Administrative Main Entrance',
        outdoorNodeId: 'mbu-out-node-admin-front',
        indoorNodeId: 'mbu-ind-admin-lobby',
        floorId: 'mbu-admin-fl-0',
        isAccessible: true,
        lat: 13.6254,
        lng: 79.2965,
        position3D: [-20, 0, 36]
      }
    ],
    floors: [
      {
        id: 'mbu-admin-fl-0',
        campusId: 'mbu-tirupati',
        buildingId: 'mbu-bld-admin',
        floorNumber: 0,
        name: 'Ground Floor',
        dataStatus: 'demo',
        bounds: { width: 50, height: 35 },
        connectors: [],
        rooms: [
          {
            id: 'mbu-rm-adm-admissions',
            campusId: 'mbu-tirupati',
            buildingId: 'mbu-bld-admin',
            floorId: 'mbu-admin-fl-0',
            roomCode: 'ADM-01',
            name: 'Admissions & Student Welfare Desk',
            category: 'admin',
            graphNodeId: 'mbu-ind-admin-lobby',
            x: 50,
            y: 50,
            aliases: ['admissions', 'fee counter', 'student welfare', 'helpdesk', 'enquiry office'],
            provenance: 'SYNTHETIC_DEMO_DATA',
            position3D: [-20, 0, 24]
          }
        ]
      }
    ]
  },
  {
    id: 'mbu-bld-library',
    campusId: 'mbu-tirupati',
    name: 'Dr. M. Mohan Babu Central Library',
    code: 'LIB',
    category: 'library',
    description: 'Multi-tier central academic library with digital learning section, journal archives, and reading halls.',
    coordinates: [13.6278, 79.2985],
    polygon: [
      [13.6274, 79.2980],
      [13.6282, 79.2980],
      [13.6282, 79.2990],
      [13.6274, 79.2990]
    ],
    position3D: [40, 0, -30],
    dimensions3D: [30, 16, 26],
    color3D: '#0284C7',
    dataStatus: 'verified',
    provenance: 'VERIFIED_PUBLIC_DATA',
    entrances: [
      {
        id: 'mbu-ent-lib-main',
        name: 'Library Front Entrance',
        outdoorNodeId: 'mbu-out-node-lib-front',
        indoorNodeId: 'mbu-ind-lib-lobby',
        floorId: 'mbu-lib-fl-0',
        isAccessible: true,
        lat: 13.6276,
        lng: 79.2982,
        position3D: [40, 0, -17]
      }
    ],
    floors: [
      {
        id: 'mbu-lib-fl-0',
        campusId: 'mbu-tirupati',
        buildingId: 'mbu-bld-library',
        floorNumber: 0,
        name: 'Ground Floor Reading Hall',
        dataStatus: 'demo',
        bounds: { width: 55, height: 40 },
        connectors: [],
        rooms: [
          {
            id: 'mbu-rm-lib-circulation',
            campusId: 'mbu-tirupati',
            buildingId: 'mbu-bld-library',
            floorId: 'mbu-lib-fl-0',
            roomCode: 'LIB-CIRC',
            name: 'Book Issue & Circulation Counter',
            category: 'library',
            graphNodeId: 'mbu-ind-lib-lobby',
            x: 50,
            y: 50,
            aliases: ['library', 'reading room', 'book issue', 'central library', 'study room', 'books'],
            provenance: 'SYNTHETIC_DEMO_DATA',
            position3D: [40, 0, -30]
          }
        ]
      }
    ]
  },
  {
    id: 'mbu-bld-foodcourt',
    campusId: 'mbu-tirupati',
    name: 'Central Food Court & University Cafeteria',
    code: 'FC',
    category: 'amenity',
    description: 'Multi-cuisine campus dining facility, student cafeteria, coffee house, and bakery counters.',
    coordinates: [13.6260, 79.2992],
    polygon: [
      [13.6256, 79.2988],
      [13.6264, 79.2988],
      [13.6264, 79.2996],
      [13.6256, 79.2996]
    ],
    position3D: [45, 0, 10],
    dimensions3D: [26, 10, 22],
    color3D: '#E11D48',
    dataStatus: 'verified',
    provenance: 'VERIFIED_PUBLIC_DATA',
    entrances: [
      {
        id: 'mbu-ent-fc-main',
        name: 'Food Court North Entry',
        outdoorNodeId: 'mbu-out-node-fc-front',
        indoorNodeId: 'mbu-ind-fc-hall',
        floorId: 'mbu-fc-fl-0',
        isAccessible: true,
        lat: 13.6262,
        lng: 79.2990,
        position3D: [45, 0, -1]
      }
    ],
    floors: [
      {
        id: 'mbu-fc-fl-0',
        campusId: 'mbu-tirupati',
        buildingId: 'mbu-bld-foodcourt',
        floorNumber: 0,
        name: 'Dining Hall',
        dataStatus: 'demo',
        bounds: { width: 50, height: 35 },
        connectors: [],
        rooms: [
          {
            id: 'mbu-rm-canteen-counter',
            campusId: 'mbu-tirupati',
            buildingId: 'mbu-bld-foodcourt',
            floorId: 'mbu-fc-fl-0',
            roomCode: 'FC-MAIN',
            name: 'Campus Canteen & Beverage Counter',
            category: 'canteen',
            graphNodeId: 'mbu-ind-fc-hall',
            x: 50,
            y: 50,
            aliases: ['canteen', 'cafeteria', 'food court', 'mess', 'lunch', 'coffee', 'snacks', 'eating'],
            provenance: 'SYNTHETIC_DEMO_DATA',
            position3D: [45, 0, 10]
          }
        ]
      }
    ]
  },
  {
    id: 'mbu-bld-health',
    campusId: 'mbu-tirupati',
    name: 'Campus Health & Wellness Centre',
    code: 'HC',
    category: 'health',
    description: '24/7 medical dispensary, emergency outpatient care, first aid clinic, and ambulance station.',
    coordinates: [13.6285, 79.2960],
    polygon: [
      [13.6282, 79.2957],
      [13.6288, 79.2957],
      [13.6288, 79.2963],
      [13.6282, 79.2963]
    ],
    position3D: [-25, 0, -45],
    dimensions3D: [20, 8, 16],
    color3D: '#10B981',
    dataStatus: 'verified',
    provenance: 'VERIFIED_PUBLIC_DATA',
    entrances: [
      {
        id: 'mbu-ent-hc-main',
        name: 'Health Centre Emergency Gate',
        outdoorNodeId: 'mbu-out-node-hc-front',
        indoorNodeId: 'mbu-ind-hc-opd',
        floorId: 'mbu-hc-fl-0',
        isAccessible: true,
        lat: 13.6284,
        lng: 79.2960,
        position3D: [-25, 0, -37]
      }
    ],
    floors: [
      {
        id: 'mbu-hc-fl-0',
        campusId: 'mbu-tirupati',
        buildingId: 'mbu-bld-health',
        floorNumber: 0,
        name: 'Dispensary & OPD',
        dataStatus: 'demo',
        bounds: { width: 35, height: 25 },
        connectors: [],
        rooms: [
          {
            id: 'mbu-rm-hc-opd',
            campusId: 'mbu-tirupati',
            buildingId: 'mbu-bld-health',
            floorId: 'mbu-hc-fl-0',
            roomCode: 'HC-01',
            name: 'Dispensary Doctor Room',
            category: 'admin',
            graphNodeId: 'mbu-ind-hc-opd',
            x: 50,
            y: 50,
            aliases: ['health centre', 'health center', 'clinic', 'dispensary', 'hospital', 'doctor', 'first aid', 'medical room', 'medicine'],
            provenance: 'SYNTHETIC_DEMO_DATA',
            position3D: [-25, 0, -45]
          }
        ]
      }
    ]
  }
];

export const mbuPOIs: POI[] = [
  {
    id: 'mbu-poi-gate1',
    campusId: 'mbu-tirupati',
    name: 'MBU Main Entrance Gate (South)',
    category: 'gate',
    aliases: ['main gate', 'south gate', 'entrance gate', 'mbu arch', 'entry gate', 'campus entrance'],
    coordinate: [13.6245, 79.2968],
    outdoorNodeId: 'mbu-out-node-gate1',
    position3D: [0, 0, 55],
    description: 'Primary vehicular and pedestrian arch entrance on Chandragiri highway.',
    provenance: 'VERIFIED_PUBLIC_DATA'
  },
  {
    id: 'mbu-poi-gate2',
    campusId: 'mbu-tirupati',
    name: 'MBU North Gate & Bus Depot',
    category: 'gate',
    aliases: ['north gate', 'bus bay', 'depot gate', 'exit gate'],
    coordinate: [13.6295, 79.2970],
    outdoorNodeId: 'mbu-out-node-gate2',
    position3D: [6, 0, -65],
    description: 'North perimeter gate adjacent to university student transport terminal.',
    provenance: 'VERIFIED_PUBLIC_DATA'
  },
  {
    id: 'mbu-poi-atm',
    campusId: 'mbu-tirupati',
    name: 'SBI Bank Campus ATM',
    category: 'atm',
    aliases: ['atm', 'bank', 'cash machine', 'money', 'sbi atm'],
    coordinate: [13.6253, 79.2972],
    outdoorNodeId: 'mbu-out-node-atm',
    position3D: [10, 0, 38],
    description: '24-hour State Bank of India cash withdrawal machine near Administrative block.',
    provenance: 'VERIFIED_PUBLIC_DATA'
  },
  {
    id: 'mbu-poi-parking',
    campusId: 'mbu-tirupati',
    name: 'Student & Visitor Vehicle Parking Lot',
    category: 'parking',
    aliases: ['parking', 'car park', 'bike parking', 'scooter stand', 'vehicle lot'],
    coordinate: [13.6250, 79.2958],
    outdoorNodeId: 'mbu-out-node-parking',
    position3D: [-35, 0, 42],
    description: 'Paved multi-bay vehicle parking zone with bicycle racks and car slots.',
    provenance: 'VERIFIED_PUBLIC_DATA'
  },
  {
    id: 'mbu-poi-sports',
    campusId: 'mbu-tirupati',
    name: 'University Sports Pavilion & Stadium Ground',
    category: 'sports',
    aliases: ['cricket ground', 'football ground', 'sports complex', 'stadium', 'play ground', 'track'],
    coordinate: [13.6288, 79.2995],
    outdoorNodeId: 'mbu-out-node-sports',
    position3D: [60, 0, -50],
    description: 'Outdoor athletic track, turf cricket pitch, and covered spectator gallery.',
    provenance: 'VERIFIED_PUBLIC_DATA'
  }
];

export const mbuNavigationGraph: NavigationGraph = {
  campusId: 'mbu-tirupati',
  nodes: {
    // Outdoor nodes
    'mbu-out-node-gate1': { id: 'mbu-out-node-gate1', campusId: 'mbu-tirupati', type: 'gate', lat: 13.6245, lng: 79.2968, name: 'Main Gate Arch' },
    'mbu-out-node-parking': { id: 'mbu-out-node-parking', campusId: 'mbu-tirupati', type: 'parking', lat: 13.6250, lng: 79.2958, name: 'Main Parking' },
    'mbu-out-node-atm': { id: 'mbu-out-node-atm', campusId: 'mbu-tirupati', type: 'outdoor', lat: 13.6253, lng: 79.2972, name: 'Bank ATM Point' },
    'mbu-out-node-junc-main': { id: 'mbu-out-node-junc-main', campusId: 'mbu-tirupati', type: 'outdoor', lat: 13.6252, lng: 79.2967, name: 'South Central Junction' },
    'mbu-out-node-admin-front': { id: 'mbu-out-node-admin-front', campusId: 'mbu-tirupati', type: 'entrance', lat: 13.6254, lng: 79.2965, name: 'Admin Entrance Walk' },
    'mbu-out-node-spine-mid': { id: 'mbu-out-node-spine-mid', campusId: 'mbu-tirupati', type: 'outdoor', lat: 13.6264, lng: 79.2968, name: 'Campus Spine Midpoint' },
    'mbu-out-node-soc-front': { id: 'mbu-out-node-soc-front', campusId: 'mbu-tirupati', type: 'entrance', lat: 13.6268, lng: 79.2970, name: 'School of Computing South Approach' },
    'mbu-out-node-soc-east': { id: 'mbu-out-node-soc-east', campusId: 'mbu-tirupati', type: 'entrance', lat: 13.6272, lng: 79.2975, name: 'School of Computing East Plaza' },
    'mbu-out-node-fc-front': { id: 'mbu-out-node-fc-front', campusId: 'mbu-tirupati', type: 'entrance', lat: 13.6262, lng: 79.2990, name: 'Food Court Plaza' },
    'mbu-out-node-lib-front': { id: 'mbu-out-node-lib-front', campusId: 'mbu-tirupati', type: 'entrance', lat: 13.6276, lng: 79.2982, name: 'Central Library Forecourt' },
    'mbu-out-node-hc-front': { id: 'mbu-out-node-hc-front', campusId: 'mbu-tirupati', type: 'entrance', lat: 13.6284, lng: 79.2960, name: 'Health Centre Entrance' },
    'mbu-out-node-sports': { id: 'mbu-out-node-sports', campusId: 'mbu-tirupati', type: 'outdoor', lat: 13.6288, lng: 79.2995, name: 'Sports Complex Pavilion' },
    'mbu-out-node-gate2': { id: 'mbu-out-node-gate2', campusId: 'mbu-tirupati', type: 'gate', lat: 13.6295, lng: 79.2970, name: 'North Campus Gate' },

    // Indoor School of Computing Floor 0
    'mbu-ind-f0-lobby': { id: 'mbu-ind-f0-lobby', campusId: 'mbu-tirupati', type: 'entrance', buildingId: 'mbu-bld-computing', floorId: 'mbu-soc-fl-0', floorNumber: 0, x: 50, y: 90, name: 'SOC Ground Floor Lobby' },
    'mbu-ind-f0-east-ramp': { id: 'mbu-ind-f0-east-ramp', campusId: 'mbu-tirupati', type: 'entrance', buildingId: 'mbu-bld-computing', floorId: 'mbu-soc-fl-0', floorNumber: 0, x: 90, y: 50, name: 'East Accessible Ramp' },
    'mbu-ind-f0-corridor-ctr': { id: 'mbu-ind-f0-corridor-ctr', campusId: 'mbu-tirupati', type: 'corridor', buildingId: 'mbu-bld-computing', floorId: 'mbu-soc-fl-0', floorNumber: 0, x: 50, y: 50, name: 'Ground Central Junction' },
    'mbu-ind-f0-stairs-a': { id: 'mbu-ind-f0-stairs-a', campusId: 'mbu-tirupati', type: 'stairs', buildingId: 'mbu-bld-computing', floorId: 'mbu-soc-fl-0', floorNumber: 0, x: 50, y: 45, name: 'Stairs A Ground Landing' },
    'mbu-ind-f0-elevator': { id: 'mbu-ind-f0-elevator', campusId: 'mbu-tirupati', type: 'elevator', buildingId: 'mbu-bld-computing', floorId: 'mbu-soc-fl-0', floorNumber: 0, x: 55, y: 45, name: 'Ground Elevator Door' },
    'mbu-ind-f0-rm-dean': { id: 'mbu-ind-f0-rm-dean', campusId: 'mbu-tirupati', type: 'room', buildingId: 'mbu-bld-computing', floorId: 'mbu-soc-fl-0', floorNumber: 0, x: 25, y: 25, name: 'Dean Cabin Door' },
    'mbu-ind-f0-rm-dsa': { id: 'mbu-ind-f0-rm-dsa', campusId: 'mbu-tirupati', type: 'room', buildingId: 'mbu-bld-computing', floorId: 'mbu-soc-fl-0', floorNumber: 0, x: 75, y: 25, name: 'DSA Lab Door' },
    'mbu-ind-f0-rm-wash-m': { id: 'mbu-ind-f0-rm-wash-m', campusId: 'mbu-tirupati', type: 'room', buildingId: 'mbu-bld-computing', floorId: 'mbu-soc-fl-0', floorNumber: 0, x: 15, y: 75, name: 'Gents Washroom Entrance' },
    'mbu-ind-f0-rm-wash-f': { id: 'mbu-ind-f0-rm-wash-f', campusId: 'mbu-tirupati', type: 'room', buildingId: 'mbu-bld-computing', floorId: 'mbu-soc-fl-0', floorNumber: 0, x: 85, y: 75, name: 'Ladies Washroom Entrance' },

    // Indoor School of Computing Floor 1
    'mbu-ind-f1-corridor-ctr': { id: 'mbu-ind-f1-corridor-ctr', campusId: 'mbu-tirupati', type: 'corridor', buildingId: 'mbu-bld-computing', floorId: 'mbu-soc-fl-1', floorNumber: 1, x: 50, y: 50, name: '1st Floor Hallway' },
    'mbu-ind-f1-stairs-a': { id: 'mbu-ind-f1-stairs-a', campusId: 'mbu-tirupati', type: 'stairs', buildingId: 'mbu-bld-computing', floorId: 'mbu-soc-fl-1', floorNumber: 1, x: 50, y: 45, name: 'Stairs A 1st Floor' },
    'mbu-ind-f1-elevator': { id: 'mbu-ind-f1-elevator', campusId: 'mbu-tirupati', type: 'elevator', buildingId: 'mbu-bld-computing', floorId: 'mbu-soc-fl-1', floorNumber: 1, x: 55, y: 45, name: '1st Floor Elevator Door' },
    'mbu-ind-f1-rm-101': { id: 'mbu-ind-f1-rm-101', campusId: 'mbu-tirupati', type: 'room', buildingId: 'mbu-bld-computing', floorId: 'mbu-soc-fl-1', floorNumber: 1, x: 25, y: 25, name: 'Lecture Hall 101' },
    'mbu-ind-f1-rm-ai-lab': { id: 'mbu-ind-f1-rm-ai-lab', campusId: 'mbu-tirupati', type: 'room', buildingId: 'mbu-bld-computing', floorId: 'mbu-soc-fl-1', floorNumber: 1, x: 75, y: 25, name: 'AI & Deep Learning Lab' },
    'mbu-ind-f1-rm-wash': { id: 'mbu-ind-f1-rm-wash', campusId: 'mbu-tirupati', type: 'room', buildingId: 'mbu-bld-computing', floorId: 'mbu-soc-fl-1', floorNumber: 1, x: 15, y: 75, name: 'Floor 1 Restroom' },

    // Indoor School of Computing Floor 2
    'mbu-ind-f2-corridor-ctr': { id: 'mbu-ind-f2-corridor-ctr', campusId: 'mbu-tirupati', type: 'corridor', buildingId: 'mbu-bld-computing', floorId: 'mbu-soc-fl-2', floorNumber: 2, x: 50, y: 50, name: '2nd Floor Hallway' },
    'mbu-ind-f2-stairs-a': { id: 'mbu-ind-f2-stairs-a', campusId: 'mbu-tirupati', type: 'stairs', buildingId: 'mbu-bld-computing', floorId: 'mbu-soc-fl-2', floorNumber: 2, x: 50, y: 45, name: 'Stairs A 2nd Floor' },
    'mbu-ind-f2-elevator': { id: 'mbu-ind-f2-elevator', campusId: 'mbu-tirupati', type: 'elevator', buildingId: 'mbu-bld-computing', floorId: 'mbu-soc-fl-2', floorNumber: 2, x: 55, y: 45, name: '2nd Floor Elevator Door' },
    'mbu-ind-f2-rm-204': { id: 'mbu-ind-f2-rm-204', campusId: 'mbu-tirupati', type: 'room', buildingId: 'mbu-bld-computing', floorId: 'mbu-soc-fl-2', floorNumber: 2, x: 25, y: 25, name: 'Seminar Room 204' },
    'mbu-ind-f2-rm-cloud': { id: 'mbu-ind-f2-rm-cloud', campusId: 'mbu-tirupati', type: 'room', buildingId: 'mbu-bld-computing', floorId: 'mbu-soc-fl-2', floorNumber: 2, x: 75, y: 25, name: 'Cloud Computing Lab' },
    'mbu-ind-f2-rm-wash': { id: 'mbu-ind-f2-rm-wash', campusId: 'mbu-tirupati', type: 'room', buildingId: 'mbu-bld-computing', floorId: 'mbu-soc-fl-2', floorNumber: 2, x: 85, y: 75, name: 'Floor 2 Restroom' },

    // Indoor School of Computing Floor 3
    'mbu-ind-f3-corridor-ctr': { id: 'mbu-ind-f3-corridor-ctr', campusId: 'mbu-tirupati', type: 'corridor', buildingId: 'mbu-bld-computing', floorId: 'mbu-soc-fl-3', floorNumber: 3, x: 50, y: 50, name: '3rd Floor Hallway' },
    'mbu-ind-f3-stairs-a': { id: 'mbu-ind-f3-stairs-a', campusId: 'mbu-tirupati', type: 'stairs', buildingId: 'mbu-bld-computing', floorId: 'mbu-soc-fl-3', floorNumber: 3, x: 50, y: 45, name: 'Stairs A 3rd Floor' },
    'mbu-ind-f3-elevator': { id: 'mbu-ind-f3-elevator', campusId: 'mbu-tirupati', type: 'elevator', buildingId: 'mbu-bld-computing', floorId: 'mbu-soc-fl-3', floorNumber: 3, x: 55, y: 45, name: '3rd Floor Elevator Door' },
    'mbu-ind-f3-rm-304': { id: 'mbu-ind-f3-rm-304', campusId: 'mbu-tirupati', type: 'room', buildingId: 'mbu-bld-computing', floorId: 'mbu-soc-fl-3', floorNumber: 3, x: 25, y: 25, name: 'Room 304 (Robotics Lab)' },
    'mbu-ind-f3-rm-faculty': { id: 'mbu-ind-f3-rm-faculty', campusId: 'mbu-tirupati', type: 'room', buildingId: 'mbu-bld-computing', floorId: 'mbu-soc-fl-3', floorNumber: 3, x: 75, y: 25, name: 'Faculty Cabin' },
    'mbu-ind-f3-rm-wash': { id: 'mbu-ind-f3-rm-wash', campusId: 'mbu-tirupati', type: 'room', buildingId: 'mbu-bld-computing', floorId: 'mbu-soc-fl-3', floorNumber: 3, x: 85, y: 75, name: 'Floor 3 Restroom' },

    // Other Building Interior Nodes
    'mbu-ind-admin-lobby': { id: 'mbu-ind-admin-lobby', campusId: 'mbu-tirupati', type: 'room', buildingId: 'mbu-bld-admin', floorId: 'mbu-admin-fl-0', floorNumber: 0, x: 50, y: 50, name: 'Admin Block Counter' },
    'mbu-ind-lib-lobby': { id: 'mbu-ind-lib-lobby', campusId: 'mbu-tirupati', type: 'room', buildingId: 'mbu-bld-library', floorId: 'mbu-lib-fl-0', floorNumber: 0, x: 50, y: 50, name: 'Library Front Desk' },
    'mbu-ind-fc-hall': { id: 'mbu-ind-fc-hall', campusId: 'mbu-tirupati', type: 'room', buildingId: 'mbu-bld-foodcourt', floorId: 'mbu-fc-fl-0', floorNumber: 0, x: 50, y: 50, name: 'Food Court Counter' },
    'mbu-ind-hc-opd': { id: 'mbu-ind-hc-opd', campusId: 'mbu-tirupati', type: 'room', buildingId: 'mbu-bld-health', floorId: 'mbu-hc-fl-0', floorNumber: 0, x: 50, y: 50, name: 'Health Centre Doctor Room' }
  },
  edges: [
    // Outdoor main pathways
    { id: 'mbu-e-1', campusId: 'mbu-tirupati', fromNodeId: 'mbu-out-node-gate1', toNodeId: 'mbu-out-node-junc-main', distanceMeters: 80, allowedModes: ['walk', 'bicycle', 'car'], isAccessible: true, isOutdoor: true, name: 'Main Campus Boulevard' },
    { id: 'mbu-e-2', campusId: 'mbu-tirupati', fromNodeId: 'mbu-out-node-junc-main', toNodeId: 'mbu-out-node-parking', distanceMeters: 90, allowedModes: ['walk', 'bicycle', 'car'], isAccessible: true, isOutdoor: true, name: 'Parking Access Road' },
    { id: 'mbu-e-3', campusId: 'mbu-tirupati', fromNodeId: 'mbu-out-node-junc-main', toNodeId: 'mbu-out-node-atm', distanceMeters: 55, allowedModes: ['walk', 'bicycle'], isAccessible: true, isOutdoor: true, name: 'Bank Walkway' },
    { id: 'mbu-e-4', campusId: 'mbu-tirupati', fromNodeId: 'mbu-out-node-junc-main', toNodeId: 'mbu-out-node-admin-front', distanceMeters: 40, allowedModes: ['walk', 'bicycle', 'car'], isAccessible: true, isOutdoor: true, name: 'Administrative Driveway' },
    { id: 'mbu-e-5', campusId: 'mbu-tirupati', fromNodeId: 'mbu-out-node-junc-main', toNodeId: 'mbu-out-node-spine-mid', distanceMeters: 135, allowedModes: ['walk', 'bicycle', 'car'], isAccessible: true, isOutdoor: true, name: 'Central Academic Avenue' },
    { id: 'mbu-e-6', campusId: 'mbu-tirupati', fromNodeId: 'mbu-out-node-spine-mid', toNodeId: 'mbu-out-node-soc-front', distanceMeters: 50, allowedModes: ['walk', 'bicycle'], isAccessible: true, isOutdoor: true, name: 'Computing Block Walkway' },
    { id: 'mbu-e-7', campusId: 'mbu-tirupati', fromNodeId: 'mbu-out-node-soc-front', toNodeId: 'mbu-out-node-soc-east', distanceMeters: 65, allowedModes: ['walk', 'bicycle'], isAccessible: true, isOutdoor: true, name: 'SOC East Promenade' },
    { id: 'mbu-e-8', campusId: 'mbu-tirupati', fromNodeId: 'mbu-out-node-spine-mid', toNodeId: 'mbu-out-node-fc-front', distanceMeters: 220, allowedModes: ['walk', 'bicycle', 'car'], isAccessible: true, isOutdoor: true, name: 'Canteen Road' },
    { id: 'mbu-e-9', campusId: 'mbu-tirupati', fromNodeId: 'mbu-out-node-spine-mid', toNodeId: 'mbu-out-node-lib-front', distanceMeters: 180, allowedModes: ['walk', 'bicycle'], isAccessible: true, isOutdoor: true, name: 'Library Walkway' },
    { id: 'mbu-e-10', campusId: 'mbu-tirupati', fromNodeId: 'mbu-out-node-spine-mid', toNodeId: 'mbu-out-node-hc-front', distanceMeters: 240, allowedModes: ['walk', 'bicycle', 'car'], isAccessible: true, isOutdoor: true, name: 'Health Centre Access' },
    { id: 'mbu-e-11', campusId: 'mbu-tirupati', fromNodeId: 'mbu-out-node-lib-front', toNodeId: 'mbu-out-node-sports', distanceMeters: 190, allowedModes: ['walk', 'bicycle'], isAccessible: true, isOutdoor: true, name: 'Sports Avenue' },
    { id: 'mbu-e-12', campusId: 'mbu-tirupati', fromNodeId: 'mbu-out-node-soc-front', toNodeId: 'mbu-out-node-gate2', distanceMeters: 300, allowedModes: ['walk', 'bicycle', 'car'], isAccessible: true, isOutdoor: true, name: 'North Ring Road' },

    // Building Entrance transitions (Outdoor -> Indoor)
    { id: 'mbu-tr-soc-main', campusId: 'mbu-tirupati', fromNodeId: 'mbu-out-node-soc-front', toNodeId: 'mbu-ind-f0-lobby', distanceMeters: 10, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, name: 'Enter Computing Block' },
    { id: 'mbu-tr-soc-east', campusId: 'mbu-tirupati', fromNodeId: 'mbu-out-node-soc-east', toNodeId: 'mbu-ind-f0-east-ramp', distanceMeters: 8, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, name: 'Enter via East Ramp' },
    { id: 'mbu-tr-admin', campusId: 'mbu-tirupati', fromNodeId: 'mbu-out-node-admin-front', toNodeId: 'mbu-ind-admin-lobby', distanceMeters: 12, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, name: 'Enter Admin Block' },
    { id: 'mbu-tr-lib', campusId: 'mbu-tirupati', fromNodeId: 'mbu-out-node-lib-front', toNodeId: 'mbu-ind-lib-lobby', distanceMeters: 15, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, name: 'Enter Central Library' },
    { id: 'mbu-tr-fc', campusId: 'mbu-tirupati', fromNodeId: 'mbu-out-node-fc-front', toNodeId: 'mbu-ind-fc-hall', distanceMeters: 10, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, name: 'Enter Food Court' },
    { id: 'mbu-tr-hc', campusId: 'mbu-tirupati', fromNodeId: 'mbu-out-node-hc-front', toNodeId: 'mbu-ind-hc-opd', distanceMeters: 8, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, name: 'Enter Health Centre' },

    // Indoor Floor 0 Corridor Connections
    { id: 'mbu-ind-e-f0-1', campusId: 'mbu-tirupati', fromNodeId: 'mbu-ind-f0-lobby', toNodeId: 'mbu-ind-f0-corridor-ctr', distanceMeters: 16, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, floorId: 'mbu-soc-fl-0', name: 'Ground Floor Foyer' },
    { id: 'mbu-ind-e-f0-2', campusId: 'mbu-tirupati', fromNodeId: 'mbu-ind-f0-east-ramp', toNodeId: 'mbu-ind-f0-corridor-ctr', distanceMeters: 20, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, floorId: 'mbu-soc-fl-0', name: 'East Corridor' },
    { id: 'mbu-ind-e-f0-3', campusId: 'mbu-tirupati', fromNodeId: 'mbu-ind-f0-corridor-ctr', toNodeId: 'mbu-ind-f0-stairs-a', distanceMeters: 5, allowedModes: ['walk'], isAccessible: false, isOutdoor: false, floorId: 'mbu-soc-fl-0', name: 'Stairs Landing' },
    { id: 'mbu-ind-e-f0-4', campusId: 'mbu-tirupati', fromNodeId: 'mbu-ind-f0-corridor-ctr', toNodeId: 'mbu-ind-f0-elevator', distanceMeters: 6, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, floorId: 'mbu-soc-fl-0', name: 'Elevator Landing' },
    { id: 'mbu-ind-e-f0-5', campusId: 'mbu-tirupati', fromNodeId: 'mbu-ind-f0-corridor-ctr', toNodeId: 'mbu-ind-f0-rm-dean', distanceMeters: 15, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, floorId: 'mbu-soc-fl-0', name: 'West Wing Corridor' },
    { id: 'mbu-ind-e-f0-6', campusId: 'mbu-tirupati', fromNodeId: 'mbu-ind-f0-corridor-ctr', toNodeId: 'mbu-ind-f0-rm-dsa', distanceMeters: 15, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, floorId: 'mbu-soc-fl-0', name: 'East Wing Corridor' },
    { id: 'mbu-ind-e-f0-7', campusId: 'mbu-tirupati', fromNodeId: 'mbu-ind-f0-lobby', toNodeId: 'mbu-ind-f0-rm-wash-m', distanceMeters: 14, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, floorId: 'mbu-soc-fl-0', name: 'Gents Washroom Corridor' },
    { id: 'mbu-ind-e-f0-8', campusId: 'mbu-tirupati', fromNodeId: 'mbu-ind-f0-lobby', toNodeId: 'mbu-ind-f0-rm-wash-f', distanceMeters: 14, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, floorId: 'mbu-soc-fl-0', name: 'Ladies Washroom Corridor' },

    // Vertical Transitions: Ground (0) <-> First (1)
    { id: 'mbu-v-st-0-1', campusId: 'mbu-tirupati', fromNodeId: 'mbu-ind-f0-stairs-a', toNodeId: 'mbu-ind-f1-stairs-a', distanceMeters: 12, allowedModes: ['walk'], isAccessible: false, isStairs: true, isOutdoor: false, name: 'Take Stairs A to 1st Floor' },
    { id: 'mbu-v-el-0-1', campusId: 'mbu-tirupati', fromNodeId: 'mbu-ind-f0-elevator', toNodeId: 'mbu-ind-f1-elevator', distanceMeters: 10, allowedModes: ['walk'], isAccessible: true, isElevator: true, isOutdoor: false, name: 'Take Elevator to 1st Floor' },

    // Indoor Floor 1 Connections
    { id: 'mbu-ind-e-f1-1', campusId: 'mbu-tirupati', fromNodeId: 'mbu-ind-f1-stairs-a', toNodeId: 'mbu-ind-f1-corridor-ctr', distanceMeters: 5, allowedModes: ['walk'], isAccessible: false, isOutdoor: false, floorId: 'mbu-soc-fl-1', name: '1st Floor Landing' },
    { id: 'mbu-ind-e-f1-2', campusId: 'mbu-tirupati', fromNodeId: 'mbu-ind-f1-elevator', toNodeId: 'mbu-ind-f1-corridor-ctr', distanceMeters: 6, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, floorId: 'mbu-soc-fl-1', name: '1st Floor Elevator Foyer' },
    { id: 'mbu-ind-e-f1-3', campusId: 'mbu-tirupati', fromNodeId: 'mbu-ind-f1-corridor-ctr', toNodeId: 'mbu-ind-f1-rm-101', distanceMeters: 14, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, floorId: 'mbu-soc-fl-1', name: 'Walk to Room 101' },
    { id: 'mbu-ind-e-f1-4', campusId: 'mbu-tirupati', fromNodeId: 'mbu-ind-f1-corridor-ctr', toNodeId: 'mbu-ind-f1-rm-ai-lab', distanceMeters: 15, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, floorId: 'mbu-soc-fl-1', name: 'Walk to AI Lab' },
    { id: 'mbu-ind-e-f1-5', campusId: 'mbu-tirupati', fromNodeId: 'mbu-ind-f1-corridor-ctr', toNodeId: 'mbu-ind-f1-rm-wash', distanceMeters: 16, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, floorId: 'mbu-soc-fl-1', name: 'Walk to Floor 1 Restroom' },

    // Vertical Transitions: First (1) <-> Second (2)
    { id: 'mbu-v-st-1-2', campusId: 'mbu-tirupati', fromNodeId: 'mbu-ind-f1-stairs-a', toNodeId: 'mbu-ind-f2-stairs-a', distanceMeters: 12, allowedModes: ['walk'], isAccessible: false, isStairs: true, isOutdoor: false, name: 'Take Stairs A to 2nd Floor' },
    { id: 'mbu-v-el-1-2', campusId: 'mbu-tirupati', fromNodeId: 'mbu-ind-f1-elevator', toNodeId: 'mbu-ind-f2-elevator', distanceMeters: 10, allowedModes: ['walk'], isAccessible: true, isElevator: true, isOutdoor: false, name: 'Take Elevator to 2nd Floor' },

    // Indoor Floor 2 Connections
    { id: 'mbu-ind-e-f2-1', campusId: 'mbu-tirupati', fromNodeId: 'mbu-ind-f2-stairs-a', toNodeId: 'mbu-ind-f2-corridor-ctr', distanceMeters: 5, allowedModes: ['walk'], isAccessible: false, isOutdoor: false, floorId: 'mbu-soc-fl-2', name: '2nd Floor Landing' },
    { id: 'mbu-ind-e-f2-2', campusId: 'mbu-tirupati', fromNodeId: 'mbu-ind-f2-elevator', toNodeId: 'mbu-ind-f2-corridor-ctr', distanceMeters: 6, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, floorId: 'mbu-soc-fl-2', name: '2nd Floor Elevator Foyer' },
    { id: 'mbu-ind-e-f2-3', campusId: 'mbu-tirupati', fromNodeId: 'mbu-ind-f2-corridor-ctr', toNodeId: 'mbu-ind-f2-rm-204', distanceMeters: 14, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, floorId: 'mbu-soc-fl-2', name: 'Walk to Seminar Room 204' },
    { id: 'mbu-ind-e-f2-4', campusId: 'mbu-tirupati', fromNodeId: 'mbu-ind-f2-corridor-ctr', toNodeId: 'mbu-ind-f2-rm-cloud', distanceMeters: 15, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, floorId: 'mbu-soc-fl-2', name: 'Walk to Cloud Lab' },
    { id: 'mbu-ind-e-f2-5', campusId: 'mbu-tirupati', fromNodeId: 'mbu-ind-f2-corridor-ctr', toNodeId: 'mbu-ind-f2-rm-wash', distanceMeters: 16, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, floorId: 'mbu-soc-fl-2', name: 'Walk to Floor 2 Washroom' },

    // Vertical Transitions: Second (2) <-> Third (3)
    { id: 'mbu-v-st-2-3', campusId: 'mbu-tirupati', fromNodeId: 'mbu-ind-f2-stairs-a', toNodeId: 'mbu-ind-f3-stairs-a', distanceMeters: 12, allowedModes: ['walk'], isAccessible: false, isStairs: true, isOutdoor: false, name: 'Take Stairs A to 3rd Floor' },
    { id: 'mbu-v-el-2-3', campusId: 'mbu-tirupati', fromNodeId: 'mbu-ind-f2-elevator', toNodeId: 'mbu-ind-f3-elevator', distanceMeters: 10, allowedModes: ['walk'], isAccessible: true, isElevator: true, isOutdoor: false, name: 'Take Elevator to 3rd Floor' },

    // Indoor Floor 3 Connections
    { id: 'mbu-ind-e-f3-1', campusId: 'mbu-tirupati', fromNodeId: 'mbu-ind-f3-stairs-a', toNodeId: 'mbu-ind-f3-corridor-ctr', distanceMeters: 5, allowedModes: ['walk'], isAccessible: false, isOutdoor: false, floorId: 'mbu-soc-fl-3', name: '3rd Floor Landing' },
    { id: 'mbu-ind-e-f3-2', campusId: 'mbu-tirupati', fromNodeId: 'mbu-ind-f3-elevator', toNodeId: 'mbu-ind-f3-corridor-ctr', distanceMeters: 6, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, floorId: 'mbu-soc-fl-3', name: '3rd Floor Elevator Foyer' },
    { id: 'mbu-ind-e-f3-3', campusId: 'mbu-tirupati', fromNodeId: 'mbu-ind-f3-corridor-ctr', toNodeId: 'mbu-ind-f3-rm-304', distanceMeters: 15, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, floorId: 'mbu-soc-fl-3', name: 'Walk to Room 304' },
    { id: 'mbu-ind-e-f3-4', campusId: 'mbu-tirupati', fromNodeId: 'mbu-ind-f3-corridor-ctr', toNodeId: 'mbu-ind-f3-rm-faculty', distanceMeters: 15, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, floorId: 'mbu-soc-fl-3', name: 'Walk to Faculty Lounge' },
    { id: 'mbu-ind-e-f3-5', campusId: 'mbu-tirupati', fromNodeId: 'mbu-ind-f3-corridor-ctr', toNodeId: 'mbu-ind-f3-rm-wash', distanceMeters: 16, allowedModes: ['walk'], isAccessible: true, isOutdoor: false, floorId: 'mbu-soc-fl-3', name: 'Walk to Floor 3 Washroom' }
  ]
};

// Synthetic Wi-Fi Fingerprint Database for MBU
export const mbuWiFiFingerprints: WiFiFingerprintSample[] = [
  {
    id: 'mbu-fp-f0-lobby',
    campusId: 'mbu-tirupati',
    buildingId: 'mbu-bld-computing',
    floorId: 'mbu-soc-fl-0',
    floorNumber: 0,
    nodeId: 'mbu-ind-f0-lobby',
    indoorX: 50,
    indoorY: 90,
    readings: {
      'MBU-AP-SOC-G01': -45,
      'MBU-AP-SOC-G02': -52,
      'MBU-AP-SOC-101': -74,
      'MBU-AP-ADMIN-01': -68,
      'MBU-AP-OUT-SPINE': -62
    },
    sampleType: 'SYNTHETIC_DEMO_DATA'
  },
  {
    id: 'mbu-fp-f0-ctr',
    campusId: 'mbu-tirupati',
    buildingId: 'mbu-bld-computing',
    floorId: 'mbu-soc-fl-0',
    floorNumber: 0,
    nodeId: 'mbu-ind-f0-corridor-ctr',
    indoorX: 50,
    indoorY: 50,
    readings: {
      'MBU-AP-SOC-G01': -42,
      'MBU-AP-SOC-G02': -44,
      'MBU-AP-SOC-101': -68,
      'MBU-AP-SOC-201': -82,
      'MBU-AP-ADMIN-01': -75
    },
    sampleType: 'SYNTHETIC_DEMO_DATA'
  },
  {
    id: 'mbu-fp-f0-wash-m',
    campusId: 'mbu-tirupati',
    buildingId: 'mbu-bld-computing',
    floorId: 'mbu-soc-fl-0',
    floorNumber: 0,
    nodeId: 'mbu-ind-f0-rm-wash-m',
    indoorX: 15,
    indoorY: 75,
    readings: {
      'MBU-AP-SOC-G01': -48,
      'MBU-AP-SOC-G02': -71,
      'MBU-AP-ADMIN-01': -64,
      'MBU-AP-OUT-SPINE': -60
    },
    sampleType: 'SYNTHETIC_DEMO_DATA'
  },
  {
    id: 'mbu-fp-f1-ctr',
    campusId: 'mbu-tirupati',
    buildingId: 'mbu-bld-computing',
    floorId: 'mbu-soc-fl-1',
    floorNumber: 1,
    nodeId: 'mbu-ind-f1-corridor-ctr',
    indoorX: 50,
    indoorY: 50,
    readings: {
      'MBU-AP-SOC-101': -40,
      'MBU-AP-SOC-102': -42,
      'MBU-AP-SOC-G01': -65,
      'MBU-AP-SOC-201': -66,
      'MBU-AP-SOC-301': -84
    },
    sampleType: 'SYNTHETIC_DEMO_DATA'
  },
  {
    id: 'mbu-fp-f1-ai-lab',
    campusId: 'mbu-tirupati',
    buildingId: 'mbu-bld-computing',
    floorId: 'mbu-soc-fl-1',
    floorNumber: 1,
    nodeId: 'mbu-ind-f1-rm-ai-lab',
    indoorX: 75,
    indoorY: 25,
    readings: {
      'MBU-AP-SOC-102': -38,
      'MBU-AP-SOC-101': -51,
      'MBU-AP-SOC-202': -62,
      'MBU-AP-SOC-G02': -69
    },
    sampleType: 'SYNTHETIC_DEMO_DATA'
  },
  {
    id: 'mbu-fp-f2-ctr',
    campusId: 'mbu-tirupati',
    buildingId: 'mbu-bld-computing',
    floorId: 'mbu-soc-fl-2',
    floorNumber: 2,
    nodeId: 'mbu-ind-f2-corridor-ctr',
    indoorX: 50,
    indoorY: 50,
    readings: {
      'MBU-AP-SOC-201': -41,
      'MBU-AP-SOC-202': -45,
      'MBU-AP-SOC-101': -67,
      'MBU-AP-SOC-301': -65,
      'MBU-AP-SOC-G01': -86
    },
    sampleType: 'SYNTHETIC_DEMO_DATA'
  },
  {
    id: 'mbu-fp-f3-ctr',
    campusId: 'mbu-tirupati',
    buildingId: 'mbu-bld-computing',
    floorId: 'mbu-soc-fl-3',
    floorNumber: 3,
    nodeId: 'mbu-ind-f3-corridor-ctr',
    indoorX: 50,
    indoorY: 50,
    readings: {
      'MBU-AP-SOC-301': -39,
      'MBU-AP-SOC-302': -44,
      'MBU-AP-SOC-201': -64,
      'MBU-AP-SOC-101': -83
    },
    sampleType: 'SYNTHETIC_DEMO_DATA'
  },
  {
    id: 'mbu-fp-f3-304',
    campusId: 'mbu-tirupati',
    buildingId: 'mbu-bld-computing',
    floorId: 'mbu-soc-fl-3',
    floorNumber: 3,
    nodeId: 'mbu-ind-f3-rm-304',
    indoorX: 25,
    indoorY: 25,
    readings: {
      'MBU-AP-SOC-301': -42,
      'MBU-AP-SOC-302': -55,
      'MBU-AP-SOC-201': -68,
      'MBU-AP-OUT-SPINE': -88
    },
    sampleType: 'SYNTHETIC_DEMO_DATA'
  }
];

// QR Checkpoints for MBU
export const mbuQRCheckpoints: QRCheckpointPayload[] = [
  {
    version: '1.0',
    campus_id: 'mbu-tirupati',
    building_id: 'mbu-bld-computing',
    floor_id: 'mbu-soc-fl-0',
    checkpoint_id: 'CP-MBU-SOC-G-ENT',
    node_id: 'mbu-ind-f0-lobby',
    label: 'Computing Block South Entrance Checkpoint',
    createdAt: '2026-10-31T09:00:00Z',
    isActive: true,
    provenance: 'VERIFIED_PUBLIC_DATA'
  },
  {
    version: '1.0',
    campus_id: 'mbu-tirupati',
    building_id: 'mbu-bld-computing',
    floor_id: 'mbu-soc-fl-0',
    checkpoint_id: 'CP-MBU-SOC-G-STAIRS',
    node_id: 'mbu-ind-f0-stairs-a',
    label: 'Ground Floor Staircase A Landing',
    createdAt: '2026-10-31T09:00:00Z',
    isActive: true,
    provenance: 'VERIFIED_PUBLIC_DATA'
  },
  {
    version: '1.0',
    campus_id: 'mbu-tirupati',
    building_id: 'mbu-bld-computing',
    floor_id: 'mbu-soc-fl-1',
    checkpoint_id: 'CP-MBU-SOC-1-HALL',
    node_id: 'mbu-ind-f1-corridor-ctr',
    label: 'Floor 1 Central Elevator Corridor Checkpoint',
    createdAt: '2026-10-31T09:00:00Z',
    isActive: true,
    provenance: 'VERIFIED_PUBLIC_DATA'
  },
  {
    version: '1.0',
    campus_id: 'mbu-tirupati',
    building_id: 'mbu-bld-computing',
    floor_id: 'mbu-soc-fl-3',
    checkpoint_id: 'CP-MBU-SOC-3-304',
    node_id: 'mbu-ind-f3-rm-304',
    label: 'Room 304 Robotics Doorway Checkpoint',
    createdAt: '2026-10-31T09:00:00Z',
    isActive: true,
    provenance: 'SYNTHETIC_DEMO_DATA'
  }
];

// Visual Reference Keyframes for Visual Positioning System (VPS) (Brief Section F)
export const mbuVPSKeyframes: VisualReferenceKeyframe[] = [
  {
    id: 'vps-mbu-soc-portico',
    campusId: 'mbu-tirupati',
    buildingId: 'mbu-bld-computing',
    floorId: 'mbu-soc-fl-0',
    nodeId: 'mbu-ind-f0-lobby',
    title: 'Computing Block Main Atrium Arch',
    landmarkDescription: 'Two-story glass façade with university emblem and double glass entrance doors.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=400&q=80',
    featureSignature: 'hash-mbu-vps-atrium-arch-98f2',
    groundTruthPose: { x: 12, y: 1.6, z: -4, pitch: -2.4, yaw: 180.0, roll: 0.1 },
    provenance: 'REAL_CAPTURED_DATA'
  },
  {
    id: 'vps-mbu-soc-f1-lift',
    campusId: 'mbu-tirupati',
    buildingId: 'mbu-bld-computing',
    floorId: 'mbu-soc-fl-1',
    nodeId: 'mbu-ind-f1-corridor-ctr',
    title: 'First Floor Elevator Bank & Directory',
    landmarkDescription: 'Brushed steel elevator surround with illuminated floor indicator and department directory.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80',
    featureSignature: 'hash-mbu-vps-f1-lift-77a1',
    groundTruthPose: { x: 4, y: 7.6, z: 0, pitch: 0.0, yaw: 90.0, roll: 0.0 },
    provenance: 'REAL_CAPTURED_DATA'
  },
  {
    id: 'vps-mbu-soc-f3-304',
    campusId: 'mbu-tirupati',
    buildingId: 'mbu-bld-computing',
    floorId: 'mbu-soc-fl-3',
    nodeId: 'mbu-ind-f3-rm-304',
    title: 'Room 304 Robotics Doorway',
    landmarkDescription: 'Room 304 acrylic nameplate with blue accent door frame and corridor emergency light.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
    featureSignature: 'hash-mbu-vps-f3-304-45e9',
    groundTruthPose: { x: -10, y: 19.6, z: -8, pitch: -1.2, yaw: 270.0, roll: 0.0 },
    provenance: 'SYNTHETIC_DEMO_DATA'
  }
];
