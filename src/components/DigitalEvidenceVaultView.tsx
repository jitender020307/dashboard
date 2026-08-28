import React, { useState } from 'react';
import {
  Search,
  FileCode,
  FileText,
  Video,
  Music,
  HardDrive,
  Cpu,
  Fingerprint,
  CheckCircle2,
  AlertTriangle,
  Download,
  GitCommit,
  Sparkles,
  RotateCcw,
  UploadCloud,
  FileSearch,
  ShieldCheck,
  Info
} from 'lucide-react';
import { EvidenceItem, EvidenceType } from '../types';

interface DigitalEvidenceVaultViewProps {
  evidenceItems: EvidenceItem[];
  onOpenIngestion: () => void;
  onSelectEvidenceForIntegrity: (id: string) => void;
  onOpenChainOfCustody: (id: string) => void;
  onOpenMetadata: (item: EvidenceItem) => void;
  onOpenAIAnalysis: (id: string) => void;
  onRestoreEvidence: (id: string) => void;
  onDownloadEvidence: (item: EvidenceItem) => void;
}

export const DigitalEvidenceVaultView: React.FC<DigitalEvidenceVaultViewProps> = ({
  evidenceItems,
  onOpenIngestion,
  onSelectEvidenceForIntegrity,
  onOpenChainOfCustody,
  onOpenMetadata,
  onOpenAIAnalysis,
  onRestoreEvidence,
  onDownloadEvidence,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedClassification, setSelectedClassification] = useState<string>('ALL');

  const filteredItems = evidenceItems.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.caseId && item.caseId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.digitalHashSha256.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      selectedType === 'ALL' || item.type === selectedType;

    const matchesClassification =
      selectedClassification === 'ALL' ||
      item.classification === selectedClassification;

    return matchesSearch && matchesType && matchesClassification;
  });

  const getEvidenceIcon = (type: EvidenceType) => {
    switch (type) {
      case 'DOC_PDF':
      case 'DOC_SCAN':
        return <FileText className="w-5 h-5 text-sky-700" />;
      case 'VIDEO_SURVEILLANCE':
        return <Video className="w-5 h-5 text-amber-700" />;
      case 'AUDIO_INTERCEPT':
        return <Music className="w-5 h-5 text-purple-700" />;
      case 'DIGITAL_STORAGE':
        return <HardDrive className="w-5 h-5 text-emerald-700" />;
      case 'MEMORY_DUMP':
        return <Cpu className="w-5 h-5 text-rose-700" />;
      default:
        return <FileCode className="w-5 h-5 text-slate-700" />;
    }
  };

  const getFriendlyTypeName = (type: EvidenceType) => {
    switch (type) {
      case 'DOC_PDF': return 'PDF Document';
      case 'DOC_SCAN': return 'Scanned Paper';
      case 'VIDEO_SURVEILLANCE': return 'CCTV Footage';
      case 'AUDIO_INTERCEPT': return 'Audio Recording';
      case 'DIGITAL_STORAGE': return 'Disk Image (.E01)';
      case 'MEMORY_DUMP': return 'RAM Memory Dump';
      default: return 'Digital Evidence';
    }
  };

  return (
    <div className="space-y-6 text-slate-900">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
              Evidence Repository
            </span>
            <span className="text-xs text-slate-500">• {evidenceItems.length} Stored Files</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Digital Evidence Vault
          </h1>
          <p className="text-xs text-slate-500 font-sans">
            Encrypted repository for photos, CCTV videos, wiretaps, documents, and disk images.
          </p>
        </div>

        <button
          onClick={onOpenIngestion}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-xs shrink-0 cursor-pointer"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Evidence</span>
        </button>
      </div>

      {/* Info Tip for Standard Users */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3 text-xs text-slate-600">
        <Info className="w-4 h-4 text-slate-400 shrink-0" />
        <div className="flex-1">
          <span className="font-semibold text-slate-800">How verification works:</span> Every file is assigned a unique digital fingerprint (SHA-256 hash) upon upload. Clicking <span className="font-semibold text-slate-800">&quot;Verify Hash&quot;</span> recalculates this fingerprint to guarantee court authenticity.
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by file name, ID (EV-...), case, or description..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:border-slate-900 focus:bg-white focus:outline-none cursor-pointer"
          >
            <option value="ALL">All File Types</option>
            <option value="DOC_PDF">PDF Documents</option>
            <option value="DOC_SCAN">Scanned Documents</option>
            <option value="VIDEO_SURVEILLANCE">CCTV Videos</option>
            <option value="AUDIO_INTERCEPT">Audio Recordings</option>
            <option value="DIGITAL_STORAGE">Disk Storage Images</option>
            <option value="MEMORY_DUMP">Memory Dumps</option>
          </select>

          <select
            value={selectedClassification}
            onChange={(e) => setSelectedClassification(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:border-slate-900 focus:bg-white focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Clearances</option>
            <option value="TOP SECRET">Top Secret</option>
            <option value="RESTRICTED">Restricted</option>
            <option value="CONFIDENTIAL">Confidential</option>
            <option value="UNCLASSIFIED">Unclassified</option>
          </select>
        </div>
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs">
          <Search className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">
            No matching evidence files found
          </h3>
          <p className="text-xs text-slate-500">Try adjusting your search terms or filters.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedType('ALL');
              setSelectedClassification('ALL');
            }}
            className="px-3.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 text-xs font-medium cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* Evidence Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((ev) => {
            const isTampered =
              ev.isTampered || ev.digitalHashSha256 !== ev.currentHashSha256;

            return (
              <div
                key={ev.id}
                className={`interactive-glow p-5 rounded-2xl border transition-all space-y-4 shadow-xs ${
                  isTampered
                    ? 'interactive-glow-amber bg-rose-50/70 border-rose-200'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                      {getEvidenceIcon(ev.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900">
                          {ev.id}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {ev.classification}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {getFriendlyTypeName(ev.type)}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-slate-900 truncate max-w-[260px] mt-0.5">
                        {ev.name}
                      </h3>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {!isTampered ? (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Tampered</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 line-clamp-2 font-sans">
                  {ev.description}
                </p>

                {/* Key Details Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-semibold">CASE:</span>
                    <span className="text-slate-900 font-mono font-medium">{ev.caseId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-semibold">FILE SIZE:</span>
                    <span className="text-slate-700 font-mono">{ev.fileSize}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-semibold">CUSTODIAN:</span>
                    <span className="text-slate-700 truncate block font-medium">{ev.currentCustodian}</span>
                  </div>
                </div>

                {/* Digital Fingerprint Hash Box */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 font-semibold flex items-center gap-1">
                      <Fingerprint className="w-3.5 h-3.5 text-slate-500" />
                      Digital Fingerprint (SHA-256):
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">64 Hex</span>
                  </div>
                  <div className={`text-[11px] font-mono truncate ${
                    isTampered ? 'text-rose-600 line-through font-bold' : 'text-slate-700'
                  }`}>
                    {ev.digitalHashSha256}
                  </div>
                  {isTampered && (
                    <div className="text-[11px] font-mono text-rose-700 font-bold truncate pt-0.5">
                      Current Modified Hash: {ev.currentHashSha256}
                    </div>
                  )}
                </div>

                {/* Action Buttons Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => onOpenMetadata(ev)}
                      title="Inspect Metadata & Technical Exif"
                      className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1 border border-slate-200 transition-colors cursor-pointer shadow-2xs"
                    >
                      <FileSearch className="w-3.5 h-3.5 text-slate-500" />
                      <span>Details</span>
                    </button>

                    <button
                      onClick={() => onSelectEvidenceForIntegrity(ev.id)}
                      title="Verify SHA-256 Integrity"
                      className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1 border border-slate-200 transition-colors cursor-pointer shadow-2xs"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                      <span>Verify</span>
                    </button>

                    <button
                      onClick={() => onOpenChainOfCustody(ev.id)}
                      title="View Chain of Custody History"
                      className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1 border border-slate-200 transition-colors cursor-pointer shadow-2xs"
                    >
                      <GitCommit className="w-3.5 h-3.5 text-slate-500" />
                      <span>Custody</span>
                    </button>

                    <button
                      onClick={() => onOpenAIAnalysis(ev.id)}
                      title="Run AI Smart Analysis"
                      className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1 border border-slate-200 transition-colors cursor-pointer shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-slate-500" />
                      <span>AI Scan</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isTampered && (
                      <button
                        onClick={() => onRestoreEvidence(ev.id)}
                        title="Restore Original File Version"
                        className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-emerald-50 text-emerald-700 text-xs font-medium flex items-center gap-1 border border-emerald-300 transition-colors cursor-pointer shadow-2xs"
                      >
                        <RotateCcw className="w-3 h-3 text-emerald-600" />
                        <span>Restore</span>
                      </button>
                    )}

                    <button
                      onClick={() => onDownloadEvidence(ev)}
                      title="Download Evidence Copy"
                      className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer shadow-2xs"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
