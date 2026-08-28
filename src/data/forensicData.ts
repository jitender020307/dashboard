import {
  EvidenceItem,
  CustodyEvent,
  AuditEvent,
  SecurityThreat,
  AIForensicAnalysis,
  ActiveSession,
  ForensicStats
} from '../types';

export const INITIAL_EVIDENCE_ITEMS: EvidenceItem[] = [
  {
    id: 'EV-2026-00421',
    name: 'investigation_report.pdf',
    type: 'DOC_PDF',
    description: 'Master Digital Forensics Incident Report with seized payload dumps and packet capture analysis.',
    collectedDate: '2026-07-14 09:42:00 UTC',
    collectedBy: 'Insp. Anil Sharma',
    currentCustodian: 'State Forensic Science Lab (Locker 04)',
    locationFound: 'Cyber Cell Forensic Lab #2',
    status: 'IN_VAULT',
    classification: 'CONFIDENTIAL',
    digitalHashSha256: '8F72A91C45D298AF72C10F826A91B82190A81234EFC0912478D8901234567890',
    currentHashSha256: '8F72A91C45D298AF72C10F826A91B82190A81234EFC0912478D8901234567890',
    digitalHashVerified: true,
    isTampered: false,
    encryptionStatus: 'AES-256 (At-Rest Enclave)',
    signatureStatus: 'VALID',
    signerName: 'Analyst Rahul Singh (Lead Examiner)',
    storageLocker: 'VAULT-LOCKER-ALPHA-01',
    fileSize: '14.8 MB',
    fileExtension: '.pdf',
    caseId: 'CASE-UP-CYB-2026-00421',
    metadata: {
      fileName: 'investigation_report.pdf',
      fileSize: '14.8 MB',
      mimeType: 'application/pdf',
      fileExtension: '.pdf',
      sha256: '8F72A91C45D298AF72C10F826A91B82190A81234EFC0912478D8901234567890',
      md5: '7D8F9A1B2C3D4E5F6A7B8C9D0E1F2A3B',
      creationDate: '2026-07-14 09:42:00 UTC',
      modificationDate: '2026-08-25 14:30:00 UTC',
      pageCount: 38,
      author: 'Cyber Forensics Unit Lead',
      writeBlockerUsed: 'Tableau T8u USB 3.0 Forensic Bridge',
      fileSystem: 'EXT4 Read-Only Mount',
      additional: {
        'Chain ID': 'COC-421-01',
        'Section 65B Certificate': 'ANNEXURE-65B-CERT-421',
        'Seizure Order': 'CJM/LKO/4412/2026'
      }
    }
  },
  {
    id: 'EV-2026-00422',
    name: 'samsung_990pro_raw_image.E01',
    type: 'DIGITAL_STORAGE',
    description: 'Forensic bitstream physical disk image (Expert Witness E01 format) of seized 2TB NVMe SSD from suspect server.',
    collectedDate: '2026-07-14 11:15:00 UTC',
    collectedBy: 'Insp. Anil Sharma',
    currentCustodian: 'Forensic Lab Storage Array',
    locationFound: 'Noida Hub Server Room C',
    status: 'FORENSIC_LAB',
    classification: 'RESTRICTED',
    digitalHashSha256: '9F86D081884C7D659A2FEAA0C55AD015A3BF4F1B2B0B822CD15D6C15B0F00A08',
    currentHashSha256: '9F86D081884C7D659A2FEAA0C55AD015A3BF4F1B2B0B822CD15D6C15B0F00A08',
    digitalHashVerified: true,
    isTampered: false,
    encryptionStatus: 'AES-256 Hardware Encrypted',
    signatureStatus: 'VALID',
    signerName: 'Insp. Anil Sharma & Independent Panchas',
    storageLocker: 'VAULT-ALPHA-HIGH-SEC',
    fileSize: '1.84 TB',
    fileExtension: '.E01',
    caseId: 'CASE-UP-CYB-2026-00421',
    metadata: {
      fileName: 'samsung_990pro_raw_image.E01',
      fileSize: '1.84 TB',
      mimeType: 'application/octet-stream',
      sha256: '9F86D081884C7D659A2FEAA0C55AD015A3BF4F1B2B0B822CD15D6C15B0F00A08',
      md5: 'E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6',
      deviceModel: 'Samsung SSD 990 PRO 2TB (S/N: S73UNF0R901234)',
      creationDate: '2026-07-14 11:15:00 UTC',
      writeBlockerUsed: 'WiebeTech Forensic DriveDock v5.5',
      fileSystem: 'NTFS / VMFS Dual Partition'
    }
  },
  {
    id: 'EV-2026-00108',
    name: 'wiretap_intercept_session_44.wav',
    type: 'AUDIO_RECORDING',
    description: 'Lawful intercept recording of suspect coordinating forged digital signature distribution across encrypted channel.',
    collectedDate: '2026-05-22 14:10:00 UTC',
    collectedBy: 'Insp. Priya Verma',
    currentCustodian: 'Mumbai Cyber Cell Evidence Repository',
    locationFound: 'Authorized Lawful Interception Gateway',
    status: 'IN_VAULT',
    classification: 'CONFIDENTIAL',
    digitalHashSha256: 'BC94A2E3519C2989B52A12903820FA84618E47F2EF8C1308A32A688FB4FF9F92',
    currentHashSha256: 'BC94A2E3519C2989B52A12903820FA84618E47F2EF8C1308A32A688FB4FF9F92',
    digitalHashVerified: true,
    isTampered: false,
    signatureStatus: 'VALID',
    signerName: 'Insp. Priya Verma',
    storageLocker: 'VAULT-LOCKER-BETA-02',
    fileSize: '124.5 MB',
    fileExtension: '.wav',
    caseId: 'CASE-MH-CYB-2026-00108',
    metadata: {
      fileName: 'wiretap_intercept_session_44.wav',
      fileSize: '124.5 MB',
      mimeType: 'audio/wav',
      sha256: 'BC94A2E3519C2989B52A12903820FA84618E47F2EF8C1308A32A688FB4FF9F92',
      creationDate: '2026-05-22 14:10:00 UTC',
      additional: {
        'Audio Duration': '42 mins 18 secs',
        'Sampling Rate': '48.0 kHz 24-bit PCM Uncompressed',
        'Intercept Authorization': 'Ministry Home Affairs Form-V Intercept #MHA/CYB/2026/891'
      }
    }
  },
  {
    id: 'EV-2026-00342',
    name: 'hospital_database_memory_dump.raw',
    type: 'MEMORY_DUMP',
    description: 'Volatile RAM image extracted from hospital core EHR server immediately following ransomware lock command.',
    collectedDate: '2026-03-09 04:30:00 UTC',
    collectedBy: 'Insp. Rajesh Kulkarni',
    currentCustodian: 'CID Cyber Forensics Division, Bengaluru',
    locationFound: 'Hospital Server Room, Rack 4 Blade 2',
    status: 'IN_VAULT',
    classification: 'RESTRICTED',
    digitalHashSha256: 'A591A6D40BF420404A011733CFB7B190D62C65BF0BCDA32B57B277D9AD9F146E',
    currentHashSha256: 'A591A6D40BF420404A011733CFB7B190D62C65BF0BCDA32B57B277D9AD9F146E',
    digitalHashVerified: true,
    isTampered: false,
    signatureStatus: 'VALID',
    signerName: 'Analyst S. Ramanathan',
    storageLocker: 'VAULT-LOCKER-GAMMA-09',
    fileSize: '64.0 GB',
    fileExtension: '.raw',
    caseId: 'CASE-KA-CYB-2026-00342'
  }
];

