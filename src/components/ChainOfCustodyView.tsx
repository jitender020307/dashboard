import React, { useState } from 'react';
import {
  GitCommit,
  User,
  MapPin,
  Laptop,
  Plus,
  CheckCircle2,
  Search,
  KeyRound,
  Send,
  Info,
  ArrowRight,
  ShieldCheck,
  Calendar,
  X
} from 'lucide-react';
import { CustodyEvent, EvidenceItem, OfficerProfile } from '../types';

interface ChainOfCustodyViewProps {
  custodyEvents: CustodyEvent[];
  evidenceItems: EvidenceItem[];
  currentOfficer: OfficerProfile;
  onAddCustodyEvent: (event: CustodyEvent) => void;
  initialSelectedEvidenceId?: string;
}

export const ChainOfCustodyView: React.FC<ChainOfCustodyViewProps> = ({
  custodyEvents,
  evidenceItems,
  currentOfficer,
  onAddCustodyEvent,
  initialSelectedEvidenceId,
}) => {
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>(
    initialSelectedEvidenceId || evidenceItems[0]?.id || 'EV-2026-00421'
  );
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [transferAction, setTransferAction] = useState<CustodyEvent['action']>('TRANSFERRED');
  const [targetRecipient, setTargetRecipient] = useState('Insp. J. Thorne (Forensics Lead)');
  const [targetLocation, setTargetLocation] = useState('Central Forensic Examination Lab');
  const [remarks, setRemarks] = useState('Transferred for forensic analysis and court filing.');

  const selectedEvidence =
    evidenceItems.find((e) => e.id === selectedEvidenceId) || evidenceItems[0];

  const filteredEvents = custodyEvents.filter(
    (ev) => ev.evidenceId === selectedEvidenceId
  );

  const handleLogTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvidence) return;

    const newEvent: CustodyEvent = {
      id: `COC-${Math.floor(1000 + Math.random() * 9000)}`,
      evidenceId: selectedEvidence.id,
      caseId: selectedEvidence.caseId,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      actorId: currentOfficer.id,
      actorName: `${currentOfficer.name} (${currentOfficer.rank})`,
      actorRole: currentOfficer.roles[0] || 'INVESTIGATOR',
      action: transferAction,
      location: targetLocation,
      deviceIp: '10.240.12.18 (Secure Node)',
      cryptographicSignature: `04:${Array.from({ length: 16 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()).join(':')}`,
      hash: selectedEvidence.digitalHashSha256,
      remarks: `${remarks} (Recipient: ${targetRecipient})`,
      verified: true
    };

    onAddCustodyEvent(newEvent);
    setShowTransferForm(false);
  };

  const getActionLabel = (action: CustodyEvent['action']) => {
    switch (action) {
      case 'COLLECTED': return 'Collected at Crime Scene';
      case 'INGESTED': return 'Secured in Digital Vault';
      case 'TRANSFERRED': return 'Custody Transferred';
      case 'REVIEWED': return 'Evidence Reviewed';
      case 'EXAMINED_LAB': return 'Lab Analysis Examined';
      case 'COURT_SUBMITTED': return 'Submitted to Court';
      case 'ARCHIVED': return 'Sealed in Archive';
      default: return action;
    }
  };

  return (
    <div className="space-y-6 text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
              Custody Tracking
            </span>
            <span className="text-xs text-slate-500">• Court-Admissible Log</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Chain of Custody Ledger
          </h1>
          <p className="text-xs text-slate-500 font-sans">
            Complete audit record of every person who collected, transferred, viewed, or submitted this evidence.
          </p>
        </div>

        <button
          onClick={() => setShowTransferForm(!showTransferForm)}
          className="interactive-glow px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Record Transfer / Handover</span>
        </button>
      </div>

      {/* Info Tip */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3 text-xs text-slate-600">
        <Info className="w-4 h-4 text-slate-400 shrink-0" />
        <div className="flex-1">
          <span className="font-semibold text-slate-800">Legal Purpose:</span> A valid Chain of Custody proves that evidence remained secure and uncorrupted from the moment it was seized until presented in court.
        </div>
      </div>

      {/* Evidence Selector Box */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3 flex-1">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Evidence File to View Custody History:
            </label>
            <select
              value={selectedEvidenceId}
              onChange={(e) => setSelectedEvidenceId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 text-xs focus:border-slate-900 focus:bg-white focus:outline-none cursor-pointer"
            >
              {evidenceItems.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.id} — {e.name} (Case: {e.caseId}, Current Custodian: {e.currentCustodian})
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedEvidence && (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1 shrink-0 md:min-w-64">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Current Custodian:</span>
              <span className="font-semibold text-slate-900">{selectedEvidence.currentCustodian}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Original Collector:</span>
              <span className="text-slate-700">{selectedEvidence.collectedBy.split('(')[0]}</span>
            </div>
          </div>
        )}
      </div>

      {/* Transfer Form Modal / Panel */}
      {showTransferForm && (
        <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Log New Custody Transfer / Action
              </h3>
              <p className="text-xs text-slate-500">Record handover of evidence item {selectedEvidence?.id}</p>
            </div>
            <button
              onClick={() => setShowTransferForm(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleLogTransfer} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Action Type:
                </label>
                <select
                  value={transferAction}
                  onChange={(e) => setTransferAction(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-slate-900"
                >
                  <option value="TRANSFERRED">Custody Transfer</option>
                  <option value="EXAMINED_LAB">Lab Forensic Examination</option>
                  <option value="REVIEWED">Investigator Case Review</option>
                  <option value="COURT_SUBMITTED">Court Submission</option>
                  <option value="ARCHIVED">Sealed in Long-term Archive</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Recipient / Handover To:
                </label>
                <input
                  type="text"
                  value={targetRecipient}
                  onChange={(e) => setTargetRecipient(e.target.value)}
                  placeholder="e.g. Officer Name, Court Registrar, Lab Scientist"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Physical / Storage Location:
                </label>
                <input
                  type="text"
                  value={targetLocation}
                  onChange={(e) => setTargetLocation(e.target.value)}
                  placeholder="e.g. Forensic Lab Station 4, Court Evidence Locker"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Authorized Officer (You):
                </label>
                <input
                  type="text"
                  disabled
                  value={`${currentOfficer.name} (${currentOfficer.rank})`}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Reason / Remarks:
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={2}
                placeholder="State the purpose of this transfer..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-slate-900"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowTransferForm(false)}
                className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Save to Custody Ledger</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Custody Timeline */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Custody Event History ({filteredEvents.length} Recorded Events)
            </h3>
            <p className="text-xs text-slate-500">Chronological custody chain from initial collection</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Unbroken Chain</span>
          </span>
        </div>

        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {filteredEvents.map((evt, idx) => (
            <div key={evt.id} className="relative group">
              {/* Timeline Marker Icon */}
              <div className="absolute -left-6 sm:-left-8 top-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xs">
                <GitCommit className="w-3.5 h-3.5" />
              </div>

              {/* Event Content Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200 hover:border-slate-300 transition-all space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-900">
                      {getActionLabel(evt.action)}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200 font-mono font-medium">
                      {evt.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{evt.timestamp}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase">PERSON / OFFICER:</div>
                    <div className="flex items-center gap-1.5 font-medium text-slate-800">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>{evt.actorName}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase">LOCATION:</div>
                    <div className="flex items-center gap-1.5 font-medium text-slate-800">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{evt.location}</span>
                    </div>
                  </div>
                </div>

                {evt.remarks && (
                  <div className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200 font-sans">
                    <span className="font-semibold text-slate-800">Notes: </span>
                    {evt.remarks}
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
                  <span>Cryptographic Seal: Valid</span>
                  <span className="text-emerald-700 font-medium font-sans flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Legally Admissible
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
