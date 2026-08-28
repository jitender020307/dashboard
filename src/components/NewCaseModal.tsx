import React, { useState } from 'react';
import { X, Plus, Hash, CheckCircle2, Lock } from 'lucide-react';
import { CaseItem, ClassificationLevel, CaseStatus, EvidenceItem } from '../types';

interface NewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCase: (newCase: CaseItem) => void;
  existingCount: number;
}

export const NewCaseModal: React.FC<NewCaseModalProps> = ({
  isOpen,
  onClose,
  onSaveCase,
  existingCount,
}) => {
  const generatedId = `#INV-2026-00${420 + existingCount + 1}`;

  const [title, setTitle] = useState('');
  const [classification, setClassification] = useState<ClassificationLevel>('CONFIDENTIAL');
  const [status, setStatus] = useState<CaseStatus>('ACTIVE');
  const [officerId, setOfficerId] = useState('IO-1042');
  const [summary, setSummary] = useState('');
  const [tagsInput, setTagsInput] = useState('Cyber, Satellite, Forensics');
  const [suspectName, setSuspectName] = useState('');
  const [evidenceName, setEvidenceName] = useState('');
  const [evidenceType, setEvidenceType] = useState<EvidenceItem['type']>('DIGITAL_STORAGE');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const officerName =
      officerId === 'IO-1042' ? 'Special Agent K. Vance' : 'Agent Sarah Chen';
    const officerDept =
      officerId === 'IO-1042'
        ? 'Cyber Forensics Unit'
        : 'Special Investigations Bureau';

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const initialEvidence: EvidenceItem[] = evidenceName
      ? [
          {
            id: `EV-${generatedId.replace(/[^0-9]/g, '')}-01`,
            name: evidenceName,
            type: evidenceType,
            description: `Primary evidence item logged during case initiation for ${title}.`,
            collectedDate: new Date().toISOString().split('T')[0],
            collectedBy: officerId,
            locationFound: 'Field Seizure Site Alpha',
            status: 'IN_VAULT',
            digitalHashSha256: Array.from({ length: 64 }, () =>
              Math.floor(Math.random() * 16).toString(16)
            ).join(''),
            digitalHashVerified: true,
            storageLocker: 'VAULT-SEC-01',
          },
        ]
      : [];

    const newCase: CaseItem = {
      id: generatedId,
      title: title.trim(),
      status,
      classification,
      leadOfficer: {
        id: officerId,
        name: officerName,
        rank: 'Investigating Officer',
        department: officerDept,
      },
      documentsCount: 1,
      evidenceCount: initialEvidence.length > 0 ? initialEvidence.length : 1,
      dateInitiated: new Date().toISOString().split('T')[0],
      lastUpdated: 'Just now',
      summary:
        summary.trim() ||
        'Investigation initiated under Federal Law Enforcement Directive.',
      integrityHash: Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join(''),
      securityClearanceLevel: classification === 'TOP SECRET' ? 4 : classification === 'RESTRICTED' ? 3 : 2,
      tags: tags.length > 0 ? tags : ['General Evidence'],
      suspects: suspectName
        ? [
            {
              id: 'SUS-01',
              name: suspectName,
              alias: 'Subject-A',
              status: 'PERSON_OF_INTEREST',
              biometricMatchRate: 91.2,
              lastKnownLocation: 'Unverified Sector',
              notes: 'Flagged during preliminary intelligence gathering.',
            },
          ]
        : [],
      evidenceItems: initialEvidence,
      chainOfCustody: [
        {
          id: 'COC-INIT',
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
          actorId: officerId,
          actorName: officerName,
          action: 'VAULT_INGESTION',
          details: `Case docket ${generatedId} officially sealed and provisioned into Secure Evidence Vault.`,
          cryptographicSignature: `SIG-ED25519-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          verified: true,
        },
      ],
      documents: [
        {
          id: `DOC-${generatedId.replace(/[^0-9]/g, '')}-01`,
          title: `Initial Case Briefing & Ingestion Docket ${generatedId}`,
          category: 'SEARCH_WARRANT',
          dateCreated: new Date().toISOString().split('T')[0],
          author: officerName,
          classification,
          contentSnippet: `Official investigation authorization for case ${generatedId}. Primary focus: ${title.trim()}`,
          pagesCount: 4,
          status: 'VERIFIED',
          caseId: generatedId,
        },
      ],
      timeline: [
        {
          id: 'TL-INIT',
          date: new Date().toISOString().split('T')[0],
          title: 'Case Registration & Cryptographic Sealing',
          description: `Docket authorized by Lead Officer ${officerId}.`,
          source: 'SECURE-DMS Core Service',
        },
      ],
    };

    onSaveCase(newCase);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-zinc-300 rounded-lg max-w-xl w-full overflow-hidden shadow-xl flex flex-col font-technical text-xs">
        {/* Header */}
        <div className="p-4 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-zinc-900 flex items-center justify-center text-white">
              <Plus className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-xs font-bold tracking-wider text-zinc-900 uppercase">
                NEW CASE DOSSIER
              </h2>
              <span className="text-[10px] text-zinc-400 font-mono">
                ID: <strong className="text-zinc-700">{generatedId}</strong>
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 max-h-[75vh] overflow-y-auto">
          {/* Case Title */}
          <div>
            <label className="block text-zinc-700 font-bold mb-1 uppercase tracking-wider text-[11px]">
              CASE OPERATION TITLE <span className="text-zinc-900">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Operation Quantum Gate: Unencrypted Aerospace Breach"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-zinc-300 focus:border-zinc-900 text-zinc-900 px-3 py-2 rounded placeholder:text-zinc-400 outline-none"
            />
          </div>

          {/* Classification & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-700 font-bold mb-1 uppercase tracking-wider text-[11px]">
                CLASSIFICATION
              </label>
              <select
                value={classification}
                onChange={(e) =>
                  setClassification(e.target.value as ClassificationLevel)
                }
                className="w-full bg-white border border-zinc-300 focus:border-zinc-900 text-zinc-900 px-3 py-1.5 rounded outline-none"
              >
                <option value="CONFIDENTIAL">CONFIDENTIAL</option>
                <option value="RESTRICTED">RESTRICTED</option>
                <option value="TOP SECRET">TOP SECRET</option>
                <option value="UNCLASSIFIED">UNCLASSIFIED</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-700 font-bold mb-1 uppercase tracking-wider text-[11px]">
                INITIAL STATUS
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CaseStatus)}
                className="w-full bg-white border border-zinc-300 focus:border-zinc-900 text-zinc-900 px-3 py-1.5 rounded outline-none"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="PENDING REVIEW">PENDING REVIEW</option>
                <option value="UNDER TRIAL">UNDER TRIAL</option>
              </select>
            </div>
          </div>

          {/* Lead Officer & Suspect */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-700 font-bold mb-1 uppercase tracking-wider text-[11px]">
                LEAD INVESTIGATOR
              </label>
              <select
                value={officerId}
                onChange={(e) => setOfficerId(e.target.value)}
                className="w-full bg-white border border-zinc-300 focus:border-zinc-900 text-zinc-900 px-3 py-1.5 rounded outline-none"
              >
                <option value="IO-1042">IO-1042 // Special Agent K. Vance</option>
                <option value="IO-0988">IO-0988 // Agent Sarah Chen</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-700 font-bold mb-1 uppercase tracking-wider text-[11px]">
                PRIMARY SUSPECT (OPTIONAL)
              </label>
              <input
                type="text"
                placeholder="e.g. Victor Sterling"
                value={suspectName}
                onChange={(e) => setSuspectName(e.target.value)}
                className="w-full bg-white border border-zinc-300 focus:border-zinc-900 text-zinc-900 px-3 py-1.5 rounded placeholder:text-zinc-400 outline-none"
              />
            </div>
          </div>

          {/* Case Summary */}
          <div>
            <label className="block text-zinc-700 font-bold mb-1 uppercase tracking-wider text-[11px]">
              BRIEFING / SUMMARY
            </label>
            <textarea
              rows={2}
              placeholder="Provide tactical context, warrant basis, and forensic scope..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full bg-white border border-zinc-300 focus:border-zinc-900 text-zinc-900 px-3 py-1.5 rounded placeholder:text-zinc-400 outline-none"
            />
          </div>

          {/* Primary Evidence Ingestion Box */}
          <div className="p-3 bg-zinc-50 border border-zinc-200 rounded space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-zinc-900 font-bold uppercase tracking-wider flex items-center gap-1 text-[11px]">
                <Hash className="w-3 h-3 text-zinc-600" />
                INITIAL EVIDENCE ITEM
              </span>
              <span className="text-[10px] text-zinc-600 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3 h-3 text-zinc-800" /> SHA-256 Enabled
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="e.g. Kingston 1TB Encrypted Flash Drive"
                value={evidenceName}
                onChange={(e) => setEvidenceName(e.target.value)}
                className="bg-white border border-zinc-300 focus:border-zinc-900 text-zinc-900 px-3 py-1.5 rounded outline-none"
              />
              <select
                value={evidenceType}
                onChange={(e) =>
                  setEvidenceType(e.target.value as EvidenceItem['type'])
                }
                className="bg-white border border-zinc-300 text-zinc-900 px-3 py-1.5 rounded outline-none"
              >
                <option value="DIGITAL_STORAGE">Digital Storage (SSD/USB)</option>
                <option value="AUDIO_INTERCEPT">Audio Intercept</option>
                <option value="VIDEO_SURVEILLANCE">Video Surveillance</option>
                <option value="PHYSICAL_SAMPLE">Physical Hardware</option>
                <option value="FINANCIAL_LEDGER">Financial Ledger</option>
                <option value="BALLISTICS">Ballistics</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-zinc-200 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-zinc-300 text-zinc-600 hover:text-zinc-900 rounded transition-colors cursor-pointer"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="bg-zinc-900 hover:bg-black text-white font-bold px-4 py-1.5 rounded flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>SEAL & CREATE CASE</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