export const INITIAL_CUSTODY_EVENTS: CustodyEvent[] = [
  {
    id: 'COC-421-01',
    evidenceId: 'EV-2026-00421',
    caseId: 'CASE-UP-CYB-2026-00421',
    timestamp: '2026-07-14 09:42:00 UTC',
    actorId: 'IO-1042',
    actorName: 'Insp. Anil Sharma',
    actorRole: 'INVESTIGATING_OFFICER',
    action: 'COLLECTED',
    location: 'Cyber Cell Forensic Lab #2',
    deviceIp: '10.240.12.18',
    cryptographicSignature: '04:9A:88:C1:F2:77:81:90:E4:31:00:99:A1:B2:C3:D4:E5:F6:01:23',
    hash: '8F72A91C45D298AF72C10F826A91B82190A81234EFC0912478D8901234567890',
    remarks: 'Original investigative report compiled and locked with write-blocker.',
    verified: true
  },
  {
    id: 'COC-421-02',
    evidenceId: 'EV-2026-00421',
    caseId: 'CASE-UP-CYB-2026-00421',
    timestamp: '2026-07-14 11:15:00 UTC',
    actorId: 'IO-205',
    actorName: 'Officer J. Thorne (Evidence Custodian)',
    actorRole: 'VAULT_CUSTODIAN',
    action: 'INGESTED',
    location: 'Secure Evidence Room Node 78B',
    deviceIp: '10.240.14.05',
    cryptographicSignature: '04:12:34:56:78:9A:BC:DE:F0:12:34:56:78:9A:BC:DE:F0:12:34:56',
    hash: '8F72A91C45D298AF72C10F826A91B82190A81234EFC0912478D8901234567890',
    remarks: 'Evidence transferred to physical Vault Locker Alpha-01 with dual biometric custody handoff.',
    verified: true
  },
  {
    id: 'COC-421-03',
    evidenceId: 'EV-2026-00421',
    caseId: 'CASE-UP-CYB-2026-00421',
    timestamp: '2026-07-20 14:00:00 UTC',
    actorId: 'FA-091',
    actorName: 'Analyst Rahul Singh (Lead Examiner)',
    actorRole: 'FORENSIC_ANALYST',
    action: 'EXAMINED_LAB',
    location: 'State Forensic Science Laboratory (SFSL)',
    deviceIp: '10.240.22.40',
    cryptographicSignature: '04:FA:91:88:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11',
    hash: '8F72A91C45D298AF72C10F826A91B82190A81234EFC0912478D8901234567890',
    remarks: 'Bitstream verification executed under Section 65B Indian Evidence Act / Section 63 BSA. Checksum exactly matched.',
    verified: true
  },
  {
    id: 'COC-421-04',
    evidenceId: 'EV-2026-00421',
    caseId: 'CASE-UP-CYB-2026-00421',
    timestamp: '2026-08-25 14:30:00 UTC',
    actorId: 'LEGAL-08',
    actorName: 'Adv. Sanjay Deshmukh (Legal Officer)',
    actorRole: 'LEGAL_OFFICER',
    action: 'REVIEWED',
    location: 'Prosecution Legal Scrutiny Wing',
    deviceIp: '10.240.18.99',
    cryptographicSignature: '04:C8:D2:11:44:77:99:AA:BB:CC:DD:EE:FF:11:22:33:44:55:66:77',
    hash: '8F72A91C45D298AF72C10F826A91B82190A81234EFC0912478D8901234567890',
    remarks: 'Reviewed and certified for court submission as Prosecution Exhibit P-14.',
    verified: true
  }
];

