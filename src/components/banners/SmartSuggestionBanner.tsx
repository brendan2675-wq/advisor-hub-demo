import { useState, useEffect, useCallback, useMemo } from 'react';
import { Sparkles, TrendingDown, Lightbulb, Calendar, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { holdingsData } from '@/data/mockData';

type BannerType = 'private-client' | 'high-losses' | 'grouping-tip' | 'month-end';
type BannerVariant = 'info' | 'warning';

interface BannerConfig {
  id: BannerType;
  icon: React.ReactNode;
  message: React.ReactNode;
  primaryAction: { label: string; onClick: () => void };
  secondaryAction: { label: string; onClick: () => void };
  variant: BannerVariant;
  autoDissmiss: boolean;
}

const STORAGE_KEY = 'smart-banner-dismissed-permanent';

export function SmartSuggestionBanner() {
  const [activeBanner, setActiveBanner] = useState<BannerConfig | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [dismissedThisSession, setDismissedThisSession] = useState<BannerType[]>([]);
  const { selectedClient, contextMode, activeTab, grouping, setActiveTab, setGrouping, showToast } = useApp();

  // Calculate unrealized losses from holdings
  const totalUnrealizedLoss = useMemo(() => {
    const clientHoldings = holdingsData[selectedClient.id] || [];
    return clientHoldings
      .filter(h => (h.units * h.currentPrice - h.costBase) < 0)
      .reduce((sum, h) => sum + Math.abs(h.units * h.currentPrice - h.costBase), 0);
  }, [selectedClient.id]);

  const isMonthEnd = () => {
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    return today.getDate() >= lastDay - 2;
  };

  const isDismissed = useCallback((type: BannerType) => {
    if (dismissedThisSession.includes(type)) return true;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const dismissed = JSON.parse(stored);
      return dismissed.includes(type);
    }
    return false;
  }, [dismissedThisSession]);

  const dismissBanner = useCallback((type: BannerType, permanent = false) => {
    setIsVisible(false);
    setTimeout(() => {
      setActiveBanner(null);
      setDismissedThisSession(prev => [...prev, type]);
      if (permanent) {
        const stored = localStorage.getItem(STORAGE_KEY);
        const dismissed = stored ? JSON.parse(stored) : [];
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...dismissed, type]));
      }
    }, 300);
  }, []);

  // Private client trigger (3 second delay)
  useEffect(() => {
    if (contextMode === 'private' && !isDismissed('private-client')) {
      const timer = setTimeout(() => {
        setActiveBanner({
          id: 'private-client',
          icon: <Sparkles className="w-5 h-5" />,
          message: (
            <>💡 Private clients typically review <strong>unrealised gains quarterly</strong>. Generate Q4 report now?</>
          ),
          primaryAction: {
            label: 'Generate Report',
            onClick: () => {
              showToast('Generating Q4 report...');
              dismissBanner('private-client');
            }
          },
          secondaryAction: {
            label: 'Remind Me Later',
            onClick: () => dismissBanner('private-client')
          },
          variant: 'info',
          autoDissmiss: true
        });
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [contextMode, isDismissed, dismissBanner, showToast]);

  // High losses trigger
  useEffect(() => {
    if (totalUnrealizedLoss > 50000 && !isDismissed('high-losses') && !activeBanner) {
      const timer = setTimeout(() => {
        setActiveBanner({
          id: 'high-losses',
          icon: <TrendingDown className="w-5 h-5" />,
          message: (
            <>⚠️ This client has <strong>significant unrealised losses</strong> (${totalUnrealizedLoss.toLocaleString()}). Consider tax harvesting strategies.</>
          ),
          primaryAction: {
            label: 'View Opportunities',
            onClick: () => {
              setActiveTab('gains');
              dismissBanner('high-losses');
            }
          },
          secondaryAction: {
            label: 'Schedule Review',
            onClick: () => {
              showToast('Scheduling review...');
              dismissBanner('high-losses');
            }
          },
          variant: 'warning',
          autoDissmiss: false
        });
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [selectedClient.id, totalUnrealizedLoss, isDismissed, dismissBanner, activeBanner, setActiveTab, showToast]);

  // Portfolio tab grouping tip (30 second delay)
  useEffect(() => {
    if (activeTab === 'portfolio' && grouping === 'assetClass' && !isDismissed('grouping-tip') && !activeBanner) {
      const timer = setTimeout(() => {
        setActiveBanner({
          id: 'grouping-tip',
          icon: <Lightbulb className="w-5 h-5" />,
          message: (
            <>💡 <strong>Try grouping by Account</strong> to see holdings across different investment vehicles</>
          ),
          primaryAction: {
            label: 'Group by Account',
            onClick: () => {
              setGrouping('account');
              dismissBanner('grouping-tip');
            }
          },
          secondaryAction: {
            label: 'Dismiss',
            onClick: () => dismissBanner('grouping-tip', true)
          },
          variant: 'info',
          autoDissmiss: true
        });
        setIsVisible(true);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [activeTab, grouping, isDismissed, dismissBanner, activeBanner, setGrouping]);

  // Month-end trigger
  useEffect(() => {
    if (isMonthEnd() && !isDismissed('month-end') && !activeBanner) {
      const timer = setTimeout(() => {
        setActiveBanner({
          id: 'month-end',
          icon: <Calendar className="w-5 h-5" />,
          message: (
            <>📅 <strong>Month-end approaching</strong>. Generate monthly reports for your clients?</>
          ),
          primaryAction: {
            label: 'Generate Reports',
            onClick: () => {
              setActiveTab('reports');
              dismissBanner('month-end');
            }
          },
          secondaryAction: {
            label: 'View Calendar',
            onClick: () => {
              showToast('Opening calendar...');
              dismissBanner('month-end');
            }
          },
          variant: 'info',
          autoDissmiss: true
        });
        setIsVisible(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isDismissed, dismissBanner, activeBanner, setActiveTab, showToast]);

  // Auto-dismiss after 10 seconds (except warnings)
  useEffect(() => {
    if (activeBanner && activeBanner.autoDissmiss && isVisible) {
      const timer = setTimeout(() => {
        dismissBanner(activeBanner.id);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [activeBanner, isVisible, dismissBanner]);

  if (!activeBanner) return null;

  const variantStyles = {
    info: {
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      border: 'border-blue-400',
      icon: 'text-blue-600 dark:text-blue-400',
    },
    warning: {
      bg: 'bg-orange-50 dark:bg-orange-950/30',
      border: 'border-orange-400',
      icon: 'text-orange-600 dark:text-orange-400',
    }
  };

  const styles = variantStyles[activeBanner.variant];

  return (
    <div
      className={cn(
        "overflow-hidden transition-all duration-300 ease-out",
        isVisible ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
      )}
    >
      <div
        className={cn(
          "mx-6 mb-4 p-4 rounded-lg shadow-sm border-l-4 flex items-center gap-4",
          styles.bg,
          styles.border
        )}
      >
        {/* Icon */}
        <div className={cn("shrink-0", styles.icon)}>
          {activeBanner.icon}
        </div>

        {/* Message */}
        <p className="flex-1 text-sm text-foreground">
          {activeBanner.message}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            onClick={activeBanner.primaryAction.onClick}
          >
            {activeBanner.primaryAction.label}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={activeBanner.secondaryAction.onClick}
          >
            {activeBanner.secondaryAction.label}
          </Button>
          <button
            onClick={() => dismissBanner(activeBanner.id)}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
