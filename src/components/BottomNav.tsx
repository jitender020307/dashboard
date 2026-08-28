import React from 'react';
import { LayoutDashboard, FolderKanban, FileText, AlertTriangle } from 'lucide-react';
import { SpotlightBox } from './InteractiveSpotlight';

interface BottomNavProps {
  activeTab: 'dashboard' | 'cases' | 'documents' | 'alerts';
  setActiveTab: (tab: 'dashboard' | 'cases' | 'documents' | 'alerts') => void;
  unreadAlertsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  unreadAlertsCount
}) => {
  return (
    <nav className="md:hidden bg-white text-slate-800 font-technical fixed bottom-0 w-full z-50 border-t border-slate-200 flex justify-around items-center h-16 px-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <SpotlightBox
        as="button"
        onClick={() => setActiveTab('dashboard')}
        className={`flex flex-col items-center justify-center transition-all active:scale-95 duration-150 gap-1 w-16 py-1 rounded-lg cursor-pointer ${
          activeTab === 'dashboard'
            ? 'text-sky-700 font-bold'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <LayoutDashboard className="w-5 h-5" />
        <span className="text-[10px] uppercase tracking-wider">Dashboard</span>
      </SpotlightBox>

      <SpotlightBox
        as="button"
        onClick={() => setActiveTab('cases')}
        className={`flex flex-col items-center justify-center transition-all active:scale-95 duration-150 gap-1 py-1 rounded-lg cursor-pointer ${
          activeTab === 'cases'
            ? 'bg-sky-50 text-sky-700 px-4 border border-sky-200 font-bold'
            : 'text-slate-500 hover:text-slate-800 w-16'
        }`}
      >
        <FolderKanban className="w-5 h-5 fill-current" />
        <span className="text-[10px] uppercase tracking-wider">Cases</span>
      </SpotlightBox>

      <SpotlightBox
        as="button"
        onClick={() => setActiveTab('documents')}
        className={`flex flex-col items-center justify-center transition-all active:scale-95 duration-150 gap-1 w-16 py-1 rounded-lg cursor-pointer ${
          activeTab === 'documents'
            ? 'text-sky-700 font-bold'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <FileText className="w-5 h-5" />
        <span className="text-[10px] uppercase tracking-wider">Docs</span>
      </SpotlightBox>

      <SpotlightBox
        as="button"
        onClick={() => setActiveTab('alerts')}
        className={`flex flex-col items-center justify-center relative transition-all active:scale-95 duration-150 gap-1 w-16 py-1 rounded-lg cursor-pointer ${
          activeTab === 'alerts'
            ? 'text-sky-700 font-bold'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <AlertTriangle className="w-5 h-5" />
        {unreadAlertsCount > 0 && (
          <span className="absolute top-0 right-3 w-3.5 h-3.5 rounded-full bg-red-600 text-white text-[8px] font-bold flex items-center justify-center">
            {unreadAlertsCount}
          </span>
        )}
        <span className="text-[10px] uppercase tracking-wider">Alerts</span>
      </SpotlightBox>
    </nav>
  );
};
