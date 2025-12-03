import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { holdingsData, calculateHoldings, groupByAssetClass, HoldingWithCalculations } from '@/data/mockData';
import { ColumnTooltip } from './ColumnTooltip';
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

function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-AU').format(value);
}

function SkeletonRow({ columns }: { columns: number }) {
  return (
    <tr className="border-b border-border">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-3 px-4">
          <Skeleton className="h-4 w-full animate-shimmer" />
        </td>
      ))}
    </tr>
  );
}

export function HoldingsTable() {
  const { selectedClient, isDetailedView } = useApp();
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
  
  const rawHoldings = holdingsData[selectedClient.id] || [];
  const holdings = calculateHoldings(rawHoldings, selectedClient.totalPortfolioValue);
  const groupedHoldings = groupByAssetClass(holdings);

  const compactColumns = ['Name', 'Code', 'Units', 'Price (AUD)', 'Value (AUD)', 'Port%'];
  const detailedColumns = [
    'Name', 'Code', 'Units', 'Price (AUD)', 'Value (AUD)', 'Port%',
    'Cost Base', 'Avg Unit Cost', 'Unrealised Gain/Loss ($)', 'Unrealised Gain/Loss (%)',
    'Est. Income', 'Est. Yield'
  ];

  const columns = isDetailedView ? detailedColumns : compactColumns;

  const renderRow = (holding: HoldingWithCalculations) => (
    <tr key={holding.id} className="border-b border-border hover:bg-muted/50 transition-all duration-100 group">
      <td className="py-3 px-4 text-sm text-foreground font-medium sticky left-0 z-10 bg-background group-hover:bg-muted/50 border-r border-border shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)] transition-colors duration-100">{holding.name}</td>
      <td className="py-3 px-4 text-sm text-muted-foreground font-mono">{holding.code}</td>
      <td className="py-3 px-4 text-sm text-foreground text-right tabular-nums">{formatNumber(holding.units)}</td>
      <td className="py-3 px-4 text-sm text-foreground text-right tabular-nums">{formatCurrency(holding.currentPrice)}</td>
      <td className="py-3 px-4 text-sm text-foreground text-right tabular-nums font-medium">{formatCurrency(holding.value)}</td>
      <td className="py-3 px-4 text-sm text-foreground text-right tabular-nums">{holding.portfolioPercent.toFixed(1)}%</td>
      
      {isDetailedView && (
        <>
          <td className="py-3 px-4 text-sm text-foreground text-right tabular-nums">{formatCurrency(holding.costBase)}</td>
          <td className="py-3 px-4 text-sm text-foreground text-right tabular-nums">{formatCurrency(holding.avgUnitCost)}</td>
          <td className={cn(
            "py-3 px-4 text-sm text-right tabular-nums font-medium",
            holding.unrealisedGainLoss >= 0 ? "text-gain" : "text-loss"
          )}>
            {formatCurrency(holding.unrealisedGainLoss)}
          </td>
          <td className={cn(
            "py-3 px-4 text-sm text-right tabular-nums font-medium",
            holding.unrealisedGainLossPercent >= 0 ? "text-gain" : "text-loss"
          )}>
            {formatPercent(holding.unrealisedGainLossPercent)}
          </td>
          <td className="py-3 px-4 text-sm text-foreground text-right tabular-nums">{formatCurrency(holding.estimatedIncome)}</td>
          <td className="py-3 px-4 text-sm text-foreground text-right tabular-nums">{holding.estimatedYield.toFixed(2)}%</td>
        </>
      )}
    </tr>
  );

  const calculateGroupTotals = (groupHoldings: HoldingWithCalculations[]) => {
    return {
      value: groupHoldings.reduce((sum, h) => sum + h.value, 0),
      portfolioPercent: groupHoldings.reduce((sum, h) => sum + h.portfolioPercent, 0),
      costBase: groupHoldings.reduce((sum, h) => sum + h.costBase, 0),
      unrealisedGainLoss: groupHoldings.reduce((sum, h) => sum + h.unrealisedGainLoss, 0),
      estimatedIncome: groupHoldings.reduce((sum, h) => sum + h.estimatedIncome, 0),
    };
  };

  return (
    <div className="card-surface overflow-hidden pb-32">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="table-header border-b border-border">
              {columns.map((col, idx) => (
                <th 
                  key={col} 
                  className={cn(
                    "py-3 px-4 text-left whitespace-nowrap",
                    idx === 0 && "sticky left-0 z-20 bg-surface border-r border-border shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]",
                    idx >= 2 && "text-right"
                  )}
                >
                  <ColumnTooltip columnName={col}>
                    <span>{col}</span>
                  </ColumnTooltip>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={cn(isLoading ? "" : "animate-fade-in")}>
            {isLoading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <SkeletonRow key={i} columns={columns.length} />
                ))}
              </>
            ) : (
              Object.entries(groupedHoldings).map(([assetClass, groupHoldings]) => {
                const totals = calculateGroupTotals(groupHoldings);
                const unrealisedPercent = totals.costBase > 0 
                  ? ((totals.unrealisedGainLoss / totals.costBase) * 100) 
                  : 0;

                return (
                  <React.Fragment key={assetClass}>
                  {/* Group Header */}
                  <tr className="bg-background border-b border-border">
                    <td 
                      className="py-3 px-4 text-sm font-medium text-foreground sticky left-0 z-[15] bg-background border-r border-border shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]"
                    >
                      {assetClass}
                    </td>
                    <td colSpan={columns.length - 1} className="bg-background"></td>
                  </tr>
                  
                  {/* Holdings */}
                  {groupHoldings.map(renderRow)}
                  
                  {/* Group Subtotal */}
                  <tr className="bg-muted/50 border-t-2 border-t-border border-b border-border relative z-[5]">
                    <td className="py-4 px-4 pr-6 text-sm font-semibold text-foreground sticky left-0 z-[15] bg-muted/50 border-r-2 border-border shadow-[2px_0_4px_-2px_rgba(0,0,0,0.15)]">
                      Subtotal: {assetClass}
                    </td>
                    <td className="py-4 px-4 bg-muted/50" colSpan={3}></td>
                    <td className="py-4 px-4 text-sm font-semibold text-foreground text-right tabular-nums bg-muted/50">
                      {formatCurrency(totals.value)}
                    </td>
                    <td className="py-4 px-4 text-sm font-semibold text-foreground text-right tabular-nums bg-muted/50">
                      {totals.portfolioPercent.toFixed(1)}%
                    </td>
                    
                    {isDetailedView && (
                      <>
                        <td className="py-4 px-4 text-sm font-semibold text-foreground text-right tabular-nums bg-muted/50">
                          {formatCurrency(totals.costBase)}
                        </td>
                        <td className="py-4 px-4 bg-muted/50"></td>
                        <td className={cn(
                          "py-4 px-4 text-sm font-semibold text-right tabular-nums bg-muted/50",
                          totals.unrealisedGainLoss >= 0 ? "text-gain" : "text-loss"
                        )}>
                          {formatCurrency(totals.unrealisedGainLoss)}
                        </td>
                        <td className={cn(
                          "py-4 px-4 text-sm font-semibold text-right tabular-nums bg-muted/50",
                          unrealisedPercent >= 0 ? "text-gain" : "text-loss"
                        )}>
                          {formatPercent(unrealisedPercent)}
                        </td>
                        <td className="py-4 px-4 text-sm font-semibold text-foreground text-right tabular-nums bg-muted/50">
                          {formatCurrency(totals.estimatedIncome)}
                        </td>
                        <td className="py-4 px-4 bg-muted/50"></td>
                      </>
                    )}
                  </tr>
                </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* Portfolio Total */}
      <div className="border-t border-border bg-surface px-4 py-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">Total Portfolio Value</span>
        <span className="text-lg font-bold text-foreground tabular-nums">
          {formatCurrency(selectedClient.totalPortfolioValue)}
        </span>
      </div>
    </div>
  );
}
