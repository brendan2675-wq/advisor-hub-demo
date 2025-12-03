import { useApp } from '@/context/AppContext';
import { holdingsData, calculateHoldings, groupByAssetClass } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Wallet, PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value).replace('A$', '$');
}

export function DashboardTab() {
  const { selectedClient, contextMode } = useApp();
  
  const rawHoldings = holdingsData[selectedClient.id] || [];
  const holdings = calculateHoldings(rawHoldings, selectedClient.totalPortfolioValue);
  const groupedHoldings = groupByAssetClass(holdings);
  
  // Calculate totals
  const totalGainLoss = holdings.reduce((sum, h) => sum + h.unrealisedGainLoss, 0);
  const totalCostBase = holdings.reduce((sum, h) => sum + h.costBase, 0);
  const totalGainLossPercent = (totalGainLoss / totalCostBase) * 100;
  const totalEstimatedIncome = holdings.reduce((sum, h) => sum + h.estimatedIncome, 0);
  
  // Get top 5 holdings by value
  const topHoldings = [...holdings].sort((a, b) => b.value - a.value).slice(0, 5);
  
  // Asset allocation for pie chart data
  const assetAllocation = Object.entries(groupedHoldings).map(([assetClass, items]) => ({
    name: assetClass,
    value: items.reduce((sum, h) => sum + h.value, 0),
    percent: items.reduce((sum, h) => sum + h.portfolioPercent, 0),
  }));

  const assetColors: Record<string, string> = {
    'Australian Equities': 'bg-primary',
    'Fixed Income': 'bg-blue-500',
    'Cash': 'bg-emerald-500',
    'International Equities': 'bg-purple-500',
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-surface p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Total Value</span>
            <Wallet className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground tabular-nums">
            {formatCurrency(selectedClient.totalPortfolioValue)}
          </p>
        </div>
        
        <div className="card-surface p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Unrealised Gain/Loss</span>
            {totalGainLoss >= 0 ? (
              <TrendingUp className="w-5 h-5 text-gain" />
            ) : (
              <TrendingDown className="w-5 h-5 text-loss" />
            )}
          </div>
          <p className={cn(
            "text-2xl font-bold tabular-nums",
            totalGainLoss >= 0 ? "text-gain" : "text-loss"
          )}>
            {formatCurrency(totalGainLoss)}
          </p>
          <p className={cn(
            "text-sm mt-1",
            totalGainLoss >= 0 ? "text-gain" : "text-loss"
          )}>
            {totalGainLossPercent >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(2)}%
          </p>
        </div>
        
        <div className="card-surface p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Est. Annual Income</span>
            <PieChart className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground tabular-nums">
            {formatCurrency(totalEstimatedIncome)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {((totalEstimatedIncome / selectedClient.totalPortfolioValue) * 100).toFixed(2)}% yield
          </p>
        </div>
        
        <div className="card-surface p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Holdings</span>
            <span className="text-sm text-muted-foreground">{holdings.length} positions</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {Object.keys(groupedHoldings).length}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Asset Classes</p>
        </div>
      </div>
      
      {/* Asset Allocation & Top Holdings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Allocation */}
        <div className="card-surface p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Asset Allocation</h3>
          <div className="space-y-3">
            {assetAllocation.map(asset => (
              <div key={asset.name}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-foreground">{asset.name}</span>
                  <span className="text-muted-foreground tabular-nums">{asset.percent.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full transition-all duration-500", assetColors[asset.name] || 'bg-primary')}
                    style={{ width: `${asset.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Top Holdings */}
        <div className="card-surface p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Top Holdings</h3>
          <div className="space-y-3">
            {topHoldings.map(holding => (
              <div key={holding.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{holding.code}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">{holding.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground tabular-nums">{formatCurrency(holding.value)}</p>
                  <p className={cn(
                    "text-xs tabular-nums flex items-center justify-end gap-1",
                    holding.unrealisedGainLoss >= 0 ? "text-gain" : "text-loss"
                  )}>
                    {holding.unrealisedGainLoss >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {holding.unrealisedGainLossPercent >= 0 ? '+' : ''}{holding.unrealisedGainLossPercent.toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
