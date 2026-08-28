import React, { useState, useEffect } from 'react';
import {
  Menu,
  Filter,
  Plus,
  Search,
  FolderKanban,
  X,
  Lock,
  Radio,
  SlidersHorizontal,
  Terminal,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Zap,
  RotateCcw
} from 'lucide-react';
import {
  CaseItem,
  SecurityAlert,
  OfficerProfile,
  EvidenceItem,
  CustodyEvent,
  AuditEvent,
  SecurityThreat,
  AIForensicAnalysis,
  ActiveSession,
  ForensicStats,
  ClassificationLevel
} from './types';
import { INITIAL_CASES, INITIAL_ALERTS, CURRENT_OFFICER } from './data/mockData';
import {
  INITIAL_EVIDENCE_ITEMS,
  INITIAL_CUSTODY_EVENTS,
  INITIAL_AUDIT_EVENTS,
  INITIAL_THREATS,
  INITIAL_AI_ANALYSES,
  INITIAL_ACTIVE_SESSIONS,
  INITIAL_FORENSIC_STATS
} from './data/forensicData';

import { Sidebar, AppTab } from './components/Sidebar';
import { CaseCard } from './components/CaseCard';
import { CaseDetailModal } from './components/CaseDetailModal';
import { FilterModal, FilterOptions } from './components/FilterModal';
import { NewCaseModal } from './components/NewCaseModal';
import { DashboardView } from './components/DashboardView';
import { DocumentsView } from './components/DocumentsView';
import { AlertsView } from './components/AlertsView';
import { UserProfileModal, LockScreen } from './components/UserProfileModal';