export const INITIAL_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: 'AUD-99104',
    timestamp: '2026-08-27 10:20:14 UTC',
    user: 'Insp. Anil Sharma',
    userId: 'IO-1042',
    role: 'INVESTIGATING_OFFICER',
    action: 'DOCUMENT_VIEW',
    caseId: 'CASE-UP-CYB-2026-00421',
    documentId: 'DOC-2026-00421-FIR',
    ip: '10.240.12.18',
    device: 'Cyber Station Node 04 (Authorized)',
    result: 'SUCCESS',
    severity: 'INFO',
    details: 'Viewed First Information Report (FIR No. 142/2026) for court hearing preparation.',
    hashRecord: 'C1928374AFBC0912837465019283746591823746501928374650192837465019'
  },
  {
    id: 'AUD-99103',
    timestamp: '2026-08-27 09:45:00 UTC',
    user: 'Adv. Sanjay Deshmukh',
    userId: 'LEGAL-08',
    role: 'LEGAL_OFFICER',
    action: 'DOCUMENT_SHARED',
    caseId: 'CASE-UP-CYB-2026-00421',
    documentId: 'DOC-2026-00421-CHG',
    ip: '10.240.18.99',
    device: 'Prosecution Legal Terminal 02',
    result: 'SUCCESS',
    severity: 'INFO',
    details: 'Shared Charge Sheet draft with Supervisory Legal Scrutiny Board for 7 days.',
    hashRecord: 'EF2D127DE37B942BAAD06145E54B0C619A1F22327B2EBBCFBEC78F5564AFE39D'
  },
  {
    id: 'AUD-99102',
    timestamp: '2026-08-27 07:18:22 UTC',
    user: 'Unknown Session / AN-0419',
    userId: 'AN-0419',
    role: 'REVIEWER',
    action: 'ACCESS_DENIED',
    caseId: 'CASE-UP-CYB-2026-00421',
    documentId: 'DOC-2026-00421-REP',
    ip: '192.168.100.45',
    device: 'Unregistered Terminal',
    result: 'DENIED',
    severity: 'WARNING',
    details: 'Unauthorized download attempt on Level 3 Restricted Document without required supervisor authorization.',
    hashRecord: '8F72A91C45D298AF72C10F826A91B82190A81234EFC0912478D8901234567890'
  },
  {
    id: 'AUD-99101',
    timestamp: '2026-08-26 14:30:00 UTC',
    user: 'Analyst Rahul Singh',
    userId: 'FA-091',
    role: 'FORENSIC_ANALYST',
    action: 'DIGITAL_SIGNATURE_APPLIED',
    caseId: 'CASE-UP-CYB-2026-00421',
    documentId: 'DOC-2026-00421-REP',
    ip: '10.240.22.40',
    device: 'Forensic Lab Workstation 01',
    result: 'SUCCESS',
    severity: 'INFO',
    details: 'Applied PKI Digital Signature and Section 65B Electronic Certificate to version v2.1.',
    hashRecord: '8F72A91C45D298AF72C10F826A91B82190A81234EFC0912478D8901234567890'
  },
  {
    id: 'AUD-99100',
    timestamp: '2026-08-26 10:00:00 UTC',
    user: 'Insp. Anil Sharma',
    userId: 'IO-1042',
    role: 'INVESTIGATING_OFFICER',
    action: 'VERSION_CREATED',
    caseId: 'CASE-UP-CYB-2026-00421',
    documentId: 'DOC-2026-00421-CHG',
    ip: '10.240.12.18',
    device: 'Cyber Station Node 04',
    result: 'SUCCESS',
    severity: 'INFO',
    details: 'Created and ingested new version v1.0 of Final Charge Sheet under Section 193 BNSS.',
    hashRecord: 'EF2D127DE37B942BAAD06145E54B0C619A1F22327B2EBBCFBEC78F5564AFE39D'
  }
];

