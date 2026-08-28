import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Play, Trash2, X, Minimize2, Maximize2, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';
import { EvidenceItem, AuditEvent } from '../types';

interface HackerTerminalProps {
  isOpen: boolean;
  onClose: () => void;
  evidenceItems: EvidenceItem[];
  onVerifyEvidence: (id: string) => void;
  onOpenIngestion?: () => void;
  auditEvents?: AuditEvent[];
}

export const HackerTerminal: React.FC<HackerTerminalProps> = ({
  isOpen,
  onClose,
  evidenceItems = [],
  onVerifyEvidence,
  onOpenIngestion,
  auditEvents = [],
}) => {
  const [inputCommand, setInputCommand] = useState('');
  const [history, setHistory] = useState<Array<{ type: 'input' | 'output' | 'error' | 'success' | 'warning'; text: string }>>([
    { type: 'output', text: 'SECURE-DMS // FORENSICS CLI TERMINAL v4.8' },
    { type: 'output', text: 'System Node: SCIF-NODE-78B | Clearance: LEVEL 4' },
    { type: 'output', text: 'Type "help" to list available forensic CLI commands.' },
  ]);
  const [isMaximized, setIsMaximized] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!isOpen) return null;

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputCommand.trim();
    if (!cmd) return;

    const newHistory = [...history, { type: 'input' as const, text: `officer@secure-dms:~$ ${cmd}` }];
    const parts = cmd.split(' ');
    const mainCmd = parts[0].toLowerCase();
    const arg = parts[1];

    switch (mainCmd) {
      case 'help':
        newHistory.push(
          { type: 'output', text: '━━━━━━━━━━━━━━━━ FORENSIC COMMAND MATRIX ━━━━━━━━━━━━━━━━' },
          { type: 'output', text: '  status           : Show cryptographic core and node health' },
          { type: 'output', text: '  list-evidence    : Display all registered digital evidence artifacts' },
          { type: 'output', text: '  verify <ev_id>   : Execute SHA-256 bitstream integrity verification' },
          { type: 'output', text: '  inspect <ev_id>  : View artifact hash, custodian, and security metadata' },
          { type: 'output', text: '  ingest           : Launch 9-step Forensic Artifact Ingestion wizard' },
          { type: 'output', text: '  audit            : Display latest security audit event records' },
          { type: 'output', text: '  whoami           : Print active officer cryptographic credentials' },
          { type: 'output', text: '  cls / clear      : Clear terminal screen buffer' }
        );
        break;

      case 'status':
        newHistory.push(
          { type: 'success', text: '● SYSTEM STATUS: ONLINE [SCIF Node 78B]' },
          { type: 'success', text: '✓ SECURITY CORE: 99.8% SECURE' },
          { type: 'output', text: '  AES-256-GCM : ACTIVE' },
          { type: 'output', text: '  SHA-256 Engine : SYNCHRONIZED' },
          { type: 'output', text: '  Chain of Custody : IMMUTABLE LEDGER ONLINE' },
          { type: 'output', text: '  AI Forensic Core : READY (Confidence 100%)' }
        );
        break;

      case 'whoami':
        newHistory.push(
          { type: 'output', text: 'OFFICER ID     : IO-1042' },
          { type: 'output', text: 'NAME           : Special Agent K. Vance' },
          { type: 'output', text: 'CLEARANCE      : LEVEL 4 // TOP SECRET' },
          { type: 'output', text: 'DEPARTMENT     : Digital Forensics Division' },
          { type: 'output', text: 'PUBLIC KEY     : 04:8F:72:A9:1C:45:D2:98:AF:72:C1:0F:82:6A:91:B8' }
        );
        break;

      case 'list-evidence':
        newHistory.push({ type: 'output', text: 'REGISTERED EVIDENCE ARTIFACTS IN VAULT:' });
        evidenceItems.forEach((item) => {
          const statusIcon = item.isTampered ? '⚠ TAMPERED' : '✓ VERIFIED';
          newHistory.push({
            type: item.isTampered ? 'error' : 'output',
            text: `  [${item.id}] ${item.name} (${item.fileSize}) - ${statusIcon} - ${item.classification}`
          });
        });
        break;

      case 'verify':
        if (!arg) {
          newHistory.push({ type: 'warning', text: 'Usage: verify <ev_id>  (e.g., verify EV-2026-00421)' });
        } else {
          const target = evidenceItems.find(
            (e) => e.id.toLowerCase() === arg.toLowerCase() || e.id.toLowerCase().includes(arg.toLowerCase())
          );
          if (target) {
            newHistory.push(
              { type: 'output', text: `> Loading bitstream for ${target.id}...` },
              { type: 'output', text: `> Reading original SHA-256: ${target.digitalHashSha256}` },
              { type: 'output', text: `> Calculating real-time memory SHA-256: ${target.currentHashSha256}` }
            );
            if (target.isTampered || target.digitalHashSha256 !== target.currentHashSha256) {
              newHistory.push(
                { type: 'error', text: '✕ HASH MISMATCH DETECTED!' },
                { type: 'error', text: '⚠ CRITICAL SECURITY ALERT: EVIDENCE TAMPERING IDENTIFIED' }
              );
            } else {
              newHistory.push(
                { type: 'success', text: '✓ HASH MATCH CONFIRMED (100% BITSTREAM INTEGRITY)' },
                { type: 'success', text: '✓ RESULT: ARTIFACT INTEGRITY VERIFIED' }
              );
            }
            onVerifyEvidence(target.id);
          } else {
            newHistory.push({ type: 'error', text: `Error: Evidence item "${arg}" not found in vault.` });
          }
        }
        break;

      case 'inspect':
        if (!arg) {
          newHistory.push({ type: 'warning', text: 'Usage: inspect <ev_id>  (e.g., inspect EV-2026-00421)' });
        } else {
          const target = evidenceItems.find(
            (e) => e.id.toLowerCase() === arg.toLowerCase() || e.id.toLowerCase().includes(arg.toLowerCase())
          );
          if (target) {
            newHistory.push(
              { type: 'output', text: `ARTIFACT DOSSIER: ${target.name} [${target.id}]` },
              { type: 'output', text: `  Case ID         : ${target.caseId}` },
              { type: 'output', text: `  Classification  : ${target.classification}` },
              { type: 'output', text: `  Current Custody : ${target.currentCustodian}` },
              { type: 'output', text: `  Signature       : ${target.signatureStatus} (${target.signerName || 'None'})` },
              { type: 'output', text: `  SHA-256 Hash    : ${target.digitalHashSha256}` }
            );
          } else {
            newHistory.push({ type: 'error', text: `Error: Evidence item "${arg}" not found.` });
          }
        }
        break;

      case 'ingest':
        newHistory.push(
          { type: 'output', text: '> Initializing 9-Step Forensic Artifact Ingestion Pipeline...' },
          { type: 'success', text: '✓ Launching interactive wizard.' }
        );
        if (onOpenIngestion) {
          onOpenIngestion();
        }
        break;

      case 'audit':
        newHistory.push({ type: 'output', text: 'RECENT AUDIT EVENTS:' });
        auditEvents.slice(0, 5).forEach((aud) => {
          newHistory.push({
            type: aud.result === 'DENIED' ? 'error' : 'output',
            text: `  [${aud.timestamp}] ${aud.action} by ${aud.user} -> ${aud.result}`
          });
        });
        break;

      case 'clear':
      case 'cls':
        setHistory([
          { type: 'output', text: 'SECURE-DMS // FORENSICS CLI TERMINAL v4.8' },
          { type: 'output', text: 'Screen buffer cleared. Type "help" for command matrix.' }
        ]);
        setInputCommand('');
        return;

      default:
        newHistory.push({
          type: 'error',
          text: `bash: command not found: "${cmd}". Type "help" for available commands.`
        });
    }

    setHistory(newHistory);
    setInputCommand('');
  };

  return (
    <div
      className={`fixed z-50 bg-white border border-slate-300 rounded-xl shadow-2xl flex flex-col font-mono text-xs transition-all duration-200 overflow-hidden ${
        isMaximized
          ? 'inset-4 w-auto h-auto'
          : 'bottom-6 right-6 w-[92vw] sm:w-[620px] h-[480px]'
      }`}
    >
      {/* Terminal Titlebar */}
      <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" />
          </div>
          <span className="text-slate-900 font-bold tracking-wider text-[11px] flex items-center gap-1.5 ml-2">
            <Terminal className="w-3.5 h-3.5 text-slate-700" />
            forensic-shell [SCIF NODE 78B]
          </span>
        </div>

        <div className="flex items-center gap-1 text-slate-500">
          <button
            onClick={() => setHistory([{ type: 'output', text: 'Terminal buffer cleared.' }])}
            title="Clear buffer"
            className="p-1 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            title={isMaximized ? 'Restore' : 'Maximize'}
            className="p-1 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors cursor-pointer"
          >
            {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClose}
            title="Close Terminal"
            className="p-1 hover:text-rose-600 hover:bg-slate-200 rounded transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Output Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-1.5 bg-white text-slate-800 selection:bg-slate-200">
        {history.map((line, idx) => (
          <div key={idx} className="leading-relaxed font-mono">
            {line.type === 'input' && (
              <span className="text-slate-900 font-bold">{line.text}</span>
            )}
            {line.type === 'output' && (
              <span className="text-slate-600">{line.text}</span>
            )}
            {line.type === 'success' && (
              <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 inline text-emerald-600" />
                {line.text}
              </span>
            )}
            {line.type === 'error' && (
              <span className="text-rose-700 font-bold flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5 shrink-0 inline text-rose-600" />
                {line.text}
              </span>
            )}
            {line.type === 'warning' && (
              <span className="text-amber-800 font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 inline text-amber-600" />
                {line.text}
              </span>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Terminal Command Input Prompt */}
      <form onSubmit={handleCommand} className="bg-slate-50 border-t border-slate-200 px-3 py-2.5 flex items-center gap-2">
        <span className="text-slate-600 font-bold text-xs shrink-0">officer@secure-dms:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={inputCommand}
          onChange={(e) => setInputCommand(e.target.value)}
          placeholder="Type command (e.g., help, status, verify EV-2026-00421)..."
          className="flex-1 bg-transparent text-slate-900 text-xs focus:outline-none placeholder:text-slate-400 font-mono"
        />
        <button
          type="submit"
          className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>EXEC</span>
        </button>
      </form>
    </div>
  );
};
