import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Database,
  Lock,
  Zap,
  Activity,
  AlertTriangle,
  Fingerprint,
  Sparkles,
  UploadCloud,
  Terminal,
  Radio,
  Layers,
  ArrowRight,
  FolderKanban,
  CheckCircle2,
  FileText,
  GitCommit,
  HelpCircle,
  X,
  Plus
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';
import { EvidenceItem, AuditEvent, SecurityThreat, ForensicStats } from '../types';
import { SpotlightBox } from './InteractiveSpotlight';

interface CyberForensicsDashboardProps {
  stats: ForensicStats;
  evidenceItems: EvidenceItem[];
  recentAudits: AuditEvent[];
  activeThreats: SecurityThreat[];
  onOpenIngestion: () => void;
  onNavigate: (tab: string) => void;
  onSelectEvidenceForIntegrity: (id: string) => void;
  onSimulateTamper: (id: string) => void;
  onToggleTerminal: () => void;
  onNewCase?: () => void;
}

const CASE_DISTRIBUTION_DATA = [
  { name: 'Under Investigation', count: 14, fill: '#0f172a' },
  { name: 'Forensic Lab', count: 8, fill: '#334155' },
  { name: 'Custody Transfer', count: 6, fill: '#64748b' },
  { name: 'Court Trial', count: 18, fill: '#94a3b8' },
  { name: 'Archived', count: 12, fill: '#cbd5e1' }
];

const CLASSIFICATION_DATA = [
  { name: 'Top Secret', value: 9, color: '#0f172a' },
  { name: 'Restricted', value: 16, color: '#475569' },
  { name: 'Confidential', value: 21, color: '#94a3b8' },
  { name: 'Unclassified', value: 12, color: '#cbd5e1' }
];

