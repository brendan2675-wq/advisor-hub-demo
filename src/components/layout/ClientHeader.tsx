import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'dashboard', label: 'DASHBOARD' },
  { id: 'portfolio', label: 'PORTFOLIO' },
  { id: 'performance', label: 'PERFORMANCE' },
  { id: 'gains', label: 'GAINS & LOSSES' },
  { id: 'transactions', label: 'TRANSACTIONS' },
  { id: 'details', label: 'DETAILS' },
  { id: 'reports', label: 'REPORTS' },
];

export function ClientHeader() {
  const { selectedClient, contextMode } = useApp();
  
  // Get initials from client name
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="border-b border-border bg-card">
      <div className="px-6 py-4 flex items-center gap-6">
        {/* Client Avatar */}
        <div className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold transition-colors duration-300",
          contextMode === 'private' ? 'bg-private text-white' : 'bg-primary text-primary-foreground'
        )}>
          {getInitials(selectedClient.name)}
        </div>
        
        {/* Client Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">{selectedClient.name}</h2>
            <span className={cn(
              "text-xs px-2 py-0.5 rounded font-medium",
              contextMode === 'private' ? 'badge-private' : 'badge-retail'
            )}>
              {selectedClient.type === 'private' ? 'Private' : 'Retail'}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{selectedClient.email}</p>
        </div>

        {/* Horizontal Tabs */}
        <nav className="flex items-center gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={cn(
                "px-3 py-2 text-xs font-medium tracking-wide transition-colors duration-200 relative",
                tab.id === 'portfolio' 
                  ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
