import React, { useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  Activity,
  Zap,
  Lock,
  Ban,
  CheckCircle2,
  Search,
  Radio
} from 'lucide-react';
import { SecurityThreat } from '../types';

interface ThreatMonitorViewProps {
  threats: SecurityThreat[];
  onMitigateThreat: (id: string, action: string) => void;
}

export const ThreatMonitorView: React.FC<ThreatMonitorViewProps> = ({
  threats,
  onMitigateThreat,
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredThreats = threats.filter((t) => {
    const matchesSev = selectedSeverity === 'ALL' || t.severity === selectedSeverity;
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.sourceIp.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.targetResource.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSev && matchesSearch;
  });

  const getSeverityBadge = (sev: SecurityThreat['severity']) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'LOW':
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getSeverityIcon = (sev: SecurityThreat['severity']) => {
    switch (sev) {
      case 'CRITICAL':
        return <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />;
      case 'HIGH':
        return <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0" />;
      case 'MEDIUM':
        return <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />;
      case 'LOW':
        return <Activity className="w-5 h-5 text-slate-600 shrink-0" />;
    }
  };

  return (
    <div className="space-y-6 font-technical text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-slate-600" />
              SOC Threat Monitor
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-emerald-700 text-[10px] font-semibold">
              ● INTRUSION SURVEILLANCE ACTIVE
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-wider mt-1">
            THREAT MONITOR &amp; INTRUSION RADAR
          </h1>
          <p className="text-xs text-slate-500 font-sans">
            Autonomous surveillance tracking failed authentications, brute-force probes, and bitstream anomalies
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-600 shrink-0">
          <Activity className="w-4 h-4 text-emerald-600" />
          <span>REAL-TIME FIREWALL ACTIVE</span>
        </div>
      </div>

      {/* Threat Metrics HUD Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase">CRITICAL THREATS</span>
          <div className="text-2xl font-bold font-mono text-rose-600">
            {threats.filter((t) => t.severity === 'CRITICAL').length}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase">HIGH SEVERITY</span>
          <div className="text-2xl font-bold font-mono text-orange-600">
            {threats.filter((t) => t.severity === 'HIGH').length}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase">MEDIUM ANOMALIES</span>
          <div className="text-2xl font-bold font-mono text-amber-600">
            {threats.filter((t) => t.severity === 'MEDIUM').length}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase">ACTIVE DEFENSE</span>
          <div className="text-2xl font-bold font-mono text-emerald-700">100% OPERATIONAL</div>
        </div>
      </div>

      {/* Toolbar Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search threats by title, IP address, target resource..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none font-mono"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:border-slate-900 focus:bg-white focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="HIGH">High Only</option>
            <option value="MEDIUM">Medium Only</option>
            <option value="LOW">Low Only</option>
          </select>
        </div>
      </div>

      {/* Threats Feed List */}
      <div className="space-y-4">
        {filteredThreats.map((threat) => (
          <div
            key={threat.id}
            className={`p-5 rounded-xl border transition-all space-y-3 shadow-xs ${
              threat.severity === 'CRITICAL'
                ? 'bg-rose-50/40 border-rose-300'
                : threat.severity === 'HIGH'
                ? 'bg-orange-50/40 border-orange-200'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                {getSeverityIcon(threat.severity)}
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border font-mono ${getSeverityBadge(threat.severity)}`}>
                      {threat.severity}
                    </span>
                    <span className="font-mono text-xs text-slate-500">
                      [{threat.id}]
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">
                      • {threat.timestamp}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 mt-0.5">
                    {threat.title}
                  </h3>
                </div>
              </div>

              {/* Threat Status Badge */}
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded text-[10px] font-bold font-mono border ${
                  threat.status === 'ACTIVE'
                    ? 'bg-rose-100 text-rose-800 border-rose-200'
                    : threat.status === 'BLOCKED'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    : 'bg-slate-100 text-slate-800 border-slate-200'
                }`}>
                  STATUS: {threat.status}
                </span>
              </div>
            </div>

            {/* Description & Technical Vector */}
            <div className="text-xs text-slate-600 font-sans leading-relaxed">
              {threat.description}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <span className="text-slate-400 uppercase text-[9px] font-bold block">SOURCE ATTRIBUTION IP:</span>
                <span className="text-rose-700 font-mono font-semibold">{threat.sourceIp}</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase text-[9px] font-bold block">TARGET RESOURCE:</span>
                <span className="text-slate-900 font-mono font-semibold">{threat.targetResource}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400 uppercase text-[9px] font-bold block">ATTACK VECTOR:</span>
                <span className="text-slate-700 font-mono text-[11px]">{threat.vector}</span>
              </div>
              {threat.actionTaken && (
                <div className="sm:col-span-2 text-emerald-700 font-mono text-[11px] border-t border-slate-200 pt-2 flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>AUTONOMOUS MITIGATION: {threat.actionTaken}</span>
                </div>
              )}
            </div>

            {/* Mitigation Quick Actions */}
            {threat.status === 'ACTIVE' && (
              <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => onMitigateThreat(threat.id, 'BLOCKED')}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 font-semibold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>BLACKLIST SOURCE IP</span>
                </button>
                <button
                  onClick={() => onMitigateThreat(threat.id, 'MITIGATED')}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>ISOLATE RESOURCE & ROTATE KEYS</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
