import React from 'react';
import { Campus } from '../../types/campus';
import { Layers, Radio, Settings, Compass, HelpCircle, Box, Map, Shield } from 'lucide-react';

interface HeaderProps {
  currentCampus: Campus;
  isOffline: boolean;
  activeMainView: '3d_twin' | '2d_map';
  onToggleMainView: (view: '3d_twin' | '2d_map') => void;
  onOpenCampusSwitcher: () => void;
  onOpenDemoLab: () => void;
  onOpenCORSComparison: () => void;
  onOpenSettings: () => void;
  onOpenJudgingGuide: () => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCampus,
  isOffline,
  activeMainView,
  onToggleMainView,
  onOpenCampusSwitcher,
  onOpenDemoLab,
  onOpenCORSComparison,
  onOpenSettings,
  onOpenJudgingGuide,
  onOpenAdmin
}) => {
  return (
    <header
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        padding: '6px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 400,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
      }}
    >
      {/* Campus Selector Pill */}
      <button
        onClick={onOpenCampusSwitcher}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: '#F7F7F2',
          border: '1px solid #D1D5DB',
          padding: '4px 8px',
          borderRadius: 20,
          cursor: 'pointer',
          textAlign: 'left',
          maxWidth: '38%'
        }}
        title="Switch Campus"
      >
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            backgroundColor: '#168C83',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10,
            fontWeight: 800,
            flexShrink: 0
          }}
        >
          {currentCampus.code}
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#252A2B',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {currentCampus.shortName}
          </div>
          <div
            style={{
              fontSize: 8,
              color: '#777F82',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <span>v{currentCampus.version}</span>
            {isOffline && (
              <span style={{ color: '#D97706', fontWeight: 700 }}>• OFFLINE</span>
            )}
          </div>
        </div>
      </button>

      {/* 2D Map vs 3D Twin Primary Toggle */}
      <div
        style={{
          display: 'flex',
          backgroundColor: '#F1F5F9',
          borderRadius: 18,
          padding: 2,
          border: '1px solid #E2E8F0'
        }}
      >
        <button
          onClick={() => onToggleMainView('3d_twin')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 8px',
            borderRadius: 14,
            border: 'none',
            backgroundColor: activeMainView === '3d_twin' ? '#168C83' : 'transparent',
            color: activeMainView === '3d_twin' ? '#FFFFFF' : '#475569',
            fontSize: 10,
            fontWeight: 700,
            cursor: 'pointer'
          }}
          title="3D Campus Digital Twin & Exploded Multi-Floor View"
        >
          <Box size={13} />
          <span>3D Twin</span>
        </button>

        <button
          onClick={() => onToggleMainView('2d_map')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 8px',
            borderRadius: 14,
            border: 'none',
            backgroundColor: activeMainView === '2d_map' ? '#168C83' : 'transparent',
            color: activeMainView === '2d_map' ? '#FFFFFF' : '#475569',
            fontSize: 10,
            fontWeight: 700,
            cursor: 'pointer'
          }}
          title="2D Vector & Satellite Outdoor Map"
        >
          <Map size={13} />
          <span>2D Map</span>
        </button>
      </div>

      {/* Action Buttons: Judging, CORS, Admin, Settings */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button
          onClick={onOpenJudgingGuide}
          style={{
            backgroundColor: '#E6F5F3',
            color: '#168C83',
            border: '1px solid #A3E3DA',
            borderRadius: 8,
            padding: '4px 6px',
            fontSize: 10,
            fontWeight: 700,
            cursor: 'pointer'
          }}
          title="PRD Live Judging Scenarios"
        >
          Judging
        </button>

        <button
          onClick={onOpenCORSComparison}
          style={{
            backgroundColor: '#DDF3EC',
            color: '#168C83',
            border: '1px solid #99DFC8',
            borderRadius: 8,
            padding: '4px 6px',
            fontSize: 10,
            fontWeight: 700,
            cursor: 'pointer'
          }}
          title="CORS / RTK Differential Demo"
        >
          CORS
        </button>

        <button
          onClick={onOpenAdmin}
          style={{
            background: 'none',
            border: 'none',
            color: '#475569',
            padding: 4,
            borderRadius: 6,
            cursor: 'pointer'
          }}
          title="Admin & 3D Spatial Content Management"
        >
          <Shield size={16} />
        </button>

        <button
          onClick={onOpenSettings}
          style={{
            background: 'none',
            border: 'none',
            color: '#475569',
            padding: 4,
            borderRadius: 6,
            cursor: 'pointer'
          }}
          title="Settings & Offline Packages"
        >
          <Settings size={16} />
        </button>
      </div>
    </header>
  );
};
