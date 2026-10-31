import React from 'react';
import { Building, Floor, Room } from '../../types/campus';
import { NavigationNode, NavigationEdge } from '../../types/navigation';
import { PositioningEstimate } from '../../types/positioning';
import { ProvenanceBadge } from '../common/ProvenanceBadge';
import { Compass, Footprints, AlertTriangle } from 'lucide-react';

interface IndoorFloorPlanProps {
  building: Building;
  floor: Floor;
  currentEstimate: PositioningEstimate | null;
  selectedRoom: Room | null;
  onSelectRoom: (room: Room) => void;
  activePathNodes?: NavigationNode[];
  edges?: NavigationEdge[];
}

export const IndoorFloorPlan: React.FC<IndoorFloorPlanProps> = ({
  building,
  floor,
  currentEstimate,
  selectedRoom,
  onSelectRoom,
  activePathNodes = [],
  edges = []
}) => {
  // Filter nodes and edges on this specific floor
  const floorNodes = activePathNodes.filter(n => n.floorId === floor.id);

  // SVG dimensions
  const svgWidth = 600;
  const svgHeight = 400;

  // Transform floor coordinates (0..100) to SVG pixel coordinates
  const toSvgX = (x: number) => (x / 100) * (svgWidth - 60) + 30;
  const toSvgY = (y: number) => (y / 100) * (svgHeight - 60) + 30;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#F3F4F1',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Synthetic Floor Plan Disclaimer Banner */}
      <div
        style={{
          backgroundColor: '#FEF3C7',
          borderBottom: '1px solid #FDE68A',
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 11,
          color: '#92400E',
          fontWeight: 600,
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <AlertTriangle size={14} color="#D97706" />
          <span>Demo layout — not an official floor plan</span>
        </div>
        <ProvenanceBadge type="SYNTHETIC_DEMO_DATA" size="sm" />
      </div>

      {/* Building & Floor Header Bar */}
      <div
        style={{
          padding: '8px 14px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E5E7EB',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10
        }}
      >
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: '#252A2B' }}>
            {building.name}
          </h4>
          <span style={{ fontSize: 11, color: '#777F82' }}>
            Floor {floor.floorNumber} • {floor.name}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, fontSize: 11, color: '#168C83', fontWeight: 600 }}>
          <span>{floor.rooms.length} Rooms</span>
          <span>•</span>
          <span>{floor.connectors.length} Connectors</span>
        </div>
      </div>

      {/* Interactive SVG Floor Plan */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          padding: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{
            width: '100%',
            height: '100%',
            maxHeight: '100%',
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            border: '2px solid #D5DCD9'
          }}
        >
          {/* Subtle Grid Background */}
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#EAECE8" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width={svgWidth} height={svgHeight} fill="url(#grid)" rx={16} />

          {/* Building Outer Wall */}
          <rect
            x={20}
            y={20}
            width={svgWidth - 40}
            height={svgHeight - 40}
            fill="#F7F8F6"
            stroke="#475569"
            strokeWidth="3.5"
            rx={10}
          />

          {/* Main Corridor Pathway Network */}
          <rect
            x={toSvgX(20)}
            y={toSvgY(44)}
            width={toSvgX(80) - toSvgX(20)}
            height={32}
            fill="#EAF0ED"
            stroke="#99DFC8"
            strokeWidth="1.5"
            rx={4}
          />
          <rect
            x={toSvgX(45)}
            y={toSvgY(20)}
            width={32}
            height={toSvgY(88) - toSvgY(20)}
            fill="#EAF0ED"
            stroke="#99DFC8"
            strokeWidth="1.5"
            rx={4}
          />

          {/* Connectors: Stairs & Elevators */}
          {floor.connectors.map(conn => {
            const cx = toSvgX(conn.x);
            const cy = toSvgY(conn.y);
            const isElevator = conn.type === 'elevator';

            return (
              <g key={conn.id} transform={`translate(${cx - 16}, ${cy - 16})`}>
                <rect
                  width={32}
                  height={32}
                  rx={6}
                  fill={isElevator ? '#E0F2FE' : '#FEF3C7'}
                  stroke={isElevator ? '#0284C7' : '#D97706'}
                  strokeWidth="2"
                />
                <text
                  x={16}
                  y={18}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill={isElevator ? '#0369A1' : '#B45309'}
                >
                  {isElevator ? 'LIFT' : 'STAIR'}
                </text>
              </g>
            );
          })}

          {/* Rooms */}
          {floor.rooms.map(rm => {
            const rx = toSvgX(rm.x - (rm.width ? rm.width / 2 : 8));
            const ry = toSvgY(rm.y - (rm.height ? rm.height / 2 : 8));
            const rw = (rm.width || 16) * 4.5;
            const rh = (rm.height || 16) * 2.8;
            const isSelected = selectedRoom?.id === rm.id;
            const isWashroom = rm.category === 'washroom';
            const isLab = rm.category === 'lab';

            return (
              <g
                key={rm.id}
                onClick={() => onSelectRoom(rm)}
                style={{ cursor: 'pointer' }}
              >
                {/* Room Shape */}
                <rect
                  x={rx}
                  y={ry}
                  width={rw}
                  height={rh}
                  rx={6}
                  fill={
                    isSelected
                      ? '#DDF3EC'
                      : isWashroom
                      ? '#F0F9FF'
                      : isLab
                      ? '#F5F3FF'
                      : '#FFFFFF'
                  }
                  stroke={
                    isSelected
                      ? '#168C83'
                      : isWashroom
                      ? '#38BDF8'
                      : '#CBD5E1'
                  }
                  strokeWidth={isSelected ? '2.5' : '1.5'}
                />

                {/* Room Label */}
                <text
                  x={rx + rw / 2}
                  y={ry + rh / 2 - 2}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="700"
                  fill="#1E293B"
                >
                  {rm.roomCode}
                </text>
                <text
                  x={rx + rw / 2}
                  y={ry + rh / 2 + 10}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#64748B"
                >
                  {rm.name.length > 18 ? rm.name.slice(0, 16) + '...' : rm.name}
                </text>
              </g>
            );
          })}

          {/* Active Walking Route Path Overlay */}
          {floorNodes.length > 1 && (
            <polyline
              points={floorNodes
                .map(n => `${toSvgX(n.x ?? 50)},${toSvgY(n.y ?? 50)}`)
                .join(' ')}
              fill="none"
              stroke="#168C83"
              strokeWidth="4"
              strokeDasharray="6 4"
              strokeLinecap="round"
            />
          )}

          {/* Active Navigation Node Waypoints */}
          {floorNodes.map((n, i) => (
            <circle
              key={n.id}
              cx={toSvgX(n.x ?? 50)}
              cy={toSvgY(n.y ?? 50)}
              r={i === floorNodes.length - 1 ? 7 : 4}
              fill={i === floorNodes.length - 1 ? '#EF4444' : '#168C83'}
              stroke="#FFFFFF"
              strokeWidth="2"
            />
          ))}

          {/* User's Current Indoor Position */}
          {currentEstimate &&
            currentEstimate.isIndoor &&
            currentEstimate.floorId === floor.id &&
            currentEstimate.indoorX !== undefined &&
            currentEstimate.indoorY !== undefined && (
              <g transform={`translate(${toSvgX(currentEstimate.indoorX)}, ${toSvgY(currentEstimate.indoorY)})`}>
                {/* Confidence / Accuracy Circle */}
                <circle
                  r={Math.min(30, (currentEstimate.accuracyMeters || 3) * 6)}
                  fill="rgba(22, 140, 131, 0.18)"
                  stroke="#168C83"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
                {/* Location Dot */}
                <circle
                  r={7}
                  fill={currentEstimate.provider === 'QR_CHECKPOINT' ? '#10B981' : '#F59E0B'}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                />
                <circle r={3} fill="#FFFFFF" />
              </g>
            )}
        </svg>
      </div>

      {/* Selected Room Quick Info Bar */}
      {selectedRoom && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #E5E7EB',
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 10
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#252A2B' }}>
                {selectedRoom.roomCode}: {selectedRoom.name}
              </span>
              <ProvenanceBadge type={selectedRoom.provenance} size="sm" />
            </div>
            <div style={{ fontSize: 11, color: '#777F82' }}>
              Aliases: {selectedRoom.aliases.slice(0, 3).join(', ')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
