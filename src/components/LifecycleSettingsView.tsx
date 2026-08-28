import React, { useState } from 'react';
import {
  Archive,
  Lock,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FileText,
  Search,
  Scale
} from 'lucide-react';
import { ManagedDocument, OfficerProfile, DocumentLifecycleStage } from '../types';

interface LifecycleSettingsViewProps {
  documents: ManagedDocument[];
  officer: OfficerProfile;
  onToggleLegalHold: (docId: string) => void;
  onOpenDocDetail: (doc: ManagedDocument) => void;
}

export const LifecycleSettingsView: React.FC<LifecycleSettingsViewProps> = ({
  documents,
  officer,
  onToggleLegalHold,
  onOpenDocDetail,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStage, setFilterStage] = useState('ALL');

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.caseId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStage = filterStage === 'ALL' || doc.lifecycleStatus === filterStage;

    return matchesSearch && matchesStage;
  });

  const legalHoldCount = documents.filter((d) => d.legalHold).length;

  return (
    <div className="space-y-6 text-slate-900 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
              Governance & Retention
            </span>
            <span className="text-xs text-slate-500">• Judicial Evidence Rules</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Document Lifecycle & Legal Hold Governance
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated statutory retention schedules, court litigation preservation freezes, and document lifecycle control.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 bg-amber-50 border border-amber-200 rounded-lg text-xs font-semibold text-amber-900 shrink-0">
          <Archive className="w-4 h-4 text-amber-700" />
          <span>{legalHoldCount} Documents Under Legal Hold</span>
        </div>
      </div>

      {/* Lifecycle Flow Graphic */}
      <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Standard Judicial Document Lifecycle Workflow
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center text-xs">
          {[
            { stage: 'DRAFT', label: '1. Draft', desc: 'Initial creation' },
            { stage: 'SUBMITTED', label: '2. Submitted', desc: 'Uploaded to docket' },
            { stage: 'UNDER_REVIEW', label: '3. Under Review', desc: 'Supervisory review' },
            { stage: 'APPROVED', label: '4. Approved', desc: 'Signed & certified' },
            { stage: 'FINAL', label: '5. Court Final', desc: 'Filed in trial' },
            { stage: 'ARCHIVED', label: '6. Sealed Archive', desc: 'Immutable storage' },
          ].map((step, idx) => (
            <div
              key={step.stage}
              className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1"
            >
              <div className="font-bold text-slate-900 text-[11px]">{step.label}</div>
              <div className="text-[10px] text-slate-500">{step.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search documents by ID, Title, or Case Reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 focus:bg-white text-xs text-slate-900 pl-9 pr-3 py-2 rounded-lg focus:outline-none placeholder:text-slate-400"
          />
        </div>

        <select
          value={filterStage}
          onChange={(e) => setFilterStage(e.target.value)}
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
      </div>

      {/* Documents Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Document Title & Case</th>
                <th className="px-4 py-3">Lifecycle Stage</th>
                <th className="px-4 py-3">Retention Policy</th>
                <th className="px-4 py-3">Retention Expiry</th>
                <th className="px-4 py-3">Legal Hold Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onOpenDocDetail(doc)}
                      className="font-bold text-slate-900 hover:underline text-left cursor-pointer"
                    >
                      {doc.title}
                    </button>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {doc.caseId} • ID: {doc.id}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800 text-[10px] font-semibold">
                      {doc.lifecycleStatus}
                    </span>
                  </td>

                  <td className="px-4 py-3 font-semibold text-slate-800">
                    {doc.retentionYears} Years
                  </td>

                  <td className="px-4 py-3 font-mono text-[11px] text-slate-600">
                    {doc.retentionExpiryDate}
                  </td>

                  <td className="px-4 py-3">
                    {doc.legalHold ? (
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-semibold text-[10px] inline-flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-700" />
                        <span>PRESERVATION HOLD ACTIVE</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500">Standard Retention</span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onToggleLegalHold(doc.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                        doc.legalHold
                          ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                          : 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100'
                      }`}
                    >
                      {doc.legalHold ? 'Release Hold' : 'Place Legal Hold'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
