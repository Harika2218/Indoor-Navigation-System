import React, { useState, useEffect, useRef } from 'react';
import { RouteResult, RouteInstruction } from '../../types/navigation';
import { CampusId } from '../../types/campus';
import { VisualLocalizationResult } from '../../types/positioning';
import { visualLocalizationService } from '../../services/visualLocalizationService';
import { 
  Camera, 
  Compass, 
  ArrowUp, 
  CornerUpLeft, 
  CornerUpRight, 
  X, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  Activity, 
  RefreshCw 
} from 'lucide-react';

interface CameraAROverlayProps {
  campusId: CampusId;
  activeRoute: RouteResult | null;
  isOpen: boolean;
  onClose: () => void;
  onScanQR: () => void;
}

export const CameraAROverlay: React.FC<CameraAROverlayProps> = ({
  campusId,
  activeRoute,
  isOpen,
  onClose,
  onScanQR
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [permissionGranted, setPermissionGranted] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [vpsResult, setVpsResult] = useState<VisualLocalizationResult | null>(null);
  const [isVpsScanning, setIsVpsScanning] = useState(false);

  // Active step instruction
  const currentInstruction: RouteInstruction | undefined = activeRoute?.instructions[0];

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();
    startOrientationListener();
    runInitialVPSMatch();

    return () => {
      stopCamera();
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [isOpen]);

  const startCamera = async () => {
    setPermissionError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.play();
      }
      setPermissionGranted(true);
    } catch (err: any) {
      setPermissionError(
        'Camera permission was denied or is unavailable. Switch to 2D Map or 3D Digital Twin fallback.'
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setPermissionGranted(false);
  };

  const handleOrientation = (e: DeviceOrientationEvent) => {
    if (e.alpha !== null) {
      setDeviceHeading(Math.round(e.alpha));
    }
  };

  const startOrientationListener = () => {
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
  };

  const runInitialVPSMatch = async () => {
    setIsVpsScanning(true);
    const keyframes = visualLocalizationService.getActiveKeyframes(campusId);
    if (keyframes.length > 0) {
      const result = await visualLocalizationService.localizeWithKeyframe(keyframes[0].id);
      setVpsResult(result);
    }
    setIsVpsScanning(false);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#000000',
        zIndex: 1300,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Real-time Camera Video Stream */}
      <video
        ref={videoRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />

      {/* Camera Dark Gradient Overlays for Readability */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 140,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 180,
          background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
          pointerEvents: 'none'
        }}
      />

      {/* Top Header & HUD Status Bar */}
      <div
        style={{
          position: 'relative',
          padding: '14px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              backgroundColor: 'rgba(22, 140, 131, 0.85)',
              color: '#FFFFFF',
              backdropFilter: 'blur(8px)',
              padding: '6px 12px',
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 700
            }}
          >
            <Camera size={14} />
            <span>Camera AR Wayfinding</span>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: '#34D399',
              padding: '4px 10px',
              borderRadius: 14,
              fontSize: 11,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <Activity size={12} />
            <span>{deviceHeading}° Compass</span>
          </div>
        </div>

        {/* Exit AR Button */}
        <button
          onClick={onClose}
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(8px)',
            border: 'none',
            color: '#FFFFFF',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Exit Camera AR Mode"
        >
          <X size={20} />
        </button>
      </div>

      {/* Mandatory PRD Honesty HUD Notice */}
      <div
        style={{
          position: 'relative',
          margin: '0 16px',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(6px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: 12,
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 10,
          color: '#E2E8F0',
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Sparkles size={13} color="#38BDF8" />
          <span>
            {vpsResult
              ? vpsResult.statusText
              : 'CALIBRATING: Aligning camera with campus visual landmarks...'}
          </span>
        </div>
        <button
          onClick={runInitialVPSMatch}
          style={{
            background: 'none',
            border: 'none',
            color: '#38BDF8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            fontSize: 10,
            fontWeight: 700
          }}
        >
          <RefreshCw size={11} />
          <span>Re-match</span>
        </button>
      </div>

      {/* Center 3D AR Wayfinding Reticle & Directional Guidance Indicator */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none'
        }}
      >
        {/* Floating Destination Pin Beacon */}
        <div
          style={{
            backgroundColor: 'rgba(22, 140, 131, 0.92)',
            color: '#FFFFFF',
            padding: '8px 16px',
            borderRadius: 20,
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            border: '2px solid #FFFFFF',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 20,
            animation: 'fadeIn 0.3s ease'
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#34D399' }} />
          <span style={{ fontSize: 13, fontWeight: 800 }}>
            {activeRoute ? 'Target Destination' : 'Explore Campus AR'}
          </span>
        </div>

        {/* 3D Floating Turn Arrow Graphic */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            boxShadow: '0 0 30px rgba(22, 140, 131, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#168C83',
            border: '3px solid #168C83'
          }}
        >
          {currentInstruction?.action === 'turn_left' ? (
            <CornerUpLeft size={38} strokeWidth={3} />
          ) : currentInstruction?.action === 'turn_right' ? (
            <CornerUpRight size={38} strokeWidth={3} />
          ) : (
            <ArrowUp size={38} strokeWidth={3} />
          )}
        </div>

        {/* Distance Countdown */}
        <div
          style={{
            marginTop: 12,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            color: '#FFFFFF',
            padding: '4px 12px',
            borderRadius: 14,
            fontSize: 12,
            fontWeight: 700
          }}
        >
          {currentInstruction?.distanceMeters ? `In ${currentInstruction.distanceMeters}m` : 'Straight ahead'}
        </div>
      </div>

      {/* Bottom AR Turn Instruction & QR Fallback Bar */}
      <div
        style={{
          position: 'relative',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          zIndex: 10
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            borderRadius: 18,
            padding: '12px 16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#1E293B' }}>
              {currentInstruction?.text || 'Point camera along the central walkway'}
            </div>
            <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
              {currentInstruction?.subtext || 'Visual Positioning tracking campus landmarks'}
            </div>
          </div>

          <button
            onClick={onScanQR}
            style={{
              backgroundColor: '#168C83',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 14,
              padding: '8px 12px',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            QR Calibrate
          </button>
        </div>
      </div>
    </div>
  );
};
