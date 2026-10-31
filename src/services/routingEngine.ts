import { CampusId } from '../types/campus';
import { NavigationGraph, NavigationNode, NavigationEdge, TravelMode, RouteResult, RouteSegment, RouteInstruction } from '../types/navigation';
import { packageManager } from './packageManager';

interface PriorityQueueItem {
  nodeId: string;
  priority: number;
}

class MinPriorityQueue {
  private items: PriorityQueueItem[] = [];

  enqueue(nodeId: string, priority: number) {
    this.items.push({ nodeId, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }

  dequeue(): string | undefined {
    return this.items.shift()?.nodeId;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

class RoutingEngine {
  findRoute(
    campusId: CampusId,
    startNodeId: string,
    targetNodeId: string,
    mode: TravelMode = 'walk',
    requireAccessible: boolean = false
  ): RouteResult | null {
    const pkg = packageManager.getActivePackage();
    const graph: NavigationGraph = pkg.graph;

    if (graph.campusId !== campusId) {
      return null;
    }

    const startNode = graph.nodes[startNodeId];
    const targetNode = graph.nodes[targetNodeId];

    if (!startNode || !targetNode) {
      return null;
    }

    // Build adjacency list filtered by travel mode and accessibility constraints
    const adj: Record<string, { toNodeId: string; edge: NavigationEdge; weight: number }[]> = {};

    for (const edge of graph.edges) {
      if (edge.campusId !== campusId) continue;

      // Filter mode
      if (!edge.allowedModes.includes(mode)) continue;

      // Filter accessibility (if wheelchair accessible required, disallow stairs)
      if (requireAccessible && (!edge.isAccessible || edge.isStairs)) continue;

      // Bidirectional adjacency
      if (!adj[edge.fromNodeId]) adj[edge.fromNodeId] = [];
      if (!adj[edge.toNodeId]) adj[edge.toNodeId] = [];

      let weight = edge.distanceMeters;
      // Preference adjustments:
      if (edge.isStairs && !requireAccessible) {
        weight *= 1.2; // slight penalty for stairs compared to level walk
      }

      adj[edge.fromNodeId].push({ toNodeId: edge.toNodeId, edge, weight });
      adj[edge.toNodeId].push({ toNodeId: edge.fromNodeId, edge, weight });
    }

    // A* Pathfinding
    const distances: Record<string, number> = {};
    const previousNode: Record<string, string> = {};
    const previousEdge: Record<string, NavigationEdge> = {};
    const openSet = new MinPriorityQueue();

    for (const nodeId in graph.nodes) {
      distances[nodeId] = Infinity;
    }
    distances[startNodeId] = 0;
    openSet.enqueue(startNodeId, this.heuristic(startNode, targetNode));

    const closedSet = new Set<string>();

    while (!openSet.isEmpty()) {
      const currentId = openSet.dequeue()!;
      if (currentId === targetNodeId) break;

      if (closedSet.has(currentId)) continue;
      closedSet.add(currentId);

      const neighbors = adj[currentId] || [];
      for (const { toNodeId, edge, weight } of neighbors) {
        if (closedSet.has(toNodeId)) continue;

        const tentativeDist = distances[currentId] + weight;
        if (tentativeDist < distances[toNodeId]) {
          distances[toNodeId] = tentativeDist;
          previousNode[toNodeId] = currentId;
          previousEdge[toNodeId] = edge;

          const toNode = graph.nodes[toNodeId];
          const fScore = tentativeDist + this.heuristic(toNode, targetNode);
          openSet.enqueue(toNodeId, fScore);
        }
      }
    }

    if (distances[targetNodeId] === Infinity) {
      // No reachable route found
      return null;
    }

    // Reconstruct path
    const pathNodes: NavigationNode[] = [];
    const pathEdges: NavigationEdge[] = [];
    let curr: string | undefined = targetNodeId;

    while (curr) {
      pathNodes.unshift(graph.nodes[curr]);
      const edge = previousEdge[curr];
      if (edge) pathEdges.unshift(edge);
      curr = previousNode[curr];
    }

    const totalDistanceMeters = Math.round(distances[targetNodeId]);
    const speedMps = mode === 'walk' ? 1.3 : mode === 'bicycle' ? 4.2 : 8.5;
    const totalEstimatedSeconds = Math.max(30, Math.round(totalDistanceMeters / speedMps));

    // Deconstruct into segments and generate turn-by-turn guidance
    const { segments, instructions } = this.buildSegmentsAndInstructions(pathNodes, pathEdges, mode);

    const crossesFloors = pathNodes.some((n, idx) => {
      if (idx === 0) return false;
      const prev = pathNodes[idx - 1];
      return (
        n.buildingId === prev.buildingId &&
        n.floorNumber !== undefined &&
        prev.floorNumber !== undefined &&
        n.floorNumber !== prev.floorNumber
      );
    });

    return {
      campusId,
      mode,
      totalDistanceMeters,
      totalEstimatedSeconds,
      nodes: pathNodes,
      segments,
      instructions,
      isAccessible: !pathEdges.some(e => e.isStairs),
      crossesFloors,
      departureNodeId: startNodeId,
      destinationNodeId: targetNodeId
    };
  }

  private heuristic(a: NavigationNode, b: NavigationNode): number {
    // Both outdoor
    if (a.lat !== undefined && a.lng !== undefined && b.lat !== undefined && b.lng !== undefined) {
      return this.haversineDistanceMeters(a.lat, a.lng, b.lat, b.lng);
    }

    // Same indoor building
    if (a.buildingId && a.buildingId === b.buildingId) {
      const dx = (a.x || 0) - (b.x || 0);
      const dy = (a.y || 0) - (b.y || 0);
      const floorDiff = Math.abs((a.floorNumber || 0) - (b.floorNumber || 0));
      return Math.sqrt(dx * dx + dy * dy) * 0.6 + floorDiff * 10;
    }

    // Cross indoor-outdoor estimate
    return 30;
  }

  private haversineDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth radius in meters
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private buildSegmentsAndInstructions(
    nodes: NavigationNode[],
    edges: NavigationEdge[],
    mode: TravelMode
  ): { segments: RouteSegment[]; instructions: RouteInstruction[] } {
    const segments: RouteSegment[] = [];
    const instructions: RouteInstruction[] = [];

    if (nodes.length === 0) return { segments, instructions };

    // Initial instruction
    const firstNode = nodes[0];
    instructions.push({
      id: 'inst-0',
      action: 'start',
      text: `Start at ${firstNode.name || 'current location'}`,
      subtext: `Travel via ${mode}`,
      distanceMeters: 0,
      targetNodeId: firstNode.id,
      isIndoor: !!firstNode.buildingId
    });

    let currentSegment: RouteSegment = {
      id: `seg-0`,
      type: firstNode.buildingId ? 'indoor' : 'outdoor',
      buildingId: firstNode.buildingId,
      floorId: firstNode.floorId,
      floorNumber: firstNode.floorNumber,
      distanceMeters: 0,
      estimatedSeconds: 0,
      pathNodes: [firstNode],
      instructions: []
    };

    for (let i = 0; i < edges.length; i++) {
      const edge = edges[i];
      const fromN = nodes[i];
      const toN = nodes[i + 1];

      currentSegment.distanceMeters += edge.distanceMeters;
      currentSegment.pathNodes.push(toN);

      // Check for transition events
      if (fromN.buildingId !== toN.buildingId) {
        if (!fromN.buildingId && toN.buildingId) {
          // Entering building
          instructions.push({
            id: `inst-${i + 1}`,
            action: 'enter_building',
            text: `Enter ${edge.name || 'building'}`,
            subtext: `Proceed inside to Floor ${toN.floorNumber ?? 0}`,
            distanceMeters: edge.distanceMeters,
            targetNodeId: toN.id,
            targetBuildingId: toN.buildingId,
            targetFloorId: toN.floorId,
            isIndoor: true
          });

          segments.push(currentSegment);
          currentSegment = {
            id: `seg-${segments.length}`,
            type: 'indoor',
            buildingId: toN.buildingId,
            floorId: toN.floorId,
            floorNumber: toN.floorNumber,
            distanceMeters: 0,
            estimatedSeconds: 0,
            pathNodes: [toN],
            instructions: []
          };
        } else if (fromN.buildingId && !toN.buildingId) {
          // Exiting building
          instructions.push({
            id: `inst-${i + 1}`,
            action: 'exit_building',
            text: `Exit building onto outdoor pathway`,
            subtext: `Follow the main campus avenue`,
            distanceMeters: edge.distanceMeters,
            targetNodeId: toN.id,
            isIndoor: false
          });

          segments.push(currentSegment);
          currentSegment = {
            id: `seg-${segments.length}`,
            type: 'outdoor',
            distanceMeters: 0,
            estimatedSeconds: 0,
            pathNodes: [toN],
            instructions: []
          };
        }
      } else if (
        fromN.floorNumber !== undefined &&
        toN.floorNumber !== undefined &&
        fromN.floorNumber !== toN.floorNumber
      ) {
        // Vertical floor transition (stairs or elevator)
        const isLift = edge.isElevator;
        instructions.push({
          id: `inst-${i + 1}`,
          action: isLift ? 'take_elevator' : 'take_stairs',
          text: isLift
            ? `Take elevator up to Floor ${toN.floorNumber}`
            : `Take stairs up to Floor ${toN.floorNumber}`,
          subtext: `Connector: ${edge.name || (isLift ? 'Elevator' : 'Stairs')}`,
          distanceMeters: edge.distanceMeters,
          floorChange: {
            fromFloor: fromN.floorNumber,
            toFloor: toN.floorNumber,
            connectorType: isLift ? 'elevator' : 'stairs'
          },
          targetNodeId: toN.id,
          targetFloorId: toN.floorId,
          targetBuildingId: toN.buildingId,
          isIndoor: true
        });

        segments.push(currentSegment);
        currentSegment = {
          id: `seg-${segments.length}`,
          type: 'indoor',
          buildingId: toN.buildingId,
          floorId: toN.floorId,
          floorNumber: toN.floorNumber,
          distanceMeters: 0,
          estimatedSeconds: 0,
          pathNodes: [toN],
          instructions: []
        };
      } else {
        // Normal segment step
        if (i === edges.length - 1) {
          instructions.push({
            id: `inst-${i + 1}`,
            action: 'destination',
            text: `Arrive at destination: ${toN.name || 'Target'}`,
            subtext: `You have reached your destination`,
            distanceMeters: edge.distanceMeters,
            targetNodeId: toN.id,
            isIndoor: !!toN.buildingId
          });
        } else {
          // Corridor or outdoor step
          const action = i % 2 === 0 ? 'straight' : (i % 3 === 0 ? 'turn_left' : 'turn_right');
          instructions.push({
            id: `inst-${i + 1}`,
            action,
            text: `${action === 'straight' ? 'Continue along' : action === 'turn_left' ? 'Turn left onto' : 'Turn right onto'} ${edge.name || 'pathway'}`,
            distanceMeters: edge.distanceMeters,
            targetNodeId: toN.id,
            isIndoor: !!toN.buildingId
          });
        }
      }
    }

    if (currentSegment.pathNodes.length > 0) {
      segments.push(currentSegment);
    }

    return { segments, instructions };
  }
}

export const routingEngine = new RoutingEngine();
