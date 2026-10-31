import { CampusId, Building, Room, POI, ProvenanceType } from '../types/campus';
import { packageManager } from './packageManager';

export interface SearchResultItem {
  id: string;
  campusId: CampusId;
  type: 'room' | 'building' | 'poi' | 'category_washroom' | 'category_canteen';
  title: string;
  subtitle: string;
  buildingId?: string;
  buildingName?: string;
  floorId?: string;
  floorNumber?: number;
  floorName?: string;
  roomCode?: string;
  targetNodeId: string;
  isIndoor: boolean;
  provenance: ProvenanceType;
  matchScore: number;
  distanceMetersApprox?: number;
}

const SYNONYM_MAP: Record<string, string[]> = {
  washroom: ['washroom', 'toilet', 'restroom', 'loo', 'gents', 'ladies', 'bathroom', 'urinal', 'wc'],
  canteen: ['canteen', 'cafeteria', 'mess', 'food court', 'food', 'snack', 'coffee', 'tea', 'eat', 'dining', 'lunch', 'breakfast'],
  library: ['library', 'reading room', 'book', 'books', 'clrc', 'journal', 'study'],
  admin: ['admin', 'administration', 'director', 'dean', 'hod', 'office', 'registrar', 'fee', 'admissions'],
  health: ['health', 'dispensary', 'hospital', 'clinic', 'doctor', 'medical', 'first aid', 'medicine', 'nurse', 'opd'],
  sports: ['sports', 'ground', 'cricket', 'football', 'badminton', 'gym', 'gymnasium', 'stadium', 'play'],
  parking: ['parking', 'park', 'car', 'bike', 'scooter', 'vehicle', 'ev'],
  gate: ['gate', 'entrance', 'exit', 'arch', 'security', 'entry', 'portal']
};

