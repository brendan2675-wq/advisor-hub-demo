import { useApp } from '@/context/AppContext';
import { holdingsData, calculateHoldings, groupByAssetClass } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
  }).format(value).replace('A$', '$');
}

function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

export function PerformanceTab() {
  const { selectedClient, contextMode } = useApp();
  
  const rawHoldings = holdingsData[selectedClient.id] || [];
  const holdings = calculateHoldings(rawHoldings, selectedClient.totalPortfolioValue);
  const groupedHoldings = groupByAssetClass(holdings);
  
  // Mock performance periods
  const performancePeriods = [
    { period: '1 Month', return: 2.34, value: selectedClient.totalPortfolioValue * 0.0234 },
    { period: '3 Months', return: 5.67, value: selectedClient.totalPortfolioValue * 0.0567 },
    { period: '6 Months', return: 8.12, value: selectedClient.totalPortfolioValue * 0.0812 },
    { period: '1 Year', return: 12.45, value: selectedClient.totalPortfolioValue * 0.1245 },
    { period: '3 Years', return: 28.90, value: selectedClient.totalPortfolioValue * 0.289 },
    { period: 'Since Inception', return: 45.23, value: selectedClient.totalPortfolioValue * 0.4523 },
  ];
  
  // Asset class performance
  const assetClassPerformance = Object.entries(groupedHoldings).map(([assetClass, items]) => {
    const totalValue = items.reduce((sum, h) => sum + h.value, 0);
    const totalCostBase = items.reduce((sum, h) => sum + h.costBase, 0);
    const totalGainLoss = items.reduce((sum, h) => sum + h.unrealisedGainLoss, 0);
    const gainLossPercent = (totalGainLoss / totalCostBase) * 100;
    
    return {
      assetClass,
      value: totalValue,
      gainLoss: totalGainLoss,
      gainLossPercent,
    };
  });

  return (
    <div className="space-y-6">
      {/* Performance Summary */}
      <div className="card-surface p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Performance Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {performancePeriods.map(period => (
            <div key={period.period} className="text-center p-4 rounded-lg bg-surface">
              <p className="text-xs text-muted-foreground mb-2">{period.period}</p>
              <p className={cn(
                "text-xl font-bold tabular-nums",
                period.return >= 0 ? "text-gain" : "text-loss"
              )}>
                {formatPercent(period.return)}
              </p>
              <p className="text-xs text-muted-foreground mt-1 tabular-nums">
                {formatCurrency(period.value)}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Asset Class Performance */}
      <div className="card-surface p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Performance by Asset Class</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Asset Class</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Current Value</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Gain/Loss ($)</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Gain/Loss (%)</th>
                <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase w-48">Performance</th>
              </tr>
            </thead>
            <tbody>
              {assetClassPerformance.map(item => (
                <tr key={item.assetClass} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-4 px-4 text-sm font-medium text-foreground">{item.assetClass}</td>
                  <td className="py-4 px-4 text-sm text-foreground text-right tabular-nums">{formatCurrency(item.value)}</td>
                  <td className={cn(
                    "py-4 px-4 text-sm text-right tabular-nums font-medium",
                    item.gainLoss >= 0 ? "text-gain" : "text-loss"
                  )}>
                    {formatCurrency(item.gainLoss)}
                  </td>
                  <td className={cn(
                    "py-4 px-4 text-sm text-right tabular-nums font-medium",
                    item.gainLossPercent >= 0 ? "text-gain" : "text-loss"
                  )}>
                    <span className="flex items-center justify-end gap-1">
                      {item.gainLossPercent >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {formatPercent(item.gainLossPercent)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all",
                          item.gainLossPercent >= 0 ? "bg-gain" : "bg-loss"
                        )}
                        style={{ width: `${Math.min(Math.abs(item.gainLossPercent), 100)}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Individual Holdings Performance */}
      <div className="card-surface p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Top Performers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Best Performers */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gain" /> Best Performing
            </h4>
            <div className="space-y-2">
              {[...holdings]
                .sort((a, b) => b.unrealisedGainLossPercent - a.unrealisedGainLossPercent)
                .slice(0, 5)
                .map(holding => (
                  <div key={holding.id} className="flex items-center justify-between p-3 rounded-lg bg-surface">
                    <div>
                      <p className="text-sm font-medium text-foreground">{holding.code}</p>
                      <p className="text-xs text-muted-foreground">{holding.assetClass}</p>
                    </div>
                    <span className="text-sm font-bold text-gain tabular-nums">
                      {formatPercent(holding.unrealisedGainLossPercent)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
          
          {/* Worst Performers */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-loss" /> Underperforming
            </h4>
            <div className="space-y-2">
              {[...holdings]
                .sort((a, b) => a.unrealisedGainLossPercent - b.unrealisedGainLossPercent)
                .slice(0, 5)
                .map(holding => (
                  <div key={holding.id} className="flex items-center justify-between p-3 rounded-lg bg-surface">
                    <div>
                      <p className="text-sm font-medium text-foreground">{holding.code}</p>
                      <p className="text-xs text-muted-foreground">{holding.assetClass}</p>
                    </div>
                    <span className={cn(
                      "text-sm font-bold tabular-nums",
                      holding.unrealisedGainLossPercent >= 0 ? "text-gain" : "text-loss"
                    )}>
                      {formatPercent(holding.unrealisedGainLossPercent)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
