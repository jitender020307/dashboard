import React, { useState, useEffect } from 'react';
import {
  Menu,
  Filter,
  Plus,
  Search,
  FolderKanban,
  X,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Upload,
  FileText,
  Lock,
  Stamp
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
  ManagedDocument,
  DocumentVersion,
  SharedAccessRecord,
  UserRole,
  ClearanceLevel
} from './types';
import { INITIAL_CASES, INITIAL_ALERTS, CURRENT_OFFICER, INITIAL_MANAGED_DOCUMENTS } from './data/mockData';
import {
  INITIAL_EVIDENCE_ITEMS,
  INITIAL_CUSTODY_EVENTS,
  INITIAL_AUDIT_EVENTS,
  INITIAL_THREATS,
  INITIAL_AI_ANALYSES,
  INITIAL_ACTIVE_SESSIONS,
  INITIAL_FORENSIC_STATS
} from './data/forensicData';

// Navigation & Modals
import { Sidebar, AppTab } from './components/Sidebar';
import { CaseCard } from './components/CaseCard';
import { CaseDetailModal } from './components/CaseDetailModal';
import { FilterModal, FilterOptions } from './components/FilterModal';
import { NewCaseModal } from './components/NewCaseModal';
import { UserProfileModal, LockScreen } from './components/UserProfileModal';
import { UploadDocumentModal } from './components/UploadDocumentModal';
import { SecureDocumentModal } from './components/SecureDocumentModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';

