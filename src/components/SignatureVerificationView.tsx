import React, { useState } from 'react';
import {
  FileCheck2,
  KeyRound,
  AlertOctagon,
  Search,
  Stamp
} from 'lucide-react';
import { EvidenceItem, OfficerProfile } from '../types';

interface SignatureVerificationViewProps {
  evidenceItems: EvidenceItem[];
  currentOfficer: OfficerProfile;
  onSignEvidence: (id: string, signerName: string) => void;
}

export const SignatureVerificationView: React.FC<SignatureVerificationViewProps> = ({
  evidenceItems,
  currentOfficer,
  onSignEvidence,
}) => {
  const [selectedId, setSelectedId] = useState<string>(
    evidenceItems[0]?.id || 'EV-2026-00421'
  );
  const [isSigning, setIsSigning] = useState(false);
  const [simulatedInvalid, setSimulatedInvalid] = useState(false);

  const selectedEvidence =
    evidenceItems.find((e) => e.id === selectedId) || evidenceItems[0];

  const handleSign = () => {
    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      if (selectedEvidence) {
        onSignEvidence(selectedEvidence.id, `${currentOfficer.name} (${currentOfficer.rank})`);
      }
    }, 600);
  };

  const isSigValid = !simulatedInvalid && selectedEvidence?.signatureStatus === 'VALID';

  return (
    <div className="space-y-6 font-technical text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold tracking-wider uppercase">
              MODULE 11 // DIGITAL SIGNATURE VERIFICATION
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-emerald-700 text-[10px] font-semibold">
              ● PKI AUTHORITY ONLINE
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-wider mt-1">
            DIGITAL SIGNATURE VALIDATOR
          </h1>
          <p className="text-xs text-slate-500 font-sans">
            Asymmetric RSA-4096 and ECDSA P-384 digital signature verification for legal non-repudiation
          </p>
        </div>

        <button
          onClick={() => setSimulatedInvalid(!simulatedInvalid)}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all border shrink-0 cursor-pointer ${
            simulatedInvalid
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
              : 'bg-white hover:bg-rose-50 text-rose-700 border-rose-200 shadow-2xs'
          }`}
        >
          {simulatedInvalid ? 'RESTORE STATUS' : 'SIMULATE INVALID SIGNATURE'}
        </button>
      </div>

      {/* Target Evidence Selector Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3 flex-1">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="flex-1">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              SELECT EVIDENCE ARTIFACT FOR PKI SIGNATURE AUDIT
            </label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 text-xs font-mono focus:border-slate-900 focus:bg-white focus:outline-none cursor-pointer"
            >
              {evidenceItems.map((e) => (
                <option key={e.id} value={e.id}>
                  [{e.id}] {e.name} — {e.caseId} (Signed by: {e.signerName || 'Pending'})
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleSign}
          disabled={isSigning}
          className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-xs shrink-0 cursor-pointer disabled:opacity-50"
        >
          <Stamp className="w-4 h-4" />
          <span>{isSigning ? 'SIGNING VIA HSM...' : 'ATTACH DIGITAL SIGNATURE'}</span>
        </button>
      </div>

      {selectedEvidence && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Cryptographic Signature Dossier */}
          <div className="lg:col-span-2 space-y-6">
            <div className={`p-6 rounded-xl border transition-all shadow-xs ${
              isSigValid
                ? 'bg-white border-slate-200'
                : 'bg-rose-50/50 border-rose-300'
            }`}>
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                    isSigValid
                      ? 'bg-slate-100 border-slate-200 text-slate-700'
                      : 'bg-rose-100 border-rose-200 text-rose-700'
                  }`}>
                    {isSigValid ? <FileCheck2 className="w-5 h-5" /> : <AlertOctagon className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      SIGNATURE ATTESTATION RECORD
                    </h3>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Target: {selectedEvidence.name} [{selectedEvidence.id}]
                    </div>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded text-xs font-semibold font-mono border ${
                  isSigValid
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-rose-100 text-rose-800 border-rose-200'
                }`}>
                  {isSigValid ? 'VALID SIGNATURE' : 'INVALID SIGNATURE'}
                </span>
              </div>

              {/* Signature Matrix Details */}
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">AUTHORIZED SIGNER:</span>
                    <span className="text-slate-900 font-bold font-mono">
                      {selectedEvidence.signerName || currentOfficer.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">SIGNER ROLE:</span>
                    <span className="text-slate-800 font-mono font-medium">Authorized Investigation Officer</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">ALGORITHM:</span>
                    <span className="text-slate-800 font-mono font-medium">ECDSA P-384 / SHA-256</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">CERTIFICATE AUTHORITY:</span>
                    <span className="text-slate-800 font-mono">Federal Law Enforcement Root CA</span>
                  </div>
                </div>

                {/* Hash & Signature Digest */}
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">BOUND DOCUMENT HASH:</span>
                    <span className="text-slate-900 font-mono text-xs break-all font-semibold">
                      {selectedEvidence.digitalHashSha256}
                    </span>
                  </div>
                  <div className="border-t border-slate-200 pt-2">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">PUBLIC KEY FINGERPRINT:</span>
                    <span className="text-slate-700 font-mono text-xs break-all">
                      {currentOfficer.publicKey}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Statutory Compliance Matrix */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                JUDICIAL NON-REPUDIATION ATTESTATION
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                This digital signature complies with statutory provisions under the Information Technology Act (Certifying Authorities Rules) and the Indian Evidence Act, affirming that the authorized officer examined and locked this specific bitstream artifact without subsequent modification.
              </p>
            </div>
          </div>

          {/* Right 1 Col: Active Signer Token Info */}
          <div className="space-y-6">
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-slate-600" />
                <span>OFFICER HARDWARE TOKEN</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">OFFICER:</span>
                  <span className="text-slate-900 font-mono font-bold">{currentOfficer.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">BADGE ID:</span>
                  <span className="text-slate-800 font-mono">{currentOfficer.id}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">CLEARANCE:</span>
                  <span className="text-slate-800 font-semibold">{currentOfficer.clearanceName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">SECURITY ENCLAVE:</span>
                  <span className="text-slate-800 font-mono">FIPS 140-3 HSM Level 3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
