import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  Plus,
  Download,
  Share2,
  Stamp,
  Fingerprint,
  Archive,
  History,
  Eye,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowUpDown,
  Tag,
  Clock,
  Sparkles
} from 'lucide-react';
import {
  ManagedDocument,
  DocumentCategory,
  ClassificationLevel,
  OfficerProfile
} from '../types';

interface DocumentRepositoryViewProps {
  documents: ManagedDocument[];
  officer: OfficerProfile;
  onOpenDocDetail: (doc: ManagedDocument) => void;
  onOpenUploadDoc: () => void;
  onShareDoc: (doc: ManagedDocument) => void;
  onSignDoc: (docId: string) => void;
  onVerifyDocHash: (doc: ManagedDocument) => void;
  onToggleLegalHold: (docId: string) => void;
  onDownloadDoc: (doc: ManagedDocument) => void;
}

export const DocumentRepositoryView: React.FC<DocumentRepositoryViewProps> = ({
  documents,
  officer,
  onOpenDocDetail,
  onOpenUploadDoc,
  onShareDoc,
  onSignDoc,
  onVerifyDocHash,
  onToggleLegalHold,
  onDownloadDoc,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedClassification, setSelectedClassification] = useState<string>('ALL');
  const [selectedLifecycle, setSelectedLifecycle] = useState<string>('ALL');
  const [filterLegalHoldOnly, setFilterLegalHoldOnly] = useState(false);
  const [filterSignedOnly, setFilterSignedOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'TABLE' | 'CARDS'>('TABLE');

  // Filtering logic
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.contentSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'ALL' || doc.category === selectedCategory;

    const matchesClassification =
      selectedClassification === 'ALL' || doc.classification === selectedClassification;

    const matchesLifecycle =
      selectedLifecycle === 'ALL' || doc.lifecycleStatus === selectedLifecycle;

    const matchesLegalHold = !filterLegalHoldOnly || doc.legalHold;
    const matchesSigned = !filterSignedOnly || doc.digitalSignatureStatus === 'VALID';

    return (
      matchesSearch &&
      matchesCategory &&
      matchesClassification &&
      matchesLifecycle &&
      matchesLegalHold &&
      matchesSigned
    );
  });

  const categories: { id: string; label: string }[] = [
    { id: 'ALL', label: 'All Documents' },
    { id: 'FIR', label: 'First Information Reports (FIR)' },
    { id: 'FORENSIC_REPORT', label: 'Forensic Reports' },
    { id: 'SEIZURE_MEMO', label: 'Seizure Memos (Panchnama)' },
    { id: 'WITNESS_STATEMENT', label: 'Witness Statements' },
    { id: 'CHARGE_SHEET', label: 'Charge Sheets' },
    { id: 'COURT_FILING', label: 'Court Filings & Orders' },
  ];

  return (
    <div className="space-y-6 text-slate-900 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
              Document Repository
            </span>
            <span className="text-xs text-slate-500">• Section 65B Admissible</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Secure Legal & Investigation Document Repository
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Centralized version-controlled repository with cryptographic hashing, PKI signatures, and role-gated collaboration.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenUploadDoc}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by Document Name, Case ID, Keyword, or Tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 focus:bg-white text-xs text-slate-900 pl-9 pr-3 py-2 rounded-lg focus:outline-none placeholder:text-slate-400"
            />
          </div>

          {/* Classification Dropdown */}
          <select
            value={selectedClassification}
            onChange={(e) => setSelectedClassification(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-lg px-3 py-2 focus:border-slate-900 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Clearances</option>
            <option value="UNCLASSIFIED">Unclassified</option>
            <option value="CONFIDENTIAL">Confidential</option>
            <option value="RESTRICTED">Restricted</option>
            <option value="HIGHLY_RESTRICTED">Highly Restricted</option>
          </select>

          {/* Lifecycle Status Dropdown */}
          <select
            value={selectedLifecycle}
            onChange={(e) => setSelectedLifecycle(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-lg px-3 py-2 focus:border-slate-900 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Lifecycle Stages</option>
            <option value="DRAFT">Draft</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="APPROVED">Approved</option>
            <option value="FINAL">Final</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          {/* Toggle Switches */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterLegalHoldOnly((prev) => !prev)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                filterLegalHoldOnly
                  ? 'bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Legal Hold</span>
            </button>

            <button
              onClick={() => setFilterSignedOnly((prev) => !prev)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                filterSignedOnly
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Stamp className="w-3.5 h-3.5" />
              <span>Signed Only</span>
            </button>
          </div>
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-md text-xs transition-colors cursor-pointer font-medium ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Documents Listing */}
      {filteredDocs.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-xl text-slate-500 text-xs">
          No documents match your filter criteria. Try broadening your search or resetting filters.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Document Title & ID</th>
                  <th className="px-4 py-3">Case Association</th>
                  <th className="px-4 py-3">Version</th>
                  <th className="px-4 py-3">Classification</th>
                  <th className="px-4 py-3">SHA-256 Hash</th>
                  <th className="px-4 py-3">Signature</th>
                  <th className="px-4 py-3">Lifecycle</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDocs.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Document Title & Type */}
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <button
                            onClick={() => onOpenDocDetail(doc)}
                            className="font-bold text-slate-900 hover:underline text-left line-clamp-1 cursor-pointer"
                          >
                            {doc.title}
                          </button>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-0.5">
                            <span>{doc.id}</span>
                            <span>•</span>
                            <span>{doc.fileSize}</span>
                            {doc.legalHold && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold font-sans">
                                Legal Hold
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Case ID */}
                    <td className="px-4 py-3">
                      <span className="font-mono text-[11px] font-semibold text-slate-800 block">
                        {doc.caseId}
                      </span>
                      <span className="text-[10px] text-slate-500">{doc.owner}</span>
                    </td>

                    {/* Version */}
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-[11px] font-semibold text-slate-800">
                        {doc.currentVersion}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {doc.versions.length} ver{doc.versions.length > 1 ? 's' : ''}
                      </div>
                    </td>

                    {/* Classification */}
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-semibold font-mono ${
                          doc.classification === 'RESTRICTED' || doc.classification === 'HIGHLY_RESTRICTED'
                            ? 'bg-purple-50 border border-purple-200 text-purple-800'
                            : doc.classification === 'CONFIDENTIAL'
                            ? 'bg-slate-100 border border-slate-200 text-slate-800'
                            : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                        }`}
                      >
                        {doc.classification}
                      </span>
                    </td>

                    {/* SHA-256 Hash */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] text-slate-600 truncate max-w-[130px]" title={doc.sha256Hash}>
                          {doc.sha256Hash.slice(0, 8)}...{doc.sha256Hash.slice(-6)}
                        </span>
                        <button
                          onClick={() => onVerifyDocHash(doc)}
                          title="Verify SHA-256 with Web Crypto"
                          className="text-emerald-700 hover:text-emerald-900 cursor-pointer p-0.5"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Digital Signature */}
                    <td className="px-4 py-3">
                      {doc.digitalSignatureStatus === 'VALID' ? (
                        <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Signed</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => onSignDoc(doc.id)}
                          className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-semibold hover:bg-amber-100 cursor-pointer"
                        >
                          Sign Now
                        </button>
                      )}
                    </td>

                    {/* Lifecycle Stage */}
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                        {doc.lifecycleStatus}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenDocDetail(doc)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          title="View Document & Versions"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onShareDoc(doc)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          title="Secure Share & Permissions"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onDownloadDoc(doc)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          title="Download Document (RBAC verified)"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
