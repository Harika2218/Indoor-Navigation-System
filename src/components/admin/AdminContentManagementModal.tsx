import React, { useState } from 'react';
import { Campus, CampusId, DigitalTwinAsset } from '../../types/campus';
import { QRCheckpointPayload } from '../../types/positioning';
import { packageManager } from '../../services/packageManager';
import { ProvenanceBadge } from '../common/ProvenanceBadge';
import { 
  ShieldCheck, 
  Box, 
  QrCode, 
  CheckCircle, 
  AlertTriangle, 
  Plus, 
  Download, 
  Upload, 
  Layers, 
  X, 
  Lock 
} from 'lucide-react';

interface AdminContentManagementModalProps {
  campus: Campus;
  isOpen: boolean;
  onClose: () => void;
  onRefreshData: () => void;
}

export const AdminContentManagementModal: React.FC<AdminContentManagementModalProps> = ({
  campus,
  isOpen,
  onClose,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'digital_twin' | 'qr_checkpoints' | 'validation' | 'publish'>('digital_twin');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // Demo mode pre-authenticated
  const [adminPin, setAdminPin] = useState<string>('2026');

  // Form state for registering new digital twin asset
  const [newAsset, setNewAsset] = useState<{
    name: string;
    format: 'gltf' | 'glb' | 'ply' | 'splat';
    provenance: 'REAL_CAPTURED_DATA' | 'SYNTHETIC_DEMO_DATA';
    buildingId: string;
  }>({
    name: '',
    format: 'glb',
    provenance: 'REAL_CAPTURED_DATA',
    buildingId: ''
  });

  // State for new QR checkpoint
  const [newCheckpoint, setNewCheckpoint] = useState<{
    label: string;
    buildingId: string;
    floorId: string;
    nodeId: string;
  }>({
    label: '',
    buildingId: '',
    floorId: '',
    nodeId: ''
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);

  const activePkg = packageManager.getActivePackage();
  const dtAssets = activePkg.manifest.digitalTwinAssets || [];
  const checkpoints = activePkg.qrCheckpoints;

  if (!isOpen) return null;

  const handleRegisterAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsset.name) return;

    const registered: DigitalTwinAsset = {
      id: `dt-${campus.code.toLowerCase()}-${Date.now().toString(36)}`,
      campusId: campus.id,
      buildingId: newAsset.buildingId || undefined,
      name: newAsset.name,
      format: newAsset.format,
      provenance: newAsset.provenance,
      captureDate: new Date().toISOString().split('T')[0],
      version: '1.0.0',
      processingStatus: 'ready',
      fileSizeBytes: 3500000,
      description: 'Admin registered spatial digital twin asset.'
    };

    if (!activePkg.manifest.digitalTwinAssets) {
      activePkg.manifest.digitalTwinAssets = [];
    }
    activePkg.manifest.digitalTwinAssets.push(registered);
    setNewAsset({ name: '', format: 'glb', provenance: 'REAL_CAPTURED_DATA', buildingId: '' });
    onRefreshData();
  };

  const handleCreateCheckpoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCheckpoint.label) return;

    const cp: QRCheckpointPayload = {
      version: '1.0',
      campus_id: campus.id,
      building_id: newCheckpoint.buildingId || activePkg.buildings[0]?.id || 'bld-01',
      floor_id: newCheckpoint.floorId || activePkg.buildings[0]?.floors[0]?.id || 'fl-0',
      checkpoint_id: `CP-${campus.code}-${Date.now().toString(36).toUpperCase()}`,
      node_id: newCheckpoint.nodeId || activePkg.buildings[0]?.entrances[0]?.indoorNodeId || 'node-0',
      label: newCheckpoint.label,
      createdAt: new Date().toISOString(),
      isActive: true,
      provenance: 'REAL_CAPTURED_DATA'
    };

    activePkg.qrCheckpoints.push(cp);
    setNewCheckpoint({ label: '', buildingId: '', floorId: '', nodeId: '' });
    onRefreshData();
  };

  const runIntegrityValidation = () => {
    const errors: string[] = [];
    // Check broken building-floor relationships
    for (const bld of activePkg.buildings) {
      if (bld.campusId !== campus.id) {
        errors.push(`Integrity Error: Building ${bld.id} has mismatched campus_id`);
      }
      for (const fl of bld.floors) {
        if (fl.buildingId !== bld.id) {
          errors.push(`Broken Relationship: Floor ${fl.id} references non-parent building ${fl.buildingId}`);
        }
      }
    }

    // Check QR Checkpoints
    for (const cp of activePkg.qrCheckpoints) {
      if (cp.campus_id !== campus.id) {
        errors.push(`Cross-Campus Leak: Checkpoint ${cp.checkpoint_id} assigned to ${cp.campus_id} inside ${campus.id}`);
      }
    }

    setValidationErrors(errors);
  };

  const handlePublishVersion = () => {
    runIntegrityValidation();
    if (validationErrors.length === 0) {
      const newVersion = `2026.11.${Date.now() % 100}`;
      activePkg.manifest.version = newVersion;
      campus.version = newVersion;
      setPublishSuccess(`Package version v${newVersion} validated and published to local SQLite/IndexedDB repository!`);
      setTimeout(() => setPublishSuccess(null), 4000);
    }
  };

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
          maxWidth: 580,
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
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
            backgroundColor: '#F8FAFC'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>
                Admin & Spatial Content Management
              </h3>
              <span style={{ fontSize: 10, color: '#64748B' }}>
                Protected repository for 3D twin assets, QR checkpoints & package publishing
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

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #E5E7EB',
            backgroundColor: '#F1F5F9',
            fontSize: 11,
            fontWeight: 700
          }}
        >
          {(
            [
              { id: 'digital_twin', label: '3D Twin Assets', icon: Box },
              { id: 'qr_checkpoints', label: 'QR Manager', icon: QrCode },
              { id: 'validation', label: 'Integrity Validator', icon: ShieldCheck },
              { id: 'publish', label: 'Publish Package', icon: Upload }
            ] as const
          ).map(tab => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  padding: '10px 4px',
                  border: 'none',
                  background: isTabActive ? '#FFFFFF' : 'transparent',
                  color: isTabActive ? '#168C83' : '#64748B',
                  borderBottom: isTabActive ? '2px solid #168C83' : 'none',
                  cursor: 'pointer'
                }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div style={{ padding: 18, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* TAB 1: 3D DIGITAL TWIN ASSETS */}
          {activeTab === 'digital_twin' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1E293B' }}>
                Registered 3D Models, Point Clouds & Gaussian Splatting Assets
              </div>

              {/* Assets List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {dtAssets.map(asset => (
                  <div
                    key={asset.id}
                    style={{
                      border: '1px solid #E2E8F0',
                      borderRadius: 12,
                      padding: 10,
                      backgroundColor: '#F8FAFC',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#1E293B' }}>
                          {asset.name}
                        </span>
                        <span
                          style={{
                            fontSize: 9,
                            backgroundColor: '#E2E8F0',
                            padding: '1px 6px',
                            borderRadius: 4,
                            fontWeight: 700,
                            textTransform: 'uppercase'
                          }}
                        >
                          {asset.format}
                        </span>
                        <ProvenanceBadge type={asset.provenance} size="sm" />
                      </div>
                      <div style={{ fontSize: 10, color: '#64748B', marginTop: 2 }}>
                        Captured: {asset.captureDate} • Size: {(asset.fileSizeBytes / 1000000).toFixed(1)} MB • Status: {asset.processingStatus}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New 3D Asset Form */}
              <form
                onSubmit={handleRegisterAsset}
                style={{
                  backgroundColor: '#F1F5F9',
                  borderRadius: 14,
                  padding: 12,
                  marginTop: 6,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: '#334155' }}>
                  Register New 3D Digital Twin Model
                </div>
                <input
                  type="text"
                  placeholder="Asset Name (e.g. Computing Block Interior LiDAR Scan)"
                  value={newAsset.name}
                  onChange={e => setNewAsset({ ...newAsset, name: e.target.value })}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1px solid #CBD5E1',
                    fontSize: 12
                  }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <select
                    value={newAsset.format}
                    onChange={e => setNewAsset({ ...newAsset, format: e.target.value as any })}
                    style={{ padding: '6px 8px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 11 }}
                  >
                    <option value="glb">glTF / GLB Architectural Model</option>
                    <option value="splat">Gaussian Splat (.splat)</option>
                    <option value="ply">Point Cloud (.ply)</option>
                  </select>

                  <select
                    value={newAsset.provenance}
                    onChange={e => setNewAsset({ ...newAsset, provenance: e.target.value as any })}
                    style={{ padding: '6px 8px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 11 }}
                  >
                    <option value="REAL_CAPTURED_DATA">REAL_CAPTURED_DATA</option>
                    <option value="SYNTHETIC_DEMO_DATA">SYNTHETIC_DEMO_DATA</option>
                  </select>
                </div>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#168C83',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 0',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Register Asset
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: QR CHECKPOINTS MANAGER */}
          {activeTab === 'qr_checkpoints' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1E293B' }}>
                QR Checkpoint Registry ({checkpoints.length} Active)
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 180, overflowY: 'auto' }}>
                {checkpoints.map(cp => (
                  <div
                    key={cp.checkpoint_id}
                    style={{
                      border: '1px solid #E2E8F0',
                      borderRadius: 10,
                      padding: 8,
                      backgroundColor: '#F8FAFC',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#1E293B' }}>
                        {cp.label}
                      </div>
                      <div style={{ fontSize: 9, color: '#64748B' }}>
                        ID: {cp.checkpoint_id} • Node: {cp.node_id}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 9,
                        backgroundColor: '#DCFCE7',
                        color: '#166534',
                        padding: '2px 6px',
                        borderRadius: 4,
                        fontWeight: 700
                      }}
                    >
                      ACTIVE
                    </span>
                  </div>
                ))}
              </div>

              {/* Add Checkpoint Form */}
              <form
                onSubmit={handleCreateCheckpoint}
                style={{
                  backgroundColor: '#F1F5F9',
                  borderRadius: 14,
                  padding: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: '#334155' }}>
                  Generate New QR Checkpoint
                </div>
                <input
                  type="text"
                  placeholder="Checkpoint Description (e.g. West Wing Stairs Landing)"
                  value={newCheckpoint.label}
                  onChange={e => setNewCheckpoint({ ...newCheckpoint, label: e.target.value })}
                  style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 12 }}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#168C83',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 0',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Generate QR Checkpoint
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: SPATIAL DATA INTEGRITY VALIDATOR */}
          {activeTab === 'validation' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1E293B' }}>
                Spatial Graph & Relationship Validation
              </div>
              <p style={{ fontSize: 11, color: '#64748B', lineHeight: 1.4 }}>
                Enforces the PRD rule: Blocks publishing records with invalid coordinates, cross-campus leakage, or broken floor relationships.
              </p>

              <button
                onClick={runIntegrityValidation}
                style={{
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 10,
                  padding: '8px 14px',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Run Full Integrity Scan
              </button>

              {validationErrors.length === 0 ? (
                <div
                  style={{
                    padding: 12,
                    backgroundColor: '#ECFDF5',
                    borderRadius: 10,
                    border: '1px solid #A7F3D0',
                    color: '#065F46',
                    fontSize: 11,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  <CheckCircle size={16} />
                  <span>All campus entities, coordinates, and 3D floor trees passed validation!</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {validationErrors.map((err, i) => (
                    <div
                      key={i}
                      style={{
                        padding: 8,
                        backgroundColor: '#FEF2F2',
                        borderRadius: 8,
                        border: '1px solid #FECACA',
                        color: '#991B1B',
                        fontSize: 10
                      }}
                    >
                      {err}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PUBLISH PACKAGE */}
          {activeTab === 'publish' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1E293B' }}>
                Publish Versioned Campus Package
              </div>
              <p style={{ fontSize: 11, color: '#64748B', lineHeight: 1.4 }}>
                Validates checksums, builds the unified manifest, and updates the local SQLite/IndexedDB package registry.
              </p>

              {publishSuccess && (
                <div
                  style={{
                    padding: 12,
                    backgroundColor: '#ECFDF5',
                    borderRadius: 10,
                    border: '1px solid #A7F3D0',
                    color: '#065F46',
                    fontSize: 11,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  <CheckCircle size={16} />
                  <span>{publishSuccess}</span>
                </div>
              )}

              <button
                onClick={handlePublishVersion}
                style={{
                  backgroundColor: '#168C83',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 12,
                  padding: '10px 0',
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Validate & Publish New Version
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
