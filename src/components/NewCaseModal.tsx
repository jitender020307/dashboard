import React, { useState } from 'react';
import { X, Plus, Hash, CheckCircle2, Lock, FolderKanban } from 'lucide-react';
import { CaseItem, ClassificationLevel, CaseStatus, EvidenceItem, OfficerProfile } from '../types';

interface NewCaseModalProps {
  officer: OfficerProfile;
  onClose: () => void;
  onCreateCase: (newCase: CaseItem) => void;
}

export const NewCaseModal: React.FC<NewCaseModalProps> = ({
  officer,
  onClose,
  onCreateCase,
}) => {
  const generatedId = `CASE-UP-CYB-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

  const [title, setTitle] = useState('');
  const [classification, setClassification] = useState<ClassificationLevel>('CONFIDENTIAL');
  const [status, setStatus] = useState<CaseStatus>('ACTIVE');
  const [summary, setSummary] = useState('');
  const [location, setLocation] = useState('Cyber Crime Police Station HQ, Sector 36, Noida');
  const [tagsInput, setTagsInput] = useState('Cyber Forensics, Section 65B, Financial Fraud');
  const [suspectName, setSuspectName] = useState('');
  const [evidenceName, setEvidenceName] = useState('');
  const [evidenceType, setEvidenceType] = useState<EvidenceItem['type']>('DIGITAL_STORAGE');
  const [legalHold, setLegalHold] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const initialEvidence: EvidenceItem[] = evidenceName
      ? [
          {
            id: `EV-${generatedId.replace(/[^0-9]/g, '')}-01`,
            caseId: generatedId,
            name: evidenceName,
            type: evidenceType,
            description: `Primary evidence item logged during case initiation for ${title}.`,
            collectedDate: new Date().toISOString().split('T')[0],
            collectedBy: officer.name,
            locationFound: location,
            status: 'IN_VAULT',
            digitalHashSha256: Array.from({ length: 64 }, () =>
              Math.floor(Math.random() * 16).toString(16).toUpperCase()
            ).join(''),
            digitalHashVerified: true,
            storageLocker: 'VAULT-SEC-01',
            isTampered: false,
          },
        ]
      : [];

    const newCase: CaseItem = {
      id: generatedId,
      title: title.trim(),
      status,
      classification,
      department: officer.department,
      location,
      legalHold,
      leadOfficer: {
        id: officer.id,
        name: officer.name,
        rank: officer.rank,
        department: officer.department,
      },
      documentsCount: 1,
      evidenceCount: initialEvidence.length > 0 ? initialEvidence.length : 1,
      dateInitiated: new Date().toISOString().split('T')[0],
      lastUpdated: 'Just now',
      summary:
        summary.trim() ||
        'Investigation initiated under Section 66D IT Act & 318(4) Bharatiya Nyaya Sanhita.',
      integrityHash: Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16).toUpperCase()
      ).join(''),
      securityClearanceLevel: classification === 'HIGHLY_RESTRICTED' ? 4 : classification === 'RESTRICTED' ? 3 : 2,
      tags: tags.length > 0 ? tags : ['General Evidence'],
      suspects: suspectName
        ? [
            {
              id: 'SUS-01',
              name: suspectName,
              alias: 'Accused Person',
              status: 'PERSON_OF_INTEREST',
              biometricMatchRate: 91.2,
              lastKnownLocation: 'Under Surveillance',
              notes: 'Named in initial FIR complaint.',
            },
          ]
        : [],
      evidenceItems: initialEvidence,
      chainOfCustody: [
        {
          id: 'COC-INIT',
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
          actorId: officer.id,
          actorName: officer.name,
          action: 'VAULT_INGESTION',
          details: `Case docket ${generatedId} officially provisioned and sealed into Secure DMS Vault.`,
          cryptographicSignature: `SIG-ECDSA-STATE-CYBER-ROOT`,
          verified: true,
        },
      ],
      documents: [
        {
          id: `DOC-${generatedId.replace(/[^0-9]/g, '')}-01`,
          title: `Initial Case Briefing & Ingestion Docket ${generatedId}`,
          category: 'SEARCH_WARRANT',
          dateCreated: new Date().toISOString().split('T')[0],
          author: officer.name,
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
          description: `Docket authorized by Lead Officer ${officer.name}.`,
          source: 'SECURE-DMS Core Service',
        },
      ],
    };

    onCreateCase(newCase);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn text-slate-900">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl flex flex-col text-xs">
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-xs">
              <FolderKanban className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Register New Investigation Docket
              </h2>
              <span className="text-[10px] text-slate-500 font-mono">
                Assigned ID: <strong className="text-slate-800">{generatedId}</strong>
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 max-h-[75vh] overflow-y-auto">
          {/* Case Title */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1 text-xs">
              Case Operation Title / Matter Name <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. State vs. Cyber Syndicate / Cryptocurrency Laundering Network"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-slate-300 focus:border-slate-900 text-slate-900 px-3 py-2 rounded-lg placeholder:text-slate-400 outline-none text-xs"
            />
          </div>

          {/* Classification & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1 text-xs">
                Classification Level
              </label>
              <select
                value={classification}
                onChange={(e) =>
                  setClassification(e.target.value as ClassificationLevel)
                }
                className="w-full bg-white border border-slate-300 focus:border-slate-900 text-slate-900 px-3 py-1.5 rounded-lg outline-none text-xs"
              >
                <option value="UNCLASSIFIED">UNCLASSIFIED</option>
                <option value="INTERNAL">INTERNAL</option>
                <option value="CONFIDENTIAL">CONFIDENTIAL</option>
                <option value="RESTRICTED">RESTRICTED</option>
                <option value="HIGHLY_RESTRICTED">HIGHLY RESTRICTED</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1 text-xs">
                Initial Docket Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CaseStatus)}
                className="w-full bg-white border border-slate-300 focus:border-slate-900 text-slate-900 px-3 py-1.5 rounded-lg outline-none text-xs"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="UNDER_REVIEW">UNDER REVIEW</option>
                <option value="UNDER_TRIAL">UNDER TRIAL</option>
                <option value="DISPOSED">DISPOSED</option>
              </select>
            </div>
          </div>

          {/* Location & Suspect */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1 text-xs">
                Police Station / Jurisdiction
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-white border border-slate-300 focus:border-slate-900 text-slate-900 px-3 py-1.5 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1 text-xs">
                Primary Accused / Suspect (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Vikramaditya Sharma"
                value={suspectName}
                onChange={(e) => setSuspectName(e.target.value)}
                className="w-full bg-white border border-slate-300 focus:border-slate-900 text-slate-900 px-3 py-1.5 rounded-lg placeholder:text-slate-400 outline-none text-xs"
              />
            </div>
          </div>

          {/* Case Summary */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1 text-xs">
              Case Summary & Statutory Provisions
            </label>
            <textarea
              rows={2}
              placeholder="Provide investigation details, statutory sections (BNS / IT Act), and scope..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full bg-white border border-slate-300 focus:border-slate-900 text-slate-900 px-3 py-1.5 rounded-lg placeholder:text-slate-400 outline-none text-xs"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1 text-xs">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full bg-white border border-slate-300 focus:border-slate-900 text-slate-900 px-3 py-1.5 rounded-lg text-xs"
            />
          </div>

          {/* Primary Evidence Ingestion Box */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-900 font-bold flex items-center gap-1.5 text-[11px]">
                <Hash className="w-3.5 h-3.5 text-slate-600" />
                <span>INITIAL SEIZED EVIDENCE ITEM</span>
              </span>
              <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> SHA-256 Enabled
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="e.g. Samsung Galaxy S23 (Seized from Accused)"
                value={evidenceName}
                onChange={(e) => setEvidenceName(e.target.value)}
                className="bg-white border border-slate-300 focus:border-slate-900 text-slate-900 px-3 py-1.5 rounded-lg outline-none text-xs"
              />
              <select
                value={evidenceType}
                onChange={(e) =>
                  setEvidenceType(e.target.value as EvidenceItem['type'])
                }
                className="bg-white border border-slate-300 text-slate-900 px-3 py-1.5 rounded-lg outline-none text-xs"
              >
                <option value="DIGITAL_STORAGE">Digital Storage (SSD/Flash)</option>
                <option value="MOBILE_DEVICE">Mobile Handset / SIM</option>
                <option value="NETWORK_PACKET_DUMP">Network Packet Capture (PCAP)</option>
                <option value="DATABASE_EXTRACT">Database Extract (SQL)</option>
                <option value="SURVEILLANCE_FOOTAGE">CCTV / Surveillance Footage</option>
                <option value="CRYPTOCURRENCY_WALLET">Crypto Wallet / Seed Phrase</option>
              </select>
            </div>
          </div>

          {/* Legal Hold */}
          <label className="flex items-center gap-2 cursor-pointer p-2 bg-slate-50 border border-slate-200 rounded-lg">
            <input
              type="checkbox"
              checked={legalHold}
              onChange={(e) => setLegalHold(e.target.checked)}
              className="rounded text-slate-900"
            />
            <span className="font-semibold text-slate-800 text-xs">
              Place docket under Judicial Legal Hold (Prevents automated purging)
            </span>
          </label>

          {/* Submit */}
          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Seal & Register Docket</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
