import React from 'react';
import { CampusId } from '../../types/campus';
import { 
  CheckCircle2, 
  HelpCircle, 
  Play, 
  Layers, 
  Search, 
  MapPin, 
  Wifi, 
  QrCode, 
  Radio, 
  X 
} from 'lucide-react';

interface JudgingScenariosModalProps {
  isOpen: boolean;
  onClose: () => void;
  campusId: CampusId;
  onRunScenario: (scenarioId: string) => void;
}

export const JudgingScenariosModal: React.FC<JudgingScenariosModalProps> = ({
  isOpen,
  onClose,
  campusId,
  onRunScenario
}) => {
  if (!isOpen) return null;

  const scenarios = [
    {
      id: 'scenario_mbu_washroom',
      title: '1. MBU Natural-Language "Where is the washroom?"',
      description: 'Switches to Mohan Babu University, executes synonym search, disambiguates to School of Computing washroom, and plots multi-floor route.',
      icon: Search,
      tag: 'PRD Page 8 - Step 1'
    },
    {
      id: 'scenario_mbu_gps_walk',
      title: '2. Simulated GPS Route Walkthrough',
      description: 'Plays back walking movement along MBU campus spine towards School of Computing with configurable noise and heading updates.',
      icon: Play,
      tag: 'PRD Page 8 - Step 2'
    },
    {
      id: 'scenario_mbu_indoor_floor',
      title: '3. Indoor Multi-Floor Vector Layout',
      description: 'Enters School of Computing, reveals synthetic floor plan with Room 304, stairs, elevator connectors, and walkable corridor network.',
      icon: MapPin,
      tag: 'PRD Page 8 - Step 3'
    },
    {
      id: 'scenario_wifi_qr_fallback',
      title: '4. Wi-Fi Fingerprint k-NN + QR Fallback',
      description: 'Triggers synthetic RSSI scan, estimates Floor 1 with k-NN, then simulates QR checkpoint scan to lock location with ground-truth precision.',
      icon: QrCode,
      tag: 'PRD Page 8 - Step 4'
    },
    {
      id: 'scenario_iittp_isolation',
      title: '5. IIT Tirupati Campus Isolation Test',
      description: 'Switches to IIT Tirupati permanent campus (Yerpedu), proves that no MBU data leaks, and routes to Lecture Hall 1 / CLRC.',
      icon: Layers,
      tag: 'PRD Page 8 - Step 5'
    },
    {
      id: 'scenario_cors_rtk',
      title: '6. CORS / RTK Differential Demonstration',
      description: 'Opens illustrative standalone GPS vs RTK carrier-phase scatter comparison with Survey of India base station telemetry and honesty banner.',
      icon: Radio,
      tag: 'PRD Page 8 - Step 6'
    }
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1250,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 500,
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '14px 18px',
            borderBottom: '1px solid #E5E7EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#E6F5F3'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                backgroundColor: '#168C83',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <HelpCircle size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: '#116F68' }}>
                PRD Hackathon Judging Replay Flow
              </h3>
              <span style={{ fontSize: 10, color: '#168C83' }}>
                Automated one-click verification of PRD acceptance criteria
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#9CA3AF',
              cursor: 'pointer',
              padding: 4
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scenario List */}
        <div style={{ padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {scenarios.map(sc => {
            const Icon = sc.icon;
            return (
              <div
                key={sc.id}
                style={{
                  border: '1px solid #E5E7EB',
                  borderRadius: 16,
                  padding: 12,
                  backgroundColor: '#F9FAF9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      backgroundColor: '#DDF3EC',
                      color: '#168C83',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 2
                    }}
                  >
                    <Icon size={15} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#252A2B' }}>
                        {sc.title}
                      </span>
                    </div>
                    <div style={{ fontSize: 10, color: '#64748B', marginTop: 2, lineHeight: 1.3 }}>
                      {sc.description}
                    </div>
                    <span
                      style={{
                        display: 'inline-block',
                        marginTop: 4,
                        fontSize: 9,
                        color: '#168C83',
                        fontWeight: 700,
                        backgroundColor: '#E6F5F3',
                        padding: '1px 6px',
                        borderRadius: 4
                      }}
                    >
                      {sc.tag}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onRunScenario(sc.id);
                    onClose();
                  }}
                  style={{
                    backgroundColor: '#168C83',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 12,
                    padding: '8px 14px',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    flexShrink: 0
                  }}
                >
                  <Play size={12} fill="#FFFFFF" />
                  <span>Execute</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
