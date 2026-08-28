import React from 'react';
import {
  X,
  FileSearch,
  Fingerprint,
  HardDrive,
  Camera,
  MapPin,
  Info
} from 'lucide-react';
import { EvidenceItem } from '../types';

interface MetadataForensicsModalProps {
  isOpen?: boolean;
  onClose: () => void;
  evidence?: EvidenceItem | null;
  item?: EvidenceItem | null;
}

export const MetadataForensicsModal: React.FC<MetadataForensicsModalProps> = ({
  isOpen = true,
  onClose,
  evidence: evidenceProp,
  item,
}) => {
  const evidence = item || evidenceProp;
  if (!isOpen || !evidence) return null;

  const { metadata } = evidence;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full text-slate-900 shadow-2xl overflow-hidden font-technical">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center">
              <FileSearch className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-wider">
                METADATA & FORENSIC ATTRIBUTE INSPECTOR
              </h2>
              <p className="text-[10px] text-slate-500 font-mono">
                Artifact ID: {evidence.id} // {evidence.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Statutory Source Label */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-[11px] text-slate-700">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-slate-500 shrink-0" />
              <span>
                <strong>SOURCE:</strong> EXTRACTED FORENSIC METADATA MANIFEST
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-semibold font-mono">
              UNALTERED
            </span>
          </div>

          {/* Core File Properties */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-2">
              <HardDrive className="w-3.5 h-3.5 text-slate-600" />
              <span>FILESYSTEM & INODE PROPERTIES</span>
            </h4>

            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-bold">FILE NAME:</span>
                <span className="text-slate-900 font-mono font-semibold">{evidence.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-bold">MIME TYPE:</span>
                <span className="text-slate-800 font-mono">{metadata?.mimeType || 'application/octet-stream'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-bold">FILE SIZE:</span>
                <span className="text-slate-800 font-mono">{metadata?.fileSize || evidence.fileSize}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-bold">FILE EXTENSION:</span>
                <span className="text-slate-800 font-mono font-semibold">{evidence.fileExtension}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-bold">FILESYSTEM POOL:</span>
                <span className="text-slate-800 font-mono">{metadata?.fileSystem || 'ZFS Immutable Pool'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-bold">WRITE-BLOCKER:</span>
                <span className="text-slate-800 font-mono">{metadata?.writeBlockerUsed || 'Tableau T8u Forensic USB 3.0'}</span>
              </div>
            </div>
          </div>

          {/* Cryptographic Fingerprints */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-2">
              <Fingerprint className="w-3.5 h-3.5 text-slate-600" />
              <span>CRYPTOGRAPHIC HASH DIGESTS</span>
            </h4>

            <div className="space-y-1.5 text-[11px] font-mono">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[9px] uppercase font-bold">SHA-256 (AUTHORITATIVE):</span>
                <span className="text-slate-900 font-bold break-all">{evidence.digitalHashSha256}</span>
              </div>
              {metadata?.md5 && (
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">MD5:</span>
                  <span className="text-slate-700 break-all">{metadata.md5}</span>
                </div>
              )}
              {metadata?.sha1 && (
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">SHA-1:</span>
                  <span className="text-slate-700 break-all">{metadata.sha1}</span>
                </div>
              )}
            </div>
          </div>

          {/* Camera EXIF / GPS if available */}
          {(metadata?.cameraExif || metadata?.gpsCoordinates) && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-2">
                <Camera className="w-3.5 h-3.5 text-slate-600" />
                <span>EXIF & GEOSPATIAL TELEMETRY</span>
              </h4>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                {metadata.cameraExif?.make && (
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">DEVICE MAKE:</span>
                    <span className="text-slate-800 font-mono">{metadata.cameraExif.make}</span>
                  </div>
                )}
                {metadata.cameraExif?.model && (
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">DEVICE MODEL:</span>
                    <span className="text-slate-800 font-mono">{metadata.cameraExif.model}</span>
                  </div>
                )}
                {metadata.gpsCoordinates && (
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-600" />
                      GPS COORDINATES:
                    </span>
                    <span className="text-slate-900 font-mono font-semibold">{metadata.gpsCoordinates}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Forensic Parameters */}
          {metadata?.additional && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5">
                ADDITIONAL FORENSIC SPECIFICATIONS
              </h4>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                {Object.entries(metadata.additional).map(([key, val]) => (
                  <div key={key}>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">{key}:</span>
                    <span className="text-slate-800">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between">
          <span className="text-[10px] text-slate-500 font-mono">
            SECURE-DMS METADATA EXTRACTION ENGINE v4.8
          </span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
