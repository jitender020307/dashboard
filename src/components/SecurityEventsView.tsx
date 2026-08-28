import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  FileText
} from 'lucide-react';
import { SecurityEvent, OfficerProfile } from '../types';

interface SecurityEventsViewProps {
  events: SecurityEvent[];
  officer: OfficerProfile;
  onAcknowledgeEvent: (eventId: string) => void;
}

export const SecurityEventsView: React.FC<SecurityEventsViewProps> = ({
  events,
  officer,
  onAcknowledgeEvent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.targetResource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.sourceIp.includes(searchQuery);

    const matchesSeverity = severityFilter === 'ALL' || evt.severity === severityFilter;

    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6 text-slate-900 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
              Security & Policy Enforcement
            </span>
            <span className="text-xs text-slate-500">• Access Anomaly Sentinel</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Document Security & Access Event Logs
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time monitoring of clearance level mismatches, expired sharing tokens, and unauthorized download attempts.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 shrink-0">
          <span>ACTIVE INCIDENTS: <strong>{events.filter((e) => e.status === 'ACTIVE').length}</strong></span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search security incidents by title, IP address, or document ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 focus:bg-white text-xs text-slate-900 pl-9 pr-3 py-2 rounded-lg focus:outline-none placeholder:text-slate-400"
          />
        </div>

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-lg px-3 py-2 focus:border-slate-900 focus:outline-none cursor-pointer"
        >
          <option value="ALL">All Severities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      {/* Incidents Listing */}
      {filteredEvents.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-xl text-slate-500 text-xs">
          No security events found matching your filter criteria. System posture is normal.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className={`p-4 rounded-xl border transition-all shadow-2xs ${
                evt.severity === 'CRITICAL' || evt.severity === 'HIGH'
                  ? 'bg-rose-50/40 border-rose-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold font-mono ${
                        evt.severity === 'CRITICAL' || evt.severity === 'HIGH'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {evt.severity}
                    </span>
                    <span className="font-bold text-slate-900 text-xs">{evt.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">• {evt.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-700">{evt.description}</p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono pt-1">
                    <span>Target: <strong className="text-slate-800">{evt.targetResource}</strong></span>
                    <span>•</span>
                    <span>Source IP: {evt.sourceIp}</span>
                    <span>•</span>
                    <span>Event: {evt.eventType}</span>
                  </div>

                  {evt.actionTaken && (
                    <div className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 p-2 rounded-md mt-2 font-medium">
                      Resolution Action: {evt.actionTaken}
                    </div>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      evt.status === 'ACTIVE'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {evt.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
