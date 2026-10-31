import React, { useState } from 'react';
import { PositioningEstimate, PositioningProviderType } from '../../types/positioning';
import { CampusId } from '../../types/campus';
import { positioningService } from '../../services/positioningService';
import { 
  Compass, 
  Wifi, 
  Smartphone, 
  AlertTriangle, 
  Volume2, 
  Sliders, 
  X, 
  Radio, 
  CheckCircle2, 
  RotateCcw 
} from 'lucide-react';

interface DemoControlPanelProps {
  campusId: CampusId;
  isOpen: boolean;
  onClose: () => void;
  currentEstimate: PositioningEstimate | null;
  onTriggerWiFiScan: () => void;
  onOpenQRScanner: () => void;
}

export const DemoControlPanel: React.FC<DemoControlPanelProps> = ({
  campusId,
  isOpen,
  onClose,
  currentEstimate,
  onTriggerWiFiScan,
  onOpenQRScanner
}) => {
  const config = positioningService.getConfig();
  const [gpsNoise, setGpsNoise] = useState(config.gpsNoiseMeters);
  const [speedMultiplier, setSpeedMultiplier] = useState(config.simulatedSpeedMultiplier);
  const [signalLoss, setSignalLoss] = useState(config.simulateSignalLoss);
  const [routeDeviation, setRouteDeviation] = useState(config.simulateRouteDeviation);

  if (!isOpen) return null;

  const handleProviderChange = (provider: PositioningProviderType) => {
    positioningService.switchProvider(provider);
  };

  const handleNoiseChange = (val: number) => {
    setGpsNoise(val);
    positioningService.updateConfig({ gpsNoiseMeters: val });
  };

  const handleSpeedChange = (val: number) => {
    setSpeedMultiplier(val);
    positioningService.updateConfig({ simulatedSpeedMultiplier: val });
  };

  const handleToggleSignalLoss = (enabled: boolean) => {
    setSignalLoss(enabled);
    positioningService.updateConfig({ simulateSignalLoss: enabled });
  };

  const handleToggleDeviation = (enabled: boolean) => {
    setRouteDeviation(enabled);
    positioningService.updateConfig({ simulateRouteDeviation: enabled });
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1150,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column'
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
            backgroundColor: '#FFFBEB'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: '#D97706',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Compass size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: '#92400E' }}>
                Positioning Simulation Lab
              </h3>
              <span style={{ fontSize: 10, color: '#B45309' }}>
                Repeatable test scenarios & sensor provider testing
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

        {/* Current Active Estimate Indicator */}
        {currentEstimate && (
          <div
            style={{
              padding: '10px 16px',
              backgroundColor: currentEstimate.isRealSensor ? '#ECFDF5' : '#FFFBEB',
              borderBottom: '1px solid #F1F1E8',
              fontSize: 11
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
              <span style={{ color: currentEstimate.isRealSensor ? '#065F46' : '#92400E' }}>
                {currentEstimate.statusMessage}
              </span>
              <span style={{ color: '#4B5563' }}>
                Acc: ±{currentEstimate.accuracyMeters}m
              </span>
            </div>
          </div>
        )}

        {/* Controls Body */}
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14, maxHeight: 420, overflowY: 'auto' }}>
          {/* Provider Selection */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase' }}>
              Active Positioning Provider
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 6 }}>
              <button
                onClick={() => handleProviderChange('SIMULATED_GPS')}
                style={{
                  padding: '8px 10px',
                  borderRadius: 10,
                  border: config.activeProvider === 'SIMULATED_GPS' ? '2px solid #168C83' : '1px solid #E5E7EB',
                  backgroundColor: config.activeProvider === 'SIMULATED_GPS' ? '#DDF3EC' : '#F7F7F2',
                  color: config.activeProvider === 'SIMULATED_GPS' ? '#168C83' : '#4B5563',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <Compass size={14} />
                <span>Simulated GPS</span>
              </button>

              <button
                onClick={() => handleProviderChange('REAL_GPS')}
                style={{
                  padding: '8px 10px',
                  borderRadius: 10,
                  border: config.activeProvider === 'REAL_GPS' ? '2px solid #168C83' : '1px solid #E5E7EB',
                  backgroundColor: config.activeProvider === 'REAL_GPS' ? '#DDF3EC' : '#F7F7F2',
                  color: config.activeProvider === 'REAL_GPS' ? '#168C83' : '#4B5563',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <Smartphone size={14} />
                <span>Real Device GPS</span>
              </button>
            </div>
          </div>

          {/* Wi-Fi k-NN Trigger */}
          <div style={{ backgroundColor: '#F7F7F2', padding: 12, borderRadius: 14, border: '1px solid #E5E7EB' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#374151' }}>
              Indoor Wi-Fi Fingerprint Matching
            </div>
            <div style={{ fontSize: 10, color: '#777F82', margin: '4px 0 8px 0' }}>
              Generate synthetic RSSI reading across APs and run k-NN floor/coordinate estimation.
            </div>
            <button
              onClick={onTriggerWiFiScan}
              style={{
                width: '100%',
                backgroundColor: '#168C83',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 10,
                padding: '8px 0',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}
            >
              <Wifi size={14} />
              <span>Trigger Simulated Wi-Fi Scan</span>
            </button>
          </div>

          {/* GPS Noise Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600 }}>
              <span style={{ color: '#374151' }}>GPS Noise / Jitter</span>
              <span style={{ color: '#168C83' }}>±{gpsNoise} meters</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={gpsNoise}
              onChange={e => handleNoiseChange(Number(e.target.value))}
              style={{ width: '100%', marginTop: 6 }}
            />
          </div>

          {/* Playback Speed Multiplier */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600 }}>
              <span style={{ color: '#374151' }}>Playback Speed Multiplier</span>
              <span style={{ color: '#168C83' }}>{speedMultiplier}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.5"
              value={speedMultiplier}
              onChange={e => handleSpeedChange(Number(e.target.value))}
              style={{ width: '100%', marginTop: 6 }}
            />
          </div>

          {/* Error Injection Toggles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#374151', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={signalLoss}
                onChange={e => handleToggleSignalLoss(e.target.checked)}
              />
              <span>Simulate GPS Signal Loss / Tunnel Dropout</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#374151', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={routeDeviation}
                onChange={e => handleToggleDeviation(e.target.checked)}
              />
              <span>Simulate Intentional Route Deviation (Trigger Reroute)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
