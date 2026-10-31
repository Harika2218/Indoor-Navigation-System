import React, { useState, useEffect } from 'react';
import { CampusId } from '../../types/campus';
import { corsRtkSimulator, ANDHRA_CORS_STATIONS } from '../../services/corsRtkSimulator';
import { RTKComparisonMetrics } from '../../types/positioning';
import { Radio, AlertOctagon, ShieldCheck, Activity, Cpu, Layers, X, RefreshCw } from 'lucide-react';

interface CORSComparisonModalProps {
  campusId: CampusId;
  isOpen: boolean;
  onClose: () => void;
  centerLat: number;
  centerLng: number;
}

export const CORSComparisonModal: React.FC<CORSComparisonModalProps> = ({
  campusId,
  isOpen,
  onClose,
  centerLat,
  centerLng
}) => {
  const [metrics, setMetrics] = useState<RTKComparisonMetrics | null>(null);
  const [scatterCloud, setScatterCloud] = useState<{
    standaloneCloud: [number, number][];
    rtkCloud: [number, number][];
  } | null>(null);

  const corsInfo = ANDHRA_CORS_STATIONS[campusId];

  const refreshData = () => {
    const met = corsRtkSimulator.generateComparison(campusId, centerLat, centerLng);
    const cloud = corsRtkSimulator.generateScatterCloud(centerLat, centerLng, 25);
    setMetrics(met);
    setScatterCloud(cloud);
  };

  useEffect(() => {
    if (isOpen) {
      refreshData();
    }
  }, [isOpen, campusId, centerLat, centerLng]);

  if (!isOpen || !metrics) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(5px)',
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
          maxWidth: 540,
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh'
        }}
      >
        {/* Mandatory PRD Honesty Banner */}
        <div
          style={{
            backgroundColor: '#DC2626',
            color: '#FFFFFF',
            padding: '8px 14px',
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.04em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            textAlign: 'center'
          }}
        >
          <AlertOctagon size={16} />
          <span>ILLUSTRATIVE CORS/RTK — NOT A LIVE CORRECTION FEED</span>
        </div>

        {/* Modal Header */}
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
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: '#168C83',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Radio size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: '#252A2B' }}>
                CORS / RTK Differential Positioning Lab
              </h3>
              <span style={{ fontSize: 10, color: '#777F82' }}>
                Project Theme: CORS for Everyday Solutions
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              onClick={refreshData}
              style={{
                background: 'none',
                border: '1px solid #D1D5DB',
                borderRadius: 8,
                padding: '4px 8px',
                color: '#252A2B',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11
              }}
              title="Resample Scatter Cloud"
            >
              <RefreshCw size={12} />
              <span>Resample</span>
            </button>
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
        </div>

        {/* Modal Body */}
        <div style={{ padding: 18, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Comparative Error Metrics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {/* Standalone GNSS Card */}
            <div
              style={{
                backgroundColor: '#FEF2F2',
                border: '1.5px solid #FECACA',
                borderRadius: 16,
                padding: 12
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: '#991B1B', textTransform: 'uppercase' }}>
                Standalone GPS (Phone)
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#DC2626', margin: '4px 0' }}>
                ±{metrics.standaloneErrorMeters} m
              </div>
              <div style={{ fontSize: 10, color: '#7F1D1D', lineHeight: 1.3 }}>
                Subject to ionospheric delay, troposphere refraction & clock jitter.
              </div>
            </div>

            {/* Illustrative RTK Corrected Card */}
            <div
              style={{
                backgroundColor: '#ECFDF5',
                border: '1.5px solid #A7F3D0',
                borderRadius: 16,
                padding: 12
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: '#065F46', textTransform: 'uppercase' }}>
                Illustrative RTK Fix
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#059669', margin: '4px 0' }}>
                ±{metrics.correctedErrorMeters} m
              </div>
              <div style={{ fontSize: 10, color: '#064E3B', lineHeight: 1.3 }}>
                Carrier-phase double difference ({metrics.improvementFactor}x precision boost).
              </div>
            </div>
          </div>

          {/* Interactive Scatter Simulation Canvas */}
          <div
            style={{
              backgroundColor: '#1E293B',
              borderRadius: 16,
              padding: 14,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 11,
                color: '#94A3B8',
                marginBottom: 8,
                fontWeight: 600
              }}
            >
              <span>95% Dispersion Scatter Cloud (Illustrative)</span>
              <span style={{ color: '#34D399' }}>Sub-decimeter CEP</span>
            </div>

            <svg viewBox="-120 -120 240 240" style={{ width: 220, height: 220 }}>
              {/* Distance Rings */}
              <circle r={100} fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
              <text x={0} y={-102} fill="#64748B" fontSize="8" textAnchor="middle">
                8m radius
              </text>
              <circle r={50} fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
              <text x={0} y={-52} fill="#64748B" fontSize="8" textAnchor="middle">
                4m radius
              </text>
              <circle r={10} fill="none" stroke="#168C83" strokeWidth="1" />
              <text x={0} y={-12} fill="#34D399" fontSize="7" textAnchor="middle">
                0.1m
              </text>

              {/* Crosshairs */}
              <line x1={-110} y1={0} x2={110} y2={0} stroke="#334155" strokeWidth="1" />
              <line x1={0} y1={-110} x2={0} y2={110} stroke="#334155" strokeWidth="1" />

              {/* Standalone GPS Scatter (Red Dots spread across 40-100 px) */}
              {scatterCloud?.standaloneCloud.map(([sLat, sLng], i) => {
                const px = ((sLng - centerLng) * 111000 * Math.cos((centerLat * Math.PI) / 180)) * 12;
                const py = ((sLat - centerLat) * 111000) * 12;
                return (
                  <circle
                    key={`std-${i}`}
                    cx={Math.max(-105, Math.min(105, px))}
                    cy={Math.max(-105, Math.min(105, py))}
                    r={2.5}
                    fill="#EF4444"
                    opacity={0.65}
                  />
                );
              })}

              {/* RTK Tight Fix Cluster (Green Dots tightly grouped in center) */}
              {scatterCloud?.rtkCloud.map(([rLat, rLng], i) => {
                const px = ((rLng - centerLng) * 111000 * Math.cos((centerLat * Math.PI) / 180)) * 12;
                const py = ((rLat - centerLat) * 111000) * 12;
                return (
                  <circle
                    key={`rtk-${i}`}
                    cx={px}
                    cy={py}
                    r={3}
                    fill="#10B981"
                    stroke="#FFFFFF"
                    strokeWidth={0.5}
                  />
                );
              })}

              {/* True Center Marker */}
              <circle r={3} fill="#FFFFFF" />
            </svg>

            <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 10, color: '#CBD5E1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#EF4444' }} />
                <span>Standalone GPS (Scattered)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10B981' }} />
                <span>RTK Corrected Fix (Tight)</span>
              </div>
            </div>
          </div>

          {/* CORS Reference Station Telemetry */}
          <div
            style={{
              backgroundColor: '#F7F7F2',
              borderRadius: 14,
              border: '1px solid #E5E7EB',
              padding: 12
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: '#252A2B', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Activity size={14} color="#168C83" />
              <span>Survey of India CORS Ground Station Telemetry</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 11 }}>
              <div>
                <span style={{ color: '#777F82' }}>Base Station:</span>{' '}
                <strong style={{ color: '#252A2B' }}>{corsInfo.station.id}</strong>
              </div>
              <div>
                <span style={{ color: '#777F82' }}>Baseline Distance:</span>{' '}
                <strong style={{ color: '#252A2B' }}>{corsInfo.station.distanceKm} km</strong>
              </div>
              <div>
                <span style={{ color: '#777F82' }}>Correction Format:</span>{' '}
                <strong style={{ color: '#252A2B' }}>{corsInfo.station.format}</strong>
              </div>
              <div>
                <span style={{ color: '#777F82' }}>Stream Latency:</span>{' '}
                <strong style={{ color: '#168C83' }}>{corsInfo.station.latencySeconds}s</strong>
              </div>
            </div>
          </div>

          {/* Hardware & Real Deployment Prerequisites */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              borderRadius: 14,
              border: '1px solid #E2E8F0',
              padding: 12
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: '#334155', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Cpu size={14} color="#0284C7" />
              <span>Real Hardware & Feed Integration Requirements</span>
            </div>
            <ul style={{ paddingLeft: 18, fontSize: 10, color: '#64748B', lineHeight: 1.5 }}>
              {corsInfo.hardwareRequirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
