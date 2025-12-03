import { useApp } from '@/context/AppContext';
import { holdingsData, calculateHoldings } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';

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

export function GainsLossesTab() {
  const { selectedClient } = useApp();
  
  const rawHoldings = holdingsData[selectedClient.id] || [];
  const holdings = calculateHoldings(rawHoldings, selectedClient.totalPortfolioValue);
  
  // Separate gains and losses
  const gains = holdings.filter(h => h.unrealisedGainLoss >= 0).sort((a, b) => b.unrealisedGainLoss - a.unrealisedGainLoss);
  const losses = holdings.filter(h => h.unrealisedGainLoss < 0).sort((a, b) => a.unrealisedGainLoss - b.unrealisedGainLoss);
  
  const totalGains = gains.reduce((sum, h) => sum + h.unrealisedGainLoss, 0);
  const totalLosses = losses.reduce((sum, h) => sum + h.unrealisedGainLoss, 0);
  const netGainLoss = totalGains + totalLosses;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-surface p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-gain" />
            <span className="text-sm text-muted-foreground">Total Unrealised Gains</span>
          </div>
          <p className="text-2xl font-bold text-gain tabular-nums">{formatCurrency(totalGains)}</p>
          <p className="text-sm text-muted-foreground mt-1">{gains.length} positions in profit</p>
        </div>
        
        <div className="card-surface p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-5 h-5 text-loss" />
            <span className="text-sm text-muted-foreground">Total Unrealised Losses</span>
          </div>
          <p className="text-2xl font-bold text-loss tabular-nums">{formatCurrency(totalLosses)}</p>
          <p className="text-sm text-muted-foreground mt-1">{losses.length} positions in loss</p>
        </div>
        
        <div className="card-surface p-5">
          <div className="flex items-center gap-2 mb-3">
            {netGainLoss >= 0 ? <ArrowUpRight className="w-5 h-5 text-gain" /> : <ArrowDownRight className="w-5 h-5 text-loss" />}
            <span className="text-sm text-muted-foreground">Net Unrealised Position</span>
          </div>
          <p className={cn(
            "text-2xl font-bold tabular-nums",
            netGainLoss >= 0 ? "text-gain" : "text-loss"
          )}>{formatCurrency(netGainLoss)}</p>
        </div>
      </div>
      
      {/* Detailed Table */}
      <div className="card-surface overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Capital Gains & Losses Detail</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header border-b border-border">
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Code</th>
                <th className="py-3 px-4 text-right">Units</th>
                <th className="py-3 px-4 text-right">Cost Base</th>
                <th className="py-3 px-4 text-right">Current Value</th>
                <th className="py-3 px-4 text-right">Unrealised Gain/Loss</th>
                <th className="py-3 px-4 text-right">Gain/Loss %</th>
              </tr>
            </thead>
            <tbody>
              {holdings
                .sort((a, b) => b.unrealisedGainLoss - a.unrealisedGainLoss)
                .map(holding => (
                <tr key={holding.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-foreground">{holding.name}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground font-mono">{holding.code}</td>
                  <td className="py-3 px-4 text-sm text-foreground text-right tabular-nums">
                    {new Intl.NumberFormat('en-AU').format(holding.units)}
                  </td>
                  <td className="py-3 px-4 text-sm text-foreground text-right tabular-nums">{formatCurrency(holding.costBase)}</td>
                  <td className="py-3 px-4 text-sm text-foreground text-right tabular-nums">{formatCurrency(holding.value)}</td>
                  <td className={cn(
                    "py-3 px-4 text-sm text-right tabular-nums font-medium",
                    holding.unrealisedGainLoss >= 0 ? "text-gain" : "text-loss"
                  )}>
                    <span className="flex items-center justify-end gap-1">
                      {holding.unrealisedGainLoss >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {formatCurrency(holding.unrealisedGainLoss)}
                    </span>
                  </td>
                  <td className={cn(
                    "py-3 px-4 text-sm text-right tabular-nums font-medium",
                    holding.unrealisedGainLossPercent >= 0 ? "text-gain" : "text-loss"
                  )}>
                    {formatPercent(holding.unrealisedGainLossPercent)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-surface font-semibold">
                <td colSpan={5} className="py-3 px-4 text-sm text-foreground">Total</td>
                <td className={cn(
                  "py-3 px-4 text-sm text-right tabular-nums",
                  netGainLoss >= 0 ? "text-gain" : "text-loss"
                )}>{formatCurrency(netGainLoss)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
