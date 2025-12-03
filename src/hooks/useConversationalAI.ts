import { useState, useCallback, useMemo } from 'react';
import { useApp, TabType } from '@/context/AppContext';
import { clients, holdingsData, calculateHoldings } from '@/data/mockData';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: ChatAction[];
}

export interface ChatAction {
  id: string;
  label: string;
  type: 'navigate' | 'generate' | 'schedule' | 'show';
  target?: string;
}

export function useConversationalAI() {
  const { selectedClient, setSelectedClient, setActiveTab, contextMode } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hi! I'm your AI assistant. I can help you analyze portfolios, find tax opportunities, and manage client workflows. What would you like to know?`,
      timestamp: new Date(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const clientHoldings = useMemo(() => {
    const rawHoldings = holdingsData[selectedClient.id] || [];
    return calculateHoldings(rawHoldings, selectedClient.totalPortfolioValue);
  }, [selectedClient]);

  const generateResponse = useCallback(async (userMessage: string): Promise<{ content: string; actions?: ChatAction[] }> => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Portfolio performance queries
    if (lowerMessage.includes('perform') || lowerMessage.includes('how is') || lowerMessage.includes('doing')) {
      const clientName = selectedClient.name;
      const totalValue = clientHoldings.reduce((sum, h) => sum + h.value, 0);
      const totalGain = clientHoldings.reduce((sum, h) => sum + h.unrealisedGainLoss, 0);
      const gainPercent = ((totalGain / (totalValue - totalGain)) * 100).toFixed(1);
      
      const sortedByGain = [...clientHoldings].sort((a, b) => b.unrealisedGainLossPercent - a.unrealisedGainLossPercent);
      const bestPerformer = sortedByGain[0];
      const worstPerformer = sortedByGain[sortedByGain.length - 1];

      return {
        content: `📊 **${clientName}'s Portfolio** (${selectedClient.type === 'retail' ? 'Retail' : 'Private'}):

• **Total value:** $${totalValue.toLocaleString()} (${totalGain >= 0 ? '+' : ''}${gainPercent}% unrealised)
• **Best performer:** ${bestPerformer?.name} (+${bestPerformer?.unrealisedGainLossPercent.toFixed(1)}%)
• **Needs attention:** ${worstPerformer?.name} (${worstPerformer?.unrealisedGainLossPercent.toFixed(1)}%)
• **Overall unrealised gains:** $${totalGain.toLocaleString()}

Would you like me to generate a detailed report or identify rebalancing opportunities?`,
        actions: [
          { id: '1', label: 'Generate Performance Report', type: 'generate' },
          { id: '2', label: 'Show Rebalancing Opportunities', type: 'navigate', target: 'portfolio' },
          { id: '3', label: 'View Sector Allocation', type: 'show' },
        ]
      };
    }

    // Tax harvest queries
    if (lowerMessage.includes('tax') || lowerMessage.includes('harvest') || lowerMessage.includes('loss')) {
      const taxOpportunities = clients.map(client => {
        const rawHoldings = holdingsData[client.id] || [];
        const calculated = calculateHoldings(rawHoldings, client.totalPortfolioValue);
        const lossHoldings = calculated.filter(h => h.unrealisedGainLoss < 0);
        const totalLoss = lossHoldings.reduce((sum, h) => sum + Math.abs(h.unrealisedGainLoss), 0);
        return { client, totalLoss, count: lossHoldings.length };
      }).filter(o => o.totalLoss > 0).sort((a, b) => b.totalLoss - a.totalLoss);

      const topThree = taxOpportunities.slice(0, 3);
      const totalPotential = topThree.reduce((sum, o) => sum + o.totalLoss, 0);

      return {
        content: `💰 **Tax Harvesting Opportunities**

I found ${taxOpportunities.length} clients with potential tax loss harvesting:

${topThree.map((o, i) => `${i + 1}. **${o.client.name}** - $${o.totalLoss.toLocaleString()} loss potential (${o.count} holding${o.count > 1 ? 's' : ''})`).join('\n')}

**Total potential offset:** $${totalPotential.toLocaleString()}

Shall I generate detailed tax reports for these clients?`,
        actions: [
          { id: '1', label: 'Generate Tax Reports', type: 'generate' },
          { id: '2', label: 'View Gains & Losses', type: 'navigate', target: 'gains' },
          { id: '3', label: 'Schedule Tax Review', type: 'schedule' },
        ]
      };
    }

    // Review queries
    if (lowerMessage.includes('review') || lowerMessage.includes('due') || lowerMessage.includes('this month')) {
      return {
        content: `📅 **Client Reviews Due**

**This week:**
• Sarah Chen (Nov 15) - Quarterly review
• ${selectedClient.name} (Nov 17) - Annual review

**Later this month:**
• 3 more clients (Nov 22-28)

I can help you:
- Schedule calendar reminders
- Prepare performance summaries  
- Draft meeting agendas

What would you like me to do?`,
        actions: [
          { id: '1', label: 'Schedule Reminders', type: 'schedule' },
          { id: '2', label: 'Prepare Summaries', type: 'generate' },
          { id: '3', label: 'Draft Agendas', type: 'generate' },
        ]
      };
    }

    // Rebalancing queries
    if (lowerMessage.includes('rebalanc') || lowerMessage.includes('drift') || lowerMessage.includes('allocation')) {
      return {
        content: `⚖️ **Rebalancing Analysis**

Portfolios with significant drift from target allocation:

1. **Sarah Chen** - 15% drift (Overweight: Equities)
2. **Michael Roberts** - 12% drift (Underweight: Fixed Income)
3. **${selectedClient.name}** - 8% drift (Overweight: Cash)

**Recommended actions:**
• Reduce equity exposure for Sarah Chen
• Increase bond allocation for Michael Roberts
• Deploy excess cash for ${selectedClient.name}

Would you like me to generate rebalancing recommendations?`,
        actions: [
          { id: '1', label: 'Generate Rebalancing Report', type: 'generate' },
          { id: '2', label: 'View All Allocations', type: 'navigate', target: 'portfolio' },
        ]
      };
    }

    // Market queries
    if (lowerMessage.includes('market') || lowerMessage.includes('today') || lowerMessage.includes('movement')) {
      return {
        content: `📈 **Today's Market Impact**

**Key movements:**
• ASX 200: -1.2% 
• S&P 500: +0.8%
• Tech sector: +2.1%

**Impact on your clients:**
• 8 portfolios affected by ASX decline
• 4 portfolios benefiting from tech rally
• ${selectedClient.name}'s portfolio: -0.3% today

I noticed 3 clients have >2% decline today. Would you like me to draft proactive updates?`,
        actions: [
          { id: '1', label: 'Draft Client Updates', type: 'generate' },
          { id: '2', label: 'View Performance', type: 'navigate', target: 'performance' },
        ]
      };
    }

    // Client-specific queries
    if (lowerMessage.includes('client') || lowerMessage.includes('who') || lowerMessage.includes('list')) {
      const clientCount = contextMode === 'all' ? clients.length : clients.filter(c => c.type === contextMode).length;
      return {
        content: `👥 **Client Overview** (${contextMode === 'all' ? 'All' : contextMode === 'retail' ? 'Retail' : 'Private'})

You have **${clientCount} clients** in your current view.

**Currently selected:** ${selectedClient.name}
**Type:** ${selectedClient.type === 'retail' ? 'Retail' : 'Private Wealth'}

Quick stats across all clients:
• Total AUM: $24.8M
• Average portfolio size: $4.1M
• Clients needing attention: 3

What would you like to know about your clients?`,
        actions: [
          { id: '1', label: 'View Dashboard', type: 'navigate', target: 'dashboard' },
          { id: '2', label: 'Show Client List', type: 'show' },
        ]
      };
    }

    // Help/explain queries
    if (lowerMessage.includes('help') || lowerMessage.includes('what can') || lowerMessage.includes('explain')) {
      return {
        content: `🤖 **I can help you with:**

**Portfolio Analysis**
• "How is [client]'s portfolio performing?"
• "Show me sector allocation"
• "Who needs rebalancing?"

**Tax Planning**
• "Show tax harvest opportunities"
• "Which clients have CGT discount available?"

**Workflow Management**
• "Which clients need reviews?"
• "What needs my attention today?"
• "Draft a client update"

**Market Insights**
• "How did today's market affect portfolios?"
• "Show me top performers"

Just ask naturally - I'll understand!`,
        actions: [
          { id: '1', label: 'Show Today\'s Priorities', type: 'show' },
          { id: '2', label: 'View All Insights', type: 'navigate', target: 'dashboard' },
        ]
      };
    }

    // Default response
    return {
      content: `I understand you're asking about "${userMessage.slice(0, 50)}${userMessage.length > 50 ? '...' : ''}". 

I can help you with:
• Portfolio performance and analysis
• Tax harvesting opportunities
• Client review scheduling
• Market impact assessment
• Rebalancing recommendations

Could you rephrase your question, or would you like me to show you what I can do?`,
      actions: [
        { id: '1', label: 'Show My Capabilities', type: 'show' },
        { id: '2', label: 'View Dashboard', type: 'navigate', target: 'dashboard' },
      ]
    };
  }, [selectedClient, clientHoldings, contextMode]);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const response = await generateResponse(content);

    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: response.content,
      timestamp: new Date(),
      actions: response.actions,
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsTyping(false);
  }, [generateResponse]);

  const executeAction = useCallback((action: ChatAction) => {
    switch (action.type) {
      case 'navigate':
        if (action.target) {
          setActiveTab(action.target as any);
        }
        break;
      case 'generate':
        // Simulate generating report
        setMessages(prev => [...prev, {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: `✅ I'm generating the ${action.label.toLowerCase()}. This will be ready in a moment and will appear in your Reports tab.`,
          timestamp: new Date(),
        }]);
        break;
      case 'schedule':
        setMessages(prev => [...prev, {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: `📅 I've added reminders to your calendar. You'll receive notifications before each scheduled item.`,
          timestamp: new Date(),
        }]);
        break;
      case 'show':
        setMessages(prev => [...prev, {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: `Let me show you that information. Check the main dashboard for details.`,
          timestamp: new Date(),
        }]);
        setActiveTab('dashboard');
        break;
    }
  }, [setActiveTab]);

  const clearHistory = useCallback(() => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: `Hi! I'm your AI assistant. I can help you analyze portfolios, find tax opportunities, and manage client workflows. What would you like to know?`,
      timestamp: new Date(),
    }]);
  }, []);

  return {
    messages,
    isTyping,
    sendMessage,
    executeAction,
    clearHistory,
  };
}
