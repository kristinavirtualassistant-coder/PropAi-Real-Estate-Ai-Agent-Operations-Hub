import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, Sparkles, X, Database } from 'lucide-react';
import { TargetNiche, WholesalerLead, MaintenanceTicket } from '../types';

interface ImportLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeNiche: TargetNiche;
  onImportBulkLeads: (leads: WholesalerLead[]) => void;
  onImportBulkTickets: (tickets: MaintenanceTicket[]) => void;
}

export const ImportLeadsModal: React.FC<ImportLeadsModalProps> = ({
  isOpen,
  onClose,
  activeNiche,
  onImportBulkLeads,
  onImportBulkTickets
}) => {
  const [csvText, setCsvText] = useState<string>(
    activeNiche === 'wholesaler'
      ? `Address,Owner,Phone,Distress,Value\n402 Grand Ave,Michael Vance,(214) 555-0912,Tax Delinquent,290000\n1804 College St,Rebecca Cole,(817) 555-0321,Pre-Foreclosure,340000\n910 Park Blvd,David Ross,(972) 555-0772,Vacant Property,210000`
      : `Address,Unit,Tenant,Phone,Issue,Severity\n1208 Northwood,Apt 4,Chloe Adams,(214) 555-0112,Water heater leaking,high\n502 Oakway,Unit 1B,Marcus Vance,(817) 555-0441,No heat in bedroom,emergency`
  );
  const [importedSuccess, setImportedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleProcessImport = () => {
    const lines = csvText.trim().split('\n').slice(1); // skip header
    if (activeNiche === 'wholesaler') {
      const newLeads: WholesalerLead[] = lines.map((line, idx) => {
        const parts = line.split(',');
        return {
          id: `imp-lead-${Date.now()}-${idx}`,
          propertyAddress: parts[0]?.trim() || `Property ${idx + 1}`,
          cityStateZip: 'Dallas, TX',
          ownerName: parts[1]?.trim() || 'Property Owner',
          phone: parts[2]?.trim() || '(555) 019-2831',
          distressType: (parts[3]?.trim() as any) || 'Tax Delinquent',
          estimatedValue: Number(parts[4]?.trim()) || 300000,
          motivationScore: 7,
          status: 'new',
          conversation: []
        };
      });
      onImportBulkLeads(newLeads);
    } else {
      const newTickets: MaintenanceTicket[] = lines.map((line, idx) => {
        const parts = line.split(',');
        return {
          id: `TK-IMP-${idx + 100}`,
          propertyAddress: parts[0]?.trim() || 'Property Address',
          unit: parts[1]?.trim() || 'Unit 1',
          tenantName: parts[2]?.trim() || 'Tenant',
          tenantPhone: parts[3]?.trim() || '(555) 012-3912',
          issueDescription: parts[4]?.trim() || 'Maintenance issue reported',
          category: 'General',
          severity: (parts[5]?.trim() as any) || 'medium',
          status: 'submitted',
          createdAt: 'Just now',
          conversation: [],
          troubleshootingSteps: []
        };
      });
      onImportBulkTickets(newTickets);
    }

    setImportedSuccess(true);
    setTimeout(() => {
      setImportedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-5 shadow-2xl space-y-4">
        
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 border border-indigo-200">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Import {activeNiche === 'wholesaler' ? 'Off-Market Property Leads' : 'Property Door Roster'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">PropStream / County Records / CSV Paste</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <label className="block text-xs text-slate-700 font-bold mb-1">
            CSV File Data (Paste line-by-line):
          </label>
          <textarea
            rows={7}
            value={csvText}
            onChange={e => setCsvText(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-mono text-xs focus:outline-none focus:border-indigo-600"
          />
        </div>

        {importedSuccess ? (
          <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 justify-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Successfully imported properties into AI outreach pipeline!</span>
          </div>
        ) : (
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium">
              Cancel
            </button>
            <button
              onClick={handleProcessImport}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Upload className="w-4 h-4" />
              <span>Launch Bulk AI Campaign</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
