import React, { useState } from 'react';
import {
  Shield,
  LayoutDashboard,
  FolderKanban,
  FileText,
  AlertTriangle,
  Lock,
  Radio,
  X,
  Database,
  Fingerprint,
  GitCommit,
  Sparkles,
  KeyRound,
  History,
  UserCheck,
  Terminal,
  ChevronDown,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { OfficerProfile } from '../types';

export type AppTab =
  | 'dashboard'
  | 'vault'
  | 'integrity'
  | 'custody'
  | 'threats'
  | 'neural'
  | 'signatures'
  | 'timeline'
  | 'access'
  | 'cases'
  | 'documents'
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
  officer: OfficerProfile;
  onOpenProfile: () => void;
  onLockSystem: () => void;
  onToggleTerminal: () => void;
  onOpenGuide?: () => void;
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
  officer,
  onOpenProfile,
  onLockSystem,
  onToggleTerminal,
  onOpenGuide,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(
    ['neural', 'signatures', 'threats', 'timeline', 'access', 'documents', 'alerts'].includes(activeTab)
  );

  const primaryNavItems = [
    {
      id: 'dashboard' as const,
      label: 'Overview',
      subtitle: 'Summary & quick actions',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'cases' as const,
      label: 'Cases',
      subtitle: 'Investigation files',
      icon: FolderKanban,
      badge: totalCasesCount > 0 ? `${totalCasesCount}` : null,
    },
    {
      id: 'vault' as const,
      label: 'Evidence Vault',
      subtitle: 'Secure digital files',
      icon: Database,
      badge: evidenceVaultCount > 0 ? `${evidenceVaultCount}` : null,
    },
    {
      id: 'custody' as const,
      label: 'Chain of Custody',
      subtitle: 'Transfer & access logs',
      icon: GitCommit,
      badge: null,
    },
    {
      id: 'integrity' as const,
      label: 'File Integrity',
      subtitle: 'Tamper & hash verification',
      icon: Fingerprint,
      badge: tamperAlertsCount > 0 ? `${tamperAlertsCount} Alert` : '100% OK',
      badgeHighlight: tamperAlertsCount > 0,
      alertColor: tamperAlertsCount > 0,
    },
  ];

  const advancedNavItems = [
    {
      id: 'neural' as const,
      label: 'AI Document Analysis',
      icon: Sparkles,
      badge: 'AI',
    },
    {
      id: 'signatures' as const,
      label: 'Digital Signatures',
      icon: KeyRound,
      badge: null,
    },
    {
      id: 'threats' as const,
      label: 'Security & Threats',
      icon: Radio,
      badge: activeThreatsCount > 0 ? `${activeThreatsCount}` : null,
      badgeHighlight: activeThreatsCount > 0,
    },
    {
      id: 'timeline' as const,
      label: 'Audit History',
      icon: History,
      badge: null,
    },
    {
      id: 'access' as const,
      label: 'Access & Clearance',
      icon: UserCheck,
      badge: null,
    },
    {
      id: 'documents' as const,
      label: 'All Documents',
      icon: FileText,
      badge: totalDocsCount > 0 ? `${totalDocsCount}` : null,
    },
    {
      id: 'alerts' as const,
      label: 'System Alerts',
      icon: AlertTriangle,
      badge: unreadAlertsCount > 0 ? `${unreadAlertsCount}` : null,
      badgeHighlight: unreadAlertsCount > 0,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      {/* Left Sidebar Menu */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[275px] bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 overflow-hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Header: Identity & Quick Actions */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Brand Header */}
          <div className="p-3.5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <div
              onClick={() => {
                setActiveTab('dashboard');
                onCloseMobile?.();
              }}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs shrink-0 group-hover:bg-slate-800 transition-colors">
                <Shield className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900 tracking-wider">
                  SECURE-DMS
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  Evidence Vault & Cases
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={onLockSystem}
                title="Lock Application"
                className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-200/80 transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>

              {onCloseMobile && (
                <button
                  onClick={onCloseMobile}
                  className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-200 md:hidden cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* User Profile Bar */}
          <div
            onClick={() => {
              onOpenProfile();
              onCloseMobile?.();
            }}
            className="px-3.5 py-2.5 bg-white border-b border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-colors group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-md bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                {officer.name.charAt(0)}
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold text-slate-900 truncate group-hover:text-slate-700">
                  {officer.name}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {officer.rank} • {officer.clearanceName.replace('LEVEL ', 'Level ')}
                </div>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Online & Authorized" />
          </div>

          {/* Navigation Section */}
          <div className="px-3 py-3 space-y-4 flex-1 overflow-y-auto">
            {/* Primary Section */}
            <div className="space-y-1">
              <div className="px-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                MAIN NAVIGATION
              </div>

              <nav className="space-y-1">
                {primaryNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        onCloseMobile?.();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all cursor-pointer text-left ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? 'text-white' : 'text-slate-500'
                          }`}
                        />
                        <div className="truncate">
                          <div className={`text-xs ${isActive ? 'font-semibold' : 'font-medium'}`}>
                            {item.label}
                          </div>
                          <div className={`text-[10px] truncate ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                            {item.subtitle}
                          </div>
                        </div>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ml-1.5 ${
                            item.alertColor
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : isActive
                              ? 'bg-white/20 text-white'
                              : item.badgeHighlight
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Advanced Forensics & Tools Section (Collapsible for cleanliness) */}
            <div className="space-y-1 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                className="w-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700 flex items-center justify-between cursor-pointer rounded transition-colors"
              >
                <span>ADVANCED FORENSICS</span>
                {isAdvancedOpen ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>

              {isAdvancedOpen && (
                <nav className="space-y-0.5 pt-1">
                  {advancedNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          onCloseMobile?.();
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all cursor-pointer font-medium text-left ${
                          isActive
                            ? 'bg-slate-900 text-white font-semibold shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isActive ? 'text-white' : 'text-slate-400'
                            }`}
                          />
                          <span className="truncate text-xs">{item.label}</span>
                        </div>

                        {item.badge && (
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold shrink-0 ml-1 ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar: CLI Terminal & Quick Help */}
        <div className="border-t border-slate-200 flex flex-col shrink-0 bg-slate-50/80">
          <div className="p-2.5 flex items-center gap-2">
            <button
              onClick={onToggleTerminal}
              title="Open Forensics Terminal (CLI)"
              className="flex-1 py-1.5 px-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-slate-500" />
                <span>Terminal CLI</span>
              </div>
            </button>

            {onOpenGuide && (
              <button
                onClick={onOpenGuide}
                title="Quick Guide & FAQ"
                className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 transition-colors cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="px-3 pb-2 text-[10px] text-slate-400 flex items-center justify-between font-mono">
            <span>v4.9 • SECURE VAULT</span>
            <span className="flex items-center gap-1 text-emerald-600 font-sans font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Protected
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
