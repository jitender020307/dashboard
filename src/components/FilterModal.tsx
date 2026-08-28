import React from 'react';
import { X, Filter, RefreshCw, Check } from 'lucide-react';
import { CaseStatus, ClassificationLevel } from '../types';

export interface FilterOptions {
  searchQuery: string;
  status: 'ALL' | CaseStatus;
  classification: 'ALL' | ClassificationLevel;
  leadOfficer: 'ALL' | string;
  minEvidence: number;
}

interface FilterModalProps {
  isOpen?: boolean;
  onClose: () => void;
  filters: FilterOptions;
  setFilters?: React.Dispatch<React.SetStateAction<FilterOptions>>;
  onApply?: (filters: FilterOptions) => void;
  onReset: () => void;
  matchingCount?: number;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen = true,
  onClose,
  filters: initialFilters,
  setFilters: setFiltersProp,
  onApply,
  onReset,
  matchingCount,
}) => {
  const [localFilters, setLocalFilters] = React.useState<FilterOptions>(initialFilters);

  const setFilters = (updater: any) => {
    if (setFiltersProp) {
      setFiltersProp(updater);
    }
    setLocalFilters(updater);
  };

  const filters = setFiltersProp ? initialFilters : localFilters;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-zinc-300 rounded-lg max-w-md w-full overflow-hidden shadow-xl flex flex-col font-technical text-xs">
        {/* Modal Header */}
        <div className="p-4 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-900 font-bold uppercase tracking-wider text-xs">
            <Filter className="w-4 h-4" />
            <span>FILTER VAULT CASES</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Keyword Search */}
          <div>
            <label className="block text-zinc-600 font-bold mb-1 uppercase tracking-wider text-[11px]">
              SEARCH IDENTIFIER / KEYWORD
            </label>
            <input
              type="text"
              placeholder="e.g. #INV-2026-00421, SCADA, Voronov, SSD..."
              value={filters.searchQuery}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
              }
              className="w-full bg-white border border-zinc-300 focus:border-zinc-900 text-zinc-900 px-3 py-2 rounded placeholder:text-zinc-400 outline-none"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-zinc-600 font-bold mb-1 uppercase tracking-wider text-[11px]">
              INVESTIGATION STATUS
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['ALL', 'ACTIVE', 'UNDER_REVIEW', 'UNDER_TRIAL', 'DISPOSED', 'ARCHIVED'] as const).map(
                (st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setFilters((prev) => ({ ...prev, status: st as any }))}
                    className={`py-1.5 px-2 rounded text-center transition-all cursor-pointer font-medium text-[11px] ${
                      filters.status === st
                        ? 'bg-zinc-900 text-white font-bold'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Classification Level */}
          <div>
            <label className="block text-zinc-600 font-bold mb-1 uppercase tracking-wider text-[11px]">
              SECURITY CLASSIFICATION
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(['ALL', 'UNCLASSIFIED', 'INTERNAL', 'CONFIDENTIAL', 'RESTRICTED', 'HIGHLY_RESTRICTED'] as const).map(
                (lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, classification: lvl as any }))
                    }
                    className={`py-1.5 px-2.5 rounded text-center transition-all cursor-pointer font-medium text-[11px] ${
                      filters.classification === lvl
                        ? 'bg-zinc-900 text-white font-bold'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
                    }`}
                  >
                    {lvl.replace('_', ' ')}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Lead Officer Filter */}
          <div>
            <label className="block text-zinc-600 font-bold mb-1 uppercase tracking-wider text-[11px]">
              LEAD INVESTIGATOR
            </label>
            <select
              value={filters.leadOfficer}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, leadOfficer: e.target.value }))
              }
              className="w-full bg-white border border-zinc-300 focus:border-zinc-900 text-zinc-900 px-3 py-2 rounded outline-none"
            >
              <option value="ALL">ALL INVESTIGATING OFFICERS</option>
              <option value="IO-1042">IO-1042 // Special Agent K. Vance</option>
              <option value="IO-0988">IO-0988 // Agent Sarah Chen</option>
            </select>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between">
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-zinc-500 hover:text-zinc-900 px-2 py-1 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>RESET</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="text-zinc-500">
              MATCHES: <strong className="text-zinc-900">{matchingCount}</strong>
            </span>
            <button
              onClick={() => {
                if (onApply) onApply(localFilters);
                onClose();
              }}
              className="bg-zinc-900 hover:bg-black text-white font-bold px-4 py-1.5 rounded flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>APPLY</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
