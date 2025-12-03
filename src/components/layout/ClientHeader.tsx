import { useState, useEffect } from 'react';
import { useApp, TabType } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const tabs: { id: TabType; label: string }[] = [
  { id: 'dashboard', label: 'DASHBOARD' },
  { id: 'portfolio', label: 'PORTFOLIO' },
  { id: 'performance', label: 'PERFORMANCE' },
  { id: 'gains', label: 'GAINS & LOSSES' },
  { id: 'transactions', label: 'TRANSACTIONS' },
  { id: 'details', label: 'DETAILS' },
  { id: 'reports', label: 'REPORTS' },
];

export function ClientHeader() {
  const { selectedClient, contextMode, activeTab, setActiveTab } = useApp();
  const [loadingTab, setLoadingTab] = useState<TabType | null>(null);
  const [showBadgePulse, setShowBadgePulse] = useState(true);
  
  // Get initials from client name
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Tab loading animation
  const handleTabClick = (tabId: TabType) => {
    if (tabId === activeTab) return;
    setLoadingTab(tabId);
    setTimeout(() => {
      setActiveTab(tabId);
      setLoadingTab(null);
    }, 300);
  };

  // Badge pulse animation on first appearance
  useEffect(() => {
    const timer = setTimeout(() => setShowBadgePulse(false), 1000);
    return () => clearTimeout(timer);
  }, [selectedClient.id]);

  useEffect(() => {
    setShowBadgePulse(true);
  }, [selectedClient.id]);

  return (
    <div className="border-b border-border bg-card">
      <div className="px-6 py-4 flex items-center gap-6">
        {/* Client Avatar */}
        <div className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold transition-all duration-300",
          contextMode === 'private' ? 'bg-private text-white' : 'bg-primary text-primary-foreground'
        )}>
          {getInitials(selectedClient.name)}
        </div>
        
        {/* Client Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">{selectedClient.name}</h2>
            <span className={cn(
              "text-xs px-2 py-0.5 rounded font-medium transition-transform duration-300",
              contextMode === 'private' ? 'badge-private' : 'badge-retail',
              showBadgePulse && 'animate-pulse-badge'
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
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                "px-3 py-2 text-xs font-medium tracking-wide transition-all duration-200 relative flex items-center gap-1.5",
                tab.id === activeTab 
                  ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {loadingTab === tab.id && (
                <Loader2 className="w-3 h-3 animate-spin" />
              )}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