export const CyberForensicsDashboard: React.FC<CyberForensicsDashboardProps> = ({
  stats,
  evidenceItems,
  recentAudits,
  activeThreats,
  onOpenIngestion,
  onNavigate,
  onSelectEvidenceForIntegrity,
  onSimulateTamper,
  onToggleTerminal,
  onNewCase,
}) => {
  const [showWelcomeGuide, setShowWelcomeGuide] = useState(true);
  const tamperedItems = evidenceItems.filter((e) => e.isTampered);

  return (
    <div className="space-y-6 text-slate-900">
      {/* Top Banner Alert if Tampering Detected */}
      {tamperedItems.length > 0 && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0" />
            <div>
              <div className="text-sm font-bold text-rose-900">
                Tamper Alert: {tamperedItems.length} File{tamperedItems.length > 1 ? 's Have' : ' Has'} Modified Hash
              </div>
              <div className="text-xs text-rose-700">
                A digital hash mismatch was detected. Evidence write-lock is engaged to preserve original records.
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('integrity')}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-lg transition-colors shrink-0 shadow-xs cursor-pointer"
          >
            Review in Integrity Engine
          </button>
        </div>
      )}

      {/* Friendly Welcome & System Purpose Card for Standard Users */}
      {showWelcomeGuide && (
        <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl shadow-sm relative overflow-hidden">
          <button
            onClick={() => setShowWelcomeGuide(false)}
            className="absolute top-3.5 right-3.5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Dismiss Welcome Card"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-[11px] font-medium tracking-wide">
                Secure Evidence & Case Hub
              </span>
              <span className="text-xs text-slate-300">• Quick Start Guide</span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              Welcome to SECURE-DMS Evidence Vault
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              This system protects digital evidence for legal investigations. You can safely store files (photos, CCTV, audio, documents), track who accessed them with an unbroken Chain of Custody, and automatically verify that files have never been altered.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <FolderKanban className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">1. Manage Cases</div>
                  <div className="text-[11px] text-slate-400">Organize dossiers, suspects, and notes.</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">2. Store Evidence</div>
                  <div className="text-[11px] text-slate-400">Upload files with digital fingerprints.</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Fingerprint className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">3. Verify Integrity</div>
                  <div className="text-[11px] text-slate-400">1-click tamper check for court readiness.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
              Evidence Command Overview
            </span>
            <span className="text-xs text-slate-500">• Real-Time Status</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            System Overview & Metrics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 font-sans">
            Monitor digital evidence items, case progress, and real-time cryptographic integrity.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {onNewCase && (
            <button
              onClick={onNewCase}
              className="interactive-glow px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
            >
              <Plus className="w-4 h-4 text-slate-600" />
              <span>New Case</span>
            </button>
          )}

          <button
            onClick={onOpenIngestion}
            className="interactive-glow px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Evidence</span>
          </button>

          <button
            onClick={() => onNavigate('integrity')}
            className="interactive-glow px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
          >
            <Fingerprint className="w-4 h-4 text-slate-600" />
            <span>Verify Integrity</span>
          </button>
        </div>
      </div>

      {/* 4 Clean Primary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Evidence */}
        <SpotlightBox
          onClick={() => onNavigate('vault')}
          className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-sm transition-all cursor-pointer space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900">Total Evidence Files</span>
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
              <Database className="w-4 h-4 text-slate-700" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900">
            {stats.totalEvidenceItems}
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1 font-medium">
            <span>In Secure Vault</span>
            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </SpotlightBox>

        {/* Metric 2: Integrity Verified */}
        <SpotlightBox
          onClick={() => onNavigate('integrity')}
          className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-sm transition-all cursor-pointer space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900">Integrity Health</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900">
            {stats.integrityVerifiedPercent}%
          </div>
          <div className="text-xs text-emerald-700 font-medium">
            {stats.tamperAlertsCount === 0 ? 'All Hashes Match' : `${stats.tamperAlertsCount} Hash Mismatch`}
          </div>
        </SpotlightBox>

        {/* Metric 3: Active Legal Cases */}
        <SpotlightBox
          onClick={() => onNavigate('cases')}
          className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-sm transition-all cursor-pointer space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900">Legal Cases</span>
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
              <FolderKanban className="w-4 h-4 text-slate-700" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900">
            6
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1 font-medium">
            <span>View All Cases</span>
            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </SpotlightBox>

        {/* Metric 4: Security Status */}
        <SpotlightBox
          onClick={() => onNavigate('threats')}
          className={`p-4 sm:p-5 rounded-2xl border hover:shadow-sm transition-all cursor-pointer space-y-2 group ${
            stats.activeThreats > 0 ? 'bg-amber-50/50 border-amber-200' : 'bg-white border-slate-200 hover:border-sky-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900">Security Status</span>
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
              <Radio className={`w-4 h-4 ${stats.activeThreats > 0 ? 'text-amber-600' : 'text-slate-600'}`} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900">
            {stats.activeThreats === 0 ? 'Normal' : `${stats.activeThreats} Alert`}
          </div>
          <div className="text-xs text-slate-500 font-medium">
            AES-256 Protected
          </div>
        </SpotlightBox>
      </div>

      {/* Case Distribution Chart + Security Levels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Case Distribution Bar Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Case Workflow Status
              </h3>
              <p className="text-[11px] text-slate-500">Distribution of legal cases across stages</p>
            </div>
            <span className="text-xs font-mono text-slate-400">Total: 58</span>
          </div>

          <div className="h-60 w-full pt-2 min-h-[240px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={CASE_DISTRIBUTION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '8px',
                    color: '#0f172a',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.08)'
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {CASE_DISTRIBUTION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Security Classification Breakdown */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Security Levels
              </h3>
              <p className="text-[11px] text-slate-500">Evidence access tiers</p>
            </div>
            <Lock className="w-4 h-4 text-slate-400" />
          </div>

          <div className="h-44 w-full min-h-[176px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <PieChart>
                <Pie
                  data={CLASSIFICATION_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={68}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {CLASSIFICATION_DATA.map((entry, index) => (
                    <Cell key={`pie-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '8px',
                    color: '#0f172a',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.08)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
            {CLASSIFICATION_DATA.map((c) => (
              <div key={c.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                <span className="text-slate-700 text-[11px]">{c.name} ({c.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Evidence Files & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Evidence Files */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Recent Evidence Files
              </h3>
              <p className="text-[11px] text-slate-500">Latest secured digital assets</p>
            </div>
            <button
              onClick={() => onNavigate('vault')}
              className="text-xs text-slate-700 hover:text-slate-900 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View All ({evidenceItems.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {evidenceItems.slice(0, 4).map((ev) => {
              const isTampered = ev.isTampered || ev.digitalHashSha256 !== ev.currentHashSha256;

              return (
                <div
                  key={ev.id}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isTampered
                      ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                      : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">{ev.id}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200 font-medium">
                        {ev.classification}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">• Case {ev.caseId}</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-900">{ev.name}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-md font-mono">
                      Digital Hash: <span className={isTampered ? 'text-rose-600 font-bold' : 'text-slate-600'}>{ev.digitalHashSha256.slice(0, 24)}...</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onSelectEvidenceForIntegrity(ev.id)}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 transition-colors cursor-pointer shadow-2xs"
                    >
                      Verify Hash
                    </button>
                    {!isTampered ? (
                      <button
                        onClick={() => onSimulateTamper(ev.id)}
                        title="Simulate Tamper Test"
                        className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                      >
                        <Zap className="w-3 h-3 text-amber-600" />
                        <span>Tamper Test</span>
                      </button>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200">
                        Modified
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Activity Feed */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Recent Activity
              </h3>
              <p className="text-[11px] text-slate-500">Security & audit logs</p>
            </div>
            <button
              onClick={() => onNavigate('timeline')}
              className="text-xs text-slate-600 hover:text-slate-900 font-semibold transition-colors cursor-pointer"
            >
              Full Log →
            </button>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {recentAudits.slice(0, 5).map((aud) => (
              <div
                key={aud.id}
                className="p-3 rounded-xl bg-slate-50/80 border border-slate-200 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-slate-900 font-semibold">{aud.action.replace('_', ' ')}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{aud.timestamp.slice(11, 16)}</span>
                </div>
                <div className="text-slate-600 text-[11px] truncate">{aud.details}</div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                  <span>{aud.user}</span>
                  <span className={aud.result === 'SUCCESS' ? 'text-emerald-700 font-semibold' : 'text-rose-600 font-semibold'}>
                    {aud.result}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
