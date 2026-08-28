import React, { useState } from 'react';
import {
  Users,
  Share2,
  ShieldCheck,
  Clock,
  Trash2,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Eye,
  FileText
} from 'lucide-react';
import { ManagedDocument, SharedAccessRecord, OfficerProfile } from '../types';

interface SecureCollaborationViewProps {
  documents: ManagedDocument[];
  officer: OfficerProfile;
  onOpenDocDetail: (doc: ManagedDocument) => void;
  onRevokeShare: (docId: string, shareId: string) => void;
  onAddShare: (docId: string, shareData: Partial<SharedAccessRecord>) => void;
}

export const SecureCollaborationView: React.FC<SecureCollaborationViewProps> = ({
  documents,
  officer,
  onOpenDocDetail,
  onRevokeShare,
  onAddShare,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Flatten all active shares
  const allShares: { doc: ManagedDocument; share: SharedAccessRecord }[] = [];
  documents.forEach((doc) => {
    doc.sharedWith.forEach((share) => {
      allShares.push({ doc, share });
    });
  });

  const filteredShares = allShares.filter(({ doc, share }) => {
    const matchesSearch =
      share.sharedWithUserName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      share.documentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      share.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.caseId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || share.sharedWithRole === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 text-slate-900 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
              Secure Collaboration Hub
            </span>
            <span className="text-xs text-slate-500">• Zero Public Links</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Role-Based Document Collaboration & Sharing
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Internal permission granting with strict temporal expiration, role gating, and immediate revocation audit logs.
          </p>
        </div>

        <div className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 shrink-0">
          <span>ACTIVE SHARES: <strong>{allShares.length}</strong></span>
        </div>
      </div>

      {/* Security Principles Info Banner */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs text-slate-700">
        <div className="font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Judicial Chain-of-Custody Sharing Rules</span>
        </div>
        <p className="leading-relaxed text-slate-600">
          Documents in this repository are strictly confidential investigation records. Sharing is limited exclusively to authenticated case participants (Investigating Officers, Forensic Analysts, Legal Officers, and Appointed Reviewers). Every shared access token is watermarked and logged in the immutable audit trail.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Collaborator Name, Document Title, or Case ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 focus:bg-white text-xs text-slate-900 pl-9 pr-3 py-2 rounded-lg focus:outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-lg px-3 py-2 focus:border-slate-900 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Roles</option>
            <option value="LEGAL_OFFICER">Legal Officers</option>
            <option value="FORENSIC_ANALYST">Forensic Analysts</option>
            <option value="REVIEWER">Supervisory Reviewers</option>
            <option value="INVESTIGATING_OFFICER">Investigating Officers</option>
          </select>
        </div>
      </div>

      {/* Active Shares Table */}
      {filteredShares.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-xl text-slate-500 text-xs">
          No active collaboration shares found matching your filters.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Document Title & Case</th>
                  <th className="px-4 py-3">Shared With (Collaborator)</th>
                  <th className="px-4 py-3">Permission Level</th>
                  <th className="px-4 py-3">Shared By</th>
                  <th className="px-4 py-3">Expiration Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredShares.map(({ doc, share }) => (
                  <tr key={share.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{doc.title}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {doc.caseId} • ID: {doc.id}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{share.sharedWithUserName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{share.sharedWithRole}</div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-[11px] font-semibold text-slate-800">
                        {share.permission}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-slate-700 font-medium">
                      {share.sharedByUserName}
                    </td>

                    <td className="px-4 py-3 font-mono text-[11px] text-slate-700">
                      {share.expiresAt}
                    </td>

                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                        ACTIVE
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onOpenDocDetail(doc)}
                          className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded cursor-pointer"
                          title="View Document"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onRevokeShare(doc.id, share.id)}
                          className="px-2.5 py-1 text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Revoke Access</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
