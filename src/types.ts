export type CaseStatus = 'ACTIVE' | 'PENDING REVIEW' | 'UNDER TRIAL' | 'RESOLVED' | 'ARCHIVED';

export type ClassificationLevel = 'CONFIDENTIAL' | 'RESTRICTED' | 'TOP SECRET' | 'UNCLASSIFIED';

export type UserRole = 'SUPER_ADMIN' | 'INVESTIGATOR' | 'FORENSIC_ANALYST' | 'AUDITOR' | 'JUDGE' | 'GUEST' | string;

export type ClearanceLevel = 'TOP SECRET' | 'RESTRICTED' | 'CONFIDENTIAL' | 'UNCLASSIFIED' | string;

export type EvidenceType = 
  | 'DIGITAL_STORAGE'
  | 'AUDIO_INTERCEPT'
  | 'VIDEO_SURVEILLANCE'
  | 'BALLISTICS'
  | 'FINANCIAL_LEDGER'
  | 'PHYSICAL_SAMPLE'
  | 'BIOMETRIC'
  | 'DOC_PDF'
  | 'DOC_SCAN'
  | 'MEMORY_DUMP'
  | string;

export type EvidenceStatus = 'IN_VAULT' | 'FORENSIC_LAB' | 'COURT_EVIDENCE' | 'CHECKED_OUT' | 'ARCHIVED' | string;

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
  encryptionStatus?: 'AES-256-GCM' | 'RSA-4096' | 'CHACHA20-POLY1305' | string;
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

export interface CaseDocument {
  id: string;
  title: string;
  category: 'SEARCH_WARRANT' | 'FORENSIC_ANALYSIS' | 'INTERCEPT_TRANSCRIPT' | 'BALLISTIC_REPORT' | 'WITNESS_DEPOSITION' | 'COURT_ORDER' | 'FIR_RECORD' | string;
  dateCreated: string;
  author: string;
  classification: ClassificationLevel;
  contentSnippet: string;
  fullText?: string;
  pagesCount: number;
  status: 'VERIFIED' | 'PENDING_APPROVAL' | 'SEALED' | string;
  caseId: string;
  sha256Hash?: string;
  digitalSignature?: string;
  isSigned?: boolean;
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
}

export type AuditActionType =
  | 'LOGIN'
  | 'LOGOUT'
  | 'UPLOAD'
  | 'DOWNLOAD'
  | 'VIEW'
  | 'SHARE'
  | 'DELETE'
  | 'HASH_GENERATED'
  | 'HASH_VERIFIED'
  | 'HASH_MISMATCH'
  | 'SIGNATURE_CREATED'
  | 'SIGNATURE_VERIFIED'
  | 'ACCESS_GRANTED'
  | 'ACCESS_DENIED'
  | 'EVIDENCE_TRANSFERRED'
  | 'CASE_CREATED'
  | 'MALWARE_SCAN_PASSED'
  | 'TAMPER_SIMULATION_TRIGGERED'
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
  severity: 'INFO' | 'WARNING' | 'CRITICAL' | string;
  details: string;
  hashRecord?: string;
}

export interface SecurityThreat {
  id: string;
  timestamp: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  sourceIp: string;
  targetResource: string;
  status: 'ACTIVE' | 'INVESTIGATING' | 'MITIGATED' | 'BLOCKED';
  vector: string;
  actionTaken?: string;
}

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
  roles: string[];
}

export interface ExtractedEntity {
  category: 'PERSON' | 'LOCATION' | 'DATE' | 'CASE NUMBER' | 'POLICE STATION' | 'LEGAL SECTION' | 'IP_ADDRESS' | 'CRYPTOCURRENCY_WALLET' | string;
  value: string;
  confidence: number;
}

export interface AIForensicAnalysis {
  documentId: string;
  documentName: string;
  caseId: string;
  ocrConfidence: number;
  documentType: 'FIR' | 'CHARGE_SHEET' | 'FORENSIC_EXAMINATION' | 'SEARCH_WARRANT' | 'CYBER_INCIDENT_REPORT' | string;
  extractedEntities: ExtractedEntity[];
  aiSummary: string;
  keywords: string[];
  riskScore: number;
  tamperAnomalyDetected: boolean;
  analysisTimestamp: string;
}

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
  totalEvidenceItems: number;
  integrityVerifiedPercent: number;
  tamperAlertsCount: number;
  activeThreats: number;
  aiAnalysesCompleted: number;
  totalAuditEvents: number;
}

export interface IngestionStepProgress {
  step: number;
  label: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  log: string;
}
