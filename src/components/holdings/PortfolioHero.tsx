import { useEffect, useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value).replace('A$', '$');
}

export function PortfolioHero() {
  const { selectedClient, contextMode } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const prevClientRef = useRef(selectedClient.id);

  useEffect(() => {
    if (prevClientRef.current !== selectedClient.id) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 800);
      prevClientRef.current = selectedClient.id;
      return () => clearTimeout(timer);
    }
  }, [selectedClient.id]);
  
  return (
    <div className={cn(
      "rounded-xl p-6 mb-6 transition-all duration-300",
      contextMode === 'private' 
        ? 'bg-gradient-to-br from-private to-private/80' 
        : 'bg-gradient-to-br from-primary to-primary/80'
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/80 mb-1">Portfolio Value</p>
          {isLoading ? (
            <Skeleton className="h-9 w-48 bg-white/20 animate-shimmer" />
          ) : (
            <p className="text-3xl font-bold text-white tabular-nums animate-fade-in">
              {formatCurrency(selectedClient.totalPortfolioValue)}
            </p>
          )}
        </div>
        
        {/* Time Period Selector - Visual Only */}
        <div className="flex items-center gap-2">
          {['1M', '3M', '6M', '1Y', '3Y', 'ALL'].map((period, idx) => (
            <button
              key={period}
              className={cn(
                "w-10 h-10 rounded-full text-xs font-medium transition-all duration-200 hover-scale",
                idx === 3 
                  ? "bg-white text-primary" 
                  : "bg-white/20 text-white hover:bg-white/30"
              )}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
