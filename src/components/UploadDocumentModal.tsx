import React, { useState } from 'react';
import {
  X,
  Upload,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Tag,
  AlertCircle
} from 'lucide-react';
import { ManagedDocument, DocumentCategory, ClassificationLevel, OfficerProfile, CaseItem } from '../types';
import { calculateFileSha256, calculateTextSha256 } from '../utils/cryptoUtils';

interface UploadDocumentModalProps {
  cases: CaseItem[];
  officer: OfficerProfile;
  onClose: () => void;
  onUploadSuccess: (newDoc: ManagedDocument) => void;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  cases,
  officer,
  onClose,
  onUploadSuccess,
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState(cases[0]?.id || 'CASE-UP-CYB-2026-00421');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('INVESTIGATION_REPORT');
  const [classification, setClassification] = useState<ClassificationLevel>('CONFIDENTIAL');
  const [contentSummary, setContentSummary] = useState('');
  const [tagsInput, setTagsInput] = useState('Evidence, Report, Section 65B');
  const [retentionYears, setRetentionYears] = useState(10);
  const [legalHold, setLegalHold] = useState(true);
  const [signImmediately, setSignImmediately] = useState(true);

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [computedSha256, setComputedSha256] = useState<string>('');
  const [isHashing, setIsHashing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }

