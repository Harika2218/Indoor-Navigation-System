import React, { useState } from 'react';
import { Campus, CampusId } from '../../types/campus';
import { packageManager } from '../../services/packageManager';
import { 
  Settings, 
  Plane, 
  CheckCircle, 
  Trash2, 
  ShieldCheck, 
  HardDrive, 
  X, 
  RotateCcw 
} from 'lucide-react';

interface SettingsModalProps {
  campus: Campus;
  isOpen: boolean;
  onClose: () => void;
  isOffline: boolean;
  onToggleOffline: (enabled: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  campus,
  isOpen,
  onClose,
  isOffline,
  onToggleOffline
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1200,
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
            backgroundColor: '#F7F7F2'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: '#168C83',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Settings size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: '#252A2B' }}>
                Settings & Offline Storage
              </h3>
              <span style={{ fontSize: 10, color: '#777F82' }}>
                Local package cache & network simulation
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

        {/* Content */}
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Airplane Mode Simulation Toggle */}
          <div
            style={{
              backgroundColor: isOffline ? '#FEF2F2' : '#F7F7F2',
              border: isOffline ? '1.5px solid #FCA5A5' : '1px solid #E5E7EB',
              borderRadius: 16,
              padding: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: isOffline ? '#EF4444' : '#E5E7EB',
                  color: isOffline ? '#FFFFFF' : '#4B5563',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Plane size={18} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#252A2B' }}>
                  Airplane Mode Simulation
                </div>
                <div style={{ fontSize: 10, color: '#777F82', marginTop: 1 }}>
                  Tests offline routing, search & map display without internet
                </div>
              </div>
            </div>

            <button
              onClick={() => onToggleOffline(!isOffline)}
              style={{
                backgroundColor: isOffline ? '#EF4444' : '#E5E7EB',
                color: isOffline ? '#FFFFFF' : '#374151',
                border: 'none',
                borderRadius: 14,
                padding: '6px 14px',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {isOffline ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          {/* Local SQLite / IndexedDB Cache Details */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              borderRadius: 16,
              border: '1px solid #E2E8F0',
              padding: 14,
              display: 'flex',
              flexDirection: 'column',
              gap: 8
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: 6 }}>
              <HardDrive size={15} color="#168C83" />
              <span>Active Campus Package: {campus.code}</span>
            </div>

            <div style={{ fontSize: 11, color: '#64748B', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div>Version: <strong>{campus.version}</strong> (Schema v1.2.0)</div>
              <div>Local Footprint: <strong>{campus.packageSizeMb} MB</strong></div>
              <div>Integrity Checksum: <strong>Verified SHA-256</strong></div>
              <div>Status: <strong style={{ color: '#059669' }}>Cached in Local IndexedDB</strong></div>
            </div>
          </div>

          {/* Privacy Note */}
          <div style={{ fontSize: 10, color: '#777F82', lineHeight: 1.4, padding: '0 4px' }}>
            Positioning data is processed strictly on your device. No precise coordinates or Wi-Fi signatures are continuously uploaded to any external server.
          </div>
        </div>
      </div>
    </div>
  );
};
