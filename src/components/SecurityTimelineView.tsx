import React, { useState } from 'react';
import {
  Search,
  Download
} from 'lucide-react';
import { AuditEvent, AuditActionType } from '../types';

interface SecurityTimelineViewProps {
  auditEvents: AuditEvent[];
}

export const SecurityTimelineView: React.FC<SecurityTimelineViewProps> = ({
  auditEvents,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedResult, setSelectedResult] = useState<string>('ALL');

  const filteredEvents = auditEvents.filter((aud) => {
    const matchesSearch =
      aud.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aud.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aud.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (aud.caseId && aud.caseId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (aud.evidenceId && aud.evidenceId.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesAction =
      selectedAction === 'ALL' || aud.action === selectedAction;

    const matchesSeverity =
      selectedSeverity === 'ALL' || aud.severity === selectedSeverity;

    const matchesResult =
      selectedResult === 'ALL' || aud.result === selectedResult;

    return matchesSearch && matchesAction && matchesSeverity && matchesResult;
  });

  const getResultBadge = (result: AuditEvent['result']) => {
    switch (result) {
      case 'SUCCESS':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'DENIED':
      case 'FAILED':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'ALERT':
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  const getActionBadge = (action: AuditActionType) => {
    if (action.includes('DENIED') || action.includes('MISMATCH')) {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
    if (action.includes('VERIFIED') || action.includes('PASSED')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (action.includes('SIGNATURE') || action.includes('HASH')) {
      return 'bg-slate-100 text-slate-800 border-slate-200';
    }
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const handleExportAuditJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredEvents, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `audit_trail_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 font-technical text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold tracking-wider uppercase">
              MODULE 12 // AUDIT TRAIL
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-emerald-700 text-[10px] font-semibold">
              ● {auditEvents.length} IMMUTABLE LEDGER ENTRIES
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-wider mt-1">
            FORENSIC AUDIT TRAIL & LOG
          </h1>
          <p className="text-xs text-slate-500 font-sans">
            Cryptographically sealed security log tracking access, hash verification, transfers, and denials
          </p>
        </div>

        <button
          onClick={handleExportAuditJSON}
          className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-xs shrink-0 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>EXPORT AUDIT LOG (JSON)</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search audit trail by user, IP, action, case ID, details..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none font-mono"
          />
        </div>

        {/* Action Filter */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:border-slate-900 focus:bg-white focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Actions</option>
            <option value="LOGIN">LOGIN</option>
            <option value="UPLOAD">UPLOAD</option>
            <option value="DOWNLOAD">DOWNLOAD</option>
            <option value="HASH_VERIFIED">HASH VERIFIED</option>
            <option value="HASH_MISMATCH">HASH MISMATCH</option>
            <option value="SIGNATURE_VERIFIED">SIGNATURE VERIFIED</option>
            <option value="ACCESS_DENIED">ACCESS DENIED</option>
            <option value="EVIDENCE_TRANSFERRED">EVIDENCE TRANSFERRED</option>
            <option value="CASE_CREATED">CASE CREATED</option>
          </select>

          {/* Severity Filter */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:border-slate-900 focus:bg-white focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Severities</option>
            <option value="INFO">INFO</option>
            <option value="WARNING">WARNING</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>

          {/* Result Filter */}
          <select
            value={selectedResult}
            onChange={(e) => setSelectedResult(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:border-slate-900 focus:bg-white focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Results</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="DENIED">DENIED</option>
            <option value="ALERT">ALERT</option>
          </select>
        </div>
      </div>

      {/* Audit Event Table / Ledger */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[10px] uppercase">
                <th className="p-3.5">TIMESTAMP</th>
                <th className="p-3.5">EVENT ID</th>
                <th className="p-3.5">ACTION</th>
                <th className="p-3.5">ACTOR / ROLE</th>
                <th className="p-3.5">RESOURCE / CASE</th>
                <th className="p-3.5">IP & DEVICE</th>
                <th className="p-3.5">RESULT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvents.map((evt) => (
                <tr
                  key={evt.id}
                  className="hover:bg-slate-50 transition-colors font-technical"
                >
                  <td className="p-3.5 font-mono text-slate-900 font-semibold whitespace-nowrap">
                    {evt.timestamp}
                  </td>
                  <td className="p-3.5 font-mono text-slate-500 whitespace-nowrap">
                    {evt.id}
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border font-mono ${getActionBadge(evt.action)}`}>
                      {evt.action}
                    </span>
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <div className="font-semibold text-slate-900">{evt.user}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{evt.role}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="text-slate-900 font-mono font-semibold">
                      {evt.evidenceId || evt.documentId || evt.caseId || 'SYSTEM'}
                    </div>
                    <div className="text-[11px] text-slate-500 font-sans line-clamp-1 max-w-xs">
                      {evt.details}
                    </div>
                  </td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    <div>{evt.ip}</div>
                    <div className="text-[10px] text-slate-400">{evt.device}</div>
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border font-mono ${getResultBadge(evt.result)}`}>
                      {evt.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
