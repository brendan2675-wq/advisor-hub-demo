import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';

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
  
  return (
    <div className={cn(
      "rounded-xl p-6 mb-6 transition-colors duration-300",
      contextMode === 'private' 
        ? 'bg-gradient-to-br from-private to-private/80' 
        : 'bg-gradient-to-br from-primary to-primary/80'
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/80 mb-1">Portfolio Value</p>
          <p className="text-3xl font-bold text-white tabular-nums">
            {formatCurrency(selectedClient.totalPortfolioValue)}
          </p>
        </div>
        
        {/* Time Period Selector - Visual Only */}
        <div className="flex items-center gap-2">
          {['1M', '3M', '6M', '1Y', '3Y', 'ALL'].map((period, idx) => (
            <button
              key={period}
              className={cn(
                "w-10 h-10 rounded-full text-xs font-medium transition-colors duration-200",
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
