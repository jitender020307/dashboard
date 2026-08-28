import React, { useState } from 'react';
import {
  X,
  User,
  Shield,
  Key,
  Lock,
  CheckCircle2
} from 'lucide-react';
import { OfficerProfile } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  officer: OfficerProfile;
  onLockSystem: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  officer,
  onLockSystem,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-zinc-300 rounded-lg max-w-sm w-full overflow-hidden shadow-xl font-technical text-xs flex flex-col">
        {/* Header */}
        <div className="p-4 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-900 font-bold uppercase tracking-wider text-xs">
            <User className="w-4 h-4 text-zinc-700" />
            <span>OFFICER CREDENTIALS</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Badge Avatar Card */}
          <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-white border border-zinc-300 flex items-center justify-center text-zinc-800 shadow-2xs">
              <Shield className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <div className="text-zinc-900 font-bold text-sm font-sans">
                {officer.name}
              </div>
              <div className="text-zinc-500 text-[11px] font-sans">
                {officer.rank}
              </div>
              <div className="text-[10px] text-zinc-700 font-mono">
                BADGE ID: {officer.id}
              </div>
            </div>
          </div>

          {/* Details Table */}
          <div className="space-y-2 bg-zinc-50 p-3.5 rounded border border-zinc-200 text-[11px]">
            <div className="flex justify-between border-b border-zinc-200/80 pb-1.5">
              <span className="text-zinc-500">CLEARANCE:</span>
              <span className="text-zinc-900 font-bold font-mono">
                {officer.clearanceName}
              </span>
            </div>
            <div className="flex justify-between border-b border-zinc-200/80 py-1.5">
              <span className="text-zinc-500">DIVISION:</span>
              <span className="text-zinc-800 font-sans text-right">
                {officer.department}
              </span>
            </div>
            <div className="flex justify-between border-b border-zinc-200/80 py-1.5">
              <span className="text-zinc-500">NODE:</span>
              <span className="text-zinc-900 font-mono font-bold">
                {officer.terminalNode}
              </span>
            </div>
            <div className="flex justify-between pt-1.5">
              <span className="text-zinc-500">SESSION:</span>
              <span className="text-zinc-900 font-mono">
                {officer.activeSessionDuration}
              </span>
            </div>
          </div>

          {/* Hardware Token Status */}
          <div className="p-2.5 rounded bg-zinc-50 border border-zinc-200 text-[11px] space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-900 font-bold">
              <Key className="w-3.5 h-3.5 text-zinc-700" />
              <span>YUBIKEY FIPS 140-3 HSM ACTIVE</span>
            </div>
            <p className="text-zinc-500 font-mono text-[10px]">
              Serial: 9021-44A9-09BF-8812
            </p>
          </div>

          {/* Lockdown Terminal Button */}
          <button
            onClick={() => {
              onClose();
              onLockSystem();
            }}
            className="w-full py-2 rounded bg-zinc-100 border border-zinc-300 text-zinc-800 hover:bg-zinc-200 hover:text-black font-bold flex items-center justify-center gap-2 transition-all cursor-pointer text-xs"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>LOCK TERMINAL</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const LockScreen: React.FC<{
  onUnlock: () => void;
  officer: OfficerProfile;
}> = ({ onUnlock, officer }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1042' || pin.length >= 4) {
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-technical">
      <div className="max-w-xs w-full bg-white border border-zinc-300 p-6 rounded-lg text-center space-y-5 shadow-2xl animate-fadeIn">
        <div className="w-12 h-12 rounded-full bg-zinc-100 border border-zinc-300 mx-auto flex items-center justify-center text-zinc-900 shadow-2xs">
          <Lock className="w-6 h-6" />
        </div>

        <div>
          <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
            SCIF TERMINAL LOCKED
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            EXAMINER: {officer.name} ({officer.id})
          </p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-3">
          <input
            type="password"
            autoFocus
            maxLength={6}
            placeholder="PIN (Default: 1042)"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-300 focus:border-zinc-900 text-center text-base tracking-widest text-zinc-900 py-1.5 rounded outline-none"
          />

          {error && (
            <p className="text-xs text-zinc-900 font-bold">
              INVALID PIN
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-zinc-900 hover:bg-black text-white font-bold text-xs rounded uppercase tracking-wider cursor-pointer"
          >
            UNLOCK
          </button>
        </form>

        <p className="text-[10px] text-zinc-400">
          FIPS 140-3 COMPLIANT LOCKOUT PROTOCOL
        </p>
      </div>
    </div>
  );
};
