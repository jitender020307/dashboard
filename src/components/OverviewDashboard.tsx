import React, { useState } from 'react';
import {
  FolderKanban,
  FileText,
  Database,
  Fingerprint,
  ShieldCheck,
  ShieldAlert,
  Users,
  Archive,
  Plus,
  ArrowRight,
  Upload,
  CheckCircle2,
  Clock,
  Stamp,
  FileCheck2,
  AlertTriangle,
  X
} from 'lucide-react';
import {
  CaseItem,
  ManagedDocument,
  EvidenceItem,
  AuditEvent,
  ForensicStats,
  OfficerProfile
} from '../types';

interface OverviewDashboardProps {
  stats: ForensicStats;
  cases: CaseItem[];
  documents: ManagedDocument[];
  evidenceItems: EvidenceItem[];
  recentAudits: AuditEvent[];
  officer: OfficerProfile;
  onNavigate: (tab: any) => void;
  onOpenNewCase: () => void;
  onOpenUploadDoc: () => void;
  onOpenIngestEvidence: () => void;
  onOpenDocDetail: (doc: ManagedDocument) => void;
  onOpenCaseDetail: (c: CaseItem) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  stats,
  cases,
  documents,
  evidenceItems,
  recentAudits,
  officer,
  onNavigate,
  onOpenNewCase,
  onOpenUploadDoc,
  onOpenIngestEvidence,
  onOpenDocDetail,
  onOpenCaseDetail,
}) => {
  const [showWelcome, setShowWelcome] = useState(true);
  const tamperedCount = evidenceItems.filter((e) => e.isTampered).length;

  return (
    <div className="space-y-6 text-slate-900 animate-fadeIn">
      {/* Tamper Warning Banner if any detected */}
      {tamperedCount > 0 && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0" />
            <div>
              <div className="text-sm font-bold text-rose-900">
                Integrity Alert: {tamperedCount} Evidence Record{tamperedCount > 1 ? 's' : ''} Hash Mismatch
              </div>
              <div className="text-xs text-rose-700">
                A cryptographic mismatch has been flagged. Write-locks and forensic isolation are automatically engaged.
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('integrity')}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-lg transition-colors shrink-0 cursor-pointer"
          >
            Open Integrity Engine
          </button>
        </div>
      )}

      {/* Hero Welcome & Quick Mission Banner */}
      {showWelcome && (
        <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl shadow-sm relative overflow-hidden">
          <button
            onClick={() => setShowWelcome(false)}
            className="absolute top-3.5 right-3.5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="max-w-3xl space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-white text-[11px] font-medium tracking-wide">
                Smart India Hackathon • Problem 26190
              </span>
              <span className="text-xs text-slate-300">• State Cyber & Judicial DMS</span>
            </div>

            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              Secure Digital Document Management System
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Court-admissible electronic records repository adhering to Section 65B Indian Evidence Act / Section 63 Bharatiya Sakshya Adhiniyam, Featuring SHA-256 integrity verification, chain of custody tracking, role-based access control, and PKI digital signatures.
            </p>

            <div className="pt-2 flex flex-wrap gap-2.5">
              <button
                onClick={onOpenUploadDoc}
                className="px-3.5 py-1.5 bg-white text-slate-900 font-semibold text-xs rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Document</span>
              </button>
              <button
                onClick={onOpenNewCase}
                className="px-3.5 py-1.5 bg-white/10 text-white font-semibold text-xs rounded-lg hover:bg-white/20 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Case Docket</span>
              </button>
              <button
                onClick={() => onNavigate('documents')}
                className="px-3.5 py-1.5 bg-white/10 text-white font-semibold text-xs rounded-lg hover:bg-white/20 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Document Repository</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Primary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate('cases')}
          className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Cases</span>
            <FolderKanban className="w-4 h-4 text-slate-700 group-hover:text-slate-900" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{cases.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {cases.filter((c) => c.status === 'ACTIVE').length} under investigation
          </div>
        </div>

        <div
          onClick={() => onNavigate('documents')}
          className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Legal Documents</span>
            <FileText className="w-4 h-4 text-slate-700 group-hover:text-slate-900" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{documents.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {documents.filter((d) => d.digitalSignatureStatus === 'VALID').length} digitally signed
          </div>
        </div>

        <div
          onClick={() => onNavigate('vault')}
          className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Evidence Artifacts</span>
            <Database className="w-4 h-4 text-slate-700 group-hover:text-slate-900" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{evidenceItems.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            100% write-blocked in vault
          </div>
        </div>

        <div
          onClick={() => onNavigate('integrity')}
          className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Integrity Rate</span>
            <Fingerprint className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-700">
            {stats.integrityVerifiedPercent}%
          </div>
          <div className="text-[11px] text-emerald-600 mt-0.5">
            SHA-256 checksums verified
          </div>
        </div>
      </div>

      {/* Secondary Fast Action Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center">
              <Archive className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Legal Holds Active</div>
              <div className="text-[11px] text-slate-500">{documents.filter((d) => d.legalHold).length} documents protected from purging</div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('lifecycle')}
            className="text-xs font-semibold text-slate-900 hover:underline cursor-pointer"
          >
            Manage
          </button>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Active Collaborations</div>
              <div className="text-[11px] text-slate-500">Role-gated shares with auto-expiry</div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('collaboration')}
            className="text-xs font-semibold text-slate-900 hover:underline cursor-pointer"
          >
            Review
          </button>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center">
              <Stamp className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Digital Signatures</div>
              <div className="text-[11px] text-slate-500">PKI Non-Repudiation Stamping</div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('signatures')}
            className="text-xs font-semibold text-slate-900 hover:underline cursor-pointer"
          >
            Validate
          </button>
        </div>
      </div>

      {/* Main Two-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Documents Repository Summary (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Key Legal Documents & Reports
              </h2>
              <p className="text-xs text-slate-500">
                FIRs, Forensic affadavits, Panchnamas & Court filings
              </p>
            </div>
            <button
              onClick={() => onNavigate('documents')}
              className="text-xs font-semibold text-slate-900 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Repository</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {documents.slice(0, 4).map((doc) => (
              <div
                key={doc.id}
                onClick={() => onOpenDocDetail(doc)}
                className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-slate-400 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-slate-950 truncate">
                        {doc.title}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-mono font-medium">
                        {doc.currentVersion}
                      </span>
                      {doc.legalHold && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700 font-semibold">
                          Legal Hold
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      Case: <span className="font-mono">{doc.caseId}</span> • Owner: {doc.owner}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                      SHA-256: {doc.sha256Hash.slice(0, 16)}...{doc.sha256Hash.slice(-8)}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-medium inline-block ${
                      doc.digitalSignatureStatus === 'VALID'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {doc.digitalSignatureStatus === 'VALID' ? 'Signed' : 'Signature Pending'}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1">{doc.fileSize}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Admissibility Section 65B Banner */}
          <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <FileCheck2 className="w-4 h-4 text-emerald-700" />
              <span>Section 65B Electronic Admissibility Framework</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every document in this system automatically maintains cryptographic timestamps, bitstream hashes, examiner signatures, and unbroken custody records to satisfy the strict requirements of Section 65B Indian Evidence Act / Section 63 Bharatiya Sakshya Adhiniyam for production before judicial courts.
            </p>
          </div>
        </div>

        {/* Right Column: Active Investigation Dockets & Audit Stream (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Active Cases Block */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Investigation Dockets
              </h2>
              <button
                onClick={() => onNavigate('cases')}
                className="text-xs font-semibold text-slate-900 hover:underline cursor-pointer"
              >
                All Cases
              </button>
            </div>

            <div className="space-y-2.5">
              {cases.slice(0, 3).map((c) => (
                <div
                  key={c.id}
                  onClick={() => onOpenCaseDetail(c)}
                  className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-slate-400 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[10px] font-mono text-slate-500 font-bold uppercase">
                        {c.id}
                      </div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-slate-950 line-clamp-1 mt-0.5">
                        {c.title}
                      </div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium shrink-0">
                      {c.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2">
                    <span>{c.documentsCount} Docs</span>
                    <span>•</span>
                    <span>{c.evidenceCount} Artifacts</span>
                    <span>•</span>
                    <span>Lead: {c.leadOfficer.name.split(' ').slice(0, 2).join(' ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Audit Log Snippet */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Immutable Audit Trail
              </h2>
              <button
                onClick={() => onNavigate('timeline')}
                className="text-xs font-semibold text-slate-900 hover:underline cursor-pointer"
              >
                Full Audit Trail
              </button>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2.5">
              {recentAudits.slice(0, 4).map((audit) => (
                <div
                  key={audit.id}
                  className="text-xs border-b border-slate-100 last:border-0 pb-2 last:pb-0"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-900 font-mono text-[11px]">
                      {audit.action}
                    </span>
                    <span className="text-[10px] text-slate-400">{audit.timestamp.slice(11, 19)} UTC</span>
                  </div>
                  <div className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                    {audit.details}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    By: {audit.user} ({audit.role})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
