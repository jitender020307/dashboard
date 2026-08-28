export type CaseStatus = 'ACTIVE' | 'UNDER_INVESTIGATION' | 'CHARGE_SHEETED' | 'UNDER_TRIAL' | 'RESOLVED' | 'ARCHIVED';

export type ClassificationLevel = 'UNCLASSIFIED' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED' | 'HIGHLY_RESTRICTED';

export type UserRole = 
  | 'ADMINISTRATOR'
  | 'INVESTIGATING_OFFICER'
  | 'FORENSIC_ANALYST'
  | 'LEGAL_OFFICER'
  | 'REVIEWER'
  | 'AUDITOR';

export type ClearanceLevel = 'LEVEL 1 (UNCLASSIFIED)' | 'LEVEL 2 (CONFIDENTIAL)' | 'LEVEL 3 (RESTRICTED)' | 'LEVEL 4 (HIGHLY RESTRICTED)';

export type EvidenceType = 
  | 'DIGITAL_STORAGE'
  | 'AUDIO_RECORDING'
  | 'VIDEO_SURVEILLANCE'
  | 'MEMORY_DUMP'
  | 'DOC_PDF'
  | 'DOC_SCAN'
  | 'FINANCIAL_LEDGER'
  | 'MOBILE_EXTRACT'
  | 'NETWORK_PCAP'
  | string;

export type EvidenceStatus = 'IN_VAULT' | 'FORENSIC_LAB' | 'COURT_EVIDENCE' | 'CHECKED_OUT' | 'ARCHIVED';

export interface MetadataRecord {
  fileName?: string;
  fileSize?: string;
  mimeType?: string;
  fileExtension?: string;
  sha256?: string;
  md5?: string;
  sha1?: string;
  creationDate?: string;
  modificationDate?: string;
  uploadDate?: string;
  pageCount?: number;
  author?: string;
  deviceModel?: string;
  gpsCoordinates?: string;
  cameraExif?: {
    make?: string;
    model?: string;
    iso?: string;
    exposure?: string;
    focalLength?: string;
    lens?: string;
    timestamp?: string;
  };
  fileSystem?: string;
  writeBlockerUsed?: string;
  additional?: Record<string, string>;
  [key: string]: any;
}

export interface DocumentVersion {
  versionNumber: number; // 1, 2, 3...
  versionTag: string; // 'v1.0', 'v1.1', 'v2.0'
  author: string;
  authorRole: string;
  timestamp: string;
  changeDescription: string;
  sha256Hash: string;
  fileSize: string;
  signatureStatus: 'VALID' | 'PENDING' | 'UNSIGNED';
  signerName?: string;
  isCurrent: boolean;
  downloadUrl?: string;
}

export interface SharedAccessRecord {
  id: string;
  documentId: string;
  documentTitle: string;
  sharedWithUserId: string;
  sharedWithUserName: string;
  sharedWithRole: string;
  sharedByUserName: string;
  permission: 'VIEW' | 'COMMENT' | 'EDIT' | 'DOWNLOAD';
  sharedAt: string;
  expiresAt: string; // e.g. "7 Days (2026-09-04)"
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  notes?: string;
}

export type DocumentLifecycleStage = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'FINAL' | 'ARCHIVED';

export type DocumentCategory = 
  | 'FIR'
  | 'INVESTIGATION_REPORT'
  | 'CASE_DIARY'
  | 'WITNESS_STATEMENT'
  | 'SEIZURE_MEMO'
  | 'FORENSIC_REPORT'
  | 'DIGITAL_EVIDENCE_REPORT'
  | 'LEGAL_NOTICE'
  | 'CHARGE_SHEET'
  | 'COURT_FILING'
  | 'SUPPORTING_DOCUMENT';

