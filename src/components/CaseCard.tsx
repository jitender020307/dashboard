import React from 'react';
import { FileText, Package, ArrowRight, Shield } from 'lucide-react';
import { CaseItem } from '../types';

interface CaseCardProps {
  caseItem: CaseItem;
  onClick: () => void;
}

export const CaseCard: React.FC<CaseCardProps> = ({ caseItem, onClick }) => {
  const isHighRestricted =
    caseItem.classification === 'HIGHLY_RESTRICTED' ||
    caseItem.classification === 'RESTRICTED';

  return (
    <div
      onClick={onClick}
      className="rounded-xl bg-white border border-slate-200 hover:border-slate-400 transition-all duration-150 flex flex-col justify-between p-5 cursor-pointer group shadow-2xs hover:shadow-md text-slate-900"
    >
      <div>
        {/* Top Header: ID and Classification Tag */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold font-mono text-slate-900 tracking-wider">
              {caseItem.id}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              • {caseItem.dateInitiated}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                isHighRestricted
                  ? 'bg-purple-50 text-purple-800 border border-purple-200'
                  : caseItem.classification === 'CONFIDENTIAL'
                  ? 'bg-slate-100 text-slate-800 border border-slate-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              {caseItem.classification}
            </span>
          </div>
        </div>

        {/* Title and Summary */}
        <div className="py-4 space-y-1.5">
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-slate-700 transition-colors leading-snug">
            {caseItem.title}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {caseItem.summary}
          </p>
        </div>

        {/* Metadata Details */}
        <div className="grid grid-cols-2 gap-3 py-3 border-t border-slate-100 text-[11px] text-slate-600">
          <div>
            <span className="text-slate-400 block text-[9px] uppercase font-semibold">
              STATUS
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  caseItem.status === 'ACTIVE'
                    ? 'bg-emerald-600'
                    : caseItem.status === 'UNDER_TRIAL'
                    ? 'bg-purple-600'
                    : 'bg-slate-400'
                }`}
              />
              <span className="font-semibold text-slate-800">{caseItem.status}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block text-[9px] uppercase font-semibold">
              LEAD OFFICER
            </span>
            <span className="font-semibold text-slate-800 mt-0.5 block truncate">
              {caseItem.leadOfficer.name} ({caseItem.leadOfficer.rank})
            </span>
          </div>
        </div>
      </div>

      {/* Footer Counts & Action */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[11px]">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <strong className="text-slate-800">{caseItem.documentsCount}</strong> docs
          </span>
          <span className="text-slate-200">|</span>
          <span className="flex items-center gap-1 text-[11px]">
            <Package className="w-3.5 h-3.5 text-slate-400" />
            <strong className="text-slate-800">{caseItem.evidenceCount}</strong> evidence
          </span>
        </div>

        <span className="text-[11px] font-bold text-slate-900 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
          <span>VIEW DOSSIER</span>
          <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
};
