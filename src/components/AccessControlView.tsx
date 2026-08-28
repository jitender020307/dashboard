import React, { useState } from 'react';
import {
  UserCheck,
  Lock,
  Laptop,
  CheckCircle2,
  Ban
} from 'lucide-react';
import { ActiveSession, OfficerProfile, UserRole, ClearanceLevel } from '../types';

interface AccessControlViewProps {
  sessions: ActiveSession[];
  currentOfficer: OfficerProfile;
  onRevokeSession: (sessionId: string) => void;
  onSwitchOfficerRole?: (newRole: UserRole, clearance: ClearanceLevel) => void;
}

export const AccessControlView: React.FC<AccessControlViewProps> = ({
  sessions,
  currentOfficer,
  onRevokeSession,
}) => {
  const [activeSessions, setActiveSessions] = useState(sessions);

  const handleRevoke = (id: string) => {
    setActiveSessions((prev) => prev.filter((s) => s.id !== id));
    onRevokeSession(id);
  };

  return (
    <div className="space-y-6 font-technical text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold tracking-wider uppercase">
              MODULE 13 // ACCESS CONTROL & ZERO TRUST
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-emerald-700 text-[10px] font-semibold">
              ● ZERO TRUST ENFORCEMENT ACTIVE
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-wider mt-1">
            ACCESS CONTROL & ZERO-TRUST MATRIX
          </h1>
          <p className="text-xs text-slate-500 font-sans">
            Continuous identity verification, clearance enforcement, and session posture validation
          </p>
        </div>

        <div className="text-right text-xs font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200 shrink-0">
          <div className="text-slate-500 text-[10px] uppercase">ACTIVE USER CLEARANCE</div>
          <div className="text-slate-900 font-bold">{currentOfficer.clearanceName} ({currentOfficer.clearanceLevel})</div>
        </div>
      </div>

      {/* Role Matrix & Clearance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Role Permissions Matrix */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-slate-600" />
              <span>ROLE-BASED ACCESS CONTROL (RBAC) POLICIES</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">6 DEFINED ROLES</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block font-mono">SUPER_ADMIN</span>
                <span className="text-[11px] text-slate-500">Full system override, vault master key, policy config</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 text-[10px] font-semibold font-mono">
                LEVEL 4 / ALL ACCESS
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block font-mono">INVESTIGATOR / SPECIAL AGENT</span>
                <span className="text-[11px] text-slate-500">Evidence ingestion, custodial transfer, case notes, signature</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 text-[10px] font-semibold font-mono">
                LEVEL 3 / RESTRICTED
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block font-mono">FORENSIC_ANALYST</span>
                <span className="text-[11px] text-slate-500">Bitstream hash calculation, AI OCR/NER, metadata audit</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 text-[10px] font-semibold font-mono">
                LEVEL 3 / FORENSICS
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block font-mono">AUDITOR / JUDGE</span>
                <span className="text-[11px] text-slate-500">Read-only immutable timeline audit, 65B legal certificate check</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-200 font-mono">
                READ-ONLY AUDIT
              </span>
            </div>
          </div>
        </div>

        {/* Zero-Trust Architecture Rules */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-600" />
              <span>ZERO-TRUST ENFORCEMENT RULES</span>
            </h3>
            <span className="text-[10px] font-mono text-emerald-700 font-semibold">ACTIVE</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">1. NEVER TRUST, ALWAYS VERIFY</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <p className="text-[11px] text-slate-600 font-sans">
                Every request to retrieve or decrypt an artifact re-evaluates the officer's biometric token and IP subnet.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">2. HARDWARE WRITE-BLOCKING</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <p className="text-[11px] text-slate-600 font-sans">
                Original bitstream evidence pools cannot be mounted with write permissions by any user role.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">3. CONTINUOUS POSTURE EVALUATION</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <p className="text-[11px] text-slate-600 font-sans">
                Sessions exceeding 15 minutes of idle time or switching IP gateways are immediately terminated.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Sessions List */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Laptop className="w-4 h-4 text-slate-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              ACTIVE ENCLAVE SESSIONS [{activeSessions.length}]
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            TLS 1.3 / ENCRYPTED TUNNELS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeSessions.map((session) => (
            <div
              key={session.id}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold text-slate-900 text-xs font-mono">
                    {session.userName}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {session.role} ({session.userId})
                  </div>
                </div>

                <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {session.status}
                </span>
              </div>

              <div className="space-y-1 text-[11px] text-slate-600 font-mono">
                <div>IP: <span className="text-slate-800">{session.ipAddress}</span></div>
                <div>DEVICE: <span className="text-slate-800 truncate block">{session.device}</span></div>
                <div>EXPIRY: <span className="text-slate-800">{session.expiresIn}</span></div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => handleRevoke(session.id)}
                  className="px-2.5 py-1 rounded-md bg-white hover:bg-rose-50 text-rose-700 text-[10px] font-semibold flex items-center gap-1 border border-rose-200 transition-colors cursor-pointer shadow-2xs"
                >
                  <Ban className="w-3 h-3" />
                  <span>REVOKE SESSION</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
