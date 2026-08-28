import React from 'react';
import { Shield, LayoutDashboard, FolderKanban, FileText, AlertTriangle, User, Lock, CheckCircle2 } from 'lucide-react';
import { OfficerProfile } from '../types';
import { SpotlightBox } from './InteractiveSpotlight';

interface HeaderProps {
  activeTab: 'dashboard' | 'cases' | 'documents' | 'alerts';
  setActiveTab: (tab: 'dashboard' | 'cases' | 'documents' | 'alerts') => void;
  unreadAlertsCount: number;
  officer: OfficerProfile;
  onOpenProfile: () => void;
  onLockSystem: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  unreadAlertsCount,
  officer,
  onOpenProfile,
  onLockSystem
}) => {
  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:flex bg-white text-slate-900 font-sans h-16 border-b border-slate-200 sticky top-0 z-50 justify-between items-center w-full px-8 shadow-sm">
        <SpotlightBox 
          onClick={() => setActiveTab('cases')}
          className="flex items-center gap-3 cursor-pointer select-none group transition-opacity hover:opacity-90 px-2 py-1 rounded-lg"
        >
          <div className="w-9 h-9 rounded bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shadow-sm">
            <Shield className="w-5 h-5 fill-sky-600 text-sky-600" />
          </div>
          <div className="flex flex-col">
            <span className="font-technical text-lg font-bold text-sky-700 tracking-wider">
              SECURE-DMS
            </span>
            <span className="font-technical text-[9px] text-slate-500 tracking-widest uppercase">
              Evidence Vault v4.9
            </span>
          </div>
        </SpotlightBox>

        {/* Navigation items */}
        <nav className="flex items-center gap-4 font-technical text-xs tracking-wider uppercase font-semibold">
          <SpotlightBox
            as="button"
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 py-1.5 px-3 rounded-lg transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'text-sky-700 border-b-2 border-sky-600 bg-sky-50 font-bold'
                : 'text-slate-600 hover:text-sky-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </div>
          </SpotlightBox>

          <SpotlightBox
            as="button"
            onClick={() => setActiveTab('cases')}
            className={`flex items-center gap-2 py-1.5 px-3 rounded-lg transition-all cursor-pointer ${
              activeTab === 'cases'
                ? 'text-sky-700 border-b-2 border-sky-600 bg-sky-50 font-bold'
                : 'text-slate-600 hover:text-sky-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <FolderKanban className="w-4 h-4" />
              <span>Cases</span>
            </div>
          </SpotlightBox>

          <SpotlightBox
            as="button"
            onClick={() => setActiveTab('documents')}
            className={`flex items-center gap-2 py-1.5 px-3 rounded-lg transition-all cursor-pointer ${
              activeTab === 'documents'
                ? 'text-sky-700 border-b-2 border-sky-600 bg-sky-50 font-bold'
                : 'text-slate-600 hover:text-sky-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Documents</span>
            </div>
          </SpotlightBox>

          <SpotlightBox
            as="button"
            onClick={() => setActiveTab('alerts')}
            className={`flex items-center gap-2 py-1.5 px-3 rounded-lg relative transition-all cursor-pointer ${
              activeTab === 'alerts'
                ? 'text-sky-700 border-b-2 border-sky-600 bg-sky-50 font-bold'
                : 'text-slate-600 hover:text-sky-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Alerts</span>
              {unreadAlertsCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {unreadAlertsCount}
                </span>
              )}
            </div>
          </SpotlightBox>
        </nav>

        {/* Right side officer and lock */}
        <div className="flex items-center gap-3">
          <SpotlightBox className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-right shadow-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <div className="flex flex-col">
              <span className="font-technical text-[10px] text-sky-800 font-bold">
                {officer.id} // {officer.name}
              </span>
              <span className="font-technical text-[9px] text-slate-500">
                CLR-LVL 4 (TS/SCI)
              </span>
            </div>
          </SpotlightBox>

          <SpotlightBox
            as="button"
            onClick={onLockSystem}
            title="Lock SCIF Terminal"
            className="p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:text-red-600 hover:border-red-300 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Lock className="w-4 h-4" />
          </SpotlightBox>

          <SpotlightBox
            as="button"
            onClick={onOpenProfile}
            title="Security Profile"
            className="cursor-pointer active:opacity-80 hover:bg-slate-100 transition-colors p-1.5 rounded-full border border-slate-200 text-sky-700 bg-slate-50"
          >
            <User className="w-5 h-5" />
          </SpotlightBox>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden flex bg-white text-slate-900 h-14 border-b border-slate-200 sticky top-0 z-50 justify-between items-center w-full px-4 shadow-xs">
        <SpotlightBox 
          onClick={() => setActiveTab('cases')}
          className="flex items-center gap-2.5 cursor-pointer p-1 rounded-lg"
        >
          <div className="w-7 h-7 rounded bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
            <Shield className="w-4 h-4 fill-sky-600 text-sky-600" />
          </div>
          <span className="font-technical text-base font-bold text-sky-800 tracking-wider">
            SECURE-DMS
          </span>
        </SpotlightBox>

        <div className="flex items-center gap-2">
          <SpotlightBox
            as="button"
            onClick={onLockSystem}
            className="p-1.5 rounded border border-slate-200 text-slate-600 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
          </SpotlightBox>
          <SpotlightBox
            as="button"
            onClick={onOpenProfile}
            className="cursor-pointer border border-slate-200 rounded-full p-1 text-sky-700 bg-slate-50"
          >
            <User className="w-4 h-4" />
          </SpotlightBox>
        </div>
      </header>
    </>
  );
};
