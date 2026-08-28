import React, { useState } from 'react';
import {
  Sparkles,
  Cpu,
  FileText,
  Search,
  Lock,
  Tag,
  MapPin,
  Calendar,
  User,
  Scale,
  Building2
} from 'lucide-react';
import { AIForensicAnalysis, EvidenceItem } from '../types';

interface NeuralForensicsViewProps {
  analyses: Record<string, AIForensicAnalysis>;
  evidenceItems: EvidenceItem[];
  initialSelectedEvidenceId?: string;
}

export const NeuralForensicsView: React.FC<NeuralForensicsViewProps> = ({
  analyses,
  evidenceItems,
  initialSelectedEvidenceId,
}) => {
  const [selectedId, setSelectedId] = useState<string>(
    initialSelectedEvidenceId || 'EV-2026-00421'
  );
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');

  const currentAnalysis = analyses[selectedId] || analyses['EV-2026-00421'];
  const currentEvidence = evidenceItems.find((e) => e.id === selectedId) || evidenceItems[0];

  const getEntityIcon = (category: string) => {
    switch (category) {
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
    <div className="space-y-6 font-technical text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-slate-600" />
              MODULE 09 // NEURAL FORENSICS CORE
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-emerald-700 text-[10px] font-semibold">
              OCR CONFIDENCE: 100.0%
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-wider mt-1">
            NEURAL FORENSICS // OCR & ENTITY RECOGNITION
          </h1>
          <p className="text-xs text-slate-500 font-sans">
            Automated statutory classification, NER entity extraction, and legal summary synthesis
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-2.5 rounded-lg shrink-0">
          <Cpu className="w-4 h-4 text-slate-600" />
          <div className="text-xs">
            <div className="text-slate-800 font-bold uppercase text-[10px]">LEGAL ADMISSIBILITY NOTICE</div>
            <div className="text-[10px] text-slate-500 font-sans">Strict separation of original evidence & AI analysis</div>
          </div>
        </div>
      </div>

      {/* Target Evidence Selector Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3 flex-1">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="flex-1">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              SELECT DOCUMENT FOR NEURAL FORENSIC ANALYSIS
            </label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 text-xs font-mono focus:border-slate-900 focus:bg-white focus:outline-none cursor-pointer"
            >
              {Object.keys(analyses).map((key) => {
                const item = analyses[key];
                return (
                  <option key={key} value={key}>
                    [{item.documentId}] {item.documentName} — Type: {item.documentType} ({item.caseId})
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {currentAnalysis && (
          <div className="text-right text-xs font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200 shrink-0">
            <div className="text-slate-500 text-[10px] uppercase">DOCUMENT TYPE</div>
            <div className="text-slate-900 font-bold">{currentAnalysis.documentType}</div>
          </div>
        )}
      </div>

      {/* Important Strict Separation Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-900 text-xs font-bold uppercase">
            <Lock className="w-4 h-4 text-slate-600" />
            <span>ORIGINAL EVIDENCE (UNTOUCHED & IMMUTABLE)</span>
          </div>
          <div className="text-xs text-slate-600 font-mono space-y-1">
            <div>FILE: <strong className="text-slate-900">{currentEvidence?.name}</strong> ({currentEvidence?.fileSize})</div>
            <div className="truncate">SHA-256: <strong className="text-slate-800">{currentEvidence?.digitalHashSha256}</strong></div>
            <div>STATUS: <span className="text-emerald-700 font-semibold">✓ READ-ONLY BUFFER (BITSTREAM LOCKED)</span></div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-900 text-xs font-bold uppercase">
            <Sparkles className="w-4 h-4 text-slate-600" />
            <span>AI-GENERATED DERIVATIVE (DERIVED LAYER)</span>
          </div>
          <div className="text-xs text-slate-600 font-mono space-y-1">
            <div>ENGINE: <strong className="text-slate-800">Neural OCR & NER Model v4.9</strong></div>
            <div>OCR ACCURACY: <strong className="text-emerald-700 font-semibold">100.0% Confidence</strong></div>
            <div>TAMPER ANOMALY: <span className="text-emerald-700 font-semibold">ZERO ANOMALIES DETECTED</span></div>
          </div>
        </div>
      </div>

      {/* Main Analysis Output */}
      {currentAnalysis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Entities & Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Summary Card */}
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-600" />
                  <span>SYNTHESIZED FORENSIC CASE SUMMARY</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-400">
                  TIMESTAMP: {currentAnalysis.analysisTimestamp}
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-sans bg-slate-50 p-4 rounded-lg border border-slate-200">
                {currentAnalysis.aiSummary}
              </p>

              {/* Forensic Keyword Cloud */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                  IDENTIFIED STATUTORY & TECHNICAL KEYWORDS
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentAnalysis.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-800 text-xs font-mono font-medium"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Extracted Named Entities Grid */}
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Tag className="w-4 h-4 text-slate-600" />
                  <span>EXTRACTED NAMED ENTITIES [{filteredEntities.length}]</span>
                </h3>

                {/* Entity Category Filter */}
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:border-slate-900 focus:bg-white focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Categories</option>
                  <option value="PERSON">PERSON</option>
                  <option value="LOCATION">LOCATION</option>
                  <option value="DATE">DATE</option>
                  <option value="CASE NUMBER">CASE NUMBER</option>
                  <option value="POLICE STATION">POLICE STATION</option>
                  <option value="LEGAL SECTION">LEGAL SECTION</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredEntities.map((ent, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="p-1.5 rounded bg-white border border-slate-200 mt-0.5">
                        {getEntityIcon(ent.category)}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-500 block font-mono">
                          {ent.category}
                        </span>
                        <span className="font-medium text-slate-900 block font-sans">
                          {ent.value}
                        </span>
                      </div>
                    </div>

                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {(ent.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 1 Col: OCR Diagnostics & Legal Matrix */}
          <div className="space-y-6">
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                OCR ENGINE DIAGNOSTICS
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">OCR ACCURACY:</span>
                  <span className="text-emerald-700 font-mono font-semibold">100.0%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">LANGUAGE DETECTED:</span>
                  <span className="text-slate-900 font-mono">English (Legal/Police)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">DOCUMENT RESOLUTION:</span>
                  <span className="text-slate-900 font-mono">600 DPI (High Fidelity)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">LEGAL COMPLIANCE:</span>
                  <span className="text-slate-900 font-mono">Sec 65B Certified</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">RISK SEVERITY INDEX:</span>
                  <span className="text-slate-900 font-mono font-semibold">{currentAnalysis.riskScore} / 100</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3 text-xs">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                STATUTORY EVIDENCE PROTECTION
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                Under the Indian Evidence Act Section 65B and ISO/IEC 27037 standards for digital evidence handling, AI-derived entities are annotated as metadata layers without modifying the binary bits of the original artifact.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
