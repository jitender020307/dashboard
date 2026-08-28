import { CaseItem, SecurityAlert, OfficerProfile, CaseDocument } from '../types';

export const CURRENT_OFFICER: OfficerProfile = {
  id: 'IO-1042',
  name: 'Special Agent K. Vance',
  rank: 'Senior Digital Forensic Examiner',
  clearanceLevel: 4,
  clearanceName: 'LEVEL 4 // TOP SECRET / SCI',
  department: 'Federal Cyber Defense & Forensics Division',
  activeSessionDuration: '02h 47m 18s',
  terminalNode: 'SEC-TERM-NODE-78B',
  publicKey: '04:8F:72:A9:1C:45:D2:98:AF:33:41:55:06:B6:D4:F5:9E:0B:10:B9:81:42:77:99',
  roles: ['SUPER_ADMIN', 'INVESTIGATOR', 'FORENSIC_ANALYST']
};

export const INITIAL_CASES: CaseItem[] = [
  {
    id: '#INV-2026-00421',
    title: 'Operation Cipher Break: Quantum Key Exfiltration',
    status: 'ACTIVE',
    classification: 'CONFIDENTIAL',
    leadOfficer: {
      id: 'IO-1042',
      name: 'Special Agent K. Vance',
      rank: 'Senior Forensic Investigator',
      department: 'Cyber Forensics Unit'
    },
    documentsCount: 42,
    evidenceCount: 18,
    dateInitiated: '2026-06-12',
    lastUpdated: '2026-08-26 18:42:10 UTC',
    summary: 'Investigation into unauthorized interception and extraction of encrypted aerospace telemetry data over satellite link 9A-Orbital.',
    integrityHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    securityClearanceLevel: 2,
    tags: ['Cyber', 'Telemetry', 'Satellite', 'Classified Comms'],
    suspects: [
      {
        id: 'SUS-01',
        name: 'Dmitri Voronov',
        alias: 'Spectre_99',
        status: 'FUGITIVE',
        biometricMatchRate: 94.8,
        lastKnownLocation: 'Sector 7 Port Terminal, Geneva',
        notes: 'Suspected operator of rogue SDR relay station intercepted on 2026-07-04.'
      },
      {
        id: 'SUS-02',
        name: 'Elena Rostova',
        alias: 'NullPointer',
        status: 'PERSON_OF_INTEREST',
        biometricMatchRate: 88.2,
        lastKnownLocation: 'Zurich Financial District',
        notes: 'Financial conduit transferring anonymized tether tokens for hardware acquisition.'
      }
    ],
    evidenceItems: [
      {
        id: 'EV-421-01',
        name: 'Samsung 990 PRO NVMe SSD (2TB)',
        type: 'DIGITAL_STORAGE',
        description: 'Physical disk recovered from clandestine server rack in Zurich sub-station. Contains raw unencrypted exfiltration logs.',
        collectedDate: '2026-07-14',
        collectedBy: 'IO-1042',
        locationFound: 'Zurich Sub-Station #4, Vault Rack C',
        status: 'IN_VAULT',
        digitalHashSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
        digitalHashVerified: true,
        storageLocker: 'LOCKER-CYBER-A12',
        fileSize: '1.84 TB',
        fileExtension: '.raw.img',
        metadata: {
          'File System': 'EXT4 Encrypted (Decoded)',
          'Partitions': '3',
          'Sector Size': '4096 bytes',
          'Write Blocker Used': 'Tableau T8u USB 3.0 Bridge'
        }
      },
      {
        id: 'EV-421-02',
        name: 'HackRF One SDR Transceiver & Antenna Array',
        type: 'PHYSICAL_SAMPLE',
        description: 'Software-defined radio module configured to tap Ku-band commercial satellite downlink channels.',
        collectedDate: '2026-07-14',
        collectedBy: 'IO-1042',
        locationFound: 'Rooftop Dish Array, Zurich',
        status: 'IN_VAULT',
        digitalHashSha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
        digitalHashVerified: true,
        storageLocker: 'VAULT-SEC-09',
        metadata: {
          'Frequency Range': '1MHz - 6GHz',
          'Serial Number': 'HRF-2024-998124',
          'Firmware Mod': 'Custom ChaosEngine v3.1'
        }
      },
      {
        id: 'EV-421-03',
        name: 'Wiretap Audio Intercept: Comms Relay #104',
        type: 'AUDIO_INTERCEPT',
        description: 'Decrypted voice over VoIP conversation discussing package drop at Terminal 4.',
        collectedDate: '2026-07-28',
        collectedBy: 'IO-0988',
        locationFound: 'SIP Server Node #18 (Geneva)',
        status: 'FORENSIC_LAB',
        digitalHashSha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
        digitalHashVerified: true,
        storageLocker: 'CLOUD-SEC-STORAGE-01',
        fileSize: '28.4 MB',
        fileExtension: '.flac',
        metadata: {
          'Duration': '04m 12s',
          'Sample Rate': '48kHz 24-bit',
          'Voice ID Match': 'Voronov, Dmitri (96.2%)'
        }
      },
      {
        id: 'EV-421-04',
        name: 'Surveillance CCTV: Geneva Terminal 4 Drop Point',
        type: 'VIDEO_SURVEILLANCE',
        description: 'High-definition 4K footage capturing individual matching Suspect-01 carrying encrypted briefcase.',
        collectedDate: '2026-08-01',
        collectedBy: 'IO-1042',
        locationFound: 'Terminal 4 Gate 12 Security Cam',
        status: 'IN_VAULT',
        digitalHashSha256: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
        digitalHashVerified: true,
        storageLocker: 'CLOUD-SEC-STORAGE-02',
        fileSize: '1.2 GB',
        fileExtension: '.mp4',
        metadata: {
          'Resolution': '3840x2160 @ 60fps',
          'Codec': 'H.265 / HEVC',
          'Timestamp Encoded': '2026-08-01 22:14:09 UTC'
        }
      }
    ],
    chainOfCustody: [
      {
        id: 'COC-001',
        timestamp: '2026-07-14 14:30:00 UTC',
        actorId: 'IO-1042',
        actorName: 'Special Agent K. Vance',
        action: 'VAULT_INGESTION',
        details: 'Seized NVMe drive cataloged, write-blocked, bitstream image generated (E01 format) and placed into Vault Locker A12.',
        cryptographicSignature: 'SIG-RSA4096-78A90B22C1',
        verified: true
      },
      {
        id: 'COC-002',
        timestamp: '2026-07-18 09:15:00 UTC',
        actorId: 'LAB-TECH-04',
        actorName: 'Dr. Marcus Aris (Forensics)',
        action: 'TRANSFER_TO_LAB',
        details: 'Checked out drive image copy for filesystem carving and decryption analysis.',
        cryptographicSignature: 'SIG-RSA4096-33D41E90F4',
        verified: true
      },
      {
        id: 'COC-003',
        timestamp: '2026-08-26 11:00:00 UTC',
        actorId: 'SYS-AUDIT',
        actorName: 'Automated Integrity Watchdog',
        action: 'CHAIN_VERIFICATION',
        details: 'Routine SHA-256 integrity check completed. All 18 evidence hashes 100% matched baseline manifest.',
        cryptographicSignature: 'SIG-ECDSA-P384-9988AF',
        verified: true
      }
    ],
    documents: [
      {
        id: 'DOC-421-W1',
        title: 'Federal Search & Seizure Warrant #SW-2026-908',
        category: 'SEARCH_WARRANT',
        dateCreated: '2026-07-12',
        author: 'Hon. Magistrate Judge H. Thorne',
        classification: 'CONFIDENTIAL',
        contentSnippet: 'Authorizing immediate physical and electronic entry to premises at Zurich Industrial Boulevard 44 to seize computing apparatus, network storage, and transceiver equipment.',
        pagesCount: 8,
        status: 'VERIFIED',
        caseId: '#INV-2026-00421'
      },
      {
        id: 'DOC-421-R2',
        title: 'Digital Forensic Technical Examination Report',
        category: 'FORENSIC_ANALYSIS',
        dateCreated: '2026-07-22',
        author: 'Special Agent K. Vance',
        classification: 'CONFIDENTIAL',
        contentSnippet: 'Analysis of recovered partitions revealed 4.2 million packet captures containing unencrypted military communications stream fragments.',
        pagesCount: 24,
        status: 'VERIFIED',
        caseId: '#INV-2026-00421'
      }
    ],
    timeline: [
      {
        id: 'TL-1',
        date: '2026-06-12',
        title: 'Anomaly Detected in Downlink Telemetry',
        description: 'Satellite ground control noticed unauthorized secondary carrier wave on Ku-Band transponder 4.',
        source: 'Orbital Ops Command'
      },
      {
        id: 'TL-2',
        date: '2026-07-14',
        title: 'Tactical Raid & Hardware Seizure',
        description: 'Federal agents executed warrant SW-2026-908 at Zurich facility. Secured server arrays.',
        source: 'Field Tactical Team Alpha'
      },
      {
        id: 'TL-3',
        date: '2026-08-01',
        title: 'Airport Intercept & Briefcase Recovery',
        description: 'Suspect Voronov spotted at Geneva airport; abandoned secondary drive in departure lounge.',
        source: 'Border & Customs Enforcement'
      }
    ]
  },
  {
    id: '#INV-2026-00422',
    title: 'Project DarkFlow: Intercepted Defense Blueprints',
    status: 'ACTIVE',
    classification: 'RESTRICTED',
    leadOfficer: {
      id: 'IO-0988',
      name: 'Agent Sarah Chen',
      rank: 'Senior Cyber Investigator',
      department: 'Special Investigations Bureau'
    },
    documentsCount: 115,
    evidenceCount: 4,
    dateInitiated: '2026-05-19',
    lastUpdated: '2026-08-25 09:12:44 UTC',
    summary: 'Investigation into unauthorized dissemination of composite armor manufacturing specifications and stealth drone avionics schematics.',
    integrityHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    securityClearanceLevel: 3,
    tags: ['Defense', 'Industrial Espionage', 'Avionics', 'CAD Schematics'],
    suspects: [
      {
        id: 'SUS-03',
        name: 'Victor Sterling',
        alias: 'Vanguard_Actual',
        status: 'IN_CUSTODY',
        biometricMatchRate: 99.4,
        lastKnownLocation: 'Federal Detention Center, Unit C',
        notes: 'Former lead materials engineer at AeroCorp Defense Systems.'
      }
    ],
    evidenceItems: [
      {
        id: 'EV-422-01',
        name: 'Micro-SD Card 512GB (Sandisk Extreme)',
        type: 'DIGITAL_STORAGE',
        description: 'Recovered from inside hollowed-out fountain pen during security checkpoint pat-down.',
        collectedDate: '2026-05-20',
        collectedBy: 'IO-0988',
        locationFound: 'Airport Security Checkpoint 3',
        status: 'IN_VAULT',
        digitalHashSha256: 'bc94a2e3519c2989b52a12903820fa84618e47f2ef8c1308a32a688fb4ff9f92',
        digitalHashVerified: true,
        storageLocker: 'LOCKER-MINI-04',
        fileSize: '412 GB',
        fileExtension: '.tar.gz',
        metadata: {
          'File System': 'exFAT Encrypted',
          'CAD Files Extracted': '1,420 .dwg / .step files',
          'Classification Level': 'ITAR Restricted'
        }
      },
      {
        id: 'EV-422-02',
        name: 'Encrypted YubiKey 5C NFC Security Key',
        type: 'DIGITAL_STORAGE',
        description: 'Hardware authentication token configured to unlock private Git mirror repositories.',
        collectedDate: '2026-05-20',
        collectedBy: 'IO-0988',
        locationFound: 'Suspect Personal Effects',
        status: 'IN_VAULT',
        digitalHashSha256: '1a79a4d60de6718e8e5b326e338ae533fa85f99bf72ef83c84f47053e1b1d7d0',
        digitalHashVerified: true,
        storageLocker: 'VAULT-SEC-02'
      }
    ],
    chainOfCustody: [
      {
        id: 'COC-101',
        timestamp: '2026-05-20 18:00:00 UTC',
        actorId: 'IO-0988',
        actorName: 'Agent Sarah Chen',
        action: 'VAULT_INGESTION',
        details: 'Micro-SD card tagged, placed in Faraday tamper bag #TB-9011 and transferred to Secure Evidence Room.',
        cryptographicSignature: 'SIG-RSA4096-44B1299C01',
        verified: true
      }
    ],
    documents: [
      {
        id: 'DOC-422-W1',
        title: 'ITAR Export Violation Incident Docket',
        category: 'COURT_ORDER',
        dateCreated: '2026-05-21',
        author: 'Office of the US Attorney',
        classification: 'RESTRICTED',
        contentSnippet: 'Formal indictment charging suspect with unauthorized export of defense articles and technical data under Title 22 United States Code § 2778.',
        pagesCount: 32,
        status: 'VERIFIED',
        caseId: '#INV-2026-00422'
      }
    ],
    timeline: [
      {
        id: 'TL-10',
        date: '2026-05-19',
        title: 'Internal DLP Alert Triggered',
        description: 'Automated Data Loss Prevention system flagged mass export of 3D CAD models after hours.',
        source: 'AeroCorp CISO'
      }
    ]
  },
  {
    id: '#INV-2026-00418',
    title: 'Operation Iron Vault: Sovereign Cyber Warfare Syndicate',
    status: 'PENDING REVIEW',
    classification: 'TOP SECRET',
    leadOfficer: {
      id: 'IO-1042',
      name: 'Special Agent K. Vance',
      rank: 'Senior Forensic Investigator',
      department: 'Cyber Forensics Unit'
    },
    documentsCount: 2041,
    evidenceCount: 88,
    dateInitiated: '2026-01-08',
    lastUpdated: '2026-08-27 06:15:22 UTC',
    summary: 'Multi-jurisdictional taskforce probe investigating advanced persistent threat (APT-39) zero-day payload deployment targeting critical electrical grid SCADA controllers.',
    integrityHash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
    securityClearanceLevel: 4,
    tags: ['APT', 'SCADA', 'Critical Infrastructure', 'Zero-Day', 'Top Secret'],
    suspects: [
      {
        id: 'SUS-04',
        name: 'Colonel Alexei Morozov',
        alias: 'BlackOnyx',
        status: 'FUGITIVE',
        biometricMatchRate: 98.7,
        lastKnownLocation: 'St. Petersburg Cyber Warfare Command',
        notes: 'Director of specialized unit 74455 offensive cyber operations.'
      },
      {
        id: 'SUS-05',
        name: 'Yuki Takahashi',
        alias: 'GhostProtocol',
        status: 'PERSON_OF_INTEREST',
        biometricMatchRate: 91.0,
        lastKnownLocation: 'Shinjuku, Tokyo',
        notes: 'Brokered exploit zero-day vulnerability in Siemens S7-1500 PLC firmware.'
      }
    ],
    evidenceItems: [
      {
        id: 'EV-418-01',
        name: 'Siemens S7-1500 PLC Mainboard with Malicious Eprom',
        type: 'PHYSICAL_SAMPLE',
        description: 'Infected industrial programmable logic controller recovered from sub-station transformer station 9.',
        collectedDate: '2026-02-14',
        collectedBy: 'IO-1042',
        locationFound: 'Grid Sub-station Alpha-1',
        status: 'IN_VAULT',
        digitalHashSha256: '7d793037a0760186574b0282f2f435e7b1eef57726d441d5b843fd76cb43e455',
        digitalHashVerified: true,
        storageLocker: 'VAULT-ALPHA-HIGH-SEC',
        metadata: {
          'Manufacturer': 'Siemens Industrial Automation',
          'Firmware Vulnerability': 'CVE-2026-9041 (Memory Corruption)',
          'Payload Hash': 'c249a0d8e2098...'
        }
      },
      {
        id: 'EV-418-02',
        name: 'Encrypted Cryptographic Ledger Cold Wallet (Trezor Model T)',
        type: 'FINANCIAL_LEDGER',
        description: 'Hardware wallet containing 4,200 Monero (XMR) utilized for zero-day exploit bounty payments.',
        collectedDate: '2026-03-01',
        collectedBy: 'IO-1042',
        locationFound: 'Safe Deposit Box #882, Zurich',
        status: 'IN_VAULT',
        digitalHashSha256: 'e8605c3167f1396a5d4d3d3c73bb1b590e8c07e052011b984594c7b8d4c72856',
        digitalHashVerified: true,
        storageLocker: 'VAULT-ALPHA-HIGH-SEC',
        metadata: {
          'Coin Type': 'Monero (XMR)',
          'Transaction Volume': '14 Recorded Escrow Transfers',
          'Passphrase Status': 'Decrypted by Quantum Lab'
        }
      },
      {
        id: 'EV-418-03',
        name: 'Satellite Reconnaissance Video: Facility 409',
        type: 'VIDEO_SURVEILLANCE',
        description: 'High-res synthetic aperture radar video capturing night operations at suspected command bunker.',
        collectedDate: '2026-04-18',
        collectedBy: 'NRO-TASKFORCE',
        locationFound: 'Orbital Recon Grid Sat-8',
        status: 'IN_VAULT',
        digitalHashSha256: '3f79bb7b435b05321651daefd374cdc681dc06faa65e374e38337b88ca14539f',
        digitalHashVerified: true,
        storageLocker: 'VAULT-ALPHA-HIGH-SEC',
        fileSize: '4.8 GB',
        fileExtension: '.raw.mov'
      }
    ],
    chainOfCustody: [
      {
        id: 'COC-201',
        timestamp: '2026-02-14 20:00:00 UTC',
        actorId: 'IO-1042',
        actorName: 'Special Agent K. Vance',
        action: 'VAULT_INGESTION',
        details: 'Physical PLC hardware and memory chips placed into Level-4 High-Sec SCIF Vault Alpha.',
        cryptographicSignature: 'SIG-ED25519-998811AABB',
        verified: true
      },
      {
        id: 'COC-202',
        timestamp: '2026-08-27 05:00:00 UTC',
        actorId: 'IO-1042',
        actorName: 'Special Agent K. Vance',
        action: 'CHAIN_VERIFICATION',
        details: 'Case dossier and 88 physical evidence lockers audited for Grand Jury submission.',
        cryptographicSignature: 'SIG-ED25519-667788CCDD',
        verified: true
      }
    ],
    documents: [
      {
        id: 'DOC-418-TS1',
        title: 'National Security Directive // Presidential Findings Memo',
        category: 'FORENSIC_ANALYSIS',
        dateCreated: '2026-03-10',
        author: 'Director of National Intelligence',
        classification: 'TOP SECRET',
        contentSnippet: 'DECLASSIFICATION PROHIBITED UNDER E.O. 13526. Detailed threat assessment on foreign adversary state-sponsored cyber warfare capabilities.',
        pagesCount: 88,
        status: 'SEALED',
        caseId: '#INV-2026-00418'
      }
    ],
    timeline: [
      {
        id: 'TL-21',
        date: '2026-01-08',
        title: 'Sub-station 9 Grid Spike & Relay Trip',
        description: 'Catastrophic frequency oscillation detected at power grid junction Alpha.',
        source: 'National Grid Control Center'
      }
    ]
  },
  {
    id: '#INV-2026-00409',
    title: 'Operation Ghost Courier: Darknet Narcotics Syndicate',
    status: 'UNDER TRIAL',
    classification: 'RESTRICTED',
    leadOfficer: {
      id: 'IO-0988',
      name: 'Agent Sarah Chen',
      rank: 'Senior Cyber Investigator',
      department: 'Special Investigations Bureau'
    },
    documentsCount: 520,
    evidenceCount: 31,
    dateInitiated: '2025-11-04',
    lastUpdated: '2026-08-20 14:10:00 UTC',
    summary: 'Investigation into automated postal dispatch network distributing controlled pharmaceutical substances ordered via Tor hidden services.',
    integrityHash: 'c4ca4238a0b923820dcc509a6f75849b29e0186716035129994c6f3764d85202',
    securityClearanceLevel: 2,
    tags: ['Darknet', 'Narcotics', 'Tor', 'Cryptocurrency'],
    suspects: [
      {
        id: 'SUS-06',
        name: 'Julian Hayes',
        alias: 'Dr_Pharma',
        status: 'IN_CUSTODY',
        biometricMatchRate: 99.9,
        lastKnownLocation: 'Metropolitan Detention Center',
        notes: 'Arrested during raid on automated sorting facility.'
      }
    ],
    evidenceItems: [
      {
        id: 'EV-409-01',
        name: 'PGP Private Key Ring & Passphrase Keyring',
        type: 'DIGITAL_STORAGE',
        description: 'Decrypted 4096-bit RSA master key used to sign marketplace communications.',
        collectedDate: '2025-11-20',
        collectedBy: 'IO-0988',
        locationFound: 'Server Room #2',
        status: 'COURT_EVIDENCE',
        digitalHashSha256: '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72',
        digitalHashVerified: true,
        storageLocker: 'VAULT-SEC-05'
      }
    ],
    chainOfCustody: [],
    documents: [],
    timeline: []
  },
  {
    id: '#INV-2026-00395',
    title: 'Financial Crime Case: Offshore Shell Banking Laundering',
    status: 'RESOLVED',
    classification: 'CONFIDENTIAL',
    leadOfficer: {
      id: 'IO-1042',
      name: 'Special Agent K. Vance',
      rank: 'Senior Forensic Investigator',
      department: 'Cyber Forensics Unit'
    },
    documentsCount: 940,
    evidenceCount: 14,
    dateInitiated: '2025-08-11',
    lastUpdated: '2026-06-15 16:30:00 UTC',
    summary: 'Completed prosecution of multi-tiered money laundering funnel through bogus maritime leasing corporations.',
    integrityHash: 'eccbc87e4b5ce2fe28308fd9f2a7baf3a41b2c4516fc415951d38fc5500e3f16',
    securityClearanceLevel: 1,
    tags: ['Financial', 'Shell Corporations', 'Maritime', 'Asset Forfeiture'],
    suspects: [],
    evidenceItems: [],
    chainOfCustody: [],
    documents: [],
    timeline: []
  }
];

