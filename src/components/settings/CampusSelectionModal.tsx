import React, { useState, useEffect } from 'react';
import { Campus, CampusId } from '../../types/campus';
import { packageManager } from '../../services/packageManager';
import { ProvenanceBadge } from '../common/ProvenanceBadge';
import { Layers, Download, CheckCircle, RefreshCw, X, ShieldCheck, MapPin } from 'lucide-react';

interface CampusSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCampusId: CampusId;
  onCampusChanged: (newCampusId: CampusId) => void;
}

export const CampusSelectionModal: React.FC<CampusSelectionModalProps> = ({
  isOpen,
  onClose,
  activeCampusId,
  onCampusChanged
}) => {
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [downloadProgress, setDownloadProgress] = useState<{
    campusId: CampusId | null;
    percent: number;
    status: string;
  }>({ campusId: null, percent: 0, status: '' });

  useEffect(() => {
    setCampuses(packageManager.getAllCampuses());
  }, []);

  if (!isOpen) return null;

  const handleDownloadAndSwitch = async (campusId: CampusId) => {
    try {
      setDownloadProgress({ campusId, percent: 10, status: 'Starting download stream...' });
      await packageManager.downloadAndActivatePackage(campusId, (pct, status) => {
        setDownloadProgress({ campusId, percent: pct, status });
      });
      setTimeout(() => {
        setDownloadProgress({ campusId: null, percent: 0, status: '' });
        onCampusChanged(campusId);
        onClose();
      }, 500);
    } catch (err: any) {
      alert(`Package error: ${err.message}`);
      setDownloadProgress({ campusId: null, percent: 0, status: '' });
    }
  };

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
          maxWidth: 480,
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
              <Layers size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: '#252A2B' }}>
                Select Campus Navigation Package
              </h3>
              <span style={{ fontSize: 10, color: '#777F82' }}>
                Isolated datasets with verified provenance
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

        {/* Campus Cards List */}
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {campuses.map(campus => {
            const isSelected = activeCampusId === campus.id;
            const isDownloading = downloadProgress.campusId === campus.id;

            return (
              <div
                key={campus.id}
                style={{
                  border: isSelected ? '2px solid #168C83' : '1px solid #E5E7EB',
                  borderRadius: 18,
                  padding: 14,
                  backgroundColor: isSelected ? '#F0FDF4' : '#FFFFFF',
                  boxShadow: isSelected ? '0 4px 14px rgba(22, 140, 131, 0.12)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: '#252A2B' }}>
                        {campus.name}
                      </span>
                      {isSelected && (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: '#168C83',
                            backgroundColor: '#DDF3EC',
                            padding: '2px 8px',
                            borderRadius: 10
                          }}
                        >
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: '#777F82', marginTop: 3 }}>
                      {campus.tagline}
                    </div>
                  </div>

                  <ProvenanceBadge type={campus.provenance} size="sm" />
                </div>

                {/* Package Metrics Bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    fontSize: 11,
                    color: '#4B5563',
                    backgroundColor: '#F7F7F2',
                    padding: '6px 10px',
                    borderRadius: 10
                  }}
                >
                  <span>Pkg: <strong>v{campus.version}</strong></span>
                  <span>Size: <strong>{campus.packageSizeMb} MB</strong></span>
                  <span>Buildings: <strong>{campus.stats.buildingCount}</strong></span>
                  <span>Updated: <strong>{campus.lastUpdated}</strong></span>
                </div>

                {/* Progress Bar (If downloading) */}
                {isDownloading && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#168C83', fontWeight: 600 }}>
                      <span>{downloadProgress.status}</span>
                      <span>{downloadProgress.percent}%</span>
                    </div>
                    <div style={{ width: '100%', height: 6, backgroundColor: '#E5E7EB', borderRadius: 9999, marginTop: 4, overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${downloadProgress.percent}%`,
                          height: '100%',
                          backgroundColor: '#168C83',
                          transition: 'width 0.2s ease'
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Action button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                  <button
                    disabled={isDownloading}
                    onClick={() => handleDownloadAndSwitch(campus.id)}
                    style={{
                      backgroundColor: isSelected ? '#168C83' : '#F7F7F2',
                      color: isSelected ? '#FFFFFF' : '#252A2B',
                      border: isSelected ? 'none' : '1px solid #D1D5DB',
                      borderRadius: 12,
                      padding: '8px 16px',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle size={14} />
                        <span>Active Campus</span>
                      </>
                    ) : (
                      <>
                        <Download size={14} />
                        <span>Download & Activate</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
