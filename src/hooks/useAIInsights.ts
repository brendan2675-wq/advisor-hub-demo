import { useState, useEffect, useMemo, useCallback } from 'react';
import { useApp, TabType } from '@/context/AppContext';
import { holdingsData, calculateHoldings, HoldingWithCalculations } from '@/data/mockData';

export interface Insight {
  id: string;
  icon: string;
  category: string;
  title: string;
  summary: string;
  explanation?: string;
  priority: 'high' | 'medium' | 'low';
  tab?: TabType | 'all';
  clientType?: 'retail' | 'private' | 'all';
}

const DISMISSED_KEY = 'dash-dismissed-insights';
const NEVER_SHOW_KEY = 'dash-never-show-insights';

export function useAIInsights() {
  const { activeTab, selectedClient, contextMode } = useApp();
  const [dismissedIds, setDismissedIds] = useState<string[]>(() => {
    const stored = localStorage.getItem(DISMISSED_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [neverShowIds, setNeverShowIds] = useState<string[]>(() => {
    const stored = localStorage.getItem(NEVER_SHOW_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  // Calculate holdings for insights generation
  const holdings = useMemo(() => {
    const clientHoldings = holdingsData[selectedClient.id] || [];
    return calculateHoldings(clientHoldings, selectedClient.totalPortfolioValue);
  }, [selectedClient.id, selectedClient.totalPortfolioValue]);

  // Generate context-aware insights
  const allInsights = useMemo(() => {
    return generateInsights(holdings, selectedClient, activeTab, contextMode);
  }, [holdings, selectedClient, activeTab, contextMode]);

  // Filter out dismissed and never-show insights
  const insights = useMemo(() => {
    return allInsights.filter(
      insight => !dismissedIds.includes(insight.id) && !neverShowIds.includes(insight.id)
    );
  }, [allInsights, dismissedIds, neverShowIds]);

  const dismissInsight = useCallback((id: string) => {
    setDismissedIds(prev => {
      const next = [...prev, id];
      localStorage.setItem(DISMISSED_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const markHelpful = useCallback((id: string) => {
    // In a real app, this would send analytics
    console.log('Insight marked helpful:', id);
  }, []);

  const neverShowAgain = useCallback((id: string) => {
    setNeverShowIds(prev => {
      const next = [...prev, id];
      localStorage.setItem(NEVER_SHOW_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Clear dismissed insights when tab changes (but keep never-show)
  useEffect(() => {
    setDismissedIds([]);
    localStorage.setItem(DISMISSED_KEY, JSON.stringify([]));
  }, [activeTab]);

  return { insights, dismissInsight, markHelpful, neverShowAgain };
}

function generateInsights(
  holdings: HoldingWithCalculations[],
  selectedClient: { id: string; name: string; totalPortfolioValue: number; type: string },
  activeTab: TabType,
  contextMode: string
): Insight[] {
  const insights: Insight[] = [];
  const isPrivate = contextMode === 'private' || selectedClient.type === 'private';

  // Group holdings by asset class
  const byAssetClass: Record<string, HoldingWithCalculations[]> = {};
  holdings.forEach(h => {
    if (!byAssetClass[h.assetClass]) byAssetClass[h.assetClass] = [];
    byAssetClass[h.assetClass].push(h);
  });

  // Calculate asset class concentrations
  const assetClassTotals = Object.entries(byAssetClass).map(([name, items]) => ({
    name,
    value: items.reduce((sum, h) => sum + h.value, 0),
    percent: items.reduce((sum, h) => sum + h.portfolioPercent, 0),
  }));

  // Sort to find highest concentration
  const sortedByConcentration = [...assetClassTotals].sort((a, b) => b.percent - a.percent);
  const highestConcentration = sortedByConcentration[0];

  // Calculate gains and losses
  const gains = holdings.filter(h => h.unrealisedGainLoss > 0);
  const losses = holdings.filter(h => h.unrealisedGainLoss < 0);
  const totalGains = gains.reduce((sum, h) => sum + h.unrealisedGainLoss, 0);
  const totalLosses = Math.abs(losses.reduce((sum, h) => sum + h.unrealisedGainLoss, 0));

  // Portfolio-wide insights (shown on Portfolio tab)
  if (activeTab === 'portfolio' || activeTab === 'dashboard') {
    // Concentration alert
    if (highestConcentration && highestConcentration.percent > 40) {
      insights.push({
        id: `concentration-${highestConcentration.name}`,
        icon: '⚠️',
        category: 'Risk Alert',
        title: `Concentration Alert: ${highestConcentration.percent.toFixed(0)}% in ${highestConcentration.name}`,
        summary: 'Consider rebalancing to reduce concentration risk',
        explanation: `A well-diversified portfolio typically has no single asset class exceeding 40% of total value. ${highestConcentration.name} currently represents ${highestConcentration.percent.toFixed(1)}% of the portfolio. Consider redistributing to other asset classes to manage risk.`,
        priority: highestConcentration.percent > 50 ? 'high' : 'medium',
      });
    }

    // Strong performer insight
    const topPerformer = [...holdings].sort((a, b) => b.unrealisedGainLossPercent - a.unrealisedGainLossPercent)[0];
    if (topPerformer && topPerformer.unrealisedGainLossPercent > 15) {
      insights.push({
        id: `top-performer-${topPerformer.id}`,
        icon: '📈',
        category: 'Performance',
        title: `Strong Performance: ${topPerformer.code} up ${topPerformer.unrealisedGainLossPercent.toFixed(1)}%`,
        summary: `Unrealised gain of $${topPerformer.unrealisedGainLoss.toLocaleString('en-AU', { maximumFractionDigits: 0 })}`,
        explanation: `${topPerformer.name} has performed exceptionally well. Consider whether to take profits or hold for further growth based on your investment thesis.`,
        priority: 'low',
      });
    }

    // Income opportunity
    const incomeHoldings = holdings.filter(h => h.estimatedYield > 4);
    if (incomeHoldings.length > 0) {
      const totalIncome = holdings.reduce((sum, h) => sum + h.estimatedIncome, 0);
      insights.push({
        id: 'income-opportunity',
        icon: '💰',
        category: 'Income',
        title: `Est. Annual Income: $${totalIncome.toLocaleString('en-AU', { maximumFractionDigits: 0 })}`,
        summary: `${incomeHoldings.length} holdings with yield above 4%`,
        explanation: `The portfolio generates an estimated $${totalIncome.toLocaleString('en-AU')} annually. High-yielding holdings include ${incomeHoldings.slice(0, 3).map(h => h.code).join(', ')}.`,
        priority: 'low',
      });
    }

    // Feature tip
    insights.push({
      id: 'tip-grouping',
      icon: '💡',
      category: 'Tip',
      title: 'Try grouping by Account',
      summary: 'See holdings across different investment vehicles',
      explanation: 'Use the "Group by" dropdown above the holdings table to organize your view by Account or GICS sector instead of asset class.',
      priority: 'low',
    });
  }

  // Gains & Losses tab insights
  if (activeTab === 'gains') {
    // Tax harvest opportunity
    if (totalLosses > 1000) {
      insights.push({
        id: 'tax-harvest',
        icon: '💡',
        category: 'Tax Planning',
        title: `Tax Harvest Opportunity: $${totalLosses.toLocaleString('en-AU', { maximumFractionDigits: 0 })} in losses`,
        summary: `${losses.length} holdings with unrealised losses available`,
        explanation: `Realizing these losses could offset capital gains and reduce tax liability. Consider selling underperforming holdings before financial year end.`,
        priority: totalLosses > 10000 ? 'high' : 'medium',
      });
    }

    // CGT discount reminder
    insights.push({
      id: 'cgt-discount',
      icon: '📅',
      category: 'Tax Planning',
      title: 'CGT Discount Reminder',
      summary: 'Holdings held 12+ months qualify for 50% discount',
      explanation: 'Australian tax residents receive a 50% discount on capital gains for assets held longer than 12 months. Review holding periods before selling.',
      priority: 'low',
    });

    if (isPrivate) {
      insights.push({
        id: 'wash-sale',
        icon: '🔄',
        category: 'Compliance',
        title: 'Wash Sale Monitoring',
        summary: 'Track 30-day windows after selling positions',
        explanation: 'Repurchasing substantially similar securities within 30 days of a sale may trigger wash sale rules, disallowing the loss deduction.',
        priority: 'medium',
      });
    }
  }

  // Performance tab insights
  if (activeTab === 'performance') {
    const portfolioReturn = ((selectedClient.totalPortfolioValue - holdings.reduce((sum, h) => sum + h.costBase, 0)) / holdings.reduce((sum, h) => sum + h.costBase, 0)) * 100;
    
    insights.push({
      id: 'benchmark-compare',
      icon: '📊',
      category: 'Analysis',
      title: 'Compare to Benchmark',
      summary: 'See how performance stacks against ASX200',
      explanation: 'Comparing portfolio performance to relevant benchmarks helps assess whether active management is adding value.',
      priority: 'low',
    });

    if (portfolioReturn > 10) {
      insights.push({
        id: 'performance-highlight',
        icon: '🎯',
        category: 'Performance',
        title: `Portfolio Return: ${portfolioReturn.toFixed(1)}%`,
        summary: 'Outperforming typical market returns',
        priority: 'low',
      });
    }
  }

  // Transactions tab insights
  if (activeTab === 'transactions') {
    insights.push({
      id: 'transaction-export',
      icon: '📋',
      category: 'Tip',
      title: 'Export for Tax Records',
      summary: 'Download transactions for EOFY reporting',
      explanation: 'Use the export function to generate transaction records suitable for tax return preparation.',
      priority: 'low',
    });
  }

  // Client action items (always relevant)
  insights.push({
    id: `review-due-${selectedClient.id}`,
    icon: '📞',
    category: 'Action',
    title: 'Quarterly Review Due',
    summary: `Schedule review with ${selectedClient.name.split(' ')[0]}`,
    explanation: 'Regular portfolio reviews help ensure investment strategy remains aligned with client goals and risk tolerance.',
    priority: 'medium',
  });

  // Predictive insight for private clients
  if (isPrivate) {
    const projectedValue = selectedClient.totalPortfolioValue * 1.08; // Assume 8% growth
    insights.push({
      id: 'projection',
      icon: '📈',
      category: 'Projection',
      title: `12-Month Projection: $${(projectedValue / 1000000).toFixed(2)}M`,
      summary: 'Based on current trajectory and market conditions',
      explanation: 'This projection assumes continuation of current market trends and no major changes to the portfolio composition.',
      priority: 'low',
    });
  }

  return insights;
}
