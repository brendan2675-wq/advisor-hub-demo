import { useState, useEffect } from 'react';
import { FileText, Calculator, BarChart3, Download, Mail, TrendingUp, Percent, Calendar, FileSpreadsheet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp, TabType } from '@/context/AppContext';

interface QuickAction {
  label: string;
  icon: React.ReactNode;
}

interface FABConfig {
  label: string;
  icon: React.ReactNode;
  actions: QuickAction[];
}

const tabConfigs: Partial<Record<TabType, FABConfig>> = {
  portfolio: {
    label: 'Generate Report',
    icon: <FileText className="w-5 h-5" />,
    actions: [
      { label: 'Performance Report', icon: <TrendingUp className="w-4 h-4" /> },
      { label: 'Holdings Summary', icon: <FileText className="w-4 h-4" /> },
      { label: 'Email Client', icon: <Mail className="w-4 h-4" /> },
    ],
  },
  gains: {
    label: 'Tax Report',
    icon: <Calculator className="w-5 h-5" />,
    actions: [
      { label: 'Generate Tax Report', icon: <Calculator className="w-4 h-4" /> },
      { label: 'Harvest Opportunities', icon: <Percent className="w-4 h-4" /> },
      { label: 'Compare Quarters', icon: <Calendar className="w-4 h-4" /> },
    ],
  },
  performance: {
    label: 'Compare',
    icon: <BarChart3 className="w-5 h-5" />,
    actions: [
      { label: 'Benchmark Comparison', icon: <BarChart3 className="w-4 h-4" /> },
      { label: 'Asset Class Performance', icon: <TrendingUp className="w-4 h-4" /> },
      { label: 'Export Charts', icon: <Download className="w-4 h-4" /> },
    ],
  },
  transactions: {
    label: 'Export',
    icon: <Download className="w-5 h-5" />,
    actions: [
      { label: 'Export CSV', icon: <FileSpreadsheet className="w-4 h-4" /> },
      { label: 'Export PDF', icon: <FileText className="w-4 h-4" /> },
      { label: 'Email Statement', icon: <Mail className="w-4 h-4" /> },
    ],
  },
};

// Tabs that show tables where FAB should move to left
const tableViewTabs: TabType[] = ['portfolio', 'gains'];

export function FloatingActionButton() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const { activeTab, contextMode, showToast } = useApp();

  const config = tabConfigs[activeTab];
  const isTableView = tableViewTabs.includes(activeTab);

  // Show repositioning tip once
  useEffect(() => {
    const tipShown = localStorage.getItem('fab-repositioning-tip-shown');
    if (!tipShown && isTableView) {
      setShowTip(true);
      localStorage.setItem('fab-repositioning-tip-shown', 'true');
      setTimeout(() => setShowTip(false), 2000);
    }
  }, [isTableView]);

  // Don't render if no config for this tab
  if (!config) return null;

  const isPrivate = contextMode === 'private';

  const handleActionClick = (label: string) => {
    showToast(`${label}...`);
    setIsExpanded(false);
  };

  const handlePrimaryClick = () => {
    showToast(`${config.label}...`);
  };

  return (
    <div 
      className={cn(
        "fixed z-20 flex flex-col gap-2 transition-all duration-300",
        isTableView 
          ? "bottom-6 left-24 items-start" 
          : "bottom-28 right-6 items-end"
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Repositioning Tip */}
      {showTip && (
        <div className="absolute -top-12 left-0 right-0 bg-foreground text-background text-xs px-3 py-2 rounded-lg shadow-lg animate-fade-in whitespace-nowrap">
          Repositioned to avoid blocking data
        </div>
      )}

      {/* Expanded Action Buttons */}
      <div className={cn(
        "flex flex-col gap-2 transition-all duration-300",
        isExpanded 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-4 pointer-events-none"
      )}>
        {config.actions.map((action, index) => (
          <button
            key={action.label}
            onClick={() => handleActionClick(action.label)}
            className={cn(
              "h-12 px-4 rounded-lg shadow-md flex items-center gap-3 transition-all duration-300",
              "text-sm font-medium whitespace-nowrap",
              isPrivate
                ? "bg-slate-700 hover:bg-slate-600 text-white"
                : "bg-primary hover:bg-primary/90 text-primary-foreground"
            )}
            style={{
              transitionDelay: isExpanded ? `${(config.actions.length - 1 - index) * 50}ms` : '0ms',
            }}
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>

      {/* Primary FAB Button */}
      <button
        onClick={handlePrimaryClick}
        className={cn(
          "h-14 px-5 rounded-full shadow-lg flex items-center gap-3 transition-all duration-300",
          "text-sm font-medium",
          isPrivate
            ? "bg-slate-800 hover:bg-slate-700 text-white"
            : "bg-primary hover:bg-primary/90 text-primary-foreground",
          isExpanded && "shadow-xl scale-105"
        )}
      >
        {config.icon}
        <span>{config.label}</span>
      </button>
    </div>
  );
}