export interface ManagedDocument {
  id: string;
  caseId: string;
  title: string;
  category: DocumentCategory;
  fileExtension: string;
  fileSize: string;
  owner: string;
  ownerRole: string;
  dateCreated: string;
  lastModified: string;
  classification: ClassificationLevel;
  lifecycleStatus: DocumentLifecycleStage;
  currentVersion: string; // 'v2.0'
  versions: DocumentVersion[];
  sha256Hash: string;
  isIntegrityVerified: boolean;
  digitalSignatureStatus: 'VALID' | 'PENDING' | 'UNVERIFIED';
  signerName?: string;
  signatureTimestamp?: string;
  accessClearanceRequired: number; // 1 to 4
  lastAccessedBy?: string;
  lastAccessedDate?: string;
  retentionYears: number;
  retentionExpiryDate: string;
  legalHold: boolean; // Flag preventing deletion while case is under legal preservation
  contentSummary: string;
  tags: string[];
  sharedWith: SharedAccessRecord[];
  metadata?: MetadataRecord;
  fullText?: string;
}

// Retain legacy CaseDocument type mapping for backward compatibility with case cards
export interface CaseDocument {
  id: string;
  title: string;
  category: string;
  dateCreated: string;
  author: string;
  classification: ClassificationLevel;
  contentSnippet: string;
  fullText?: string;
  pagesCount: number;
  status: string;
  caseId: string;
  sha256Hash?: string;
  digitalSignature?: string;
  isSigned?: boolean;
}

export interface EvidenceItem {
  id: string;
  name: string;
  type: EvidenceType;
  description: string;
  collectedDate: string;
  collectedBy: string;
  locationFound: string;
  status: EvidenceStatus;
  digitalHashSha256: string;
  digitalHashVerified: boolean;
  storageLocker: string;
  caseId?: string;
  currentCustodian?: string;
  classification?: ClassificationLevel;
  currentHashSha256?: string;
  isTampered?: boolean;
  encryptionStatus?: string;
  signatureStatus?: 'VALID' | 'INVALID' | 'UNVERIFIED' | string;
  signerName?: string;
  fileSize?: string;
  fileExtension?: string;
  metadata?: MetadataRecord;
  downloadUrl?: string;
}

export interface CustodyEvent {
  id: string;
  evidenceId?: string;
  caseId?: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole?: string;
  action: 'COLLECTED' | 'INGESTED' | 'TRANSFERRED' | 'REVIEWED' | 'EXAMINED_LAB' | 'COURT_SUBMITTED' | 'ARCHIVED' | 'INTEGRITY_CHECK' | 'VAULT_INGESTION' | 'CHAIN_VERIFICATION' | 'TRANSFER_TO_LAB' | string;
  location?: string;
  deviceIp?: string;
  cryptographicSignature: string;
  hash?: string;
  remarks?: string;
  details?: string;
  verified: boolean;
}

export interface SuspectProfile {
  id: string;
  name: string;
  alias: string;
  status: 'IN_CUSTODY' | 'PERSON_OF_INTEREST' | 'FUGITIVE' | 'WITNESS' | 'CLEARED' | string;
  biometricMatchRate?: number;
  lastKnownLocation: string;
  notes: string;
}

export interface CaseTimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  source: string;
  type?: 'NORMAL' | 'WARNING' | 'CRITICAL' | string;
}

export interface CaseItem {
  id: string;
  title: string;
  status: CaseStatus;
  classification: ClassificationLevel;
  leadOfficer: {
    id: string;
    name: string;
    rank: string;
    department: string;
  };
  department: string;
  location: string;
  documentsCount: number;
  evidenceCount: number;
  dateInitiated: string;
  lastUpdated: string;
  summary: string;
  suspects: SuspectProfile[];
  tags: string[];
  evidenceItems: EvidenceItem[];
  chainOfCustody: CustodyEvent[];
  documents: CaseDocument[];
  timeline: CaseTimelineEvent[];
  integrityHash: string;
  securityClearanceLevel: 1 | 2 | 3 | 4;
  legalHold: boolean;
}

