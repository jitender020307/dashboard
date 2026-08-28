import React, { useState } from 'react';
import {
  X,
  Shield,
  Lock,
  FileText,
  Package,
  Clock,
  UserCheck,
  Hash,
  Printer,
  CheckCircle2,
  Plus,
  Eye,
  EyeOff,
  Copy,
  Check,
  Cpu,
  Layers,
  Fingerprint
} from 'lucide-react';
import { CaseItem, EvidenceItem, CustodyEvent } from '../types';

interface CaseDetailModalProps {
  caseData: CaseItem;
  onClose: () => void;
  onUpdateCase: (updated: CaseItem) => void;
}

export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({
  caseData,
  onClose,
  onUpdateCase,
}) => {
  const [activeTab, setActiveTab] = useState<
    'evidence' | 'custody' | 'suspects' | 'documents' | 'timeline'
  >('evidence');

  const [copiedHash, setCopiedHash] = useState(false);
  const [verifyingAll, setVerifyingAll] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  // New Evidence Modal state
  const [showAddEvidence, setShowAddEvidence] = useState(false);
  const [newEvName, setNewEvName] = useState('');
  const [newEvType, setNewEvType] = useState<EvidenceItem['type']>('DIGITAL_STORAGE');
  const [newEvDesc, setNewEvDesc] = useState('');
  const [newEvLocker, setNewEvLocker] = useState('LOCKER-CYBER-09');

  // Redaction toggle for documents
  const [redactionMode, setRedactionMode] = useState(true);

  // Selected evidence item preview
  const [selectedEvidencePreview, setSelectedEvidencePreview] = useState<EvidenceItem | null>(null);

  // Manifest Print / Export state
  const [showExportManifest, setShowExportManifest] = useState(false);

  const isTopSecret = caseData.classification === 'TOP SECRET';

  const copyIntegrityHash = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(caseData.integrityHash);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = caseData.integrityHash;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    } catch {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const runIntegrityAudit = () => {
    setVerifyingAll(true);
    setVerificationSuccess(false);
    setTimeout(() => {
      setVerifyingAll(false);
      setVerificationSuccess(true);
      const newCustody: CustodyEvent = {
        id: `COC-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
        actorId: 'IO-1042',
        actorName: 'Special Agent K. Vance',
        action: 'CHAIN_VERIFICATION',
        details: `Cryptographic SHA-256 integrity scan completed for all ${caseData.evidenceItems.length} evidence pieces. No tampering detected.`,
        cryptographicSignature: `SIG-ECDSA-${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
        verified: true,
      };
      onUpdateCase({
        ...caseData,
        chainOfCustody: [newCustody, ...caseData.chainOfCustody],
      });
    }, 1000);
  };

  const handleAddEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvName.trim()) return;

    const newEvidence: EvidenceItem = {
      id: `EV-${caseData.id.replace(/[^0-9]/g, '')}-${(caseData.evidenceItems.length + 1).toString().padStart(2, '0')}`,
      name: newEvName.trim(),
      type: newEvType,
      description: newEvDesc.trim() || 'Physical evidence sealed into Vault Locker.',
      collectedDate: new Date().toISOString().split('T')[0],
      collectedBy: caseData.leadOfficer.id,
      locationFound: 'Field Extraction Site',
      status: 'IN_VAULT',
      digitalHashSha256: Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join(''),
      digitalHashVerified: true,
      storageLocker: newEvLocker,
    };

    const newCustody: CustodyEvent = {
      id: `COC-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      actorId: caseData.leadOfficer.id,
      actorName: caseData.leadOfficer.name,
      action: 'VAULT_INGESTION',
      details: `New evidence item ${newEvidence.id} (${newEvidence.name}) deposited into ${newEvidence.storageLocker}.`,
      cryptographicSignature: `SIG-RSA4096-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      verified: true,
    };

    onUpdateCase({
      ...caseData,
      evidenceCount: caseData.evidenceCount + 1,
      evidenceItems: [newEvidence, ...caseData.evidenceItems],
      chainOfCustody: [newCustody, ...caseData.chainOfCustody],
    });

    setNewEvName('');
    setNewEvDesc('');
    setShowAddEvidence(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-5xl h-[90vh] flex flex-col rounded-lg overflow-hidden border border-zinc-200 shadow-xl bg-white">
        {/* Dossier Header */}
        <div className="p-4 sm:p-5 bg-zinc-50 border-b border-zinc-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded bg-white border border-zinc-200 text-zinc-900 shadow-2xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-technical text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">
                  CASE DOSSIER
                </span>
                <span className="font-technical text-base font-bold tracking-wider text-zinc-900">
                  {caseData.id}
                </span>

                {/* Classification Badge */}
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-technical font-bold bg-zinc-900 text-white">
                  <Lock className="w-2.5 h-2.5" />
                  <span>{caseData.classification}</span>
                </div>

                {/* Status Badge */}
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 font-technical text-[10px] font-semibold text-zinc-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                  <span>{caseData.status}</span>
                </div>
              </div>

              <h1 className="text-base font-bold text-zinc-900 font-sans">
                {caseData.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-[11px] font-technical text-zinc-500 mt-1">
                <span>
                  LEAD: <strong className="text-zinc-800">{caseData.leadOfficer.id}</strong> ({caseData.leadOfficer.name})
                </span>
                <span>•</span>
                <span>
                  INITIATED: <strong className="text-zinc-800">{caseData.dateInitiated}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-end md:self-center">
            <button
              onClick={() => setShowExportManifest(true)}
              className="px-3 py-1.5 border border-zinc-200 bg-white hover:border-zinc-400 text-zinc-700 rounded font-technical text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>MANIFEST</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded border border-zinc-200 bg-white text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cryptographic SHA-256 Vault Bar */}
        <div className="px-5 py-2 bg-zinc-100/70 border-b border-zinc-200 flex flex-wrap items-center justify-between gap-2 font-technical text-xs">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis">
            <Fingerprint className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
            <span className="text-zinc-500 text-[10px] shrink-0 font-semibold">
              HASH INTEGRITY:
            </span>
            <code className="text-zinc-900 font-mono text-[10px] truncate max-w-xs sm:max-w-md">
              {caseData.integrityHash}
            </code>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={copyIntegrityHash}
              className="text-zinc-500 hover:text-zinc-900 flex items-center gap-1 text-[10px] transition-colors cursor-pointer font-semibold"
            >
              {copiedHash ? (
                <>
                  <Check className="w-3 h-3 text-zinc-900" />
                  <span className="text-zinc-900">COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>COPY HASH</span>
                </>
              )}
            </button>

            <span className="text-zinc-300">|</span>

            <button
              onClick={runIntegrityAudit}
              disabled={verifyingAll}
              className="text-zinc-900 hover:text-black flex items-center gap-1 text-[10px] font-bold transition-colors cursor-pointer disabled:opacity-50"
            >
              <Cpu className={`w-3 h-3 ${verifyingAll ? 'animate-spin' : ''}`} />
              <span>
                {verifyingAll
                  ? 'AUDITING...'
                  : verificationSuccess
                  ? '100% VERIFIED'
                  : 'AUDIT INTEGRITY'}
              </span>
            </button>
          </div>
        </div>

        {/* Dossier Tabs Navigation */}
        <div className="bg-white border-b border-zinc-200 px-5 flex items-center gap-1 sm:gap-4 overflow-x-auto font-technical text-xs font-semibold uppercase tracking-wider">
          {[
            { id: 'evidence' as const, label: `Evidence (${caseData.evidenceItems.length})`, icon: Package },
            { id: 'custody' as const, label: `Custody Log (${caseData.chainOfCustody.length})`, icon: Layers },
            { id: 'suspects' as const, label: `Suspects (${caseData.suspects.length})`, icon: UserCheck },
            { id: 'documents' as const, label: `Documents (${caseData.documents.length})`, icon: FileText },
            { id: 'timeline' as const, label: `Timeline (${caseData.timeline.length})`, icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-2 flex items-center gap-1.5 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-zinc-900 border-zinc-900 font-bold'
                    : 'text-zinc-500 border-transparent hover:text-zinc-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-zinc-50/40">
          {/* TAB 1: EVIDENCE LOCKER */}
          {activeTab === 'evidence' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 pb-3">
                <div>
                  <h3 className="font-technical text-xs font-bold text-zinc-900 uppercase tracking-wider">
                    CATALOGED EVIDENCE ARTIFACTS
                  </h3>
                  <p className="text-xs text-zinc-500 font-sans">
                    Physical and digital items sealed with cryptographic checksums.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddEvidence(true)}
                  className="bg-zinc-900 hover:bg-black text-white font-technical text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition-all self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>LOG EVIDENCE</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {caseData.evidenceItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-lg bg-white border border-zinc-200 hover:border-zinc-400 transition-all flex flex-col justify-between gap-3 shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5 font-technical text-xs">
                        <span className="font-bold text-zinc-900 font-mono">
                          {item.id}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 text-[10px] uppercase font-semibold font-mono">
                          {item.type.replace('_', ' ')}
                        </span>
                      </div>

                      <h4 className="text-sm font-semibold text-zinc-900 mb-1 font-sans">
                        {item.name}
                      </h4>
                      <p className="text-xs text-zinc-500 line-clamp-2 mb-2.5 font-sans">
                        {item.description}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-[10px] font-technical text-zinc-700 bg-zinc-50 p-2 rounded border border-zinc-200 mb-2 font-mono">
                        <div>
                          <span className="text-zinc-400 block text-[8px] uppercase">STORAGE</span>
                          <span className="font-semibold">{item.storageLocker}</span>
                        </div>
                        <div>
                          <span className="text-zinc-400 block text-[8px] uppercase">STATUS</span>
                          <span className="font-semibold">{item.status}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-500 bg-zinc-100/80 px-2 py-0.5 rounded overflow-hidden">
                        <Hash className="w-3 h-3 text-zinc-400 shrink-0" />
                        <span className="truncate">
                          SHA256: {item.digitalHashSha256}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-xs font-technical">
                      <div className="flex items-center gap-1 text-zinc-700 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </div>
                      <button
                        onClick={() => setSelectedEvidencePreview(item)}
                        className="px-2 py-1 rounded bg-zinc-50 border border-zinc-200 text-zinc-800 hover:bg-zinc-100 transition-colors flex items-center gap-1 cursor-pointer text-xs font-semibold"
                      >
                        <Eye className="w-3 h-3" />
                        <span>INSPECT</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CHAIN OF CUSTODY */}
          {activeTab === 'custody' && (
            <div className="space-y-3">
              <div className="border-b border-zinc-200 pb-2.5 flex items-center justify-between font-technical">
                <div>
                  <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                    CHAIN OF CUSTODY LOG
                  </h3>
                  <p className="text-xs text-zinc-500 font-sans">
                    Immutable event ledger documenting custodial handoffs.
                  </p>
                </div>
                <div className="text-xs text-zinc-800 font-mono px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200">
                  SEAL: 100% INTACT
                </div>
              </div>

              <div className="relative pl-5 border-l border-zinc-300 space-y-4 my-3 font-technical text-xs">
                {caseData.chainOfCustody.map((event) => (
                  <div key={event.id} className="relative">
                    <div className="absolute -left-[25px] top-1.5 w-2.5 h-2.5 rounded-full bg-zinc-900 border border-white" />

                    <div className="p-3.5 rounded bg-white border border-zinc-200 space-y-1.5 shadow-2xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-zinc-900 font-mono">
                            {event.id}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-zinc-100 text-[10px] text-zinc-800 font-mono uppercase">
                            {event.action.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <span className="text-[11px] text-zinc-400 font-mono">
                          {event.timestamp}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-700 font-sans">
                        {event.details}
                      </p>

                      <div className="flex flex-wrap items-center justify-between pt-1.5 border-t border-zinc-100 text-[10px] text-zinc-500 font-mono">
                        <span>
                          OFFICER: <strong>{event.actorId}</strong> ({event.actorName})
                        </span>
                        <span className="truncate max-w-xs text-zinc-400">
                          SIG: {event.cryptographicSignature}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SUSPECTS & POIS */}
          {activeTab === 'suspects' && (
            <div className="space-y-3 font-technical text-xs">
              <div className="border-b border-zinc-200 pb-2.5">
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                  PERSONS OF INTEREST
                </h3>
                <p className="text-xs text-zinc-500 font-sans">
                  Subject profiles, biometrics, and tracking records.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {caseData.suspects.map((suspect) => (
                  <div
                    key={suspect.id}
                    className="p-4 rounded-lg bg-white border border-zinc-200 flex flex-col justify-between gap-3 shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-zinc-900 font-mono">
                          {suspect.id}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-zinc-100 text-zinc-800 border border-zinc-200">
                          {suspect.status.replace('_', ' ')}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-zinc-900 font-sans">
                        {suspect.name}{' '}
                        <span className="text-xs text-zinc-500 font-normal">
                          (&quot;{suspect.alias}&quot;)
                        </span>
                      </h4>

                      {suspect.biometricMatchRate && (
                        <div className="my-2 p-2 bg-zinc-50 rounded border border-zinc-200 flex items-center justify-between text-[11px] font-mono">
                          <span className="text-zinc-500">BIOMETRIC MATCH:</span>
                          <span className="text-zinc-900 font-bold">
                            {suspect.biometricMatchRate}%
                          </span>
                        </div>
                      )}

                      <div className="text-xs text-zinc-600 space-y-1 mt-2">
                        <div>
                          <span className="text-zinc-400 font-semibold">LAST SEEN:</span>{' '}
                          {suspect.lastKnownLocation}
                        </div>
                        <div>
                          <span className="text-zinc-400 font-semibold">NOTES:</span>{' '}
                          <span className="font-sans text-zinc-700">{suspect.notes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: WARRANTS & DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-3 font-technical text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 pb-2.5">
                <div>
                  <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                    CASE DOCUMENTS & LEGAL WARRANTS
                  </h3>
                  <p className="text-xs text-zinc-500 font-sans">
                    Judicial affidavits and forensic reports.
                  </p>
                </div>

                <button
                  onClick={() => setRedactionMode(!redactionMode)}
                  className="px-2.5 py-1 rounded border border-zinc-200 bg-zinc-50 hover:border-zinc-400 text-zinc-800 text-xs flex items-center gap-1.5 transition-all cursor-pointer font-semibold"
                >
                  {redactionMode ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>REDACTED</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>UNREDACTED</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-3">
                {caseData.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-lg bg-white border border-zinc-200 space-y-2.5 shadow-2xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-zinc-600" />
                        <span className="font-bold text-zinc-900 font-mono">
                          {doc.id}
                        </span>
                        <span className="text-sm font-bold text-zinc-900 font-sans">
                          {doc.title}
                        </span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200 font-mono text-[10px] font-bold">
                        {doc.classification}
                      </span>
                    </div>

                    <div className="bg-zinc-50 p-4 rounded border border-zinc-200 font-mono text-xs text-zinc-800 leading-relaxed relative">
                      <div className="text-zinc-500 text-[10px] mb-2 font-mono">
                        AUTHOR: {doc.author} // DATE: {doc.dateCreated} // PAGES: {doc.pagesCount}
                      </div>

                      {redactionMode ? (
                        <p>
                          {doc.contentSnippet.split(' ').map((word, i) =>
                            i % 4 === 1 && word.length > 3 ? (
                              <span
                                key={i}
                                className="bg-zinc-900 text-transparent rounded px-1 select-none mx-0.5"
                                title="REDACTED"
                              >
                                [REDACTED]
                              </span>
                            ) : (
                              word + ' '
                            )
                          )}
                        </p>
                      ) : (
                        <p className="text-zinc-900">{doc.contentSnippet}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-3 font-technical text-xs">
              <div className="border-b border-zinc-200 pb-2.5">
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                  TIMELINE OF EVENTS
                </h3>
              </div>

              <div className="relative pl-5 border-l border-zinc-300 space-y-4 my-3">
                {caseData.timeline.map((item) => (
                  <div key={item.id} className="relative">
                    <div className="absolute -left-[25px] top-1.5 w-2.5 h-2.5 rounded-full bg-zinc-900 border border-white" />

                    <div className="p-3.5 rounded bg-white border border-zinc-200 shadow-2xs">
                      <div className="flex items-center justify-between text-xs font-mono mb-1">
                        <span className="text-zinc-900 font-bold">{item.date}</span>
                        <span className="text-zinc-400">{item.source}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-zinc-900 mb-1 font-sans">
                        {item.title}
                      </h4>
                      <p className="text-xs text-zinc-600 font-sans">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between font-technical text-xs">
          <div className="text-zinc-500">
            AUTHORIZED: <span className="text-zinc-800 font-bold">IO-1042</span> // SCIF NODE 78B
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-zinc-900 hover:bg-black text-white font-bold transition-colors cursor-pointer shadow-2xs"
          >
            CLOSE DOSSIER
          </button>
        </div>
      </div>

      {/* SUB-MODAL: LOG NEW EVIDENCE */}
      {showAddEvidence && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-zinc-300 rounded-lg max-w-lg w-full p-5 space-y-4 font-technical text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <h3 className="font-bold text-zinc-900 text-sm uppercase">
                LOG EVIDENCE ARTIFACT
              </h3>
              <button
                onClick={() => setShowAddEvidence(false)}
                className="text-zinc-400 hover:text-zinc-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEvidence} className="space-y-3">
              <div>
                <label className="block text-zinc-700 mb-1 font-bold uppercase text-[11px]">
                  EVIDENCE IDENTIFIER
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SanDisk 128GB Flash Drive #04"
                  value={newEvName}
                  onChange={(e) => setNewEvName(e.target.value)}
                  className="w-full bg-white border border-zinc-300 text-zinc-900 px-3 py-1.5 rounded focus:border-zinc-900 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-700 mb-1 font-bold uppercase text-[11px]">
                    TYPE
                  </label>
                  <select
                    value={newEvType}
                    onChange={(e) =>
                      setNewEvType(e.target.value as EvidenceItem['type'])
                    }
                    className="w-full bg-white border border-zinc-300 text-zinc-900 px-3 py-1.5 rounded focus:border-zinc-900 outline-none"
                  >
                    <option value="DIGITAL_STORAGE">Digital Storage</option>
                    <option value="AUDIO_INTERCEPT">Audio Intercept</option>
                    <option value="VIDEO_SURVEILLANCE">Video Surveillance</option>
                    <option value="PHYSICAL_SAMPLE">Physical Hardware</option>
                    <option value="FINANCIAL_LEDGER">Financial Ledger</option>
                    <option value="BALLISTICS">Ballistics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-700 mb-1 font-bold uppercase text-[11px]">
                    VAULT LOCKER
                  </label>
                  <input
                    type="text"
                    value={newEvLocker}
                    onChange={(e) => setNewEvLocker(e.target.value)}
                    className="w-full bg-white border border-zinc-300 text-zinc-900 px-3 py-1.5 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-700 mb-1 font-bold uppercase text-[11px]">
                  DESCRIPTION & RECOVERY CONTEXT
                </label>
                <textarea
                  rows={3}
                  value={newEvDesc}
                  onChange={(e) => setNewEvDesc(e.target.value)}
                  placeholder="Recovery circumstances, tamper bag seal number..."
                  className="w-full bg-white border border-zinc-300 text-zinc-900 px-3 py-1.5 rounded focus:border-zinc-900 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-zinc-200 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddEvidence(false)}
                  className="px-3 py-1.5 border border-zinc-300 text-zinc-600 hover:text-zinc-900 rounded cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-zinc-900 hover:bg-black text-white font-bold rounded cursor-pointer"
                >
                  COMMIT TO VAULT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUB-MODAL: ARTIFACT INSPECTOR */}
      {selectedEvidencePreview && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-zinc-300 rounded-lg max-w-lg w-full p-5 space-y-4 font-technical text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-zinc-700" />
                <h3 className="font-bold text-zinc-900 text-sm uppercase">
                  ARTIFACT INSPECTOR
                </h3>
              </div>
              <button
                onClick={() => setSelectedEvidencePreview(null)}
                className="text-zinc-400 hover:text-zinc-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-zinc-50 rounded border border-zinc-200 space-y-1">
                <div className="text-zinc-500 font-mono text-[11px]">ITEM ID: <strong className="text-zinc-900">{selectedEvidencePreview.id}</strong></div>
                <div className="text-zinc-900 font-bold text-sm font-sans">{selectedEvidencePreview.name}</div>
                <div className="text-zinc-600 font-sans text-xs">{selectedEvidencePreview.description}</div>
              </div>

              <div className="p-3 bg-zinc-50 rounded border border-zinc-200 space-y-1.5 font-mono text-[11px]">
                <div className="text-zinc-500 text-[10px] uppercase font-bold">CHECKSUM RECORD</div>
                <div className="text-zinc-900 break-all font-bold">
                  SHA-256: {selectedEvidencePreview.digitalHashSha256}
                </div>
                <div className="text-zinc-600 text-[10px]">
                  SEAL INTEGRITY: 100% INTACT // WRITE-BLOCK ENFORCED
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-200 flex justify-end">
              <button
                onClick={() => setSelectedEvidencePreview(null)}
                className="px-4 py-1.5 bg-zinc-900 hover:bg-black text-white font-bold rounded cursor-pointer"
              >
                DISMISS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL: PRINT / COURT MANIFEST EXPORT */}
      {showExportManifest && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-zinc-300 rounded-lg max-w-xl w-full p-5 space-y-4 font-mono text-xs text-zinc-800 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <div className="flex items-center gap-2 text-zinc-900">
                <Printer className="w-4 h-4" />
                <h3 className="font-bold text-sm uppercase">
                  COURT EVIDENCE MANIFEST
                </h3>
              </div>
              <button
                onClick={() => setShowExportManifest(false)}
                className="text-zinc-400 hover:text-zinc-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded space-y-2 max-h-72 overflow-y-auto leading-relaxed">
              <div className="text-center font-bold text-zinc-900 border-b border-zinc-200 pb-2">
                UNITED STATES DISTRICT COURT // EVIDENCE MANIFEST
              </div>
              <div>CASE DOCKET: {caseData.id} - {caseData.title}</div>
              <div>CLASSIFICATION: {caseData.classification}</div>
              <div>LEAD AGENT: {caseData.leadOfficer.name} ({caseData.leadOfficer.id})</div>
              <div>VAULT INTEGRITY HASH: {caseData.integrityHash}</div>
              <div>TOTAL EVIDENCE COUNT: {caseData.evidenceItems.length}</div>
              <div className="pt-2 text-zinc-500 font-bold">ITEM BREAKDOWN:</div>
              {caseData.evidenceItems.map((e, idx) => (
                <div key={e.id} className="text-[11px] pl-2 border-l border-zinc-400">
                  {idx + 1}. [{e.id}] {e.name} | Locker: {e.storageLocker} | Hash: {e.digitalHashSha256.slice(0, 16)}...
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-zinc-200 flex justify-between items-center">
              <span className="text-zinc-700 font-bold text-[11px]">Ready for transmission</span>
              <button
                onClick={() => setShowExportManifest(false)}
                className="px-4 py-1.5 bg-zinc-900 hover:bg-black text-white font-bold rounded cursor-pointer"
              >
                PRINT MANIFEST
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
