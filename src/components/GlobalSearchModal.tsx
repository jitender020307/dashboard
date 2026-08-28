import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  FileText,
  FolderKanban,
  Database,
  History,
  ArrowRight
} from 'lucide-react';
import { CaseItem, ManagedDocument, EvidenceItem, AuditEvent } from '../types';

interface GlobalSearchModalProps {
  cases: CaseItem[];
  documents: ManagedDocument[];
  evidenceItems: EvidenceItem[];
  audits: AuditEvent[];
  onClose: () => void;
  onSelectDoc: (doc: ManagedDocument) => void;
  onSelectCase: (c: CaseItem) => void;
  onNavigateTab: (tab: any) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  cases,
  documents,
  evidenceItems,
  audits,
  onClose,
  onSelectDoc,
  onSelectCase,
  onNavigateTab,
}) => {
  const [query, setQuery] = useState('');

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const q = query.toLowerCase().trim();

  const matchedDocs = q
    ? documents.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.id.toLowerCase().includes(q) ||
          d.caseId.toLowerCase().includes(q) ||
          d.contentSummary.toLowerCase().includes(q)
      )
    : [];

  const matchedCases = q
    ? cases.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.summary.toLowerCase().includes(q)
      )
    : [];

  const matchedEvidence = q
    ? evidenceItems.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.id.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
      )
    : [];

  const matchedAudits = q
    ? audits.filter(
        (a) =>
          a.details.toLowerCase().includes(q) ||
          a.action.toLowerCase().includes(q) ||
          a.user.toLowerCase().includes(q)
      )
    : [];

  const hasResults =
    matchedDocs.length > 0 ||
    matchedCases.length > 0 ||
    matchedEvidence.length > 0 ||
    matchedAudits.length > 0;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-start justify-center pt-20 p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-scaleIn text-slate-900">
        {/* Search Bar Input */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search across Cases, Documents, Evidence, and Audit events (Type to search)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full text-sm text-slate-900 focus:outline-none placeholder:text-slate-400 bg-transparent"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4 text-xs">
          {!q ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              Type a keyword like "FIR", "Panchnama", "SIM", "Sharma", or a Case ID to search.
            </div>
          ) : !hasResults ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No matching records found across the DMS repository.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Documents */}
              {matchedDocs.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Documents ({matchedDocs.length})</span>
                  </div>
                  {matchedDocs.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => {
                        onSelectDoc(doc);
                        onClose();
                      }}
                      className="p-3 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer flex items-center justify-between gap-3 border border-slate-200 transition-colors"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{doc.title}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {doc.id} • {doc.caseId}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </div>
                  ))}
                </div>
              )}

              {/* Cases */}
              {matchedCases.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <FolderKanban className="w-3.5 h-3.5" />
                    <span>Investigation Cases ({matchedCases.length})</span>
                  </div>
                  {matchedCases.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        onSelectCase(c);
                        onClose();
                      }}
                      className="p-3 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer flex items-center justify-between gap-3 border border-slate-200 transition-colors"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{c.title}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {c.id} • Lead: {c.leadOfficer.name}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </div>
                  ))}
                </div>
              )}

              {/* Evidence */}
              {matchedEvidence.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5" />
                    <span>Evidence Vault Items ({matchedEvidence.length})</span>
                  </div>
                  {matchedEvidence.map((e) => (
                    <div
                      key={e.id}
                      onClick={() => {
                        onNavigateTab('vault');
                        onClose();
                      }}
                      className="p-3 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer flex items-center justify-between gap-3 border border-slate-200 transition-colors"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{e.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {e.id} • SHA-256: {e.digitalHashSha256.slice(0, 16)}...
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
