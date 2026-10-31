import React, { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';
import { QRCheckpointPayload } from '../../types/positioning';
import { CampusId } from '../../types/campus';
import { packageManager } from '../../services/packageManager';
import { positioningService } from '../../services/positioningService';
import { ProvenanceBadge } from '../common/ProvenanceBadge';
import { QrCode, Camera, CheckCircle, AlertTriangle, X, Sparkles, RefreshCw } from 'lucide-react';

interface QRScannerModalProps {
  campusId: CampusId;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  campusId,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'demo_checkpoints'>('demo_checkpoints');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [statusAlert, setStatusAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const activePkg = packageManager.getActivePackage();
  const checkpoints = activePkg.qrCheckpoints;

  // Camera video stream handler
  useEffect(() => {
    if (!isOpen || activeTab !== 'camera') {
      stopCamera();
      return;
    }

    startCamera();
    return () => stopCamera();
  }, [isOpen, activeTab]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.play();
        requestAnimationFrame(tickScan);
      }
    } catch (err: any) {
      setCameraError(
        'Camera access denied or unavailable in this browser environment. Use the one-click Demo Checkpoints below.'
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const tickScan = () => {
    if (!videoRef.current || !canvasRef.current || activeTab !== 'camera') return;

    if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.height = videoRef.current.videoHeight;
        canvas.width = videoRef.current.videoWidth;
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert'
        });

        if (code && code.data) {
          try {
            const parsed = JSON.parse(code.data) as QRCheckpointPayload;
            handleApplyPayload(parsed);
            return;
          } catch (e) {
            // Not a JSON QR
          }
        }
      }
    }
    requestAnimationFrame(tickScan);
  };

  const handleApplyPayload = (payload: QRCheckpointPayload) => {
    const res = positioningService.applyQRCheckpoint(payload);
    if (res.success) {
      setStatusAlert({ type: 'success', message: res.message });
      setTimeout(() => {
        onSuccess(res.message);
        onClose();
      }, 1200);
    } else {
      setStatusAlert({ type: 'error', message: res.message });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1100,
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
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
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
              <QrCode size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#252A2B' }}>
                QR Checkpoint Fallback
              </h3>
              <span style={{ fontSize: 10, color: '#777F82' }}>
                Instant indoor position confirmation
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

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #E5E7EB',
            backgroundColor: '#FAFAF8'
          }}
        >
          <button
            onClick={() => setActiveTab('demo_checkpoints')}
            style={{
              flex: 1,
              padding: '10px 0',
              border: 'none',
              background: 'none',
              fontSize: 12,
              fontWeight: 700,
              color: activeTab === 'demo_checkpoints' ? '#168C83' : '#777F82',
              borderBottom: activeTab === 'demo_checkpoints' ? '2px solid #168C83' : 'none',
              cursor: 'pointer'
            }}
          >
            Demo Checkpoints (One-Click)
          </button>
          <button
            onClick={() => setActiveTab('camera')}
            style={{
              flex: 1,
              padding: '10px 0',
              border: 'none',
              background: 'none',
              fontSize: 12,
              fontWeight: 700,
              color: activeTab === 'camera' ? '#168C83' : '#777F82',
              borderBottom: activeTab === 'camera' ? '2px solid #168C83' : 'none',
              cursor: 'pointer'
            }}
          >
            Webcam Scanner
          </button>
        </div>

        {/* Status Message Notification */}
        {statusAlert && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: statusAlert.type === 'success' ? '#D1FAE5' : '#FEE2E2',
              color: statusAlert.type === 'success' ? '#065F46' : '#991B1B',
              fontSize: 11,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            {statusAlert.type === 'success' ? <CheckCircle size={15} /> : <AlertTriangle size={15} />}
            <span>{statusAlert.message}</span>
          </div>
        )}

        {/* Tab Content */}
        <div style={{ padding: 16, maxHeight: 380, overflowY: 'auto' }}>
          {activeTab === 'demo_checkpoints' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 11, color: '#4B5563', lineHeight: 1.4 }}>
                Select an indoor checkpoint fixture to immediately recalibrate indoor position with ground-truth coordinates:
              </div>

              {checkpoints.map(cp => (
                <div
                  key={cp.checkpoint_id}
                  style={{
                    border: '1px solid #E5E7EB',
                    borderRadius: 14,
                    padding: 12,
                    backgroundColor: '#F9FAF9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#252A2B' }}>
                        {cp.label}
                      </span>
                      <span
                        style={{
                          fontSize: 9,
                          backgroundColor: '#E5E7EB',
                          padding: '1px 5px',
                          borderRadius: 4,
                          fontWeight: 600
                        }}
                      >
                        {cp.checkpoint_id}
                      </span>
                    </div>
                    <div style={{ fontSize: 10, color: '#777F82', marginTop: 2 }}>
                      Campus: {cp.campus_id} • Node: {cp.node_id}
                    </div>
                  </div>

                  <button
                    onClick={() => handleApplyPayload(cp)}
                    style={{
                      backgroundColor: '#168C83',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: 12,
                      padding: '6px 12px',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    Confirm
                  </button>
                </div>
              ))}

              {/* Cross-Campus Error Demo Checkpoint (To verify error rejection!) */}
              <div
                style={{
                  border: '1px dashed #F87171',
                  borderRadius: 14,
                  padding: 12,
                  backgroundColor: '#FEF2F2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                  marginTop: 6
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#991B1B' }}>
                      Simulate Wrong-Campus QR Scan
                    </span>
                  </div>
                  <div style={{ fontSize: 10, color: '#B91C1C', marginTop: 2 }}>
                    Payload for opposite campus (tests PRD data rejection rule)
                  </div>
                </div>

                <button
                  onClick={() =>
                    handleApplyPayload({
                      version: '1.0',
                      campus_id: campusId === 'mbu-tirupati' ? 'iittp-permanent' : 'mbu-tirupati',
                      building_id: 'fake-bld',
                      floor_id: 'fake-fl',
                      checkpoint_id: 'CP-WRONG-CAMPUS-999',
                      node_id: 'fake-node',
                      label: 'Invalid Cross-Campus Code'
                    })
                  }
                  style={{
                    backgroundColor: '#EF4444',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 12,
                    padding: '6px 12px',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  Test Rejection
                </button>
              </div>
            </div>
          ) : (
            // Webcam Scanner
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {cameraError ? (
                <div
                  style={{
                    padding: 16,
                    textAlign: 'center',
                    color: '#991B1B',
                    backgroundColor: '#FEE2E2',
                    borderRadius: 12,
                    fontSize: 12
                  }}
                >
                  {cameraError}
                </div>
              ) : (
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: 240,
                    backgroundColor: '#000000',
                    borderRadius: 16,
                    overflow: 'hidden'
                  }}
                >
                  <video
                    ref={videoRef}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <canvas ref={canvasRef} style={{ display: 'none' }} />

                  {/* QR Target Viewfinder Reticle */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 140,
                      height: 140,
                      border: '2px solid #168C83',
                      borderRadius: 12,
                      boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.4)'
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