export type AuditActionType =
  | 'LOGIN'
  | 'LOGOUT'
  | 'DOCUMENT_UPLOAD'
  | 'DOCUMENT_VIEW'
  | 'DOCUMENT_DOWNLOAD'
  | 'DOCUMENT_MODIFICATION'
  | 'VERSION_CREATED'
  | 'VERSION_RESTORED'
  | 'DOCUMENT_SHARED'
  | 'SHARE_REVOKED'
  | 'PERMISSION_CHANGED'
  | 'DIGITAL_SIGNATURE_APPLIED'
  | 'SIGNATURE_VERIFIED'
  | 'HASH_GENERATED'
  | 'INTEGRITY_VERIFIED'
  | 'HASH_MISMATCH_ALERT'
  | 'ACCESS_GRANTED'
  | 'ACCESS_DENIED'
  | 'EVIDENCE_TRANSFERRED'
  | 'CASE_CREATED'
  | 'CASE_MODIFIED'
  | 'LEGAL_HOLD_TOGGLED'
  | string;

export interface AuditEvent {
  id: string;
  timestamp: string;
  user: string;
  userId?: string;
  role: string;
  action: AuditActionType;
  caseId?: string;
  evidenceId?: string;
  documentId?: string;
  ip: string;
  device: string;
  result: 'SUCCESS' | 'DENIED' | 'ALERT' | 'FAILED' | string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  details: string;
  hashRecord?: string;
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  sourceIp: string;
  targetResource: string;
  status: 'ACTIVE' | 'INVESTIGATING' | 'MITIGATED' | 'RESOLVED';
  eventType: 'UNAUTHORIZED_ACCESS' | 'CLEARANCE_MISMATCH' | 'EXPIRED_TOKEN' | 'INTEGRITY_ALERT' | 'UNAUTHORIZED_DOWNLOAD' | 'RATE_LIMIT_EXCEEDED';
  actionTaken?: string;
}

// Retain alias for existing imports
export type SecurityThreat = SecurityEvent;

export interface SecurityAlert {
  id: string;
  timestamp: string;
  level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
  title: string;
  source: string;
  description: string;
  acknowledged: boolean;
  relatedCaseId?: string;
  evidenceId?: string;
}

export interface OfficerProfile {
  id: string;
  name: string;
  rank: string;
  clearanceLevel: number;
  clearanceName: string;
  department: string;
  activeSessionDuration: string;
  terminalNode: string;
  publicKey?: string;
  roles: UserRole[];
}

export interface ExtractedEntity {
  category: 'OFFICER' | 'ACCUSED / PERSON' | 'LOCATION' | 'DATE' | 'CASE NUMBER' | 'POLICE STATION' | 'LEGAL SECTION' | 'IP_ADDRESS' | 'PHONE_NUMBER' | 'VEHICLE_NO' | string;
  value: string;
  confidence: number;
}

export interface DocumentIntelligenceAnalysis {
  documentId: string;
  documentName: string;
  caseId: string;
  ocrConfidence: number;
  documentType: DocumentCategory | string;
  extractedEntities: ExtractedEntity[];
  aiSummary: string;
  keywords: string[];
  riskScore: number;
  statutorySections: string[];
  tamperAnomalyDetected: boolean;
  analysisTimestamp: string;
  section65BCompliant: boolean;
}

export type AIForensicAnalysis = DocumentIntelligenceAnalysis;

export interface ActiveSession {
  id: string;
  userId: string;
  userName: string;
  role: string;
  ipAddress: string;
  device: string;
  status: 'ACTIVE' | 'IDLE' | 'REVOKED';
  startedAt: string;
  expiresIn: string;
}

export interface ForensicStats {
  totalCases: number;
  totalDocuments: number;
  totalEvidenceItems: number;
  integrityVerifiedPercent: number;
  legalHoldCount: number;
  pendingReviewsCount: number;
  activeSecurityEvents: number;
  totalAuditEvents: number;
  sharedDocsCount: number;
}

export interface IngestionStepProgress {
  step: number;
  label: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  log: string;
}
