import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { User, Mail, Phone, MapPin, Building, Calendar, Shield, FileText } from 'lucide-react';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
  }).format(value).replace('A$', '$');
}

export function DetailsTab() {
  const { selectedClient, contextMode } = useApp();
  
  // Mock additional client details
  const clientDetails = {
    phone: '+61 4' + Math.floor(Math.random() * 90000000 + 10000000),
    address: '123 Collins Street, Melbourne VIC 3000',
    accountType: selectedClient.type === 'private' ? 'Private Wealth' : 'Retail Investment',
    riskProfile: selectedClient.type === 'private' ? 'Balanced Growth' : 'Moderate',
    taxFileNumber: '*** *** ***',
    dateOfBirth: '15/03/1975',
    accountOpened: '12/06/2019',
    adviser: 'James Wilson',
    adviserEmail: 'james.wilson@dash.com.au',
    lastReview: '15/09/2024',
    nextReview: '15/03/2025',
  };
  
  const linkedAccounts = [
    { name: 'Individual Investment Account', type: 'Investment', value: selectedClient.totalPortfolioValue * 0.6 },
    { name: 'Superannuation Fund', type: 'Super', value: selectedClient.totalPortfolioValue * 0.3 },
    { name: 'Family Trust', type: 'Trust', value: selectedClient.totalPortfolioValue * 0.1 },
  ];

  return (
    <div className="space-y-6">
      {/* Client Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-surface p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Personal Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="w-4 h-4 text-muted-foreground mt-1" />
              <div>
                <p className="text-xs text-muted-foreground">Full Name</p>
                <p className="text-sm font-medium text-foreground">{selectedClient.name}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-muted-foreground mt-1" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-foreground">{selectedClient.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-muted-foreground mt-1" />
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm font-medium text-foreground">{clientDetails.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
              <div>
                <p className="text-xs text-muted-foreground">Address</p>
                <p className="text-sm font-medium text-foreground">{clientDetails.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-muted-foreground mt-1" />
              <div>
                <p className="text-xs text-muted-foreground">Date of Birth</p>
                <p className="text-sm font-medium text-foreground">{clientDetails.dateOfBirth}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card-surface p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Account Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Building className="w-4 h-4 text-muted-foreground mt-1" />
              <div>
                <p className="text-xs text-muted-foreground">Account Type</p>
                <p className="text-sm font-medium text-foreground">{clientDetails.accountType}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-4 h-4 text-muted-foreground mt-1" />
              <div>
                <p className="text-xs text-muted-foreground">Risk Profile</p>
                <span className={cn(
                  "inline-block text-xs font-medium px-2 py-1 rounded-full mt-1",
                  selectedClient.type === 'private' ? 'badge-private' : 'badge-retail'
                )}>
                  {clientDetails.riskProfile}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="w-4 h-4 text-muted-foreground mt-1" />
              <div>
                <p className="text-xs text-muted-foreground">TFN</p>
                <p className="text-sm font-medium text-foreground">{clientDetails.taxFileNumber}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-muted-foreground mt-1" />
              <div>
                <p className="text-xs text-muted-foreground">Account Opened</p>
                <p className="text-sm font-medium text-foreground">{clientDetails.accountOpened}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Adviser Information */}
      <div className="card-surface p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Adviser Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-muted-foreground">Assigned Adviser</p>
            <p className="text-sm font-medium text-foreground mt-1">{clientDetails.adviser}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Adviser Email</p>
            <p className="text-sm font-medium text-foreground mt-1">{clientDetails.adviserEmail}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Last Review</p>
            <p className="text-sm font-medium text-foreground mt-1">{clientDetails.lastReview}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Next Review Due</p>
            <p className="text-sm font-medium text-primary mt-1">{clientDetails.nextReview}</p>
          </div>
        </div>
      </div>
      
      {/* Linked Accounts */}
      <div className="card-surface p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Linked Accounts</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground uppercase">Account Name</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground uppercase">Type</th>
                <th className="py-3 px-4 text-right text-xs font-semibold text-muted-foreground uppercase">Value</th>
              </tr>
            </thead>
            <tbody>
              {linkedAccounts.map((account, idx) => (
                <tr key={idx} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-foreground">{account.name}</td>
                  <td className="py-3 px-4">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">
                      {account.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-foreground text-right tabular-nums font-medium">
                    {formatCurrency(account.value)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-surface">
                <td colSpan={2} className="py-3 px-4 text-sm font-semibold text-foreground">Total</td>
                <td className="py-3 px-4 text-sm font-bold text-foreground text-right tabular-nums">
                  {formatCurrency(selectedClient.totalPortfolioValue)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
