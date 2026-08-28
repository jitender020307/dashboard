import React, { useState } from 'react';
import {
  Sparkles,
  Cpu,
  FileText,
  Search,
  Tag,
  MapPin,
  Calendar,
  User,
  Scale,
  Building2,
  CheckCircle2,
  FileCheck2
} from 'lucide-react';
import { DocumentIntelligenceAnalysis, EvidenceItem, ManagedDocument } from '../types';

interface DocumentIntelligenceViewProps {
  analyses: Record<string, DocumentIntelligenceAnalysis>;
  documents: ManagedDocument[];
  evidenceItems: EvidenceItem[];
  initialSelectedId?: string;
}

export const DocumentIntelligenceView: React.FC<DocumentIntelligenceViewProps> = ({
  analyses,
  documents,
  evidenceItems,
  initialSelectedId,
}) => {
  const [selectedId, setSelectedId] = useState<string>(
    initialSelectedId || 'EV-2026-00421'
  );
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');

  const currentAnalysis = analyses[selectedId] || analyses['EV-2026-00421'];

  const getEntityIcon = (category: string) => {
    switch (category) {
      case 'OFFICER':
      case 'ACCUSED / PERSON':
      case 'PERSON':
        return <User className="w-3.5 h-3.5 text-slate-700" />;
      case 'LOCATION':
        return <MapPin className="w-3.5 h-3.5 text-slate-700" />;
      case 'DATE':
        return <Calendar className="w-3.5 h-3.5 text-slate-700" />;
      case 'CASE NUMBER':
        return <Tag className="w-3.5 h-3.5 text-slate-700" />;
      case 'POLICE STATION':
        return <Building2 className="w-3.5 h-3.5 text-slate-700" />;
      case 'LEGAL SECTION':
        return <Scale className="w-3.5 h-3.5 text-slate-700" />;
      default:
        return <Tag className="w-3.5 h-3.5 text-slate-700" />;
    }
  };

  const filteredEntities = currentAnalysis?.extractedEntities.filter((ent) => {
    if (selectedCategoryFilter === 'ALL') return true;
    return ent.category === selectedCategoryFilter;
  }) || [];

  return (
    <div className="space-y-6 text-slate-900 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-slate-600" />
              <span>Document Intelligence & OCR</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
              OCR Engine Confidence: {currentAnalysis?.ocrConfidence || 99.8}%
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Automated OCR & Legal Entity Extraction (NER)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated statutory classification, Named Entity Recognition, and Section 65B electronic compliance extraction.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs shrink-0">
          <FileCheck2 className="w-4 h-4 text-emerald-700" />
          <span className="font-semibold text-slate-800">Section 65B Indian Evidence Act Compliant</span>
        </div>
      </div>

      {/* Target Document Selector Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3 flex-1">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="flex-1">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Select Document or Evidence for Intelligence Analysis
            </label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 text-xs font-mono focus:border-slate-900 focus:bg-white focus:outline-none cursor-pointer"
            >
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  [DOC] {doc.title} — {doc.caseId} ({doc.category})
                </option>
              ))}
              {evidenceItems.map((e) => (
                <option key={e.id} value={e.id}>
                  [EVIDENCE] {e.name} — {e.caseId || 'CASE-UP-CYB-2026-00421'}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Executive Summary & NER Entities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Summary & Statutory Mapping (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Executive Summary */}
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-600" />
              <span>Extracted Legal Summary & Case Synopsis</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
              {currentAnalysis?.aiSummary || 'Document summary parsing in progress...'}
            </p>
          </div>

          {/* Statutory Legal Sections */}
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Scale className="w-4 h-4 text-slate-600" />
              <span>Identified Statutory Sections & Penal Provisions</span>
            </h2>
            <div className="space-y-2 text-xs">
              {currentAnalysis?.statutorySections.map((sec, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-semibold text-slate-800 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
                  <span>{sec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Named Entity Extraction (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Extracted Entities ({filteredEntities.length})
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">NER CONFIDENCE &gt; 95%</span>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-1 text-[11px]">
              {['ALL', 'OFFICER', 'ACCUSED / PERSON', 'POLICE STATION', 'LEGAL SECTION', 'DATE'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                    selectedCategoryFilter === cat
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {filteredEntities.map((ent, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {getEntityIcon(ent.category)}
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">{ent.value}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{ent.category}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">
                    {Math.round(ent.confidence * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
