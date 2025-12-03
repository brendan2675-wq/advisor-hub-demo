import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { FileText, Download, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export function ReportsTab() {
  const { selectedClient, contextMode } = useApp();
  
  const availableReports = [
    {
      name: 'Portfolio Valuation Report',
      description: 'Detailed breakdown of all holdings with current market values',
      category: 'Valuation',
      lastGenerated: '03/12/2024',
      status: 'ready',
    },
    {
      name: 'Performance Report',
      description: 'Time-weighted returns analysis across all periods',
      category: 'Performance',
      lastGenerated: '01/12/2024',
      status: 'ready',
    },
    {
      name: 'Capital Gains Tax Report',
      description: 'Realised and unrealised capital gains for tax purposes',
      category: 'Tax',
      lastGenerated: '30/11/2024',
      status: 'ready',
    },
    {
      name: 'Income Report',
      description: 'Dividend and interest income received during the period',
      category: 'Income',
      lastGenerated: '30/11/2024',
      status: 'ready',
    },
    {
      name: 'Transaction History',
      description: 'Complete record of all buy, sell, and corporate actions',
      category: 'Transactions',
      lastGenerated: '03/12/2024',
      status: 'ready',
    },
    {
      name: 'Asset Allocation Report',
      description: 'Current portfolio composition by asset class and sector',
      category: 'Analysis',
      lastGenerated: '03/12/2024',
      status: 'ready',
    },
    {
      name: 'Annual Tax Summary',
      description: 'End of financial year tax summary for lodgement',
      category: 'Tax',
      lastGenerated: '15/07/2024',
      status: 'ready',
    },
    {
      name: 'Risk Analysis Report',
      description: 'Portfolio risk metrics and diversification analysis',
      category: 'Analysis',
      lastGenerated: null,
      status: 'pending',
    },
  ];
  
  const recentReports = [
    { name: 'Portfolio Valuation - Nov 2024', date: '01/12/2024', size: '245 KB' },
    { name: 'Performance Report Q3 2024', date: '15/10/2024', size: '189 KB' },
    { name: 'Tax Summary FY2024', date: '15/07/2024', size: '312 KB' },
    { name: 'Income Report FY2024', date: '15/07/2024', size: '156 KB' },
  ];

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Valuation': 'bg-blue-100 text-blue-700',
      'Performance': 'bg-green-100 text-green-700',
      'Tax': 'bg-orange-100 text-orange-700',
      'Income': 'bg-purple-100 text-purple-700',
      'Transactions': 'bg-gray-100 text-gray-700',
      'Analysis': 'bg-cyan-100 text-cyan-700',
    };
    return colors[category] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-surface p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available Reports</p>
              <p className="text-xl font-bold text-foreground">{availableReports.length}</p>
            </div>
          </div>
        </div>
        <div className="card-surface p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gain/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-gain" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ready to Download</p>
              <p className="text-xl font-bold text-foreground">
                {availableReports.filter(r => r.status === 'ready').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card-surface p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Generation</p>
              <p className="text-xl font-bold text-foreground">
                {availableReports.filter(r => r.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Available Reports */}
      <div className="card-surface p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Generate Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableReports.map((report, idx) => (
            <div 
              key={idx} 
              className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {report.name}
                    </h4>
                    <span className={cn(
                      "text-xs font-medium px-2 py-0.5 rounded-full",
                      getCategoryColor(report.category)
                    )}>
                      {report.category}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{report.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {report.lastGenerated ? `Last generated: ${report.lastGenerated}` : 'Not yet generated'}
                  </div>
                </div>
                <button className={cn(
                  "p-2 rounded-lg transition-colors",
                  report.status === 'ready' 
                    ? "bg-primary/10 text-primary hover:bg-primary/20" 
                    : "bg-muted text-muted-foreground"
                )}>
                  {report.status === 'ready' ? (
                    <Download className="w-4 h-4" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Recent Downloads */}
      <div className="card-surface p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Downloads</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground uppercase">Report Name</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground uppercase">Generated</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground uppercase">Size</th>
                <th className="py-3 px-4 text-right text-xs font-semibold text-muted-foreground uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentReports.map((report, idx) => (
                <tr key={idx} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{report.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{report.date}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{report.size}</td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 ml-auto">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
