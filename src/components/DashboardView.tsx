import React, { useState } from 'react';
import {
  ShieldCheck,
  FolderKanban,
  FileText,
  Package,
  AlertTriangle,
  ArrowRight,
  Fingerprint,
  Database,
  Radio,
  Clock,
  BarChart3,
  PieChart as PieChartIcon,
  Layers,
  Lock
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { CaseItem, SecurityAlert, OfficerProfile, CaseStatus, ClassificationLevel } from '../types';

interface DashboardViewProps {
  cases: CaseItem[];
  alerts: SecurityAlert[];
  officer: OfficerProfile;
  onOpenCase: (caseItem: CaseItem) => void;
  onViewAllCases: () => void;
  onViewAlerts: () => void;
}

// Custom Tooltip for Recharts matching minimal aesthetic
const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-white border border-zinc-300 rounded shadow-md font-technical text-xs space-y-1.5 min-w-36">
        <div className="font-bold text-zinc-900 border-b border-zinc-100 pb-1 uppercase tracking-wider font-mono">
          {label || payload[0]?.name}
        </div>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-3 text-[11px]">
            <span className="text-zinc-500 uppercase">{entry.name}:</span>
            <span className="font-bold text-zinc-900 font-mono">
              {entry.value} {entry.name.toLowerCase().includes('evidence') ? 'items' : 'cases'}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  cases,
  alerts,
  officer,
  onOpenCase,
  onViewAllCases,
  onViewAlerts,
}) => {
  const [chartMode, setChartMode] = useState<'COMBINED' | 'STATUS' | 'CLASSIFICATION'>('COMBINED');

  const totalActiveCases = cases.filter((c) => c.status === 'ACTIVE').length;
  const totalEvidenceCount = cases.reduce((acc, c) => acc + c.evidenceCount, 0);
  const totalDocsCount = cases.reduce((acc, c) => acc + c.documentsCount, 0);
  const unreadAlerts = alerts.filter((a) => !a.acknowledged);

  // Status Distribution Data
  const statusOrder: CaseStatus[] = ['ACTIVE', 'PENDING REVIEW', 'UNDER TRIAL', 'RESOLVED', 'ARCHIVED'];
  const statusData = statusOrder.map((st) => {
    const matching = cases.filter((c) => c.status === st);
    const evCount = matching.reduce((acc, c) => acc + c.evidenceCount, 0);
    return {
      name: st,
      shortName: st === 'PENDING REVIEW' ? 'PENDING' : st === 'UNDER TRIAL' ? 'TRIAL' : st,
      Cases: matching.length,
      'Evidence Items': evCount,
    };
  });

  // Classification Distribution Data
  const classificationOrder: ClassificationLevel[] = ['TOP SECRET', 'RESTRICTED', 'CONFIDENTIAL', 'UNCLASSIFIED'];
  const classificationData = classificationOrder.map((cl) => {
    const matching = cases.filter((c) => c.classification === cl);
    const evCount = matching.reduce((acc, c) => acc + c.evidenceCount, 0);
    return {
      name: cl,
      Cases: matching.length,
      'Evidence Load': evCount,
    };
  }).filter(item => item.Cases > 0);

  // Monochrome colors for classification pie & bars
  const CLASSIFICATION_COLORS: Record<string, string> = {
    'TOP SECRET': '#18181b',    // zinc-900
    'RESTRICTED': '#52525b',    // zinc-600
    'CONFIDENTIAL': '#71717a',  // zinc-500
    'UNCLASSIFIED': '#a1a1aa',  // zinc-400
  };

  return (
    <div className="space-y-6 animate-fadeIn font-technical">
      {/* Top Banner / System Status */}
      <div className="p-5 rounded-lg bg-white border border-zinc-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">
              SCIF COMMAND TELEMETRY
            </span>
            <span className="px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-[10px] text-zinc-700 font-mono">
              SYSTEM OPTIMAL
            </span>
          </div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight font-sans">
            COMMAND OVERVIEW
          </h1>
          <p className="text-xs text-zinc-500">
            NODE: <span className="text-zinc-800 font-mono">{officer.terminalNode}</span> // AUTHENTICATED: <span className="text-zinc-900 font-semibold">{officer.name}</span> ({officer.id})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded bg-zinc-50 border border-zinc-200 flex items-center gap-2.5 text-xs">
            <span className="w-2 h-2 rounded-full bg-zinc-900 animate-pulse" />
            <div>
              <div className="text-[10px] text-zinc-400 uppercase font-semibold">VAULT SYNC</div>
              <div className="text-zinc-900 font-bold font-mono">ENCRYPTED // LIVE</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-zinc-200 p-5 rounded-lg flex flex-col justify-between hover:border-zinc-400 transition-colors shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-3">
            <span className="text-[10px] uppercase tracking-wider font-semibold">
              ACTIVE CASES
            </span>
            <FolderKanban className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-zinc-900 font-mono">
              {totalActiveCases}
            </span>
            <span className="text-xs text-zinc-400">
              / {cases.length} Total
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-zinc-100 text-[10px] text-zinc-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-700" />
            <span>Warrants legally active</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-zinc-200 p-5 rounded-lg flex flex-col justify-between hover:border-zinc-400 transition-colors shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-3">
            <span className="text-[10px] uppercase tracking-wider font-semibold">
              LOGGED EVIDENCE
            </span>
            <Package className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-zinc-900 font-mono">
              {totalEvidenceCount.toLocaleString()}
            </span>
            <span className="text-xs text-zinc-400">
              Artifacts
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-zinc-100 text-[10px] text-zinc-500 flex items-center gap-1">
            <Fingerprint className="w-3.5 h-3.5 text-zinc-700" />
            <span>100% SHA-256 Verified</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-zinc-200 p-5 rounded-lg flex flex-col justify-between hover:border-zinc-400 transition-colors shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-3">
            <span className="text-[10px] uppercase tracking-wider font-semibold">
              DOCUMENTS
            </span>
            <FileText className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-zinc-900 font-mono">
              {totalDocsCount.toLocaleString()}
            </span>
            <span className="text-xs text-zinc-400">
              Records
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-zinc-100 text-[10px] text-zinc-500">
            Redaction engine ready
          </div>
        </div>

        {/* Metric 4 */}
        <div
          onClick={onViewAlerts}
          className="bg-white border border-zinc-200 p-5 rounded-lg flex flex-col justify-between hover:border-zinc-400 transition-colors cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between text-zinc-500 mb-3">
            <span className="text-[10px] uppercase tracking-wider font-semibold">
              SECURITY ALERTS
            </span>
            <AlertTriangle className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-zinc-900 font-mono">
              {unreadAlerts.length}
            </span>
            <span className="text-xs text-zinc-400">
              Pending review
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-zinc-100 text-[10px] text-zinc-600 flex items-center justify-between">
            <span>Intrusion monitoring</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* CASE DISTRIBUTION & EVIDENCE LOAD RECHARTS SECTION */}
      <div className="p-5 rounded-lg bg-white border border-zinc-200 shadow-2xs space-y-4">
        {/* Section Header with View Toggles */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-zinc-700" />
              <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                CASE DISTRIBUTION & EVIDENCE OVERSIGHT
              </h2>
            </div>
            <p className="text-xs text-zinc-500 font-sans">
              Real-time visualization of docket statuses, security classifications, and artifact weight.
            </p>
          </div>

          {/* Chart View Toggle Controls */}
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded border border-zinc-200 self-start sm:self-auto text-xs">
            <button
              onClick={() => setChartMode('COMBINED')}
              className={`px-2.5 py-1 rounded font-bold transition-all cursor-pointer ${
                chartMode === 'COMBINED'
                  ? 'bg-zinc-900 text-white shadow-2xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              DUAL OVERVIEW
            </button>
            <button
              onClick={() => setChartMode('STATUS')}
              className={`px-2.5 py-1 rounded font-bold transition-all cursor-pointer ${
                chartMode === 'STATUS'
                  ? 'bg-zinc-900 text-white shadow-2xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              BY STATUS
            </button>
            <button
              onClick={() => setChartMode('CLASSIFICATION')}
              className={`px-2.5 py-1 rounded font-bold transition-all cursor-pointer ${
                chartMode === 'CLASSIFICATION'
                  ? 'bg-zinc-900 text-white shadow-2xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              BY CLASSIFICATION
            </button>
          </div>
        </div>

        {/* Charts Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          {/* Status Breakdown Bar Chart */}
          {(chartMode === 'COMBINED' || chartMode === 'STATUS') && (
            <div className={`${chartMode === 'COMBINED' ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-3`}>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-zinc-500" />
                  Cases & Evidence Volume by Status
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">STATUS LOAD METRIC</span>
              </div>

              <div className="h-64 w-full bg-zinc-50/50 p-2 rounded border border-zinc-100 min-h-[256px]">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <BarChart
                    data={statusData}
                    margin={{ top: 15, right: 15, left: -20, bottom: 5 }}
                  >
                    <XAxis
                      dataKey="shortName"
                      tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }}
                      axisLine={{ stroke: '#e4e4e7' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }}
                      axisLine={{ stroke: '#e4e4e7' }}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Legend
                      wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                      iconType="rect"
                    />
                    <Bar
                      dataKey="Cases"
                      fill="#18181b"
                      radius={[3, 3, 0, 0]}
                      maxBarSize={36}
                    />
                    <Bar
                      dataKey="Evidence Items"
                      fill="#71717a"
                      radius={[3, 3, 0, 0]}
                      maxBarSize={36}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Classification Breakdown (Donut / Bar Chart) */}
          {(chartMode === 'COMBINED' || chartMode === 'CLASSIFICATION') && (
            <div className={`${chartMode === 'COMBINED' ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-3`}>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-zinc-500" />
                  Security Clearance Distribution
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">{cases.length} TOTAL DOSSIERS</span>
              </div>

              <div className="h-64 w-full bg-zinc-50/50 p-2 rounded border border-zinc-100 flex flex-col items-center justify-center min-h-[256px]">
                <ResponsiveContainer width="100%" height="80%" minWidth={0} minHeight={0}>
                  <PieChart>
                    <Pie
                      data={classificationData}
                      dataKey="Cases"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={3}
                    >
                      {classificationData.map((entry) => (
                        <Cell
                          key={`cell-${entry.name}`}
                          fill={CLASSIFICATION_COLORS[entry.name] || '#52525b'}
                          stroke="#ffffff"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>

                {/* Custom Legend for Clearances */}
                <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] font-mono text-zinc-600">
                  {classificationData.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-xs"
                        style={{ backgroundColor: CLASSIFICATION_COLORS[entry.name] || '#52525b' }}
                      />
                      <span>
                        {entry.name}: <strong className="text-zinc-900">{entry.Cases}</strong> ({entry['Evidence Load']} items)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Priority Cases & Live Audit Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Priority Case Dockets */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
            <div className="flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-zinc-600" />
              <h2 className="text-xs font-bold tracking-wider text-zinc-900 uppercase">
                PRIORITY INVESTIGATIONS
              </h2>
            </div>
            <button
              onClick={onViewAllCases}
              className="text-xs text-zinc-600 hover:text-zinc-900 flex items-center gap-1 cursor-pointer font-bold"
            >
              <span>VIEW ALL ({cases.length})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {cases.slice(0, 3).map((c) => (
              <div
                key={c.id}
                onClick={() => onOpenCase(c)}
                className="p-4 rounded-lg bg-white border border-zinc-200 hover:border-zinc-400 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold tracking-wider text-zinc-900">
                      {c.id}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-zinc-100 text-zinc-700 border border-zinc-200 font-mono">
                      {c.classification}
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      • {c.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-900 group-hover:text-black transition-colors font-sans">
                    {c.title}
                  </h3>
                  <p className="text-xs text-zinc-500 line-clamp-1 font-sans">
                    {c.summary}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs text-zinc-600 sm:border-l sm:border-zinc-100 sm:pl-4">
                  <div>
                    <div className="text-[9px] uppercase text-zinc-400 font-semibold">EVIDENCE</div>
                    <div className="font-bold text-zinc-900 font-mono">
                      {c.evidenceCount}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase text-zinc-400 font-semibold">DOCS</div>
                    <div className="font-bold text-zinc-900 font-mono">
                      {c.documentsCount}
                    </div>
                  </div>
                  <button className="px-2.5 py-1 rounded border border-zinc-200 bg-zinc-50 group-hover:bg-zinc-900 group-hover:text-white text-zinc-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer">
                    <span>VIEW</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Storage Breakdown & Feed */}
        <div className="space-y-6">
          {/* Storage & Locker Status */}
          <div className="p-5 rounded-lg bg-white border border-zinc-200 shadow-2xs space-y-3 text-xs">
            <div className="flex items-center justify-between text-zinc-900">
              <span className="font-bold uppercase tracking-wider flex items-center gap-2 text-[11px]">
                <Database className="w-3.5 h-3.5 text-zinc-600" />
                VAULT ALLOCATION
              </span>
              <span className="text-zinc-900 font-bold font-mono">78.4 TB / 100 TB</span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 rounded-full bg-zinc-100 overflow-hidden border border-zinc-200">
              <div
                className="h-full bg-zinc-800 rounded-full"
                style={{ width: '78.4%' }}
              />
            </div>

            <div className="space-y-1 text-[11px] text-zinc-500 pt-1">
              <div className="flex justify-between">
                <span>Bitstream Storage:</span>
                <span className="font-mono text-zinc-800">54.2 TB</span>
              </div>
              <div className="flex justify-between">
                <span>Surveillance Video:</span>
                <span className="font-mono text-zinc-800">18.1 TB</span>
              </div>
              <div className="flex justify-between">
                <span>Wiretap Audio:</span>
                <span className="font-mono text-zinc-800">4.8 TB</span>
              </div>
            </div>
          </div>

          {/* Recent Security Activity Stream */}
          <div className="p-5 rounded-lg bg-white border border-zinc-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
              <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-600" />
                SECURITY LOG FEED
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {alerts.slice(0, 3).map((a) => (
                <div
                  key={a.id}
                  className="p-2.5 rounded bg-zinc-50 border border-zinc-100 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold font-mono text-zinc-800 uppercase">
                      [{a.level}] {a.id}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {a.timestamp.split(' ')[1]}
                    </span>
                  </div>
                  <div className="text-zinc-900 font-semibold text-[11px]">
                    {a.title}
                  </div>
                  <div className="text-[10px] text-zinc-500 line-clamp-1 font-sans">
                    {a.description}
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
