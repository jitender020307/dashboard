import React, { useState } from 'react';
import {
  FileText,
  Search,
  Eye,
  EyeOff,
  Download,
  ExternalLink,
  Lock
} from 'lucide-react';
import { CaseItem, CaseDocument } from '../types';

interface DocumentsViewProps {
  cases: CaseItem[];
  onOpenCase: (caseItem: CaseItem) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  cases,
  onOpenCase,
}) => {
  const allDocuments: CaseDocument[] = cases.flatMap((c) => c.documents);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDoc, setSelectedDoc] = useState<CaseDocument | null>(
    allDocuments[0] || null
  );
  const [redactionMode, setRedactionMode] = useState(true);

  const filteredDocs = allDocuments.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.contentSnippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.caseId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat =
      selectedCategory === 'ALL' || doc.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-fadeIn font-technical">
      {/* Page Header */}
      <div className="border-b border-zinc-200 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight font-sans">
            CLASSIFIED DOCUMENTS
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Search warrants, forensic affidavits, court orders & wiretap transcripts
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search records, dockets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-zinc-300 focus:border-zinc-900 text-xs text-zinc-900 pl-9 pr-3 py-2 rounded focus:outline-none placeholder:text-zinc-400"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        {[
          { id: 'ALL', label: 'ALL' },
          { id: 'SEARCH_WARRANT', label: 'SEARCH WARRANTS' },
          { id: 'FORENSIC_ANALYSIS', label: 'FORENSIC REPORTS' },
          { id: 'INTERCEPT_TRANSCRIPT', label: 'TRANSCRIPTS' },
          { id: 'COURT_ORDER', label: 'COURT ORDERS' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer font-medium ${
              selectedCategory === cat.id
                ? 'bg-zinc-900 text-white font-bold'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List (5 cols) */}
        <div className="lg:col-span-5 space-y-2.5">
          {filteredDocs.length === 0 ? (
            <div className="p-8 text-center bg-white border border-zinc-200 rounded text-zinc-400 text-xs">
              NO DOCUMENTS MATCHING QUERY
            </div>
          ) : (
            filteredDocs.map((doc) => {
              const isSelected = selectedDoc?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-100 border-zinc-400 shadow-xs'
                      : 'bg-white border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold font-mono text-zinc-900">
                      {doc.id}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono bg-zinc-200 text-zinc-800">
                      {doc.classification}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-zinc-900 mb-1 font-sans">
                    {doc.title}
                  </h3>

                  <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-zinc-200/60 mt-2 font-mono">
                    <span>CASE: {doc.caseId}</span>
                    <span>{doc.pagesCount} PAGES</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Preview Inspector (7 cols) */}
        <div className="lg:col-span-7">
          {selectedDoc ? (
            <div className="p-6 rounded-lg bg-white border border-zinc-200 space-y-4 shadow-2xs">
              {/* Document Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 pb-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono mb-1">
                    <FileText className="w-3.5 h-3.5 text-zinc-700" />
                    <span>{selectedDoc.id} // {selectedDoc.category.replace('_', ' ')}</span>
                  </div>
                  <h2 className="text-base font-bold text-zinc-900 font-sans">
                    {selectedDoc.title}
                  </h2>
                  <div className="text-xs text-zinc-500 mt-1 font-mono">
                    DOCKET: <span className="text-zinc-800 font-bold">{selectedDoc.caseId}</span> // AUTHOR: {selectedDoc.author}
                  </div>
                </div>

                {/* Redaction Button */}
                <button
                  onClick={() => setRedactionMode(!redactionMode)}
                  className="px-3 py-1.5 rounded border border-zinc-300 hover:border-zinc-900 bg-zinc-50 text-zinc-800 text-xs flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer font-bold"
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

              {/* Document Page Canvas */}
              <div className="p-6 bg-zinc-50 border border-zinc-200 rounded font-mono text-xs leading-relaxed space-y-4 text-zinc-800 relative overflow-hidden min-h-[300px]">
                {/* Diagonal Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                  <span className="text-5xl font-extrabold text-zinc-200 uppercase rotate-[-25deg] tracking-widest">
                    {selectedDoc.classification}
                  </span>
                </div>

                <div className="border-b border-zinc-200 pb-2 text-[10px] text-zinc-500 flex justify-between uppercase">
                  <span>FEDERAL FORENSIC REPOSITORY</span>
                  <span className="text-zinc-700 font-bold">DIGITAL SEAL: INTACT</span>
                </div>

                <div className="space-y-3 relative z-10">
                  <p className="text-zinc-900 font-bold">
                    RECORD CONTENT:
                  </p>
                  {redactionMode ? (
                    <p className="text-justify leading-6">
                      {selectedDoc.contentSnippet.split(' ').map((word, i) =>
                        i % 3 === 1 && word.length > 3 ? (
                          <span
                            key={i}
                            className="bg-zinc-900 text-transparent rounded px-1 select-none mx-0.5"
                            title="CLASSIFIED REDACTION"
                          >
                            [REDACTED]
                          </span>
                        ) : (
                          word + ' '
                        )
                      )}
                    </p>
                  ) : (
                    <p className="text-justify text-zinc-900 leading-6">
                      {selectedDoc.contentSnippet}
                    </p>
                  )}

                  <div className="p-3 bg-white border border-zinc-200 rounded text-[10px] text-zinc-600 space-y-0.5">
                    <div>• Electronic Signature: SIGNED VIA RSA-4096</div>
                    <div>• Hash Verification: CONFIRMED MATCH</div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-2">
                {(() => {
                  const parentCase = cases.find((c) => c.id === selectedDoc.caseId);
                  return parentCase ? (
                    <button
                      onClick={() => onOpenCase(parentCase)}
                      className="text-xs text-zinc-700 hover:text-zinc-900 hover:underline flex items-center gap-1.5 cursor-pointer font-bold"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>OPEN FULL CASE ({parentCase.id})</span>
                    </button>
                  ) : (
                    <span />
                  );
                })()}

                <button
                  onClick={() => {}}
                  className="px-3 py-1.5 rounded bg-white border border-zinc-300 hover:border-zinc-900 text-zinc-700 hover:text-zinc-900 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>EXPORT RECORD</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white border border-zinc-200 rounded text-zinc-400 text-xs">
              SELECT A DOCUMENT TO PREVIEW
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