class SearchService {
  search(query: string, currentCampusId: CampusId): SearchResultItem[] {
    const raw = query.trim().toLowerCase();
    if (!raw) return [];

    const activePkg = packageManager.getActivePackage();
    // Enforce campus isolation
    if (activePkg.campus.id !== currentCampusId) {
      return [];
    }

    const results: SearchResultItem[] = [];

    // Check synonym category expansions
    const matchedCategories = this.identifyCategories(raw);

    // 1. Search Rooms in Buildings
    for (const bld of activePkg.buildings) {
      if (bld.campusId !== currentCampusId) continue;

      for (const floor of bld.floors) {
        for (const rm of floor.rooms) {
          if (rm.campusId !== currentCampusId) continue;

          let score = 0;
          const rmCode = rm.roomCode.toLowerCase();
          const rmName = rm.name.toLowerCase();

          // Exact or prefix code match (e.g., "304", "soc-304", "lh-1")
          if (raw === rmCode || raw === rm.id.toLowerCase()) {
            score += 100;
          } else if (rmCode.includes(raw) || raw.includes(rmCode)) {
            score += 70;
          }

          // Exact number extraction (e.g. "take me to room 304" -> matches "304")
          const numMatch = raw.match(/\b\d{2,4}\b/);
          if (numMatch && rmCode.includes(numMatch[0])) {
            score += 85;
          }

          // Name and aliases match
          if (rmName.includes(raw)) {
            score += 50;
          }

          for (const alias of rm.aliases) {
            const aliasLower = alias.toLowerCase();
            if (raw.includes(aliasLower) || aliasLower.includes(raw)) {
              score += 45;
            }
          }

          // Category match (e.g. user asks "Where is the washroom?")
          if (matchedCategories.includes(rm.category)) {
            score += 40;
          }

          if (score > 0) {
            results.push({
              id: rm.id,
              campusId: currentCampusId,
              type: rm.category === 'washroom' ? 'category_washroom' : 'room',
              title: rm.name,
              subtitle: `${bld.name} • Floor ${floor.floorNumber} (${floor.name})`,
              buildingId: bld.id,
              buildingName: bld.name,
              floorId: floor.id,
              floorNumber: floor.floorNumber,
              floorName: floor.name,
              roomCode: rm.roomCode,
              targetNodeId: rm.graphNodeId,
              isIndoor: true,
              provenance: rm.provenance,
              matchScore: score
            });
          }
        }
      }

      // 2. Search Buildings
      let bldScore = 0;
      const bldName = bld.name.toLowerCase();
      const bldCode = bld.code.toLowerCase();

      if (raw === bldCode) {
        bldScore += 90;
      } else if (bldName.includes(raw) || raw.includes(bldName)) {
        bldScore += 60;
      }

      if (bldScore > 0) {
        const primaryEntrance = bld.entrances[0];
        results.push({
          id: bld.id,
          campusId: currentCampusId,
          type: 'building',
          title: bld.name,
          subtitle: `${bld.description.slice(0, 75)}...`,
          buildingId: bld.id,
          buildingName: bld.name,
          targetNodeId: primaryEntrance ? primaryEntrance.outdoorNodeId : activePkg.pois[0]?.outdoorNodeId || '',
          isIndoor: false,
          provenance: bld.provenance,
          matchScore: bldScore
        });
      }
    }

    // 3. Search POIs
    for (const poi of activePkg.pois) {
      if (poi.campusId !== currentCampusId) continue;

      let poiScore = 0;
      const poiName = poi.name.toLowerCase();

      if (poiName.includes(raw) || raw.includes(poiName)) {
        poiScore += 65;
      }

      for (const alias of poi.aliases) {
        const aliasLower = alias.toLowerCase();
        if (raw.includes(aliasLower) || aliasLower.includes(raw)) {
          poiScore += 50;
        }
      }

      // Category matches
      if (matchedCategories.includes(poi.category)) {
        poiScore += 45;
      }

      if (poiScore > 0) {
        results.push({
          id: poi.id,
          campusId: currentCampusId,
          type: 'poi',
          title: poi.name,
          subtitle: poi.description,
          targetNodeId: poi.outdoorNodeId || poi.indoorNodeId || '',
          isIndoor: !!poi.indoorNodeId,
          provenance: poi.provenance,
          matchScore: poiScore
        });
      }
    }

    // Sort by match score descending
    return results.sort((a, b) => b.matchScore - a.matchScore);
  }

  private identifyCategories(raw: string): string[] {
    const categories: string[] = [];
    for (const [cat, words] of Object.entries(SYNONYM_MAP)) {
      if (words.some(w => raw.includes(w))) {
        categories.push(cat);
      }
    }
    return categories;
  }

  getPopularSuggestions(campusId: CampusId): { label: string; query: string; icon: string }[] {
    if (campusId === 'mbu-tirupati') {
      return [
        { label: 'Where is the washroom?', query: 'washroom', icon: 'toilet' },
        { label: 'Take me to Room 304', query: 'room 304', icon: 'door' },
        { label: 'Find Central Library', query: 'library', icon: 'book' },
        { label: 'Health & Wellness Centre', query: 'health centre', icon: 'plus-circle' },
        { label: 'Central Food Court', query: 'canteen', icon: 'coffee' },
        { label: 'AI & Deep Learning Lab', query: 'ai lab', icon: 'cpu' }
      ];
    } else {
      return [
        { label: 'Where is the washroom?', query: 'washroom', icon: 'toilet' },
        { label: 'Take me to Lecture Hall 1', query: 'lh 1', icon: 'door' },
        { label: 'CLRC Central Library', query: 'clrc library', icon: 'book' },
        { label: 'Dispensary / Health Centre', query: 'health dispensary', icon: 'plus-circle' },
        { label: 'Student Cafeteria & Mess', query: 'cafeteria', icon: 'coffee' },
        { label: 'Robotics Laboratory', query: 'robotics lab', icon: 'cpu' }
      ];
    }
  }
}

export const searchService = new SearchService();