export const INITIAL_THREATS: SecurityThreat[] = [
  {
    id: 'SEC-EVT-01',
    timestamp: '2026-08-27 07:18:22 UTC',
    severity: 'HIGH',
    title: 'Clearance Mismatch on Restricted Forensic Report',
    description: 'User AN-0419 (Level 2 Clearance) attempted unauthorized download of Level 3 Restricted Document DOC-2026-00421-REP.',
    sourceIp: '192.168.100.45',
    targetResource: 'DOC-2026-00421-REP',
    status: 'ACTIVE',
    eventType: 'CLEARANCE_MISMATCH',
    actionTaken: 'Download blocked by RBAC filter; security event logged in audit ledger.'
  },
  {
    id: 'SEC-EVT-02',
    timestamp: '2026-08-26 19:40:11 UTC',
    severity: 'MEDIUM',
    title: 'Expired Access Token Used for Case Documents',
    description: 'Session attempted to access case documents using expired collaboration token SHR-000.',
    sourceIp: '10.240.19.88',
    targetResource: 'CASE-MH-CYB-2026-00108',
    status: 'RESOLVED',
    eventType: 'EXPIRED_TOKEN',
    actionTaken: 'Session invalidated, re-authentication requested.'
  }
];

export const INITIAL_AI_ANALYSES: Record<string, AIForensicAnalysis> = {
  'EV-2026-00421': {
    documentId: 'EV-2026-00421',
    documentName: 'investigation_report.pdf',
    caseId: 'CASE-UP-CYB-2026-00421',
    ocrConfidence: 99.8,
    documentType: 'FORENSIC_REPORT',
    aiSummary: 'Digital forensic investigation report detailing 14 unauthorized banking API interceptions, fraudulent diversion of Rs. 4.82 Crores, and forensic carving of NVMe storage arrays recovering suspect Telegram communication logs.',
    keywords: ['API Interception', 'SIM Box', 'Section 66D IT Act', 'NVMe Carving', 'Banking Escrow', 'Section 65B'],
    riskScore: 84,
    statutorySections: [
      'Section 66 (Computer Related Offences) IT Act 2000',
      'Section 66C (Identity Theft) IT Act 2000',
      'Section 66D (Cheating by Personation using Computer) IT Act 2000',
      'Section 318(4) Bharatiya Nyaya Sanhita (Cheating & Dishonesty)'
    ],
    tamperAnomalyDetected: false,
    analysisTimestamp: '2026-08-25 14:35:00 UTC',
    section65BCompliant: true,
    extractedEntities: [
      { category: 'OFFICER', value: 'Inspector Anil Sharma', confidence: 0.99 },
      { category: 'OFFICER', value: 'Analyst Rahul Singh', confidence: 0.98 },
      { category: 'ACCUSED / PERSON', value: 'Rakesh Kumar Tiwari (Spectre_99)', confidence: 0.97 },
      { category: 'ACCUSED / PERSON', value: 'Mohit Rawat (BitConduit)', confidence: 0.95 },
      { category: 'POLICE STATION', value: 'State Cyber Crime Police Station, Sector 18', confidence: 0.99 },
      { category: 'LOCATION', value: 'Noida Hub Server Room C', confidence: 0.96 },
      { category: 'LEGAL SECTION', value: 'Section 66D IT Act 2000', confidence: 0.99 },
      { category: 'LEGAL SECTION', value: 'Section 318(4) Bharatiya Nyaya Sanhita', confidence: 0.98 },
      { category: 'DATE', value: '14 July 2026', confidence: 0.99 },
      { category: 'CASE NUMBER', value: 'CASE-UP-CYB-2026-00421', confidence: 1.0 }
    ]
  },
  'DOC-2026-00421-FIR': {
    documentId: 'DOC-2026-00421-FIR',
    documentName: 'First Information Report (FIR No. 142/2026)',
    caseId: 'CASE-UP-CYB-2026-00421',
    ocrConfidence: 100.0,
    documentType: 'FIR',
    aiSummary: 'Formal First Information Report lodged at Cyber Crime Police Station on complaint of Chief Information Security Officer regarding unauthorized debit transactions.',
    keywords: ['FIR No 142/2026', 'Cognizable Offence', 'Cyber Crime Police Station'],
    riskScore: 75,
    statutorySections: ['Section 66C IT Act', 'Section 66D IT Act', 'Section 318 BNS'],
    tamperAnomalyDetected: false,
    analysisTimestamp: '2026-07-12 09:30:00 UTC',
    section65BCompliant: true,
    extractedEntities: [
      { category: 'OFFICER', value: 'Insp. Anil Sharma', confidence: 1.0 },
      { category: 'POLICE STATION', value: 'Cyber Crime Police Station', confidence: 1.0 },
      { category: 'DATE', value: '12 July 2026', confidence: 1.0 }
    ]
  }
};