// Forensic Module Views & Components
import { CyberForensicsDashboard } from './components/CyberForensicsDashboard';
import { DigitalEvidenceVaultView } from './components/DigitalEvidenceVaultView';
import { IntegrityEngineView } from './components/IntegrityEngineView';
import { ChainOfCustodyView } from './components/ChainOfCustodyView';
import { ThreatMonitorView } from './components/ThreatMonitorView';
import { NeuralForensicsView } from './components/NeuralForensicsView';
import { SignatureVerificationView } from './components/SignatureVerificationView';
import { SecurityTimelineView } from './components/SecurityTimelineView';
import { AccessControlView } from './components/AccessControlView';
import { ArtifactIngestionModal } from './components/ArtifactIngestionModal';
import { MetadataForensicsModal } from './components/MetadataForensicsModal';
import { HackerTerminal } from './components/HackerTerminal';
import { GlobalSpotlightProvider } from './components/InteractiveSpotlight';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');

  // Existing Data State
  const [cases, setCases] = useState<CaseItem[]>(INITIAL_CASES);
  const [alerts, setAlerts] = useState<SecurityAlert[]>(INITIAL_ALERTS);
  const [officer, setOfficer] = useState<OfficerProfile>(CURRENT_OFFICER);

  // Forensics Data State
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>(INITIAL_EVIDENCE_ITEMS);
  const [custodyEvents, setCustodyEvents] = useState<CustodyEvent[]>(INITIAL_CUSTODY_EVENTS);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(INITIAL_AUDIT_EVENTS);
  const [threats, setThreats] = useState<SecurityThreat[]>(INITIAL_THREATS);
  const [aiAnalyses, setAiAnalyses] = useState<Record<string, AIForensicAnalysis>>(INITIAL_AI_ANALYSES);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>(INITIAL_ACTIVE_SESSIONS);
  const [stats, setStats] = useState<ForensicStats>(INITIAL_FORENSIC_STATS);

  // Modals & Overlays
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isNewCaseOpen, setIsNewCaseOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // Forensic Specific Modals & State
  const [isIngestionOpen, setIsIngestionOpen] = useState(false);
  const [selectedMetadataItem, setSelectedMetadataItem] = useState<EvidenceItem | null>(null);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [integritySelectedId, setIntegritySelectedId] = useState<string>('EV-2026-00421');
  const [custodySelectedId, setCustodySelectedId] = useState<string>('EV-2026-00421');
  const [neuralSelectedId, setNeuralSelectedId] = useState<string>('EV-2026-00421');

  // Temporary Toast Notification for RBAC & Demo Alerts
  const [toastMessage, setToastMessage] = useState<{
    type: 'SUCCESS' | 'ALERT' | 'DENIED';
    title: string;
    description: string;
  } | null>(null);

  const showToast = (type: 'SUCCESS' | 'ALERT' | 'DENIED', title: string, description: string) => {
    setToastMessage({ type, title, description });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Keyboard shortcut for CLI Terminal (~ or F12)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName?.toUpperCase();
      if (e.key === '`' && !e.shiftKey && targetTag !== 'INPUT' && targetTag !== 'TEXTAREA') {
        e.preventDefault();
        setIsTerminalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update Stats when Evidence changes
  useEffect(() => {
    const tamperedCount = evidenceItems.filter((e) => e.isTampered).length;
    const verifiedPercent =
      evidenceItems.length > 0
        ? Math.round(((evidenceItems.length - tamperedCount) / evidenceItems.length) * 100)
        : 100;
    const activeThreatsCount = threats.filter((t) => t.status === 'ACTIVE').length;

    setStats((prev) => ({
      ...prev,
      totalEvidenceItems: evidenceItems.length,
      tamperAlertsCount: tamperedCount,
      integrityVerifiedPercent: verifiedPercent,
      activeThreats: activeThreatsCount,
    }));
  }, [evidenceItems, threats]);

  // Filters for Legal Cases Tab
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    status: 'ALL',
    classification: 'ALL',
    leadOfficer: 'ALL',
    minEvidence: 0,
  });

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      status: 'ALL',
      classification: 'ALL',
      leadOfficer: 'ALL',
      minEvidence: 0,
    });
  };

  const filteredCases = cases.filter((c) => {
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const matchId = c.id.toLowerCase().includes(q);
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchSummary = c.summary.toLowerCase().includes(q);
      const matchSuspect = c.suspects.some(
        (s) =>
          s.name.toLowerCase().includes(q) || s.alias.toLowerCase().includes(q)
      );
      const matchTag = c.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchId && !matchTitle && !matchSummary && !matchSuspect && !matchTag) {
        return false;
      }
    }

    if (filters.status !== 'ALL' && c.status !== filters.status) return false;
    if (filters.classification !== 'ALL' && c.classification !== filters.classification) return false;
    if (filters.leadOfficer !== 'ALL' && c.leadOfficer.id !== filters.leadOfficer) return false;

    return true;
  });

  // --- FORENSIC HANDLERS ---

  // 1. Verify Evidence Hash
  const handleVerifyEvidence = (id: string) => {
    setEvidenceItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const isMatched = item.digitalHashSha256 === item.currentHashSha256;
          return {
            ...item,
            digitalHashVerified: isMatched,
            isTampered: !isMatched,
          };
        }
        return item;
      })
    );

    const target = evidenceItems.find((e) => e.id === id);
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

    if (target?.isTampered || (target && target.digitalHashSha256 !== target.currentHashSha256)) {
      const newAudit: AuditEvent = {
        id: `AUD-${Date.now().toString().slice(-4)}`,
        timestamp: now,
        user: officer.name,
        role: officer.roles[0],
        action: 'HASH_MISMATCH',
        severity: 'CRITICAL',
        result: 'ALERT',
        caseId: target.caseId,
        evidenceId: target.id,
        ip: '10.240.12.18',
        device: 'SCIF Ingestion Node 78B',
        details: `Integrity check FAILED for ${target.name}. Authoritative Hash mismatch with bitstream.`
      };
      setAuditEvents((prev) => [newAudit, ...prev]);
      showToast('ALERT', 'CRITICAL INTEGRITY FAILURE', `SHA-256 Hash Mismatch detected in ${target.name}`);
    } else {
      const newAudit: AuditEvent = {
        id: `AUD-${Date.now().toString().slice(-4)}`,
        timestamp: now,
        user: officer.name,
        role: officer.roles[0],
        action: 'HASH_VERIFIED',
        severity: 'INFO',
        result: 'SUCCESS',
        caseId: target?.caseId,
        evidenceId: target?.id,
        ip: '10.240.12.18',
        device: 'SCIF Ingestion Node 78B',
        details: `SHA-256 Bitstream integrity verified (100% Match) for ${target?.name}.`
      };
      setAuditEvents((prev) => [newAudit, ...prev]);
      showToast('SUCCESS', 'INTEGRITY VERIFIED', `100% SHA-256 Bitstream match confirmed for ${target?.name}`);
    }
  };

  // 2. Simulate Tampering (SIH Demo Mode)
  const handleSimulateTamper = (id: string) => {
    const alteredHash = 'E99A77F21884B0298BEE98F1100C4D9A019842F8091E23CD495109BC8811AC92';
    
    setEvidenceItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            currentHashSha256: alteredHash,
            isTampered: true,
            digitalHashVerified: false,
          };
        }
        return item;
      })
    );

    const target = evidenceItems.find((e) => e.id === id);
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

    const newAudit: AuditEvent = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: now,
      user: 'SIMULATED_ADVERSARY (DEMO)',
      role: 'UNAUTHORIZED_INTRUDER',
      action: 'HASH_MISMATCH',
      severity: 'CRITICAL',
      result: 'ALERT',
      caseId: target?.caseId,
      evidenceId: target?.id,
      ip: '198.51.100.42',
      device: 'Rogue External Terminal',
      details: `UNAUTHORIZED BITSTREAM ALTERATION DETECTED on ${target?.name}. Immediate containment triggered.`
    };
    setAuditEvents((prev) => [newAudit, ...prev]);

    // Also trigger SOC Threat
    const newThreat: SecurityThreat = {
      id: `THR-2026-${Date.now().toString().slice(-3)}`,
      timestamp: now,
      severity: 'CRITICAL',
      title: `Hash Mismatch & Unauthorized Mutation on ${target?.id}`,
      description: `Bitstream checksum discrepancy detected on immutable vault locker. Potential forensic tampering underway.`,
      sourceIp: '198.51.100.42 (Rogue Tor Exit Node)',
      targetResource: `Locker Alpha / ${target?.name}`,
      status: 'ACTIVE',
      vector: 'Direct Inode Manipulation / Unauthorized Write Attempt',
    };
    setThreats((prev) => [newThreat, ...prev]);

    showToast('ALERT', 'CRITICAL TAMPERING DETECTED', `Simulated byte corruption in ${target?.name}. Security containment locked!`);
  };

  // 3. Restore Evidence
  const handleRestoreEvidence = (id: string) => {
    setEvidenceItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            currentHashSha256: item.digitalHashSha256,
            isTampered: false,
            digitalHashVerified: true,
          };
        }
        return item;
      })
    );

    const target = evidenceItems.find((e) => e.id === id);
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

    const newAudit: AuditEvent = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: now,
      user: officer.name,
      role: officer.roles[0],
      action: 'HASH_VERIFIED',
      severity: 'INFO',
      result: 'SUCCESS',
      caseId: target?.caseId,
      evidenceId: target?.id,
      ip: '10.240.12.18',
      device: 'SCIF Ingestion Node 78B',
      details: `Original bitstream restored from Genesis ZFS write-blocked snapshot for ${target?.name}.`
    };
    setAuditEvents((prev) => [newAudit, ...prev]);
    showToast('SUCCESS', 'INTEGRITY RESTORED', `Authoritative Genesis bitstream restored for ${target?.name}`);
  };

  // 4. Ingestion Pipeline Complete
  const handleIngestSuccess = (newEvidence: EvidenceItem) => {
    setEvidenceItems((prev) => [newEvidence, ...prev]);
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

    // Log Audit Event
    const newAudit: AuditEvent = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: now,
      user: officer.name,
      role: officer.roles[0],
      action: 'UPLOAD',
      severity: 'INFO',
      result: 'SUCCESS',
      caseId: newEvidence.caseId,
      evidenceId: newEvidence.id,
      ip: '10.240.12.18',
      device: 'Tableau T8u Hardware Write-Blocker',
      details: `New digital evidence artifact ingested: ${newEvidence.name} (SHA-256 calculated, AES-256 encrypted).`
    };
    setAuditEvents((prev) => [newAudit, ...prev]);

    // Create Initial Custody Event
    const genesisCustody: CustodyEvent = {
      id: `COC-${Math.floor(1000 + Math.random() * 9000)}`,
      evidenceId: newEvidence.id,
      caseId: newEvidence.caseId,
      timestamp: now,
      actorId: officer.id,
      actorName: `${officer.name} (${officer.rank})`,
      actorRole: officer.roles[0],
      action: 'INGESTED',
      location: 'Cyber Forensic Ingestion Port 4',
      deviceIp: '10.240.12.18',
      cryptographicSignature: `04:AF:89:12:${Array.from({ length: 8 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(':').toUpperCase()}`,
      hash: newEvidence.digitalHashSha256,
      remarks: 'Genesis artifact ingestion via hardware write-blocker under Sec 65B Indian Evidence Act.',
      verified: true,
    };
    setCustodyEvents((prev) => [genesisCustody, ...prev]);

    showToast('SUCCESS', 'ARTIFACT INGESTED & SECURED', `${newEvidence.name} added to Immutable Vault with SHA-256 hash.`);
  };

  // 5. Add Custody Transfer Event
  const handleAddCustodyEvent = (event: CustodyEvent) => {
    setCustodyEvents((prev) => [event, ...prev]);
    const newAudit: AuditEvent = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: event.timestamp,
      user: event.actorName,
      role: event.actorRole,
      action: 'EVIDENCE_TRANSFERRED',
      severity: 'INFO',
      result: 'SUCCESS',
      caseId: event.caseId,
      evidenceId: event.evidenceId,
      ip: event.deviceIp,
      device: 'SCIF Enclave Node',
      details: `Custody transferred for ${event.evidenceId}: ${event.remarks}`
    };
    setAuditEvents((prev) => [newAudit, ...prev]);
    showToast('SUCCESS', 'CUSTODY EVENT LOGGED', `Transfer block cryptographically signed and committed.`);
  };

  // 6. Threat Mitigation
  const handleMitigateThreat = (id: string, action: string) => {
    setThreats((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: (action as any),
              actionTaken: `Mitigated by ${officer.name} via autonomous IP quarantine rule.`,
            }
          : t
      )
    );
    showToast('SUCCESS', 'THREAT MITIGATED', `Quarantine rule applied to threat vector ${id}`);
  };

  // 7. Trigger Simulated Intrusion Probe (Demo)
  const handleSimulateNewThreat = () => {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    const fakeIp = `185.220.101.${Math.floor(10 + Math.random() * 80)}`;

    const newThreat: SecurityThreat = {
      id: `THR-2026-${Date.now().toString().slice(-3)}`,
      timestamp: now,
      severity: 'HIGH',
      title: 'Credential Stuffing & Lateral Probe Detected',
      description: 'Multiple automated token authentication failures originating from an unapproved offshore subnet targeting Case Docket archives.',
      sourceIp: fakeIp,
      targetResource: 'Vault Gateway API /api/v1/evidence/download',
      status: 'ACTIVE',
      vector: 'Distributed HTTP Request Flooding & Expired Token Replay',
    };
    setThreats((prev) => [newThreat, ...prev]);

    const newAudit: AuditEvent = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: now,
      user: 'ANONYMOUS_PROBE',
      role: 'EXTERNAL',
      action: 'ACCESS_DENIED',
      severity: 'WARNING',
      result: 'DENIED',
      ip: fakeIp,
      device: 'Automated Exploit Scanner',
      details: 'Zero Trust Gateway rejected unauthenticated handshake request.'
    };
    setAuditEvents((prev) => [newAudit, ...prev]);
    showToast('ALERT', 'SOC THREAT TRIGGERED', `High severity intrusion attempt logged from ${fakeIp}`);
  };

  // 8. Sign Evidence
  const handleSignEvidence = (id: string, signerName: string) => {
    setEvidenceItems((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              signatureStatus: 'VALID',
              signerName: signerName,
            }
          : e
      )
    );
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    const newAudit: AuditEvent = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: now,
      user: signerName,
      role: officer.roles[0],
      action: 'SIGNATURE_VERIFIED',
      severity: 'INFO',
      result: 'SUCCESS',
      evidenceId: id,
      ip: '10.240.12.18',
      device: 'FIPS 140-3 Cryptographic HSM Token',
      details: `Asymmetric ECDSA P-384 digital signature affixed to artifact ${id}.`
    };
    setAuditEvents((prev) => [newAudit, ...prev]);
    showToast('SUCCESS', 'DIGITALLY SIGNED', `ECDSA signature stamped by ${signerName}`);
  };

  // 9. Revoke Active Session
  const handleRevokeSession = (sessionId: string) => {
    setActiveSessions((prev) => prev.filter((s) => s.id !== sessionId));
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    const newAudit: AuditEvent = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: now,
      user: officer.name,
      role: officer.roles[0],
      action: 'LOGOUT',
      severity: 'WARNING',
      result: 'SUCCESS',
      ip: '10.240.12.18',
      device: 'SCIF Gateway',
      details: `Session ${sessionId} forcefully terminated via Zero Trust access policy.`
    };
    setAuditEvents((prev) => [newAudit, ...prev]);
    showToast('SUCCESS', 'SESSION REVOKED', `Enclave bearer token revoked for session ${sessionId}`);
  };

  // 10. Simulate Unauthorized Download (RBAC Enforcement)
  const handleSimulateUnauthorizedDownload = (evidence: EvidenceItem) => {
    if (evidence.classification === 'TOP SECRET' && officer.clearanceLevel < 4) {
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
      const newAudit: AuditEvent = {
        id: `AUD-${Date.now().toString().slice(-4)}`,
        timestamp: now,
        user: officer.name,
        role: officer.roles[0],
        action: 'ACCESS_DENIED',
        severity: 'WARNING',
        result: 'DENIED',
        caseId: evidence.caseId,
        evidenceId: evidence.id,
        ip: '10.240.12.18',
        device: 'SCIF Ingestion Node',
        details: `Download blocked: User clearance (${officer.clearanceName}) insufficient for TOP SECRET artifact ${evidence.id}.`
      };
      setAuditEvents((prev) => [newAudit, ...prev]);
      showToast('DENIED', 'ACCESS DENIED (ZERO TRUST)', `Insufficient clearance level for TOP SECRET artifact ${evidence.id}.`);
    } else {
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
      const newAudit: AuditEvent = {
        id: `AUD-${Date.now().toString().slice(-4)}`,
        timestamp: now,
        user: officer.name,
        role: officer.roles[0],
        action: 'DOWNLOAD',
        severity: 'INFO',
        result: 'SUCCESS',
        caseId: evidence.caseId,
        evidenceId: evidence.id,
        ip: '10.240.12.18',
        device: 'SCIF Ingestion Node',
        details: `Decrypted copy of ${evidence.name} downloaded under custodial clearance.`
      };
      setAuditEvents((prev) => [newAudit, ...prev]);
      showToast('SUCCESS', 'DOWNLOAD AUTHORIZED', `Decrypted copy prepared with forensic watermarking for ${evidence.name}.`);
    }
  };

  // Case CRUD
  const handleSaveNewCase = (newCase: CaseItem) => {
    setCases([newCase, ...cases]);
    showToast('SUCCESS', 'CASE DOCKET CREATED', `Investigation case #${newCase.id} successfully opened.`);
  };

  const handleUpdateCase = (updated: CaseItem) => {
    setCases(cases.map((c) => (c.id === updated.id ? updated : c)));
    setSelectedCase(updated);
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(
      alerts.map((a) =>
        a.id === alertId ? { ...a, acknowledged: true } : a
      )
    );
  };

  const unreadAlertsCount = alerts.filter((a) => !a.acknowledged).length;
  const totalDocsCount = cases.reduce((acc, c) => acc + c.documentsCount, 0);

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.status !== 'ALL' ||
    filters.classification !== 'ALL' ||
    filters.leadOfficer !== 'ALL';

  if (isLocked) {
    return <LockScreen onUnlock={() => setIsLocked(false)} officer={officer} />;
  }

  return (
    <GlobalSpotlightProvider>
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-slate-200 selection:text-slate-900">
        {/* Left-Corner Minimal Sidebar with Forensics & Case Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadAlertsCount={unreadAlertsCount}
        totalCasesCount={cases.length}
        totalDocsCount={totalDocsCount}
        evidenceVaultCount={evidenceItems.length}
        tamperAlertsCount={stats.tamperAlertsCount}
        activeThreatsCount={stats.activeThreats}
        officer={officer}
        onOpenProfile={() => setIsProfileOpen(true)}
        onLockSystem={() => setIsLocked(true)}
        onToggleTerminal={() => setIsTerminalOpen(!isTerminalOpen)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Workspace (Offset by left sidebar on desktop) */}
      <div className="md:pl-[275px] flex flex-col min-h-screen">
        {/* Top Minimal Bar with SOC Telemetry Status */}
        <header className="sticky top-0 z-30 h-14 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between font-technical">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 md:hidden transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-bold text-xs text-slate-900 tracking-wider">
                SECURE-DMS // FORENSICS COMMAND CENTER
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-mono">
                SCIF ENCLAVE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick SIH Demo Simulation Trigger */}
            <button
              onClick={() => {
                const target = evidenceItems[0];
                if (target) {
                  if (!target.isTampered) handleSimulateTamper(target.id);
                  else handleRestoreEvidence(target.id);
                }
              }}
              title="Quick Toggle: Simulate Bitstream Tampering"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-[11px] font-medium transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>TAMPER TEST</span>
            </button>

            {/* CLI Terminal Toggle */}
            <button
              onClick={() => setIsTerminalOpen(!isTerminalOpen)}
              className="px-2.5 py-1 rounded-md bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Terminal className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">CLI [~]</span>
            </button>

            {/* Officer Clearance Pill */}
            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2 p-1 pl-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 hover:border-slate-300 transition-colors cursor-pointer shadow-2xs"
            >
              <span className="font-mono text-[11px] text-slate-700 font-semibold hidden sm:inline">
                {officer.name.split(' ')[0]} ({officer.id})
              </span>
              <div className="w-7 h-7 rounded-md bg-slate-900 text-white font-bold text-xs flex items-center justify-center font-mono">
                {officer.id.slice(-2)}
              </div>
            </button>
          </div>
        </header>

        {/* Global Toast Alert Notification */}
        {toastMessage && (
          <div className="fixed top-16 right-4 z-50 max-w-md w-full">
            <div className={`p-4 rounded-xl border shadow-lg flex items-start gap-3 bg-white ${
              toastMessage.type === 'ALERT'
                ? 'border-rose-300 text-rose-900 shadow-rose-100'
                : toastMessage.type === 'DENIED'
                ? 'border-amber-300 text-amber-900 shadow-amber-100'
                : 'border-emerald-300 text-emerald-900 shadow-emerald-100'
            }`}>
              {toastMessage.type === 'ALERT' ? (
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              ) : toastMessage.type === 'DENIED' ? (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 text-xs">
                <div className="font-bold uppercase tracking-wider font-technical">
                  {toastMessage.title}
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5 font-sans">
                  {toastMessage.description}
                </div>
              </div>
              <button
                onClick={() => setToastMessage(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Content Body Rendering Dynamic Tab */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {/* TAB 1: CYBER FORENSICS COMMAND CENTER (DASHBOARD) */}
          {activeTab === 'dashboard' && (
            <CyberForensicsDashboard
              stats={stats}
              evidenceItems={evidenceItems}
              recentAudits={auditEvents}
              activeThreats={threats}
              onOpenIngestion={() => setIsIngestionOpen(true)}
              onNavigate={(tab) => setActiveTab(tab as AppTab)}
              onSelectEvidenceForIntegrity={(id) => {
                setIntegritySelectedId(id);
                setActiveTab('integrity');
              }}
              onSimulateTamper={handleSimulateTamper}
              onToggleTerminal={() => setIsTerminalOpen(true)}
            />
          )}

          {/* TAB 2: DIGITAL EVIDENCE VAULT */}
          {activeTab === 'vault' && (
            <DigitalEvidenceVaultView
              evidenceItems={evidenceItems}
              onOpenIngestion={() => setIsIngestionOpen(true)}
              onSelectEvidenceForIntegrity={(id) => {
                setIntegritySelectedId(id);
                setActiveTab('integrity');
              }}
              onOpenChainOfCustody={(id) => {
                setCustodySelectedId(id);
                setActiveTab('custody');
              }}
              onOpenMetadata={(item) => setSelectedMetadataItem(item)}
              onOpenAIAnalysis={(id) => {
                setNeuralSelectedId(id);
                setActiveTab('neural');
              }}
              onSimulateTamper={handleSimulateTamper}
              onRestoreEvidence={handleRestoreEvidence}
              onSimulateUnauthorizedDownload={handleSimulateUnauthorizedDownload}
            />
          )}

          {/* TAB 3: INTEGRITY ENGINE */}
          {activeTab === 'integrity' && (
            <IntegrityEngineView
              evidenceItems={evidenceItems}
              onVerifyEvidence={handleVerifyEvidence}
              onSimulateTamper={handleSimulateTamper}
              onRestoreEvidence={handleRestoreEvidence}
            />
          )}

          {/* TAB 4: CHAIN OF CUSTODY */}
          {activeTab === 'custody' && (
            <ChainOfCustodyView
              custodyEvents={custodyEvents}
              evidenceItems={evidenceItems}
              currentOfficer={officer}
              onAddCustodyEvent={handleAddCustodyEvent}
              initialSelectedEvidenceId={custodySelectedId}
            />
          )}

          {/* TAB 5: THREAT MONITOR */}
          {activeTab === 'threats' && (
            <ThreatMonitorView
              threats={threats}
              onMitigateThreat={handleMitigateThreat}
              onSimulateNewThreat={handleSimulateNewThreat}
            />
          )}

          {/* TAB 6: NEURAL FORENSICS (AI OCR & NER) */}
          {activeTab === 'neural' && (
            <NeuralForensicsView
              analyses={aiAnalyses}
              evidenceItems={evidenceItems}
              initialSelectedEvidenceId={neuralSelectedId}
            />
          )}

          {/* TAB 7: DIGITAL SIGNATURES & PKI */}
          {activeTab === 'signatures' && (
            <SignatureVerificationView
              evidenceItems={evidenceItems}
              currentOfficer={officer}
              onSignEvidence={handleSignEvidence}
            />
          )}

          {/* TAB 8: FORENSIC SECURITY TIMELINE (AUDIT LOG) */}
          {activeTab === 'timeline' && (
            <SecurityTimelineView auditEvents={auditEvents} />
          )}

          {/* TAB 9: ACCESS CONTROL & ZERO TRUST */}
          {activeTab === 'access' && (
            <AccessControlView
              sessions={activeSessions}
              currentOfficer={officer}
              onRevokeSession={handleRevokeSession}
            />
          )}

          {/* TAB 10: LEGAL CASE DOCKETS (PRESERVED EXISTING) */}
          {activeTab === 'cases' && (
            <div className="space-y-6 font-technical">
              <div className="border-b border-slate-200 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-wider">
                    LEGAL CASE DOCKETS & INVESTIGATION FILES
                  </h1>
                  <p className="text-xs text-slate-500 font-mono mt-1">
                    STATUTORY REPOSITORY // {cases.length} TOTAL REGISTERED DOCKETS
                  </p>
                </div>

                {/* Actions & Search */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="Filter dockets..."
                      value={filters.searchQuery}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
                      }
                      className="bg-white border border-slate-300 focus:border-slate-900 text-xs text-slate-900 pl-8 pr-3 py-1.5 rounded-lg focus:outline-none placeholder:text-slate-400 w-44 sm:w-56 font-mono shadow-2xs"
                    />
                  </div>

                  <button
                    onClick={() => setIsFilterOpen(true)}
                    className={`border font-technical text-xs px-3 py-1.5 flex items-center gap-1.5 rounded-lg transition-colors cursor-pointer font-medium ${
                      hasActiveFilters
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Filter className="w-3.5 h-3.5" />
                    <span>FILTERS</span>
                    {hasActiveFilters && (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    )}
                  </button>

                  <button
                    onClick={() => setIsNewCaseOpen(true)}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-technical text-xs px-3.5 py-1.5 flex items-center gap-1.5 shadow-xs transition-all rounded-lg font-medium cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>NEW CASE</span>
                  </button>
                </div>
              </div>

              {/* Active Filter Badges */}
              {hasActiveFilters && (
                <div className="p-2.5 bg-slate-100 border border-slate-200 rounded-lg flex flex-wrap items-center justify-between gap-2 font-technical text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-slate-500 font-semibold uppercase text-[10px]">
                      ACTIVE FILTERS:
                    </span>
                    {filters.searchQuery && (
                      <span className="px-2 py-0.5 rounded bg-white text-slate-800 font-mono text-[11px] border border-slate-200">
                        &quot;{filters.searchQuery}&quot;
                      </span>
                    )}
                    {filters.status !== 'ALL' && (
                      <span className="px-2 py-0.5 rounded bg-white text-slate-800 font-mono text-[11px] border border-slate-200">
                        {filters.status}
                      </span>
                    )}
                    {filters.classification !== 'ALL' && (
                      <span className="px-2 py-0.5 rounded bg-white text-slate-800 font-mono text-[11px] border border-slate-200">
                        {filters.classification}
                      </span>
                    )}
                    {filters.leadOfficer !== 'ALL' && (
                      <span className="px-2 py-0.5 rounded bg-white text-slate-800 font-mono text-[11px] border border-slate-200">
                        {filters.leadOfficer}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={resetFilters}
                    className="text-slate-500 hover:text-slate-900 flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                    <span>CLEAR</span>
                  </button>
                </div>
              )}

              {/* Cases Grid */}
              {filteredCases.length === 0 ? (
                <div className="p-12 text-center bg-white border border-slate-200 rounded-xl space-y-3 font-technical shadow-xs">
                  <FolderKanban className="w-8 h-8 text-slate-400 mx-auto" />
                  <h3 className="text-xs font-bold text-slate-800 uppercase">
                    NO CASES MATCH CRITERIA
                  </h3>
                  <button
                    onClick={resetFilters}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 text-xs font-medium cursor-pointer"
                  >
                    RESET FILTERS
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                  {filteredCases.map((caseItem) => (
                    <CaseCard
                      key={caseItem.id}
                      caseData={caseItem}
                      onOpenCase={(item) => setSelectedCase(item)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 11: CLASSIFIED DOCUMENTS */}
          {activeTab === 'documents' && (
            <DocumentsView
              cases={cases}
              onOpenCase={(item) => setSelectedCase(item)}
            />
          )}

          {/* TAB 12: SYSTEM ALERTS */}
          {activeTab === 'alerts' && (
            <AlertsView
              alerts={alerts}
              cases={cases}
              onAcknowledge={handleAcknowledgeAlert}
              onOpenCase={(item) => setSelectedCase(item)}
            />
          )}
        </main>
      </div>

      {/* Floating or Embedded Cyber Forensics Hacker CLI Terminal */}
      <HackerTerminal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        evidenceItems={evidenceItems}
        onVerifyEvidence={handleVerifyEvidence}
        onSimulateTamper={handleSimulateTamper}
        onOpenIngestion={() => {
          setIsTerminalOpen(false);
          setIsIngestionOpen(true);
        }}
        auditEvents={auditEvents}
      />

      {/* 9-Step Artifact Ingestion Modal */}
      <ArtifactIngestionModal
        isOpen={isIngestionOpen}
        onClose={() => setIsIngestionOpen(false)}
        onIngestSuccess={handleIngestSuccess}
        caseIdList={cases.map((c) => c.id)}
      />

      {/* Deep Metadata Forensics Modal */}
      <MetadataForensicsModal
        isOpen={!!selectedMetadataItem}
        onClose={() => setSelectedMetadataItem(null)}
        evidence={selectedMetadataItem}
      />

      {/* Case Detail Dossier Modal */}
      {selectedCase && (
        <CaseDetailModal
          caseData={selectedCase}
          onClose={() => setSelectedCase(null)}
          onUpdateCase={handleUpdateCase}
        />
      )}

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        onReset={resetFilters}
        matchingCount={filteredCases.length}
      />

      {/* New Case Creation Modal */}
      <NewCaseModal
        isOpen={isNewCaseOpen}
        onClose={() => setIsNewCaseOpen(false)}
        onSaveCase={handleSaveNewCase}
        existingCount={cases.length}
      />

      {/* User Profile / Security Credentials Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        officer={officer}
        onLockSystem={() => setIsLocked(true)}
      />
      </div>
    </GlobalSpotlightProvider>
  );
}