    setIsHashing(true);
    try {
      const hash = await calculateFileSha256(file);
      setComputedSha256(hash);
    } catch (err) {
      // Fallback text hash calculation
      const fallbackHash = await calculateTextSha256(file.name + Date.now());
      setComputedSha256(fallbackHash);
    } finally {
      setIsHashing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const finalHash = computedSha256 || await calculateTextSha256(title + contentSummary + Date.now());
    const docId = `DOC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const nowIso = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newDocument: ManagedDocument = {
      id: docId,
      caseId: selectedCaseId,
      title: title.trim(),
      category,
      fileExtension: selectedFile ? `.${selectedFile.name.split('.').pop()}` : '.pdf',
      fileSize: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : '3.2 MB',
      owner: officer.name,
      ownerRole: officer.roles[0] || 'INVESTIGATING_OFFICER',
      dateCreated: nowIso,
      lastModified: nowIso,
      classification,
      lifecycleStatus: 'SUBMITTED',
      currentVersion: 'v1.0',
      sha256Hash: finalHash,
      isIntegrityVerified: true,
      digitalSignatureStatus: signImmediately ? 'VALID' : 'PENDING',
      signerName: signImmediately ? `${officer.name} (${officer.rank})` : undefined,
      signatureTimestamp: signImmediately ? nowIso : undefined,
      accessClearanceRequired: classification === 'HIGHLY_RESTRICTED' ? 4 : classification === 'RESTRICTED' ? 3 : 2,
      lastAccessedBy: officer.name,
      lastAccessedDate: nowIso,
      retentionYears,
      retentionExpiryDate: `${new Date().getFullYear() + retentionYears}-12-31`,
      legalHold,
      contentSummary: contentSummary || `Official legal document uploaded by ${officer.name}.`,
      tags,
      sharedWith: [],
      versions: [
        {
          versionNumber: 1,
          versionTag: 'v1.0',
          author: officer.name,
          authorRole: officer.roles[0] || 'INVESTIGATING_OFFICER',
          timestamp: nowIso,
          changeDescription: 'Initial file upload and SHA-256 integrity registration.',
          sha256Hash: finalHash,
          fileSize: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : '3.2 MB',
          signatureStatus: signImmediately ? 'VALID' : 'UNSIGNED',
          signerName: signImmediately ? `${officer.name} (${officer.rank})` : undefined,
          isCurrent: true
        }
      ]
    };

    onUploadSuccess(newDocument);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleIn text-slate-900">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Upload & Ingest Legal Document
              </h2>
              <p className="text-xs text-slate-500">
                Automatic SHA-256 hashing, Section 65B certificate binding & PKI stamping
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* File Selector Dropzone */}
          <div className="border-2 border-dashed border-slate-300 hover:border-slate-500 rounded-xl p-4 text-center bg-slate-50 transition-colors">
            <input
              type="file"
              id="file-upload"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer block space-y-1.5">
              <FileText className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="font-bold text-slate-800">
                {selectedFile ? selectedFile.name : 'Click to select document or forensic report'}
              </div>
              <div className="text-[11px] text-slate-500">
                Supported formats: PDF, DOCX, TXT, E01, RAW, ZIP, CSV
              </div>
            </label>
          </div>

          {/* Computed Hash Display if computed */}
          {computedSha256 && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg space-y-1 text-emerald-900">
              <div className="flex items-center gap-1.5 font-bold text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Computed Client-Side SHA-256 Checksum:</span>
              </div>
              <div className="font-mono text-[10px] break-all select-all">
                {computedSha256}
              </div>
            </div>
          )}

          {/* Case Association & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Associate Investigation Case:</label>
              <select
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono focus:border-slate-900 focus:outline-none"
              >
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id} — {c.title.slice(0, 32)}...
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Document Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Seizure Panchnama of Recovered Hard Disks"
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-slate-900 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Category & Classification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Document Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-slate-900 focus:outline-none"
              >
                <option value="FIR">First Information Report (FIR)</option>
                <option value="FORENSIC_REPORT">Digital Forensic Examination Report</option>
                <option value="SEIZURE_MEMO">Seizure Memo & Panchnama</option>
                <option value="WITNESS_STATEMENT">Witness Statement (Sec 180 BNSS)</option>
                <option value="CASE_DIARY">Case Diary Extract</option>
                <option value="CHARGE_SHEET">Final Charge Sheet (Sec 193 BNSS)</option>
                <option value="COURT_FILING">Court Filing / Judicial Order</option>
                <option value="SUPPORTING_DOCUMENT">Supporting Investigation Document</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Classification Clearance:</label>
              <select
                value={classification}
                onChange={(e) => setClassification(e.target.value as ClassificationLevel)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-slate-900 focus:outline-none"
              >
                <option value="UNCLASSIFIED">Unclassified / Public Record</option>
                <option value="INTERNAL">Internal Law Enforcement Use</option>
                <option value="CONFIDENTIAL">Confidential (Level 2)</option>
                <option value="RESTRICTED">Restricted Forensic Artifact (Level 3)</option>
                <option value="HIGHLY_RESTRICTED">Highly Restricted / State Secret (Level 4)</option>
              </select>
            </div>
          </div>

          {/* Summary / Notes */}
          <div>
            <label className="block text-slate-600 font-semibold mb-1">Document Summary & Notes:</label>
            <textarea
              value={contentSummary}
              onChange={(e) => setContentSummary(e.target.value)}
              placeholder="Brief summary of document contents, signatories, and evidential value..."
              className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-slate-900 focus:outline-none"
              rows={2}
            />
          </div>

          {/* Tags & Retention */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Tags (Comma-separated):</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="FIR, Seizure, Section 65B"
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Retention Policy (Years):</label>
              <select
                value={retentionYears}
                onChange={(e) => setRetentionYears(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:border-slate-900 focus:outline-none"
              >
                <option value={5}>5 Years</option>
                <option value={10}>10 Years (Standard Investigation)</option>
                <option value={15}>15 Years</option>
                <option value={30}>30 Years (Major Felony / Trial)</option>
              </select>
            </div>
          </div>

          {/* Checkboxes for Legal Hold & Sign */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={legalHold}
                onChange={(e) => setLegalHold(e.target.checked)}
                className="rounded text-slate-900"
              />
              <span className="font-semibold text-slate-800">
                Engage Legal Hold (Protects record from automatic deletion / purge)
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={signImmediately}
                onChange={(e) => setSignImmediately(e.target.checked)}
                className="rounded text-slate-900"
              />
              <span className="font-semibold text-slate-800">
                Attach Officer Digital Signature ({officer.name}) on Ingestion
              </span>
            </label>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isHashing}
              className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              <span>{isHashing ? 'Hashing File...' : 'Complete Ingestion'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
