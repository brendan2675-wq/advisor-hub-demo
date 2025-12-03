import { useState, useCallback, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { clients, holdingsData, calculateHoldings, Client, HoldingWithCalculations } from '@/data/mockData';

export type SearchIntent = 'filter' | 'client' | 'analysis' | 'tax' | 'help' | 'performance' | 'report' | 'general';

export interface SearchResult {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  intent: SearchIntent;
  action?: string;
  data?: any;
  insight?: {
    title: string;
    description: string;
  };
}

interface SearchState {
  results: SearchResult[];
  isSearching: boolean;
}

const RECENT_SEARCHES_KEY = 'dash-recent-searches';

export function useSmartSearch() {
  const [state, setState] = useState<SearchState>({ results: [], isSearching: false });
  const { setSelectedClient, setActiveTab, setShowHelpPanel } = useApp();

  const recentSearches = useMemo(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  }, []);

  const suggestedQueries = useMemo(() => [
    "clients with losses over 10%",
    "who needs rebalancing?",
    "tax loss candidates",
    "explain unrealised gains",
    "show me top performers",
  ], []);

  const addToRecent = useCallback((query: string) => {
    const recent = JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]');
    const updated = [query, ...recent.filter((r: string) => r !== query)].slice(0, 5);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  }, []);

  const detectIntent = useCallback((query: string): SearchIntent[] => {
    const q = query.toLowerCase();
    const intents: SearchIntent[] = [];

    // Filter/Analysis intents
    if (q.includes('loss') || q.includes('negative') || q.includes('down')) intents.push('filter');
    if (q.includes('rebalanc') || q.includes('drift') || q.includes('allocation')) intents.push('analysis');
    if (q.includes('tax') || q.includes('harvest') || q.includes('cgt')) intents.push('tax');
    if (q.includes('perform') || q.includes('return') || q.includes('gain')) intents.push('performance');
    if (q.includes('explain') || q.includes('what is') || q.includes('how to') || q.includes('help')) intents.push('help');
    if (q.includes('report') || q.includes('generate') || q.includes('export')) intents.push('report');
    
    // Client intent
    const clientMatch = clients.find(c => q.includes(c.name.toLowerCase().split(' ')[0].toLowerCase()));
    if (clientMatch) intents.push('client');

    return intents.length > 0 ? intents : ['general'];
  }, []);

  const search = useCallback((query: string) => {
    if (!query.trim()) {
      setState({ results: [], isSearching: false });
      return;
    }

    setState(prev => ({ ...prev, isSearching: true }));
    addToRecent(query);

    // Simulate AI processing delay
    setTimeout(() => {
      const intents = detectIntent(query);
      const results: SearchResult[] = [];
      const q = query.toLowerCase();

      // Client search
      const matchingClients = clients.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.email.toLowerCase().includes(q)
      );

      // Calculate all holdings for analysis
      const allHoldings: { client: Client; holdings: HoldingWithCalculations[] }[] = clients.map(client => ({
        client,
        holdings: calculateHoldings(holdingsData[client.id] || [], client.totalPortfolioValue),
      }));

      // Intent: Filter clients with losses
      if (intents.includes('filter') && (q.includes('loss') || q.includes('negative'))) {
        const percentMatch = q.match(/(\d+)%?/);
        const threshold = percentMatch ? parseFloat(percentMatch[1]) : 0;

        const clientsWithLosses = allHoldings
          .map(({ client, holdings }) => {
            const totalLoss = holdings
              .filter(h => h.unrealisedGainLossPercent < 0)
              .reduce((sum, h) => sum + Math.abs(h.unrealisedGainLoss), 0);
            const lossPercent = Math.abs(
              holdings
                .filter(h => h.unrealisedGainLossPercent < 0)
                .reduce((sum, h) => sum + h.unrealisedGainLossPercent, 0) / 
              Math.max(holdings.filter(h => h.unrealisedGainLossPercent < 0).length, 1)
            );
            return { client, totalLoss, lossPercent, holdings };
          })
          .filter(({ lossPercent }) => lossPercent >= threshold)
          .sort((a, b) => b.totalLoss - a.totalLoss);

        if (clientsWithLosses.length > 0) {
          const totalLosses = clientsWithLosses.reduce((sum, c) => sum + c.totalLoss, 0);
          
          results.push({
            id: 'insight-losses',
            type: 'Insights',
            title: `${clientsWithLosses.length} clients match`,
            subtitle: `Total unrealised losses: $${totalLosses.toLocaleString('en-AU', { maximumFractionDigits: 0 })}`,
            intent: 'filter',
            action: 'Generate Tax Report',
            insight: {
              title: `Found ${clientsWithLosses.length} clients with significant losses`,
              description: `Combined unrealised losses of $${totalLosses.toLocaleString('en-AU')} across these portfolios. Consider tax harvesting opportunities.`,
            },
          });

          clientsWithLosses.slice(0, 3).forEach(({ client, lossPercent, totalLoss }) => {
            results.push({
              id: `client-loss-${client.id}`,
              type: 'Clients',
              title: client.name,
              subtitle: `${lossPercent.toFixed(1)}% avg loss • $${totalLoss.toLocaleString('en-AU', { maximumFractionDigits: 0 })} unrealised`,
              intent: 'client',
              action: 'View Portfolio',
              data: client,
            });
          });
        }
      }

      // Intent: Tax loss candidates
      if (intents.includes('tax')) {
        const taxCandidates = allHoldings
          .flatMap(({ client, holdings }) => 
            holdings
              .filter(h => h.unrealisedGainLoss < -500)
              .map(h => ({ client, holding: h }))
          )
          .sort((a, b) => a.holding.unrealisedGainLoss - b.holding.unrealisedGainLoss);

        if (taxCandidates.length > 0) {
          const totalLoss = taxCandidates.reduce((sum, c) => sum + Math.abs(c.holding.unrealisedGainLoss), 0);
          
          results.push({
            id: 'tax-insight',
            type: 'Insights',
            title: `${taxCandidates.length} tax loss candidates found`,
            subtitle: `Potential tax offset: $${totalLoss.toLocaleString('en-AU', { maximumFractionDigits: 0 })}`,
            intent: 'tax',
            insight: {
              title: 'Tax Harvesting Opportunity',
              description: `${taxCandidates.length} holdings with unrealised losses that could offset capital gains.`,
            },
          });

          // Group by client
          const byClient = taxCandidates.reduce((acc, { client, holding }) => {
            if (!acc[client.id]) acc[client.id] = { client, holdings: [] };
            acc[client.id].holdings.push(holding);
            return acc;
          }, {} as Record<string, { client: Client; holdings: HoldingWithCalculations[] }>);

          Object.values(byClient).slice(0, 3).forEach(({ client, holdings }) => {
            const clientLoss = holdings.reduce((sum, h) => sum + Math.abs(h.unrealisedGainLoss), 0);
            results.push({
              id: `tax-${client.id}`,
              type: 'Clients',
              title: client.name,
              subtitle: `${holdings.length} loss positions • $${clientLoss.toLocaleString('en-AU', { maximumFractionDigits: 0 })}`,
              intent: 'tax',
              action: 'View Gains & Losses',
              data: client,
            });
          });
        }
      }

      // Intent: Rebalancing analysis
      if (intents.includes('analysis') && q.includes('rebalanc')) {
        // Simulate drift calculation (in real app, would compare to target allocation)
        const clientsWithDrift = allHoldings.map(({ client, holdings }) => {
          const byClass = holdings.reduce((acc, h) => {
            acc[h.assetClass] = (acc[h.assetClass] || 0) + h.portfolioPercent;
            return acc;
          }, {} as Record<string, number>);
          
          // Calculate max deviation from hypothetical 25% target per class
          const maxDrift = Math.max(...Object.values(byClass).map(v => Math.abs(v - 25)));
          return { client, drift: maxDrift };
        }).filter(c => c.drift > 10).sort((a, b) => b.drift - a.drift);

        if (clientsWithDrift.length > 0) {
          results.push({
            id: 'rebalance-insight',
            type: 'Insights',
            title: `${clientsWithDrift.length} clients need rebalancing`,
            subtitle: 'More than 10% drift from target allocation',
            intent: 'analysis',
            action: 'Generate Rebalancing Report',
            insight: {
              title: 'Rebalancing Required',
              description: `${clientsWithDrift.length} portfolios have drifted significantly from target allocations.`,
            },
          });

          clientsWithDrift.slice(0, 3).forEach(({ client, drift }) => {
            results.push({
              id: `rebalance-${client.id}`,
              type: 'Clients',
              title: client.name,
              subtitle: `${drift.toFixed(0)}% max drift from target`,
              intent: 'analysis',
              action: 'View Portfolio',
              data: client,
            });
          });
        }
      }

      // Intent: Help/Education
      if (intents.includes('help')) {
        if (q.includes('unrealised') || q.includes('unrealized')) {
          results.push({
            id: 'help-unrealised',
            type: 'Help',
            title: 'Understanding Unrealised Gains/Losses',
            subtitle: 'The difference between current value and what you paid',
            intent: 'help',
            action: 'Learn More',
            insight: {
              title: 'Unrealised Gains Explained',
              description: 'Unrealised gains or losses represent the change in value of holdings you still own. They only become "realised" when you sell.',
            },
          });
        }

        if (q.includes('cost base')) {
          results.push({
            id: 'help-costbase',
            type: 'Help',
            title: 'How Cost Base is Calculated',
            subtitle: 'Original purchase price plus acquisition costs',
            intent: 'help',
            action: 'Learn More',
          });
        }

        results.push({
          id: 'help-panel',
          type: 'Actions',
          title: 'Open Help Panel',
          subtitle: 'View tutorials, guides, and support',
          intent: 'help',
          action: 'Open',
        });
      }

      // Intent: Performance
      if (intents.includes('performance') && (q.includes('top') || q.includes('best'))) {
        const topPerformers = allHoldings
          .flatMap(({ client, holdings }) => 
            holdings.map(h => ({ client, holding: h }))
          )
          .sort((a, b) => b.holding.unrealisedGainLossPercent - a.holding.unrealisedGainLossPercent)
          .slice(0, 5);

        topPerformers.forEach(({ client, holding }) => {
          results.push({
            id: `top-${holding.id}`,
            type: 'Holdings',
            title: `${holding.code} (+${holding.unrealisedGainLossPercent.toFixed(1)}%)`,
            subtitle: `${client.name} • $${holding.unrealisedGainLoss.toLocaleString('en-AU', { maximumFractionDigits: 0 })} gain`,
            intent: 'performance',
            action: 'View',
            data: { client, holding },
          });
        });
      }

      // Direct client search
      if (matchingClients.length > 0 && results.length < 5) {
        matchingClients.forEach(client => {
          if (!results.find(r => r.data?.id === client.id)) {
            results.push({
              id: `client-${client.id}`,
              type: 'Clients',
              title: client.name,
              subtitle: `${client.type === 'private' ? 'Private' : 'Retail'} • $${(client.totalPortfolioValue / 1000000).toFixed(2)}M`,
              intent: 'client',
              action: 'View Portfolio',
              data: client,
            });
          }
        });
      }

      // Holding search
      const matchingHoldings = allHoldings
        .flatMap(({ client, holdings }) => 
          holdings
            .filter(h => 
              h.name.toLowerCase().includes(q) || 
              h.code.toLowerCase().includes(q)
            )
            .map(h => ({ client, holding: h }))
        )
        .slice(0, 3);

      matchingHoldings.forEach(({ client, holding }) => {
        results.push({
          id: `holding-${holding.id}`,
          type: 'Holdings',
          title: holding.code,
          subtitle: `${holding.name} • ${client.name}`,
          intent: 'general',
          action: 'View',
          data: { client, holding },
        });
      });

      setState({ results, isSearching: false });
    }, 400);
  }, [addToRecent, detectIntent]);

  const executeResult = useCallback((result: SearchResult) => {
    if (result.intent === 'help' && result.id === 'help-panel') {
      setShowHelpPanel(true);
      return;
    }

    if (result.data?.id && typeof result.data.name === 'string') {
      // It's a client
      setSelectedClient(result.data);
      if (result.intent === 'tax' || result.action?.includes('Gains')) {
        setActiveTab('gains');
      } else {
        setActiveTab('portfolio');
      }
    }
  }, [setSelectedClient, setActiveTab, setShowHelpPanel]);

  return {
    results: state.results,
    isSearching: state.isSearching,
    search,
    executeResult,
    recentSearches,
    suggestedQueries,
  };
}
