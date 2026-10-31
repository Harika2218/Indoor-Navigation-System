import { CampusId } from './campus';

export type TravelMode = 'walk' | 'bicycle' | 'car';

export type NodeType = 'outdoor' | 'entrance' | 'corridor' | 'room' | 'stairs' | 'elevator' | 'gate' | 'parking';

export interface NavigationNode {
  id: string;
  campusId: CampusId;
  type: NodeType;
  buildingId?: string;
  floorId?: string;
  floorNumber?: number;
  // Outdoor geo coords
  lat?: number;
  lng?: number;
  // Indoor plan relative coords (0..100)
  x?: number;
  y?: number;
  name?: string;
}

export interface NavigationEdge {
  id: string;
  campusId: CampusId;
  fromNodeId: string;
  toNodeId: string;
  distanceMeters: number;
  allowedModes: TravelMode[];
  isAccessible: boolean; // wheelchair accessible
  isStairs?: boolean;
  isElevator?: boolean;
  isOutdoor: boolean;
  name?: string;
  floorId?: string;
}

export interface NavigationGraph {
  campusId: CampusId;
  nodes: Record<string, NavigationNode>;
  edges: NavigationEdge[];
}

export interface RouteInstruction {
  id: string;
  action: 'start' | 'straight' | 'turn_left' | 'turn_right' | 'slight_left' | 'slight_right' | 'enter_building' | 'exit_building' | 'take_stairs' | 'take_elevator' | 'destination';
  text: string;
  subtext?: string;
  distanceMeters: number;
  floorChange?: {
    fromFloor: number;
    toFloor: number;
    connectorType: 'stairs' | 'elevator';
  };
  targetNodeId: string;
  targetFloorId?: string;
  targetBuildingId?: string;
  isIndoor: boolean;
}

export interface RouteSegment {
  id: string;
  type: 'outdoor' | 'indoor';
  buildingId?: string;
  buildingName?: string;
  floorId?: string;
  floorNumber?: number;
  floorName?: string;
  distanceMeters: number;
  estimatedSeconds: number;
  pathNodes: NavigationNode[];
  instructions: RouteInstruction[];
}

export interface RouteResult {
  campusId: CampusId;
  mode: TravelMode;
  totalDistanceMeters: number;
  totalEstimatedSeconds: number;
  nodes: NavigationNode[];
  segments: RouteSegment[];
  instructions: RouteInstruction[];
  isAccessible: boolean;
  crossesFloors: boolean;
  departureNodeId: string;
  destinationNodeId: string;
}
