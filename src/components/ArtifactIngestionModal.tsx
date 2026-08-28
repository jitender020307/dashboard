import React, { useState } from 'react';
import {
  X,
  UploadCloud,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Terminal,
  Play,
  RotateCcw
} from 'lucide-react';
import { EvidenceItem, ClassificationLevel, EvidenceType } from '../types';

interface ArtifactIngestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIngestSuccess: (newEvidence: EvidenceItem) => void;
  caseIdList: string[];
}

const INGESTION_STEPS = [
  { step: 1, title: 'FILE SELECTED', desc: 'Acquire raw bitstream and engage hardware write-blocker' },
  { step: 2, title: 'VALIDATION', desc: 'Analyze magic bytes & MIME header signature' },
  { step: 3, title: 'METADATA', desc: 'Extract EXIF, creation timestamp, system inode attributes' },
  { step: 4, title: 'MALWARE SCAN', desc: 'Execute zero-day signature heuristic analysis via YARA rules' },
  { step: 5, title: 'SHA-256 HASH', desc: 'Calculate cryptographic hash digest for immutable fingerprint' },
  { step: 6, title: 'ENCRYPTION', desc: 'Apply AES-256-GCM envelope encryption' },
  { step: 7, title: 'STORAGE', desc: 'Commit write-locked block to immutable pool' },
  { step: 8, title: 'AUDIT LOG', desc: 'Log timestamped immutable event in forensic ledger' },
  { step: 9, title: 'CUSTODY BLOCK', desc: 'Generate genesis digital custody block with officer signature' }
];