// Core SIH 26190 Views
import { OverviewDashboard } from './components/OverviewDashboard';
import { DocumentRepositoryView } from './components/DocumentRepositoryView';
import { DigitalEvidenceVaultView } from './components/DigitalEvidenceVaultView';
import { IntegrityEngineView } from './components/IntegrityEngineView';
import { ChainOfCustodyView } from './components/ChainOfCustodyView';
import { SignatureVerificationView } from './components/SignatureVerificationView';
import { SecureCollaborationView } from './components/SecureCollaborationView';
import { AccessControlView } from './components/AccessControlView';
import { SecurityTimelineView } from './components/SecurityTimelineView';
import { DocumentIntelligenceView } from './components/DocumentIntelligenceView';
import { LifecycleSettingsView } from './components/LifecycleSettingsView';
import { SecurityEventsView } from './components/SecurityEventsView';
import { ArtifactIngestionModal } from './components/ArtifactIngestionModal';
import { MetadataForensicsModal } from './components/MetadataForensicsModal';
import { SubSectionTabs } from './components/SubSectionTabs';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');

  // Main Domain State
  const [cases, setCases] = useState<CaseItem[]>(INITIAL_CASES);
  const [documents, setDocuments] = useState<ManagedDocument[]>(INITIAL_MANAGED_DOCUMENTS);
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>(INITIAL_EVIDENCE_ITEMS);
  const [custodyEvents, setCustodyEvents] = useState<CustodyEvent[]>(INITIAL_CUSTODY_EVENTS);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(INITIAL_AUDIT_EVENTS);
  const [threats, setThreats] = useState<SecurityThreat[]>(INITIAL_THREATS);
  const [alerts, setAlerts] = useState<SecurityAlert[]>(INITIAL_ALERTS);
  const [aiAnalyses, setAiAnalyses] = useState<Record<string, AIForensicAnalysis>>(INITIAL_AI_ANALYSES);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>(INITIAL_ACTIVE_SESSIONS);
  const [stats, setStats] = useState<ForensicStats>(INITIAL_FORENSIC_STATS);
  const [officer, setOfficer] = useState<OfficerProfile>(CURRENT_OFFICER);

  // Modals & Overlays
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<ManagedDocument | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isNewCaseOpen, setIsNewCaseOpen] = useState(false);
  const [isUploadDocOpen, setIsUploadDocOpen] = useState(false);
  const [isIngestionOpen, setIsIngestionOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [selectedMetadataItem, setSelectedMetadataItem] = useState<EvidenceItem | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // Sub-view selected IDs
  const [integritySelectedId, setIntegritySelectedId] = useState<string>('EV-2026-00421');
  const [custodySelectedId, setCustodySelectedId] = useState<string>('EV-2026-00421');
  const [intelligenceSelectedId, setIntelligenceSelectedId] = useState<string>('DOC-2026-00421-FIR');

  // Toast Notification
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

  // Keyboard shortcuts (Ctrl+K / Cmd+K for Global Search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update Stats when Evidence, Cases, or Docs Change
  useEffect(() => {
    const tamperedCount = evidenceItems.filter((e) => e.isTampered).length;
    const verifiedPercent =
      evidenceItems.length > 0
        ? Math.round(((evidenceItems.length - tamperedCount) / evidenceItems.length) * 100)
        : 100;
    const legalHolds = documents.filter((d) => d.legalHold).length;
    let sharedCount = 0;
    documents.forEach((d) => (sharedCount += d.sharedWith.length));

    setStats((prev) => ({
      ...prev,
      totalCases: cases.length,
      totalDocuments: documents.length,
      totalEvidenceItems: evidenceItems.length,
      integrityVerifiedPercent: verifiedPercent,
      legalHoldCount: legalHolds,
      sharedDocsCount: sharedCount,
      totalAuditEvents: auditEvents.length,
      activeSecurityEvents: threats.filter((t) => t.status === 'ACTIVE').length,
    }));
  }, [evidenceItems, documents, cases, threats, auditEvents]);

  // Log an Audit Event helper
  const logAudit = (
    action: string,
    details: string,
    result: 'SUCCESS' | 'DENIED' | 'ALERT' | 'FAILED' = 'SUCCESS',
    severity: 'INFO' | 'WARNING' | 'CRITICAL' = 'INFO',
    docId?: string,
    caseId?: string
  ) => {
    const newAudit: AuditEvent = {
      id: `AUD-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      user: officer.name,
      userId: officer.id,
      role: officer.roles[0] || 'INVESTIGATING_OFFICER',
      action,
      caseId: caseId || 'CASE-UP-CYB-2026-00421',
      documentId: docId,
      ip: '10.240.12.18',
      device: 'Authorized Workstation',
      result,
      severity,
      details,
    };
    setAuditEvents((prev) => [newAudit, ...prev]);
  };

  // Document Handlers
  const handleUploadNewDocument = (newDoc: ManagedDocument) => {
    setDocuments((prev) => [newDoc, ...prev]);
    // Also update case documents count
    setCases((prev) =>
      prev.map((c) =>
        c.id === newDoc.caseId ? { ...c, documentsCount: c.documentsCount + 1 } : c
      )
    );
    logAudit(
      'DOCUMENT_UPLOAD',
      `Uploaded and registered new document "${newDoc.title}" (${newDoc.id}) with SHA-256 hash.`,
      'SUCCESS',
      'INFO',
      newDoc.id,
      newDoc.caseId
    );
    showToast('SUCCESS', 'Document Uploaded', `Document ${newDoc.id} has been ingested and verified.`);
  };

  const handleUploadNewVersion = (docId: string, versionData: Partial<DocumentVersion>) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id !== docId) return doc;
        const updatedVersions = doc.versions.map((v) => ({ ...v, isCurrent: false }));
        const newVer: DocumentVersion = {
          versionNumber: versionData.versionNumber || doc.versions.length + 1,
          versionTag: versionData.versionTag || `v${doc.versions.length + 1}.0`,
          author: versionData.author || officer.name,
          authorRole: versionData.authorRole || officer.roles[0],
          timestamp: versionData.timestamp || new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
          changeDescription: versionData.changeDescription || 'Updated document edition.',
          sha256Hash: versionData.sha256Hash || doc.sha256Hash,
          fileSize: versionData.fileSize || doc.fileSize,
          signatureStatus: versionData.signatureStatus || 'PENDING',
          isCurrent: true,
        };
        return {
          ...doc,
          currentVersion: newVer.versionTag,
          sha256Hash: newVer.sha256Hash,
          lastModified: newVer.timestamp,
          versions: [newVer, ...updatedVersions],
        };
      })
    );

    logAudit('VERSION_CREATED', `Committed new version for document ${docId}.`, 'SUCCESS', 'INFO', docId);
    showToast('SUCCESS', 'Version Committed', `New version added to ${docId}.`);
  };

  const handleRestoreVersion = (docId: string, versionNumber: number) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id !== docId) return doc;
        const targetVer = doc.versions.find((v) => v.versionNumber === versionNumber);
        if (!targetVer) return doc;

        const updatedVersions = doc.versions.map((v) => ({
          ...v,
          isCurrent: v.versionNumber === versionNumber,
        }));

        return {
          ...doc,
          currentVersion: targetVer.versionTag,
          sha256Hash: targetVer.sha256Hash,
          lastModified: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
          versions: updatedVersions,
        };
      })
    );

    logAudit('VERSION_RESTORED', `Restored version ${versionNumber} for document ${docId}.`, 'SUCCESS', 'WARNING', docId);
    showToast('SUCCESS', 'Version Restored', `Document ${docId} rolled back to v${versionNumber}.0.`);
  };

  const handleAddShare = (docId: string, shareData: Partial<SharedAccessRecord>) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id !== docId) return doc;
        const newShare: SharedAccessRecord = {
          id: shareData.id || `SHR-${Math.floor(1000 + Math.random() * 9000)}`,
          documentId: doc.id,
          documentTitle: doc.title,
          sharedWithUserId: shareData.sharedWithUserId || 'LEGAL-08',
          sharedWithUserName: shareData.sharedWithUserName || 'Adv. Sanjay Deshmukh',
          sharedWithRole: shareData.sharedWithRole || 'LEGAL_OFFICER',
          sharedByUserName: shareData.sharedByUserName || officer.name,
          permission: shareData.permission || 'VIEW',
          sharedAt: shareData.sharedAt || new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
          expiresAt: shareData.expiresAt || '7 Days',
          status: 'ACTIVE',
          notes: shareData.notes,
        };
        return {
          ...doc,
          sharedWith: [newShare, ...doc.sharedWith],
        };
      })
    );

    logAudit(
      'DOCUMENT_SHARED',
      `Shared document ${docId} with ${shareData.sharedWithUserName} (${shareData.sharedWithRole}). Permission: ${shareData.permission}`,
      'SUCCESS',
      'INFO',
      docId
    );
    showToast('SUCCESS', 'Access Granted', `Granted ${shareData.permission} permissions to ${shareData.sharedWithUserName}.`);
  };

  const handleRevokeShare = (docId: string, shareId: string) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id !== docId) return doc;
        return {
          ...doc,
          sharedWith: doc.sharedWith.filter((s) => s.id !== shareId),
        };
      })
    );

    logAudit('SHARE_REVOKED', `Revoked share token ${shareId} on document ${docId}.`, 'SUCCESS', 'WARNING', docId);
    showToast('SUCCESS', 'Share Revoked', `Access revoked for share token ${shareId}.`);
  };

  const handleSignDocument = (docId: string) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id !== docId) return doc;
        const nowIso = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
        return {
          ...doc,
          digitalSignatureStatus: 'VALID',
          signerName: `${officer.name} (${officer.rank})`,
          signatureTimestamp: nowIso,
          versions: doc.versions.map((v) =>
            v.isCurrent ? { ...v, signatureStatus: 'VALID', signerName: `${officer.name} (${officer.rank})` } : v
          ),
        };
      })
    );

    logAudit('DIGITAL_SIGNATURE_APPLIED', `Applied PKI digital signature to document ${docId}.`, 'SUCCESS', 'INFO', docId);
    showToast('SUCCESS', 'Digital Signature Applied', `Officer signature stamped on document ${docId}.`);
  };

  const handleToggleLegalHold = (docId: string) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id !== docId) return doc;
        const nextHold = !doc.legalHold;
        logAudit(
          'LEGAL_HOLD_TOGGLED',
          `${nextHold ? 'Engaged' : 'Released'} legal preservation hold on ${docId}.`,
          'SUCCESS',
          nextHold ? 'WARNING' : 'INFO',
          docId
        );
        return { ...doc, legalHold: nextHold };
      })
    );
  };

  const handleDownloadDoc = (doc: ManagedDocument) => {
    // Check clearance
    if (officer.clearanceLevel < doc.accessClearanceRequired) {
      logAudit(
        'ACCESS_DENIED',
        `Officer clearance Level ${officer.clearanceLevel} insufficient for Level ${doc.accessClearanceRequired} document ${doc.id}.`,
        'DENIED',
        'CRITICAL',
        doc.id,
        doc.caseId
      );
      showToast('DENIED', 'Access Denied', `Clearance Level ${doc.accessClearanceRequired} required to download this record.`);
      return;
    }

    logAudit('DOCUMENT_DOWNLOAD', `Downloaded document ${doc.title} (${doc.id}).`, 'SUCCESS', 'INFO', doc.id, doc.caseId);
    showToast('SUCCESS', 'Download Initiated', `Secure stream generated for ${doc.title}.`);
  };

  // Case Filters for Cases View
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

  const filteredCases = cases.filter((caseItem) => {
    const matchesSearch =
      caseItem.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      caseItem.id.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      caseItem.summary.toLowerCase().includes(filters.searchQuery.toLowerCase());

    const matchesStatus =
      filters.status === 'ALL' || caseItem.status === filters.status;

    const matchesClassification =
      filters.classification === 'ALL' ||
      caseItem.classification === filters.classification;

    const matchesOfficer =
      filters.leadOfficer === 'ALL' ||
      caseItem.leadOfficer.name === filters.leadOfficer;

    const matchesEvidence =
      caseItem.evidenceCount >= filters.minEvidence;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesClassification &&
      matchesOfficer &&
      matchesEvidence
    );
  });

  // Lockscreen Handler
  if (isLocked) {
    return <LockScreen officer={officer} onUnlock={() => setIsLocked(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      {/* Top Application Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between px-4 py-2.5 max-w-7xl mx-auto w-full">
          {/* Left: Mobile Menu Toggle & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden cursor-pointer"
              title="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm sm:text-base tracking-tight">
                SECURE-DMS
              </span>
              <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-medium">
                SIH 26190
              </span>
            </div>
          </div>

          {/* Center: Global Search Bar Trigger (Ctrl+K) */}
          <button
            onClick={() => setIsGlobalSearchOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-400 text-slate-500 text-xs w-72 justify-between cursor-pointer transition-colors shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5" />
              <span>Search cases, documents...</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-[10px] font-mono text-slate-700">
              Ctrl+K
            </kbd>
          </button>

          {/* Right: Quick Ingestion + Officer Badge */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsUploadDocOpen(true)}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Upload Doc</span>
            </button>

            <button
              onClick={() => setIsGlobalSearchOpen(true)}
              className="p-2 text-slate-500 hover:text-slate-900 md:hidden cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-slate-800 hidden sm:inline">
                {officer.name.split(' ')[1] || officer.name}
              </span>
              <span className="text-[10px] font-mono bg-slate-100 px-1 rounded text-slate-600">
                L{officer.clearanceLevel}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          unreadAlertsCount={alerts.filter((a) => !a.acknowledged).length}
          totalCasesCount={cases.length}
          totalDocsCount={documents.length}
          evidenceVaultCount={evidenceItems.length}
          tamperAlertsCount={evidenceItems.filter((e) => e.isTampered).length}
          activeThreatsCount={threats.filter((t) => t.status === 'ACTIVE').length}
          sharedDocsCount={stats.sharedDocsCount}
          officer={officer}
          onOpenProfile={() => setIsProfileOpen(true)}
          onLockSystem={() => setIsLocked(true)}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Content Area */}
        <main className="flex-1 lg:pl-72 p-4 sm:p-6 overflow-x-hidden">
          {/* Sub-parts Tab Bar for Group Navigation */}
          <SubSectionTabs
            activeTab={activeTab}
            onSelectTab={(tab) => setActiveTab(tab)}
            tamperAlertsCount={evidenceItems.filter((e) => e.isTampered).length}
            sharedDocsCount={stats.sharedDocsCount}
            unreadAlertsCount={alerts.filter((a) => !a.acknowledged).length}
            activeThreatsCount={threats.filter((t) => t.status === 'ACTIVE').length}
          />

          {/* 1. OVERVIEW TAB */}
          {activeTab === 'dashboard' && (
            <OverviewDashboard
              stats={stats}
              cases={cases}
              documents={documents}
              evidenceItems={evidenceItems}
              recentAudits={auditEvents}
              officer={officer}
              onNavigate={(t) => setActiveTab(t)}
              onOpenNewCase={() => setIsNewCaseOpen(true)}
              onOpenUploadDoc={() => setIsUploadDocOpen(true)}
              onOpenIngestEvidence={() => setIsIngestionOpen(true)}
              onOpenDocDetail={(doc) => setSelectedDocument(doc)}
              onOpenCaseDetail={(c) => setSelectedCase(c)}
            />
          )}

          {/* 2. CASES TAB */}
          {activeTab === 'cases' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
                      Investigation Dockets
                    </span>
                    <span className="text-xs text-slate-500">• {cases.length} Registered Cases</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
                    State Cyber & Criminal Investigation Dockets
                  </h1>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setIsFilterOpen(true)}
                    className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Filter className="w-3.5 h-3.5" />
                    <span>Filter Cases</span>
                  </button>
                  <button
                    onClick={() => setIsNewCaseOpen(true)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Case</span>
                  </button>
                </div>
              </div>

              {/* Case Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCases.map((caseItem) => (
                  <CaseCard
                    key={caseItem.id}
                    caseItem={caseItem}
                    onClick={() => setSelectedCase(caseItem)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 3. DOCUMENT REPOSITORY TAB */}
          {activeTab === 'documents' && (
            <DocumentRepositoryView
              documents={documents}
              officer={officer}
              onOpenDocDetail={(doc) => setSelectedDocument(doc)}
              onOpenUploadDoc={() => setIsUploadDocOpen(true)}
              onShareDoc={(doc) => {
                setSelectedDocument(doc);
              }}
              onSignDoc={(docId) => handleSignDocument(docId)}
              onVerifyDocHash={(doc) => setSelectedDocument(doc)}
              onToggleLegalHold={(docId) => handleToggleLegalHold(docId)}
              onDownloadDoc={(doc) => handleDownloadDoc(doc)}
            />
          )}

          {/* 4. EVIDENCE VAULT TAB */}
          {activeTab === 'vault' && (
            <DigitalEvidenceVaultView
              evidenceItems={evidenceItems}
              officer={officer}
              onOpenIngestion={() => setIsIngestionOpen(true)}
              onInspectMetadata={(item) => setSelectedMetadataItem(item)}
              onNavigateToIntegrity={(id) => {
                setIntegritySelectedId(id);
                setActiveTab('integrity');
              }}
              onNavigateToCustody={(id) => {
                setCustodySelectedId(id);
                setActiveTab('custody');
              }}
              onDownloadEvidence={(item) => {
                logAudit(
                  'DOCUMENT_DOWNLOAD',
                  `Evidence ${item.name} downloaded under write-blocker inspection.`,
                  'SUCCESS',
                  'INFO',
                  item.id,
                  item.caseId
                );
                showToast('SUCCESS', 'Evidence Downloaded', `Generated stream for ${item.name}.`);
              }}
            />
          )}

          {/* 5. FILE INTEGRITY ENGINE TAB */}
          {activeTab === 'integrity' && (
            <IntegrityEngineView
              evidenceItems={evidenceItems}
              initialSelectedId={integritySelectedId}
              onVerifyHash={(id) => {
                logAudit('INTEGRITY_VERIFIED', `Recalculated SHA-256 hash for artifact ${id}. Match confirmed.`, 'SUCCESS', 'INFO', id);
                showToast('SUCCESS', 'SHA-256 Verified', `Evidence artifact ${id} matches original bitstream.`);
              }}
            />
          )}

          {/* 6. CHAIN OF CUSTODY TAB */}
          {activeTab === 'custody' && (
            <ChainOfCustodyView
              custodyEvents={custodyEvents}
              evidenceItems={evidenceItems}
              currentOfficer={officer}
              initialSelectedEvidenceId={custodySelectedId}
              onAddCustodyEvent={(event) => {
                setCustodyEvents((prev) => [event, ...prev]);
                logAudit(
                  'EVIDENCE_TRANSFERRED',
                  `Logged custody transfer for ${event.evidenceId} to ${event.location}.`,
                  'SUCCESS',
                  'INFO',
                  event.evidenceId,
                  event.caseId
                );
                showToast('SUCCESS', 'Custody Transferred', `Recorded transfer ledger entry ${event.id}.`);
              }}
            />
          )}

          {/* 7. SECURE COLLABORATION TAB */}
          {activeTab === 'collaboration' && (
            <SecureCollaborationView
              documents={documents}
              officer={officer}
              onOpenDocDetail={(doc) => setSelectedDocument(doc)}
              onRevokeShare={handleRevokeShare}
              onAddShare={handleAddShare}
            />
          )}

          {/* 8. ACCESS CONTROL & RBAC TAB */}
          {activeTab === 'access' && (
            <AccessControlView
              sessions={activeSessions}
              currentOfficer={officer}
              onRevokeSession={(sessionId) => {
                setActiveSessions((prev) => prev.filter((s) => s.id !== sessionId));
                logAudit('LOGOUT', `Revoked active user session ${sessionId}.`, 'SUCCESS', 'WARNING');
                showToast('SUCCESS', 'Session Terminated', `Session ${sessionId} has been invalidated.`);
              }}
              onSwitchOfficerRole={(newRole, clearance) => {
                setOfficer((prev) => ({
                  ...prev,
                  roles: [newRole],
                  clearanceLevel: clearance.includes('4') ? 4 : clearance.includes('3') ? 3 : clearance.includes('2') ? 2 : 1,
                  clearanceName: clearance,
                }));
                showToast('SUCCESS', 'Role Switched', `Switched active workstation identity to ${newRole}.`);
              }}
            />
          )}

          {/* 9. AUDIT TRAIL TAB */}
          {activeTab === 'timeline' && (
            <SecurityTimelineView auditEvents={auditEvents} />
          )}

          {/* 10. DIGITAL SIGNATURES TAB */}
          {activeTab === 'signatures' && (
            <SignatureVerificationView
              evidenceItems={evidenceItems}
              currentOfficer={officer}
              onSignEvidence={(id, signerName) => {
                setEvidenceItems((prev) =>
                  prev.map((e) =>
                    e.id === id ? { ...e, signatureStatus: 'VALID', signerName } : e
                  )
                );
                logAudit('DIGITAL_SIGNATURE_APPLIED', `Signed artifact ${id} by ${signerName}.`, 'SUCCESS', 'INFO', id);
                showToast('SUCCESS', 'Signature Stamped', `PKI signature validated on ${id}.`);
              }}
            />
          )}

          {/* 11. DOCUMENT INTELLIGENCE TAB */}
          {activeTab === 'intelligence' && (
            <DocumentIntelligenceView
              analyses={aiAnalyses}
              documents={documents}
              evidenceItems={evidenceItems}
              initialSelectedId={intelligenceSelectedId}
            />
          )}

          {/* 12. LIFECYCLE & LEGAL HOLD TAB */}
          {activeTab === 'lifecycle' && (
            <LifecycleSettingsView
              documents={documents}
              officer={officer}
              onToggleLegalHold={handleToggleLegalHold}
              onOpenDocDetail={(doc) => setSelectedDocument(doc)}
            />
          )}

          {/* 13. ALERTS TAB */}
          {activeTab === 'alerts' && (
            <SecurityEventsView
              events={threats}
              officer={officer}
              onAcknowledgeEvent={(id) => {
                setThreats((prev) =>
                  prev.map((t) => (t.id === id ? { ...t, status: 'RESOLVED' } : t))
                );
                showToast('SUCCESS', 'Event Acknowledged', `Incident ${id} marked as resolved.`);
              }}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      {selectedCase && (
        <CaseDetailModal
          caseItem={selectedCase}
          onClose={() => setSelectedCase(null)}
          onUpdateCase={(updatedCase) => {
            setCases((prev) =>
              prev.map((c) => (c.id === updatedCase.id ? updatedCase : c))
            );
          }}
        />
      )}

      {selectedDocument && (
        <SecureDocumentModal
          document={selectedDocument}
          officer={officer}
          onClose={() => setSelectedDocument(null)}
          onUploadNewVersion={handleUploadNewVersion}
          onRestoreVersion={handleRestoreVersion}
          onAddShare={handleAddShare}
          onRevokeShare={handleRevokeShare}
          onSignDocument={handleSignDocument}
          onToggleLegalHold={handleToggleLegalHold}
          onDownload={handleDownloadDoc}
        />
      )}

      {isUploadDocOpen && (
        <UploadDocumentModal
          cases={cases}
          officer={officer}
          onClose={() => setIsUploadDocOpen(false)}
          onUploadSuccess={handleUploadNewDocument}
        />
      )}

      {isNewCaseOpen && (
        <NewCaseModal
          officer={officer}
          onClose={() => setIsNewCaseOpen(false)}
          onCreateCase={(newCase) => {
            setCases((prev) => [newCase, ...prev]);
            logAudit('CASE_CREATED', `Registered new investigation case "${newCase.title}" (${newCase.id}).`, 'SUCCESS', 'INFO', undefined, newCase.id);
            showToast('SUCCESS', 'Case Docket Created', `Registered ${newCase.id} successfully.`);
          }}
        />
      )}

      {isFilterOpen && (
        <FilterModal
          filters={filters}
          onApply={(newFilters) => setFilters(newFilters)}
          onReset={resetFilters}
          onClose={() => setIsFilterOpen(false)}
        />
      )}

      {isGlobalSearchOpen && (
        <GlobalSearchModal
          cases={cases}
          documents={documents}
          evidenceItems={evidenceItems}
          audits={auditEvents}
          onClose={() => setIsGlobalSearchOpen(false)}
          onSelectDoc={(doc) => setSelectedDocument(doc)}
          onSelectCase={(c) => setSelectedCase(c)}
          onNavigateTab={(t) => setActiveTab(t)}
        />
      )}

      {isIngestionOpen && (
        <ArtifactIngestionModal
          onClose={() => setIsIngestionOpen(false)}
          onIngestionComplete={(newItem) => {
            setEvidenceItems((prev) => [newItem, ...prev]);
            logAudit('EVIDENCE_TRANSFERRED', `Ingested forensic evidence ${newItem.name} (${newItem.id}).`, 'SUCCESS', 'INFO', newItem.id, newItem.caseId);
            showToast('SUCCESS', 'Evidence Ingested', `Artifact ${newItem.id} secured in vault.`);
          }}
        />
      )}

      {selectedMetadataItem && (
        <MetadataForensicsModal
          item={selectedMetadataItem}
          onClose={() => setSelectedMetadataItem(null)}
        />
      )}

      {isProfileOpen && (
        <UserProfileModal
          officer={officer}
          onClose={() => setIsProfileOpen(false)}
          onLock={() => {
            setIsProfileOpen(false);
            setIsLocked(true);
          }}
        />
      )}

      {/* Global Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-5 right-5 z-50 p-4 rounded-xl border shadow-xl flex items-start gap-3 max-w-sm animate-slideUp ${
            toastMessage.type === 'SUCCESS'
              ? 'bg-emerald-900 text-white border-emerald-700'
              : toastMessage.type === 'DENIED'
              ? 'bg-rose-900 text-white border-rose-700'
              : 'bg-slate-900 text-white border-slate-700'
          }`}
        >
          {toastMessage.type === 'SUCCESS' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
          ) : toastMessage.type === 'DENIED' ? (
            <AlertTriangle className="w-5 h-5 text-rose-300 shrink-0 mt-0.5" />
          ) : (
            <ShieldAlert className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
          )}

          <div className="min-w-0">
            <div className="font-bold text-xs">{toastMessage.title}</div>
            <div className="text-[11px] opacity-90 leading-tight mt-0.5">
              {toastMessage.description}
            </div>
          </div>

          <button
            onClick={() => setToastMessage(null)}
            className="p-0.5 hover:opacity-75 cursor-pointer ml-auto"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
