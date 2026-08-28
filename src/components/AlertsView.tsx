import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Check,
  ExternalLink,
  Shield
} from 'lucide-react';
import { SecurityAlert, CaseItem } from '../types';

interface AlertsViewProps {
  alerts: SecurityAlert[];
  cases: CaseItem[];
  onAcknowledge: (alertId: string) => void;
  onOpenCase: (caseItem: CaseItem) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  cases,
  onAcknowledge,
  onOpenCase,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO'>('ALL');

  const filteredAlerts = alerts.filter(
    (a) => filterSeverity === 'ALL' || a.level === filterSeverity
  );

  return (
    <div className="space-y-6 animate-fadeIn font-technical">
      {/* Header */}
      <div className="border-b border-zinc-200 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight flex items-center gap-2 font-sans">
            <Shield className="w-5 h-5 text-zinc-800" />
            SECURITY ALERTS & SENSOR TELEMETRY
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Real-time tamper indicators and SCIF access logs
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 text-xs">
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'INFO'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer font-medium ${
                filterSeverity === sev
                  ? 'bg-zinc-900 text-white font-bold'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center bg-white border border-zinc-200 rounded-lg text-zinc-400 text-xs">
            NO SECURITY ALERTS REGISTERED UNDER SELECTED LEVEL
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.level === 'CRITICAL';
            const relatedCase = cases.find((c) => c.id === alert.relatedCaseId);

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  alert.acknowledged
                    ? 'bg-zinc-50/50 border-zinc-200 opacity-60'
                    : 'bg-white border-zinc-200 hover:border-zinc-400 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded bg-zinc-100 border border-zinc-200 text-zinc-700 shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold font-mono text-zinc-900">
                        [{alert.level}] {alert.id}
                      </span>
                      <span className="text-[11px] text-zinc-400 font-mono">
                        {alert.timestamp}
                      </span>
                      {alert.acknowledged && (
                        <span className="px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-600 text-[10px] font-semibold flex items-center gap-1 font-mono">
                          <CheckCircle2 className="w-3 h-3 text-zinc-700" /> ACKNOWLEDGED
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-zinc-900 font-sans">
                      {alert.title}
                    </h3>
                    <p className="text-xs text-zinc-500 font-sans">
                      {alert.description}
                    </p>

                    <div className="text-[11px] text-zinc-400 pt-0.5 font-mono">
                      SOURCE: <span className="text-zinc-700">{alert.source}</span>
                      {relatedCase && (
                        <span className="ml-3">
                          AFFECTED DOCKET:{' '}
                          <button
                            onClick={() => onOpenCase(relatedCase)}
                            className="text-zinc-900 hover:underline font-bold cursor-pointer"
                          >
                            {relatedCase.id}
                          </button>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  {relatedCase && (
                    <button
                      onClick={() => onOpenCase(relatedCase)}
                      className="px-2.5 py-1.5 rounded border border-zinc-200 bg-white hover:border-zinc-400 text-zinc-700 text-xs flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>INSPECT</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}

                  {!alert.acknowledged && (
                    <button
                      onClick={() => onAcknowledge(alert.id)}
                      className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>ACKNOWLEDGE</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
