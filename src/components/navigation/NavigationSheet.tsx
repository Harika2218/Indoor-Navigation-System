import React from 'react';
import { RouteResult, TravelMode } from '../../types/navigation';
import { PositioningEstimate } from '../../types/positioning';
import { 
  Footprints, 
  Bike, 
  Car, 
  Clock, 
  ArrowUpRight, 
  CornerUpLeft, 
  CornerUpRight, 
  ArrowUp, 
  CheckCircle2, 
  QrCode, 
  X, 
  Building2, 
  Play, 
  Square 
} from 'lucide-react';

interface NavigationSheetProps {
  route: RouteResult;
  selectedMode: TravelMode;
  onSelectMode: (mode: TravelMode) => void;
  isNavigating: boolean;
  onStartNavigation: () => void;
  onStopNavigation: () => void;
  onOpenQRScanner: () => void;
  currentEstimate: PositioningEstimate | null;
  onRecalculate: () => void;
}

export const NavigationSheet: React.FC<NavigationSheetProps> = ({
  route,
  selectedMode,
  onSelectMode,
  isNavigating,
  onStartNavigation,
  onStopNavigation,
  onOpenQRScanner,
  currentEstimate,
  onRecalculate
}) => {
  // Format distance
  const distanceFormatted =
    route.totalDistanceMeters >= 1000
      ? `${(route.totalDistanceMeters / 1000).toFixed(1)} km`
      : `${route.totalDistanceMeters} m`;

  // Format time
  const minutesFormatted = Math.ceil(route.totalEstimatedSeconds / 60);

  // Active instruction
  const currentInstruction = route.instructions[0];

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.15)',
        zIndex: 550,
        maxHeight: '60vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}
      className="animate-slideUp"
    >
      {/* Drag Pill */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
        <div style={{ width: 36, height: 4, backgroundColor: '#E5E7EB', borderRadius: 9999 }} />
      </div>

      {/* Mode Selector Tabs (Walk, Bicycle, Car) */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          padding: '0 16px 12px 16px',
          borderBottom: '1px solid #F1F1E8'
        }}
      >
        {(
          [
            { mode: 'walk', label: 'Walk', icon: Footprints, speed: '1.3 m/s' },
            { mode: 'bicycle', label: 'Bicycle', icon: Bike, speed: '4.2 m/s' },
            { mode: 'car', label: 'Car', icon: Car, speed: '8.5 m/s' }
          ] as const
        ).map(tab => {
          const Icon = tab.icon;
          const isSelected = selectedMode === tab.mode;

          return (
            <button
              key={tab.mode}
              onClick={() => onSelectMode(tab.mode)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                padding: '8px 4px',
                borderRadius: 14,
                backgroundColor: isSelected ? '#DDF3EC' : '#F7F7F2',
                border: isSelected ? '2px solid #168C83' : '1px solid #E5E7EB',
                color: isSelected ? '#168C83' : '#777F82',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 12,
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Guidance Banner */}
      <div style={{ padding: '12px 16px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: '#252A2B' }}>
                {minutesFormatted} min
              </span>
              <span style={{ fontSize: 13, color: '#777F82', fontWeight: 600 }}>
                ({distanceFormatted})
              </span>
            </div>
            <div style={{ fontSize: 11, color: '#168C83', fontWeight: 600, marginTop: 2 }}>
              {route.crossesFloors
                ? 'Multi-floor indoor path with elevator/stairs'
                : 'Direct surface connection'}
            </div>
          </div>

          {/* Start / Stop Guidance Button */}
          {isNavigating ? (
            <button
              onClick={onStopNavigation}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 20,
                padding: '10px 18px',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
              }}
            >
              <Square size={16} />
              <span>Exit Route</span>
            </button>
          ) : (
            <button
              onClick={onStartNavigation}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                backgroundColor: '#168C83',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 20,
                padding: '10px 20px',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(22, 140, 131, 0.3)'
              }}
            >
              <Play size={16} fill="#FFFFFF" />
              <span>Start Turn Guidance</span>
            </button>
          )}
        </div>

        {/* Real-time Turn Instructions List */}
        <div style={{ marginTop: 14 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#777F82',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: 8
            }}
          >
            Turn-by-Turn Guidance ({route.instructions.length} Steps)
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 160, overflowY: 'auto' }}>
            {route.instructions.map((inst, idx) => (
              <div
                key={inst.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  padding: '8px 10px',
                  borderRadius: 10,
                  backgroundColor: idx === 0 ? '#E6F5F3' : '#F9FAF9',
                  border: idx === 0 ? '1px solid #A3E3DA' : '1px solid #F1F1E8'
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    backgroundColor: idx === 0 ? '#168C83' : '#E2E8F0',
                    color: idx === 0 ? '#FFFFFF' : '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 2
                  }}
                >
                  {inst.action === 'turn_left' ? (
                    <CornerUpLeft size={14} />
                  ) : inst.action === 'turn_right' ? (
                    <CornerUpRight size={14} />
                  ) : inst.action === 'destination' ? (
                    <CheckCircle2 size={14} />
                  ) : inst.action === 'take_stairs' || inst.action === 'take_elevator' ? (
                    <Building2 size={14} />
                  ) : (
                    <ArrowUp size={14} />
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#252A2B' }}>
                    {inst.text}
                  </div>
                  {inst.subtext && (
                    <div style={{ fontSize: 10, color: '#777F82', marginTop: 1 }}>
                      {inst.subtext}
                    </div>
                  )}
                </div>

                {inst.distanceMeters > 0 && (
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>
                    {inst.distanceMeters}m
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Fallback Checkpoint Banner if Indoor Positioning Uncertainty High */}
        <div
          style={{
            marginTop: 12,
            padding: '8px 12px',
            borderRadius: 12,
            backgroundColor: '#F7F7F2',
            border: '1px solid #E5E7EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ fontSize: 11, color: '#4B5563' }}>
            Positioning uncertain or GPS lost indoors?
          </div>
          <button
            onClick={onOpenQRScanner}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              backgroundColor: '#168C83',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 14,
              padding: '5px 10px',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <QrCode size={13} />
            <span>Scan QR</span>
          </button>
        </div>
      </div>
    </div>
  );
};
