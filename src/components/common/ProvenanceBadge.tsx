import React from 'react';
import { ProvenanceType } from '../../types/campus';
import { ShieldCheck, MapPin, Sparkles, HelpCircle, Camera } from 'lucide-react';

interface ProvenanceBadgeProps {
  type: ProvenanceType;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({
  type,
  showIcon = true,
  size = 'md',
  className = ''
}) => {
  const config = {
    REAL_CAPTURED_DATA: {
      label: 'Real Captured Data',
      shortLabel: 'Real 3D Scan',
      bg: '#EDE9FE',
      text: '#6D28D9',
      border: '#DDD6FE',
      icon: Camera,
      description: 'Acquired through terrestrial LiDAR scanning, photogrammetry, or calibrated Gaussian Splatting.'
    },
    VERIFIED_PUBLIC_DATA: {
      label: 'Verified Public Data',
      shortLabel: 'Verified',
      bg: '#E6F5F3',
      text: '#116F68',
      border: '#A3E3DA',
      icon: ShieldCheck,
      description: 'Supported by official university publication or approved institutional survey.'
    },
    OPENSTREETMAP_DATA: {
      label: 'OpenStreetMap',
      shortLabel: 'OSM Data',
      bg: '#EFF6FF',
      text: '#1D4ED8',
      border: '#BFDBFE',
      icon: MapPin,
      description: 'Imported from OpenStreetMap under Open Database License (ODbL).'
    },
    SYNTHETIC_DEMO_DATA: {
      label: 'Demo Layout — Not Official Plan',
      shortLabel: 'Synthetic Demo',
      bg: '#FEF3C7',
      text: '#B45309',
      border: '#FDE68A',
      icon: Sparkles,
      description: 'Generated floor plans, corridors, rooms, or fingerprints for evaluation integrity.'
    },
    UNVERIFIED_DATA: {
      label: 'Unverified Community Data',
      shortLabel: 'Unverified',
      bg: '#F3F4F6',
      text: '#4B5563',
      border: '#E5E7EB',
      icon: HelpCircle,
      description: 'Crowdsourced or draft spatial data not yet cross-validated.'
    }
  }[type] || {
    label: 'Unverified Data',
    shortLabel: 'Unverified',
    bg: '#F3F4F6',
    text: '#4B5563',
    border: '#E5E7EB',
    icon: HelpCircle,
    description: 'Data source not classified.'
  };

  const Icon = config.icon;

  const sizeClasses = {
    sm: { padding: '2px 6px', fontSize: '10px', iconSize: 11 },
    md: { padding: '3px 8px', fontSize: '11px', iconSize: 13 },
    lg: { padding: '5px 12px', fontSize: '12px', iconSize: 15 }
  }[size];

  return (
    <span
      title={config.description}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        backgroundColor: config.bg,
        color: config.text,
        border: `1px solid ${config.border}`,
        borderRadius: '9999px',
        fontWeight: 600,
        letterSpacing: '0.01em',
        padding: sizeClasses.padding,
        fontSize: sizeClasses.fontSize,
        whiteSpace: 'nowrap'
      }}
      className={className}
    >
      {showIcon && <Icon size={sizeClasses.iconSize} />}
      {config.shortLabel}
    </span>
  );
};