export const INITIAL_ALERTS: SecurityAlert[] = [
  {
    id: 'ALT-9042',
    timestamp: '2026-08-27 07:18:22 UTC',
    level: 'CRITICAL',
    title: 'Unauthorized Vault Locker Access Attempt',
    source: 'Hardware Vault SCIF Alpha (Locker #18)',
    description: 'Biometric badge rejected 3 consecutive times on Physical Evidence Locker #18 (Case #INV-2026-00418). Automatic lockdown engaged.',
    acknowledged: false,
    relatedCaseId: '#INV-2026-00418'
  },
  {
    id: 'ALT-9041',
    timestamp: '2026-08-27 06:45:10 UTC',
    level: 'HIGH',
    title: 'Subpoena Expiration Warning',
    source: 'Magistrate Court Automated Registry',
    description: 'Federal electronic surveillance order for IP subnet 185.220.101.0/24 expires in 48 hours. File extension request immediately.',
    acknowledged: false,
    relatedCaseId: '#INV-2026-00421'
  },
  {
    id: 'ALT-9039',
    timestamp: '2026-08-27 04:30:00 UTC',
    level: 'INFO',
    title: 'Scheduled Cryptographic Hash Audit Complete',
    source: 'Automated Integrity Daemon',
    description: '2,752 digital forensic files audited across 5 active vaults. 100% hash consistency verified with zero tampering detected.',
    acknowledged: true
  },
  {
    id: 'ALT-9038',
    timestamp: '2026-08-26 23:14:02 UTC',
    level: 'MEDIUM',
    title: 'Classification Clearance Elevation Logged',
    source: 'IAM Security Gateway',
    description: 'Agent IO-0988 granted temporary compartmented read access to Case #INV-2026-00422 for trial preparation.',
    acknowledged: true,
    relatedCaseId: '#INV-2026-00422'
  }
];