export const ArtifactIngestionModal: React.FC<ArtifactIngestionModalProps> = ({
  isOpen,
  onClose,
  onIngestSuccess,
  caseIdList,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('FIR_Evidence_Capture_01.pdf');
  const [fileType, setFileType] = useState<EvidenceType>('DOC_PDF');
  const [caseId, setCaseId] = useState(caseIdList[0] || '#INV-2026-00421');
  const [classification, setClassification] = useState<ClassificationLevel>('TOP SECRET');
  const [description, setDescription] = useState('Seized digital evidence artifact submitted for statutory court admissibility.');
  
  // Pipeline Execution State
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0 = idle, 1..9 = step in progress, 10 = completed
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'officer@secure-dms:~$ initialized ingestion pipeline daemon [SCIF Node 78B]'
  ]);
  const [generatedHash, setGeneratedHash] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileName(file.name);
      
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'pdf') setFileType('DOC_PDF');
      else if (['mp4', 'mov', 'avi'].includes(ext || '')) setFileType('VIDEO_SURVEILLANCE');
      else if (['flac', 'mp3', 'wav'].includes(ext || '')) setFileType('AUDIO_INTERCEPT');
      else if (['e01', 'raw', 'dd', 'img'].includes(ext || '')) setFileType('DIGITAL_STORAGE');
      else if (['bin', 'dmp'].includes(ext || '')) setFileType('MEMORY_DUMP');
      else setFileType('DOC_SCAN');
    }
  };

  const startIngestionPipeline = () => {
    setIsProcessing(true);
    setCurrentStep(1);
    
    // Generate realistic SHA-256
    const randomHash = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16).toUpperCase()
    ).join('');
    setGeneratedHash(randomHash);

    const logs = [
      'officer@secure-dms:~$ ingest evidence --write-blocker=engaged',
      `> Step 1/9: File "${fileName}" locked in read-only write-blocker buffer...`,
    ];
    setTerminalLogs(logs);

    // Sequence through the 9 steps
    const stepDelays = [
      { step: 2, log: '> Step 2/9: Magic bytes verified. MIME type matched specification [application/octet-stream]...', delay: 500 },
      { step: 3, log: '> Step 3/9: Extracting inode attributes, EXIF tags, creation timestamps...', delay: 1000 },
      { step: 4, log: '> Step 4/9: ClamAV & YARA heuristic scan passed: ZERO MALWARE DETECTED...', delay: 1500 },
      { step: 5, log: `> Step 5/9: Cryptographic digest computed: SHA-256 -> ${randomHash.slice(0, 32)}...`, delay: 2000 },
      { step: 6, log: '> Step 6/9: Encrypting payload via AES-256-GCM with hardware HSM envelope key...', delay: 2500 },
      { step: 7, log: '> Step 7/9: Committing bitstream to immutable read-only vault storage...', delay: 3000 },
      { step: 8, log: '> Step 8/9: Cryptographic audit trail event registered in tamper-evident ledger...', delay: 3500 },
      { step: 9, log: '> Step 9/9: Genesis Chain of Custody block signed by Lead Examiner IO-1042...', delay: 4000 },
      { step: 10, log: 'RESULT: ✓ ARTIFACT SECURED // COMPLIANT WITH SECTION 65B INDIAN EVIDENCE ACT', delay: 4500 }
    ];

    stepDelays.forEach(({ step, log, delay }) => {
      setTimeout(() => {
        setCurrentStep(step);
        setTerminalLogs((prev) => [...prev, log]);

        if (step === 10) {
          setIsProcessing(false);
          // Create the new evidence item
          const newEv: EvidenceItem = {
            id: `EV-2026-${Math.floor(10000 + Math.random() * 90000)}`,
            caseId: caseId,
            name: fileName,
            type: fileType,
            description: description,
            collectedDate: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
            collectedBy: 'IO-1042 (Special Agent K. Vance)',
            currentCustodian: 'Vault Secure Storage Node 78B',
            locationFound: 'Cyber Forensic Ingestion Port 4',
            status: 'IN_VAULT',
            classification: classification,
            digitalHashSha256: randomHash,
            currentHashSha256: randomHash,
            digitalHashVerified: true,
            isTampered: false,
            encryptionStatus: 'AES-256-GCM',
            signatureStatus: 'VALID',
            signerName: 'Lead Examiner Special Agent K. Vance',
            storageLocker: 'VAULT-LOCKER-ALPHA-01',
            fileSize: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : '18.4 MB',
            fileExtension: `.${fileName.split('.').pop() || 'dat'}`,
            metadata: {
              fileName: fileName,
              fileSize: selectedFile ? `${selectedFile.size} bytes` : '19,293,798 bytes',
              mimeType: selectedFile?.type || 'application/pdf',
              fileExtension: `.${fileName.split('.').pop() || 'pdf'}`,
              sha256: randomHash,
              creationDate: new Date().toISOString(),
              uploadDate: new Date().toISOString(),
              author: 'Special Agent K. Vance',
              fileSystem: 'ZFS Immutable (Read-Only Pool)',
              writeBlockerUsed: 'Tableau T8u Hardware USB 3.0 Bridge'
            }
          };
          onIngestSuccess(newEv);
        }
      }, delay);
    });
  };

  const handleReset = () => {
    setIsProcessing(false);
    setCurrentStep(0);
    setTerminalLogs(['officer@secure-dms:~$ ready for next artifact ingestion']);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-xl max-w-4xl w-full text-slate-900 shadow-2xl overflow-hidden font-technical">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shadow-2xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 tracking-wider">
                  FORENSIC ARTIFACT INGESTION PIPELINE
                </h2>
                <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-semibold">
                  IMMUTABLE
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-sans">
                SECURE-DMS // DIGITAL EVIDENCE SECUREMENT STANDARD (SIH-26190)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Important Notice */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3 text-xs text-slate-700 font-sans">
            <Lock className="w-4 h-4 text-slate-500 shrink-0" />
            <span>
              <strong>FORENSIC RULE:</strong> The original evidence is read via hardware write-blocker and is <strong>never modified</strong> during ingestion. A SHA-256 hash digest is generated prior to AES-256-GCM encryption.
            </span>
          </div>

          {currentStep === 0 ? (
            /* Config & Upload Form */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Form */}
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1 uppercase tracking-wider text-[11px]">
                    TARGET INVESTIGATION DOCKET
                  </label>
                  <select
                    value={caseId}
                    onChange={(e) => setCaseId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none font-mono cursor-pointer"
                  >
                    {caseIdList.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1 uppercase tracking-wider text-[11px]">
                    ARTIFACT FILE NAME
                  </label>
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1 uppercase tracking-wider text-[11px]">
                      EVIDENCE TYPE
                    </label>
                    <select
                      value={fileType}
                      onChange={(e) => setFileType(e.target.value as EvidenceType)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none text-[11px] cursor-pointer"
                    >
                      <option value="DOC_PDF">PDF Document</option>
                      <option value="DOC_SCAN">Scanned Legal Record</option>
                      <option value="DIGITAL_STORAGE">Disk Image (.E01 / .RAW)</option>
                      <option value="VIDEO_SURVEILLANCE">CCTV Video (.MP4 / 4K)</option>
                      <option value="AUDIO_INTERCEPT">Audio Intercept (.FLAC)</option>
                      <option value="MEMORY_DUMP">RAM Memory Dump (.BIN)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1 uppercase tracking-wider text-[11px]">
                      CLASSIFICATION
                    </label>
                    <select
                      value={classification}
                      onChange={(e) => setClassification(e.target.value as ClassificationLevel)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-semibold focus:border-slate-900 focus:bg-white focus:outline-none text-[11px] cursor-pointer"
                    >
                      <option value="TOP SECRET">TOP SECRET</option>
                      <option value="RESTRICTED">RESTRICTED</option>
                      <option value="CONFIDENTIAL">CONFIDENTIAL</option>
                      <option value="UNCLASSIFIED">UNCLASSIFIED</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1 uppercase tracking-wider text-[11px]">
                    FORENSIC SUMMARY & SEIZURE CONTEXT
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none font-sans text-xs"
                  />
                </div>
              </div>

              {/* Right Drag & Drop File Zone */}
              <div className="flex flex-col justify-between space-y-4">
                <div className="border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-xl p-6 bg-slate-50 flex flex-col items-center justify-center text-center cursor-pointer transition-all relative group">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <UploadCloud className="w-10 h-10 text-slate-400 mb-2 group-hover:scale-105 transition-transform" />
                  <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                    {selectedFile ? selectedFile.name : 'CLICK OR DRAG EVIDENCE FILE TO ACQUIRE'}
                  </span>
                  <span className="text-[11px] text-slate-500 font-sans mt-1">
                    Accepts PDF, DOCX, E01, MP4, FLAC, RAW, BIN
                  </span>
                  {selectedFile && (
                    <span className="mt-2 text-[11px] text-emerald-700 font-semibold font-mono">
                      Ready: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  )}
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-[11px] text-slate-600 space-y-1.5 font-sans">
                  <div className="flex items-center justify-between text-slate-800 font-medium">
                    <span>CUSTODIAL EXAMINER:</span>
                    <span className="font-mono text-slate-900 font-semibold">IO-1042 (Agent Vance)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>SECURITY ENVELOPE:</span>
                    <span className="font-mono text-slate-800">AES-256-GCM + SHA-256</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>LEGAL ADMISSIBILITY:</span>
                    <span className="text-slate-700">Sec 65B Indian Evidence Act</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Live 9-Step Sequence & Terminal Output */
            <div className="space-y-6">
              {/* 9-Step Progress Visualizer */}
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
                {INGESTION_STEPS.map((s) => {
                  const isDone = currentStep > s.step || currentStep === 10;
                  const isCurrent = currentStep === s.step;

                  return (
                    <div
                      key={s.step}
                      className={`p-2 rounded-lg border text-center transition-all ${
                        isDone
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : isCurrent
                          ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <div className="text-[9px] font-mono font-bold">STEP {s.step}</div>
                      <div className="text-[10px] font-semibold truncate mt-0.5">{s.title}</div>
                      {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mx-auto mt-1" />}
                    </div>
                  );
                })}
              </div>

              {/* Live Terminal Log Box */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-200 h-52 overflow-y-auto space-y-1 shadow-inner">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-2 text-slate-300 text-[11px] font-semibold">
                  <Terminal className="w-3.5 h-3.5 text-slate-400" />
                  <span>FORENSIC INGESTION LOG</span>
                </div>
                {terminalLogs.map((log, idx) => (
                  <div key={idx} className="leading-relaxed">
                    {log.startsWith('RESULT:') ? (
                      <span className="text-emerald-400 font-semibold">{log}</span>
                    ) : log.startsWith('officer@') ? (
                      <span className="text-slate-200 font-bold">{log}</span>
                    ) : (
                      <span className="text-slate-400">{log}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Completion Banner */}
              {currentStep === 10 && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>EVIDENCE SECURED AND COMMITTED TO IMMUTABLE VAULT</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-700">
                      SHA-256: <strong className="text-slate-900">{generatedHash.slice(0, 36)}...</strong>
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
                  >
                    VIEW IN EVIDENCE VAULT
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 font-mono">
            STATUS: {isProcessing ? 'PROCESSING PIPELINE...' : currentStep === 10 ? 'INGESTION COMPLETE' : 'READY TO INGEST'}
          </div>

          <div className="flex items-center gap-3">
            {currentStep === 0 ? (
              <>
                <button
                  onClick={onClose}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  onClick={startIngestionPipeline}
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>START INGESTION</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleReset}
                disabled={isProcessing}
                className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>INGEST ANOTHER ARTIFACT</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
