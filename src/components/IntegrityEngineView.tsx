import React, { useState } from 'react';
import {
  AlertTriangle,
  AlertOctagon,
  RefreshCw,
  Fingerprint,
  Zap,
  RotateCcw,
  CheckCircle2,
  Lock,
  Search,
  Activity,
  ShieldCheck,
  Info,
  Check,
  X
} from 'lucide-react';
import { EvidenceItem } from '../types';

interface IntegrityEngineProps {
  evidenceItems: EvidenceItem[];
  onVerifyEvidence: (id: string) => void;
  onSimulateTamper: (id: string) => void;
  onRestoreEvidence: (id: string) => void;
}

export const IntegrityEngineView: React.FC<IntegrityEngineProps> = ({
  evidenceItems,
  onVerifyEvidence,
  onSimulateTamper,
  onRestoreEvidence,
}) => {
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>(
    evidenceItems[0]?.id || 'EV-2026-00421'
  );
  const [isVerifying, setIsVerifying] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<string>(
    new Date().toLocaleTimeString()
  );

  const selectedEvidence =
    evidenceItems.find((e) => e.id === selectedEvidenceId) || evidenceItems[0];

  const formatHashChunks = (hash: string) => {
    if (!hash) return '';
    const chunks = [];
    for (let i = 0; i < hash.length; i += 4) {
      chunks.push(hash.substring(i, i + 4));
    }
    return chunks.join(' ');
  };

  const handleRunVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setLastCheckTime(new Date().toLocaleTimeString());
      if (selectedEvidence) {
        onVerifyEvidence(selectedEvidence.id);
      }
    }, 500);
  };

  const isMismatch =
    selectedEvidence &&
    (selectedEvidence.isTampered ||
      selectedEvidence.digitalHashSha256 !== selectedEvidence.currentHashSha256);

  return (
    <div className="space-y-6 text-slate-900">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
              Integrity Verifier
            </span>
            <span className="text-xs text-slate-500">• SHA-256 Check</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            File Integrity & Tamper Checker
          </h1>
          <p className="text-xs text-slate-500 font-sans">
            Compares original file fingerprints against current storage to mathematically verify evidence authenticity.
          </p>
        </div>

        {/* Demo Mode Badge */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
          <Zap className="w-4 h-4 text-amber-600 shrink-0" />
          <div className="text-xs">
            <div className="text-slate-800 font-bold text-[11px]">Interactive Tamper Test</div>
            <div className="text-[11px] text-slate-500">Simulate file modifications to test detection</div>
          </div>
        </div>
      </div>

      {/* Info Tip */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3 text-xs text-slate-600">
        <Info className="w-4 h-4 text-slate-400 shrink-0" />
        <div className="flex-1">
          <span className="font-semibold text-slate-800">What is a Hash?</span> Think of a SHA-256 hash as an unbreakable digital fingerprint. If even a single letter, pixel, or audio bit in a file changes, the calculated fingerprint completely changes, immediately triggering a tamper alert.
        </div>
      </div>

      {/* Evidence Selector Box */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3 flex-1">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Evidence File to Verify:
            </label>
            <select
              value={selectedEvidenceId}
              onChange={(e) => setSelectedEvidenceId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 text-xs focus:border-slate-900 focus:bg-white focus:outline-none cursor-pointer"
            >
              {evidenceItems.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.id} — {e.name} (Case: {e.caseId}) [{e.isTampered ? '⚠️ TAMPERED' : '✓ VERIFIED'}]
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleRunVerification}
            disabled={isVerifying}
            className="interactive-glow px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
            <span>{isVerifying ? 'Calculating Fingerprint...' : 'Run Verification Check'}</span>
          </button>

          {!isMismatch ? (
            <button
              onClick={() => selectedEvidence && onSimulateTamper(selectedEvidence.id)}
              title="Test: Simulate unauthorized file modification"
              className="interactive-glow px-3 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
            >
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>Simulate Tamper</span>
            </button>
          ) : (
            <button
              onClick={() => selectedEvidence && onRestoreEvidence(selectedEvidence.id)}
              title="Restore original authentic file version"
              className="interactive-glow px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Original</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Verification Result Card */}
      {selectedEvidence && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Fingerprint Comparison Card */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            {/* Status Header Banner */}
            <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
              isMismatch
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}>
              <div className="flex items-center gap-3">
                {isMismatch ? (
                  <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
                ) : (
                  <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                )}
                <div>
                  <div className="font-bold text-sm">
                    {isMismatch
                      ? 'Integrity Warning: File Has Been Altered!'
                      : 'File Integrity 100% Verified & Authentic'}
                  </div>
                  <div className="text-xs opacity-90 mt-0.5">
                    {isMismatch
                      ? 'The current file fingerprint does not match the original recorded fingerprint. Write-lock engaged.'
                      : 'The stored fingerprint matches the original seizure record with 100% mathematical certainty.'}
                  </div>
                </div>
              </div>

              <div className="text-right text-xs font-mono opacity-80 shrink-0 hidden sm:block">
                Checked: {lastCheckTime}
              </div>
            </div>

            {/* Comparison Box: Original vs Current */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Cryptographic Fingerprint Comparison
              </h3>

              {/* 1. Original Sealed Hash */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Original Hash (Recorded at Seizure):
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">Immutable Baseline</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 font-mono text-xs text-slate-800 break-all select-all">
                  {formatHashChunks(selectedEvidence.digitalHashSha256)}
                </div>
              </div>

              {/* 2. Current Calculated Hash */}
              <div className={`p-4 rounded-xl border space-y-1.5 ${
                isMismatch ? 'bg-rose-50/50 border-rose-200' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-semibold flex items-center gap-1.5 ${
                    isMismatch ? 'text-rose-800' : 'text-slate-700'
                  }`}>
                    {isMismatch ? (
                      <X className="w-4 h-4 text-rose-600" />
                    ) : (
                      <Check className="w-4 h-4 text-emerald-600" />
                    )}
                    Current Hash (Calculated from Live Storage):
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">Live Bitstream</span>
                </div>
                <div className={`p-2.5 rounded-lg bg-white border font-mono text-xs break-all select-all ${
                  isMismatch ? 'border-rose-300 text-rose-700 font-bold' : 'border-slate-200 text-slate-800'
                }`}>
                  {formatHashChunks(selectedEvidence.currentHashSha256)}
                </div>
              </div>
            </div>

            {/* Verification Checklist */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-semibold text-slate-800">Court Admissibility Checklist:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Algorithm: FIPS 180-4 SHA-256</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Encryption: AES-256 GCM</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Write-Blocking: Enabled</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Legal Status: Section 65B Certified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right 1 Col: Evidence Summary Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <div className="text-[10px] font-semibold text-slate-400 uppercase">ARTIFACT DETAILS</div>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">{selectedEvidence.name}</h3>
                <div className="text-xs text-slate-500 font-mono">{selectedEvidence.id} • Case {selectedEvidence.caseId}</div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">File Size:</span>
                  <span className="font-semibold text-slate-800 font-mono">{selectedEvidence.fileSize}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Classification:</span>
                  <span className="font-semibold text-slate-800">{selectedEvidence.classification}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Collected By:</span>
                  <span className="text-slate-700">{selectedEvidence.collectedBy.split('(')[0]}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Current Custodian:</span>
                  <span className="text-slate-700">{selectedEvidence.currentCustodian}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Digital Signature:</span>
                  <span className="font-semibold text-emerald-700">{selectedEvidence.signatureStatus}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
              <div className="font-semibold text-slate-800 mb-1">Quick Action:</div>
              <p className="text-[11px] text-slate-500">
                Click &quot;Simulate Tamper&quot; above to see how the system detects unauthorized modifications.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
