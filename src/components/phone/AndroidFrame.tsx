import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal, Smartphone, Monitor } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  isFrameEnabled: boolean;
  onToggleFrame: () => void;
  isOffline: boolean;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  isFrameEnabled,
  onToggleFrame,
  isOffline
}) => {
  const [time, setTime] = useState<string>('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E7E9E8',
        padding: isFrameEnabled ? '20px 10px' : '0'
      }}
    >
      {/* Top Floating Viewport Control Bar */}
      <div
        style={{
          position: 'fixed',
          top: 12,
          right: 16,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(8px)',
          padding: '6px 12px',
          borderRadius: 9999,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
          border: '1px solid #D1D5DB',
          fontSize: 12,
          fontWeight: 600
        }}
      >
        <button
          onClick={onToggleFrame}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'none',
            border: 'none',
            color: '#252A2B',
            cursor: 'pointer',
            padding: '2px 6px',
            borderRadius: 6
          }}
          title="Toggle between Android Device Frame and Fullscreen View"
        >
          {isFrameEnabled ? <Monitor size={15} color="#168C83" /> : <Smartphone size={15} color="#168C83" />}
          <span>{isFrameEnabled ? 'Full Screen' : 'Android Frame'}</span>
        </button>
      </div>

      {isFrameEnabled ? (
        // Realistic Android Frame Container
        <div
          style={{
            width: '100%',
            maxWidth: 420,
            height: '92vh',
            maxHeight: 880,
            backgroundColor: '#1E2325',
            borderRadius: 44,
            padding: 12,
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35), 0 4px 12px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            border: '3px solid #374151'
          }}
        >
          {/* Inner Screen */}
          <div
            style={{
              flex: 1,
              backgroundColor: '#F7F7F2',
              borderRadius: 34,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
          >
            {/* Android Status Bar */}
            <div
              style={{
                height: 32,
                backgroundColor: '#FFFFFF',
                borderBottom: '1px solid #F1F1E8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px',
                fontSize: 11,
                fontWeight: 600,
                color: '#252A2B',
                zIndex: 1000,
                userSelect: 'none'
              }}
            >
              <span>{time}</span>

              {/* Camera Notch Punch Hole */}
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: '#111827'
                }}
              />

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {isOffline && (
                  <span
                    style={{
                      fontSize: 9,
                      backgroundColor: '#FEE2E2',
                      color: '#DC2626',
                      padding: '1px 5px',
                      borderRadius: 4,
                      fontWeight: 700
                    }}
                  >
                    AIRPLANE
                  </span>
                )}
                <Signal size={13} />
                <Wifi size={13} color={isOffline ? '#9CA3AF' : '#168C83'} />
                <BatteryMedium size={14} />
              </div>
            </div>

            {/* App Content */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              {children}
            </div>

            {/* Android Gesture Bar */}
            <div
              style={{
                height: 16,
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
              }}
            >
              <div
                style={{
                  width: 90,
                  height: 4,
                  backgroundColor: '#9CA3AF',
                  borderRadius: 9999
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        // Full Window Layout
        <div
          style={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#F7F7F2'
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};
