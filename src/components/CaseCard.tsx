import React from 'react';
import { Shield, FileText, Package, ArrowRight, Lock, Clock } from 'lucide-react';
import { CaseItem } from '../types';
import { SpotlightBox } from './InteractiveSpotlight';

interface CaseCardProps {
  caseData: CaseItem;
  onOpenCase: (caseItem: CaseItem) => void;
}

export const CaseCard: React.FC<CaseCardProps> = ({ caseData, onOpenCase }) => {
  const isTopSecret = caseData.classification === 'TOP SECRET';

  return (
    <SpotlightBox
      onClick={() => onOpenCase(caseData)}
      className="rounded-lg bg-white border border-zinc-200 hover:border-sky-300 transition-all duration-150 flex flex-col justify-between p-5 cursor-pointer group shadow-2xs hover:shadow-md"
    >
      <div>
        {/* Top Header: ID and Classification Tag */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 font-technical text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-900 tracking-wider">
              {caseData.id}
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">
              // {caseData.dateInitiated}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider font-technical ${
                isTopSecret
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
              }`}
            >
              {caseData.classification}
            </span>
          </div>
        </div>

        {/* Title and Summary */}
        <div className="py-4 space-y-1.5">
          <h3 className="text-sm font-semibold text-zinc-900 group-hover:text-sky-950 transition-colors font-sans leading-snug">
            {caseData.title}
          </h3>
          <p className="text-xs text-zinc-500 line-clamp-2 font-sans leading-relaxed">
            {caseData.summary}
          </p>
        </div>

        {/* Metadata Details */}
        <div className="grid grid-cols-2 gap-3 py-3 border-t border-zinc-100 text-[11px] font-technical text-zinc-600">
          <div>
            <span className="text-zinc-400 block text-[9px] uppercase font-semibold">
              STATUS
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  caseData.status === 'ACTIVE'
                    ? 'bg-zinc-900'
                    : caseData.status === 'PENDING REVIEW'
                    ? 'bg-zinc-500'
                    : 'bg-zinc-400'
                }`}
              />
              <span className="font-semibold text-zinc-800">{caseData.status}</span>
            </div>
          </div>

          <div>
            <span className="text-zinc-400 block text-[9px] uppercase font-semibold">
              LEAD OFFICER
            </span>
            <span className="font-semibold text-zinc-800 mt-0.5 block truncate">
              {caseData.leadOfficer.id} ({caseData.leadOfficer.name.split(' ').pop()})
            </span>
          </div>
        </div>
      </div>

      {/* Footer Counts & Action */}
      <div className="pt-3 border-t border-zinc-100 flex items-center justify-between font-technical text-xs text-zinc-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[11px]">
            <FileText className="w-3.5 h-3.5 text-zinc-400" />
            <strong className="text-zinc-800">{caseData.documentsCount}</strong> docs
          </span>
          <span className="text-zinc-200">|</span>
          <span className="flex items-center gap-1 text-[11px]">
            <Package className="w-3.5 h-3.5 text-zinc-400" />
            <strong className="text-zinc-800">{caseData.evidenceCount}</strong> evidence
          </span>
        </div>

        <span className="text-[11px] font-bold text-zinc-900 group-hover:text-sky-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
          <span>DOSSIER</span>
          <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </SpotlightBox>
  );
};
