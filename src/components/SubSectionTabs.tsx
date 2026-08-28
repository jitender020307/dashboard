import React from 'react';
import {
  Fingerprint,
  GitCommit,
  Stamp,
  Users,
  ShieldCheck,
  History,
  Sparkles,
  Archive,
  AlertTriangle,
  ShieldAlert,
  BrainCircuit,
  Lock
} from 'lucide-react';
import { AppTab } from './Sidebar';

interface SubSectionTabsProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  tamperAlertsCount?: number;
  sharedDocsCount?: number;
  unreadAlertsCount?: number;
  activeThreatsCount?: number;
}

export const SubSectionTabs: React.FC<SubSectionTabsProps> = ({
  activeTab,
  onSelectTab,
  tamperAlertsCount = 0,
  sharedDocsCount = 0,
  unreadAlertsCount = 0,
  activeThreatsCount = 0,
}) => {
  const isIntegrityGroup = [
    'integrity',
    'custody',
    'signatures',
    'collaboration',
    'access',
    'timeline',
  ].includes(activeTab);

  const isIntelligenceGroup = [
    'intelligence',
    'lifecycle',
    'alerts',
  ].includes(activeTab);

  if (!isIntegrityGroup && !isIntelligenceGroup) {
    return null;
  }

  const integrityTabs = [
    {
      id: 'integrity' as AppTab,
      label: 'Document Integrity',
      shortLabel: 'Integrity Engine',
      icon: Fingerprint,
      badge: tamperAlertsCount > 0 ? `${tamperAlertsCount} ALERT` : 'SHA-256',
      badgeColor: tamperAlertsCount > 0 ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-100 text-slate-700',
    },
    {
      id: 'custody' as AppTab,
      label: 'Chain of Custody',
      shortLabel: 'Custody Ledger',
      icon: GitCommit,
      badge: 'COURT ADMISSIBLE',
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    },
    {
      id: 'signatures' as AppTab,
      label: 'Digital Signatures',
      shortLabel: 'PKI Signatures',
      icon: Stamp,
      badge: 'PKI DSC',
      badgeColor: 'bg-purple-50 text-purple-700 border border-purple-200',
    },
    {
      id: 'collaboration' as AppTab,
      label: 'Secure Collaboration',
      shortLabel: 'Access Shares',
      icon: Users,
      badge: sharedDocsCount > 0 ? `${sharedDocsCount} SHARES` : null,
      badgeColor: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    },
    {
      id: 'access' as AppTab,
      label: 'Access Control (RBAC)',
      shortLabel: 'RBAC Clearance',
      icon: ShieldCheck,
      badge: 'CLEARANCE MATRIX',
      badgeColor: 'bg-slate-100 text-slate-700',
    },
    {
      id: 'timeline' as AppTab,
      label: 'Audit Trail',
      shortLabel: 'Forensic Audit',
      icon: History,
      badge: 'IMMUTABLE LOGS',
      badgeColor: 'bg-slate-100 text-slate-700',
    },
  ];

  const intelligenceTabs = [
    {
      id: 'intelligence' as AppTab,
      label: 'Document Intelligence & OCR',
      shortLabel: 'AI Intelligence',
      icon: Sparkles,
      badge: 'OCR & NER (SEC 65B)',
      badgeColor: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    },
    {
      id: 'lifecycle' as AppTab,
      label: 'Lifecycle & Legal Hold',
      shortLabel: 'Legal Hold & Retention',
      icon: Archive,
      badge: 'JUDICIAL FREEZE',
      badgeColor: 'bg-amber-50 text-amber-800 border border-amber-200',
    },
    {
      id: 'alerts' as AppTab,
      label: 'Security Alerts & SIEM',
      shortLabel: 'Threat Alerts',
      icon: AlertTriangle,
      badge: activeThreatsCount > 0 || unreadAlertsCount > 0 ? `${activeThreatsCount || unreadAlertsCount} ACTIVE` : 'SECURE',
      badgeColor: activeThreatsCount > 0 || unreadAlertsCount > 0 ? 'bg-rose-600 text-white animate-pulse' : 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    },
  ];

  const currentTabs = isIntegrityGroup ? integrityTabs : intelligenceTabs;
  const parentTitle = isIntegrityGroup ? 'Integrity & Security Framework' : 'Intelligence & Governance Framework';
  const ParentIcon = isIntegrityGroup ? Lock : BrainCircuit;

  return (
    <div className="mb-6 bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
      {/* Category Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-100 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-slate-900 flex items-center justify-center text-white shadow-2xs">
            <ParentIcon className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-slate-900 text-xs tracking-tight">
              {parentTitle}
            </span>
            <span className="text-[10px] text-slate-500 font-mono ml-2">
              (Select a sub-part tab below)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
            {currentTabs.length} Sub-modules active
          </span>
        </div>
      </div>

      {/* Sub-parts Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {currentTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 shrink-0 ${
                  isActive ? 'text-white' : 'text-slate-500'
                }`}
              />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0 ${
                    isActive ? 'bg-white/20 text-white' : tab.badgeColor
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
