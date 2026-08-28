import React, { useState, useEffect } from 'react';
import {
  Shield,
  LayoutDashboard,
  FolderKanban,
  FileText,
  Lock,
  X,
  Database,
  Fingerprint,
  GitCommit,
  Sparkles,
  Stamp,
  History,
  Users,
  ShieldCheck,
  Archive,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  BrainCircuit,
  Layers
} from 'lucide-react';
import { OfficerProfile } from '../types';

export type AppTab =
  | 'dashboard'
  | 'cases'
  | 'documents'
  | 'vault'
  | 'integrity'
  | 'custody'
  | 'collaboration'
  | 'access'
  | 'timeline'
  | 'signatures'
  | 'intelligence'
  | 'lifecycle'
  | 'alerts';

interface SidebarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  unreadAlertsCount: number;
  totalCasesCount: number;
  totalDocsCount: number;
  evidenceVaultCount: number;
  tamperAlertsCount: number;
  activeThreatsCount: number;
  sharedDocsCount: number;
  officer: OfficerProfile;
  onOpenProfile: () => void;
  onLockSystem: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  unreadAlertsCount,
  totalCasesCount,
  totalDocsCount,
  evidenceVaultCount,
  tamperAlertsCount,
  activeThreatsCount,
  sharedDocsCount,
  officer,
  onOpenProfile,
  onLockSystem,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const isIntegrityGroupActive = [
    'integrity',
    'custody',
    'signatures',
    'collaboration',
    'access',
    'timeline',
  ].includes(activeTab);

  const isIntelligenceGroupActive = [
    'intelligence',
    'lifecycle',
    'alerts',
  ].includes(activeTab);

  // Maintain expanded state for the groups, defaulting open if their child is selected
  const [integrityExpanded, setIntegrityExpanded] = useState<boolean>(true);
  const [intelligenceExpanded, setIntelligenceExpanded] = useState<boolean>(true);

  // Automatically expand group when navigating to a child subpart
  useEffect(() => {
    if (isIntegrityGroupActive) {
      setIntegrityExpanded(true);
    }
  }, [isIntegrityGroupActive]);

  useEffect(() => {
    if (isIntelligenceGroupActive) {
      setIntelligenceExpanded(true);
    }
  }, [isIntelligenceGroupActive]);

  const coreDmsItems = [
    {
      id: 'dashboard' as const,
      label: 'System Overview',
      subtitle: 'Summary & rapid metrics',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'cases' as const,
      label: 'Investigation Cases',
      subtitle: 'Dockets & case files',
      icon: FolderKanban,
      badge: totalCasesCount > 0 ? `${totalCasesCount}` : null,
    },
    {
      id: 'documents' as const,
      label: 'Document Repository',
      subtitle: 'Versioned legal records',
      icon: FileText,
      badge: totalDocsCount > 0 ? `${totalDocsCount}` : null,
      badgeHighlight: true,
    },
    {
      id: 'vault' as const,
      label: 'Evidence Vault',
      subtitle: 'Digital artifacts & media',
      icon: Database,
      badge: evidenceVaultCount > 0 ? `${evidenceVaultCount}` : null,
    },
  ];

  const integrityAndSecurityItems = [
    {
      id: 'integrity' as const,
      label: 'Document Integrity',
      subtitle: 'SHA-256 hash validation',
      icon: Fingerprint,
      badge: tamperAlertsCount > 0 ? `${tamperAlertsCount} Alert` : '100% OK',
      alertColor: tamperAlertsCount > 0,
    },
    {
      id: 'custody' as const,
      label: 'Chain of Custody',
      subtitle: 'Court-admissible ledger',
      icon: GitCommit,
      badge: null,
    },
    {
      id: 'signatures' as const,
      label: 'Digital Signatures',
      subtitle: 'PKI certificate validation',
      icon: Stamp,
      badge: null,
    },
    {
      id: 'collaboration' as const,
      label: 'Secure Collaboration',
      subtitle: 'Role & expiring shares',
      icon: Users,
      badge: sharedDocsCount > 0 ? `${sharedDocsCount}` : null,
    },
    {
      id: 'access' as const,
      label: 'Access Control (RBAC)',
      subtitle: 'Clearance & session posture',
      icon: ShieldCheck,
      badge: null,
    },
    {
      id: 'timeline' as const,
      label: 'Audit Trail',
      subtitle: 'Immutable event logs',
      icon: History,
      badge: null,
    },
  ];

  const intelligenceAndLifecycleItems = [
    {
      id: 'intelligence' as const,
      label: 'Document Intelligence',
      subtitle: 'OCR, NER & Sec 65B',
      icon: Sparkles,
      badge: 'AI',
    },
    {
      id: 'lifecycle' as const,
      label: 'Lifecycle & Legal Hold',
      subtitle: 'Retention & legal freeze',
      icon: Archive,
      badge: null,
    },
    {
      id: 'alerts' as const,
      label: 'Security Alerts',
      subtitle: 'Integrity & access anomalies',
      icon: AlertTriangle,
      badge: unreadAlertsCount > 0 ? `${unreadAlertsCount}` : null,
      alertColor: unreadAlertsCount > 0,
    },
  ];

  interface NavItem {
    id: AppTab;
    label: string;
    subtitle: string;
    icon: React.ComponentType<{ className?: string }>;
    badge: string | null;
    alertColor?: boolean;
  }

  const renderSingleNavItem = (item: NavItem, isIndented = false) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    return (
      <button
        key={item.id}
        onClick={() => {
          setActiveTab(item.id);
          if (onCloseMobile) onCloseMobile();
        }}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all group cursor-pointer ${
          isIndented ? 'pl-7.5 text-xs' : 'text-xs'
        } ${
          isActive
            ? 'bg-slate-900 text-white font-medium shadow-xs'
            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <Icon
            className={`w-4 h-4 shrink-0 transition-colors ${
              isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-900'
            }`}
          />
          <div className="truncate">
            <div className="text-xs font-semibold leading-tight truncate">
              {item.label}
            </div>
            <div
              className={`text-[10px] leading-tight truncate ${
                isActive ? 'text-slate-300' : 'text-slate-500'
              }`}
            >
              {item.subtitle}
            </div>
          </div>
        </div>

        {item.badge && (
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono shrink-0 ml-1.5 ${
              item.alertColor
                ? 'bg-rose-100 text-rose-700 font-bold'
                : isActive
                ? 'bg-white/20 text-white font-medium'
                : 'bg-slate-200 text-slate-700 font-medium'
            }`}
          >
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* App Branding */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 leading-none">
                SECURE-DMS
              </div>
              <div className="text-[10px] text-slate-500 font-medium tracking-wide mt-1">
                SIH 26190 • Legal & Evidence
              </div>
            </div>
          </div>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 lg:hidden cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Officer Active Badge */}
        <div className="p-3 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="font-semibold text-slate-900 truncate">
                {officer.name}
              </span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono font-medium shrink-0">
              L{officer.clearanceLevel}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 truncate mt-0.5">
            {officer.rank} • {officer.department}
          </div>
        </div>

        {/* Scrollable Nav Sections */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Group 1: Core Document System */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Core Document System</span>
              <span className="text-[10px] font-mono text-slate-400">4 Items</span>
            </div>
            {coreDmsItems.map((item) => renderSingleNavItem(item))}
          </div>

          {/* Group 2: Integrity & Security (Collapsible Tab Group with Subparts) */}
          <div className="space-y-1 rounded-xl border border-slate-200 bg-slate-50/70 p-1.5">
            {/* Parent Tab Trigger */}
            <div
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer transition-all select-none ${
                isIntegrityGroupActive
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'text-slate-800 hover:bg-slate-200/70 font-semibold'
              }`}
              onClick={() => {
                if (!isIntegrityGroupActive) {
                  setActiveTab('integrity');
                  setIntegrityExpanded(true);
                  if (onCloseMobile) onCloseMobile();
                } else {
                  setIntegrityExpanded((prev) => !prev);
                }
              }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Lock
                  className={`w-4 h-4 shrink-0 ${
                    isIntegrityGroupActive ? 'text-white' : 'text-slate-600'
                  }`}
                />
                <div className="truncate">
                  <div className="text-xs font-bold leading-tight truncate">
                    Integrity & Security
                  </div>
                  <div
                    className={`text-[10px] leading-tight truncate ${
                      isIntegrityGroupActive ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    6 Sub-modules
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {tamperAlertsCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold bg-rose-600 text-white">
                    {tamperAlertsCount} Alert
                  </span>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIntegrityExpanded((prev) => !prev);
                  }}
                  className={`p-0.5 rounded hover:bg-white/20 transition-transform ${
                    integrityExpanded ? 'rotate-180' : ''
                  }`}
                  title={integrityExpanded ? 'Collapse sub-parts' : 'Show sub-parts'}
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sub-parts List when Selected / Expanded */}
            {integrityExpanded && (
              <div className="pl-1.5 pr-0.5 py-1 space-y-1 border-l-2 border-slate-300 ml-3.5 my-1">
                {integrityAndSecurityItems.map((item) =>
                  renderSingleNavItem(item, false)
                )}
              </div>
            )}
          </div>

          {/* Group 3: Intelligence & Governance (Collapsible Tab Group with Subparts) */}
          <div className="space-y-1 rounded-xl border border-slate-200 bg-slate-50/70 p-1.5">
            {/* Parent Tab Trigger */}
            <div
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer transition-all select-none ${
                isIntelligenceGroupActive
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'text-slate-800 hover:bg-slate-200/70 font-semibold'
              }`}
              onClick={() => {
                if (!isIntelligenceGroupActive) {
                  setActiveTab('intelligence');
                  setIntelligenceExpanded(true);
                  if (onCloseMobile) onCloseMobile();
                } else {
                  setIntelligenceExpanded((prev) => !prev);
                }
              }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <BrainCircuit
                  className={`w-4 h-4 shrink-0 ${
                    isIntelligenceGroupActive ? 'text-white' : 'text-slate-600'
                  }`}
                />
                <div className="truncate">
                  <div className="text-xs font-bold leading-tight truncate">
                    Intelligence & Governance
                  </div>
                  <div
                    className={`text-[10px] leading-tight truncate ${
                      isIntelligenceGroupActive ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    3 Sub-modules
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {unreadAlertsCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold bg-rose-600 text-white">
                    {unreadAlertsCount}
                  </span>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIntelligenceExpanded((prev) => !prev);
                  }}
                  className={`p-0.5 rounded hover:bg-white/20 transition-transform ${
                    intelligenceExpanded ? 'rotate-180' : ''
                  }`}
                  title={intelligenceExpanded ? 'Collapse sub-parts' : 'Show sub-parts'}
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sub-parts List when Selected / Expanded */}
            {intelligenceExpanded && (
              <div className="pl-1.5 pr-0.5 py-1 space-y-1 border-l-2 border-slate-300 ml-3.5 my-1">
                {intelligenceAndLifecycleItems.map((item) =>
                  renderSingleNavItem(item, false)
                )}
              </div>
            )}
          </div>
        </div>

        {/* User Profile & Lock Action Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center gap-2">
          <button
            onClick={onOpenProfile}
            className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>Profile & Keys</span>
          </button>

          <button
            onClick={onLockSystem}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
            title="Lock Workstation Session"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock</span>
          </button>
        </div>
      </aside>
    </>
  );
};