export const INITIAL_ACTIVE_SESSIONS: ActiveSession[] = [
  {
    id: 'SESS-1042',
    userId: 'IO-1042',
    userName: 'Insp. Anil Sharma',
    role: 'INVESTIGATING_OFFICER',
    ipAddress: '10.240.12.18',
    device: 'Cyber Station Node 04 (Authorized)',
    status: 'ACTIVE',
    startedAt: '2026-08-27 08:00:00 UTC',
    expiresIn: '05h 12m'
  },
  {
    id: 'SESS-091',
    userId: 'FA-091',
    userName: 'Analyst Rahul Singh',
    role: 'FORENSIC_ANALYST',
    ipAddress: '10.240.22.40',
    device: 'Forensic Lab Workstation 01',
    status: 'ACTIVE',
    startedAt: '2026-08-27 08:30:00 UTC',
    expiresIn: '05h 42m'
  },
  {
    id: 'SESS-08',
    userId: 'LEGAL-08',
    userName: 'Adv. Sanjay Deshmukh',
    role: 'LEGAL_OFFICER',
    ipAddress: '10.240.18.99',
    device: 'Prosecution Legal Terminal 02',
    status: 'ACTIVE',
    startedAt: '2026-08-27 09:15:00 UTC',
    expiresIn: '06h 27m'
  }
];

export const INITIAL_FORENSIC_STATS: ForensicStats = {
  totalCases: 4,
  totalDocuments: 6,
  totalEvidenceItems: 4,
  integrityVerifiedPercent: 100,
  legalHoldCount: 5,
  pendingReviewsCount: 1,
  activeSecurityEvents: 1,
  totalAuditEvents: 5,
  sharedDocsCount: 4
};
