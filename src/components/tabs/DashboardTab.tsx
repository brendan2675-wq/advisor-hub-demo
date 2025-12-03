import { useApp } from '@/context/AppContext';
import { holdingsData, calculateHoldings, groupByAssetClass } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value).replace('A$', '$');
}

function formatCompactCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
}

// Asset class colors matching the design spec
const ASSET_COLORS: Record<string, string> = {
  'Property': '#8B5CF6',           // purple
  'Fixed Income': '#F59E0B',       // gold
  'Australian Equities': '#14B8A6', // teal
  'Cash': '#3B82F6',               // blue
  'International Equities': '#EF4444', // red
};

// Performance chart mock data
const performanceData = [
  { month: 'Jan', portfolio: 3800000, cash: 200000 },
  { month: 'Feb', portfolio: 3850000, cash: 210000 },
  { month: 'Mar', portfolio: 3750000, cash: 220000 },
  { month: 'Apr', portfolio: 3900000, cash: 230000 },
  { month: 'May', portfolio: 3950000, cash: 240000 },
  { month: 'Jun', portfolio: 4000000, cash: 250000 },
  { month: 'Jul', portfolio: 3850000, cash: 260000 },
  { month: 'Aug', portfolio: 4050000, cash: 270000 },
  { month: 'Sep', portfolio: 4100000, cash: 275000 },
  { month: 'Oct', portfolio: 4050000, cash: 280000 },
  { month: 'Nov', portfolio: 4120000, cash: 282000 },
  { month: 'Dec', portfolio: 4166250, cash: 285000 },
];

export function DashboardTab() {
  const { selectedClient, contextMode, setActiveTab } = useApp();
  
  const rawHoldings = holdingsData[selectedClient.id] || [];
  const holdings = calculateHoldings(rawHoldings, selectedClient.totalPortfolioValue);
  const groupedHoldings = groupByAssetClass(holdings);
  
  // Calculate asset allocation with proper colors
  const assetAllocation = Object.entries(groupedHoldings).map(([assetClass, items]) => {
    const value = items.reduce((sum, h) => sum + h.value, 0);
    const percent = items.reduce((sum, h) => sum + h.portfolioPercent, 0);
    return {
      name: assetClass,
      value,
      percent,
      color: ASSET_COLORS[assetClass] || '#6B7280',
    };
  });

  // Get top 5 holdings by value
  const topHoldings = [...holdings].sort((a, b) => b.value - a.value).slice(0, 5);

  // Calculate YTD performance (mock: +1.2%)
  const ytdPerformance = 1.2;

  return (
    <div className="space-y-6">
      {/* Portfolio Value + Holdings Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card - Total Portfolio Value with Donut Chart */}
        <div className="lg:col-span-2 card-surface p-6">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Total Portfolio Value</h3>
              <p className="text-3xl font-bold text-foreground mt-1 tabular-nums">
                {formatCurrency(selectedClient.totalPortfolioValue)}
              </p>
              <p className="text-sm text-gain mt-1">
                +{ytdPerformance}% this year
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-8 mt-6">
            {/* Donut Chart */}
            <div className="w-48 h-48 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assetAllocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {assetAllocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend */}
            <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-3">
              {assetAllocation.map((asset) => (
                <div key={asset.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: asset.color }}
                  />
                  <span className="text-sm text-muted-foreground truncate">{asset.name}</span>
                  <span className="text-sm font-medium text-foreground ml-auto tabular-nums">
                    {asset.percent.toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Card - Holdings List */}
        <div className="card-surface p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Holdings</h3>
          
          <div className="space-y-3">
            {topHoldings.map((holding) => {
              const assetColor = ASSET_COLORS[holding.assetClass] || '#6B7280';
              return (
                <div key={holding.id} className="flex items-center gap-3">
                  <div 
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: assetColor }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {holding.name}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm text-muted-foreground tabular-nums">
                      {holding.portfolioPercent.toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 w-24">
                    <p className="text-sm font-medium text-foreground tabular-nums">
                      {formatCompactCurrency(holding.value)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          
          <button 
            onClick={() => setActiveTab('portfolio')}
            className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 mt-5 transition-colors"
          >
            View holdings detail
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Portfolio Performance Card */}
      <div className="card-surface p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-medium text-muted-foreground">Portfolio Performance</h3>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
              Reset
            </button>
            <button className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
              contextMode === 'private' 
                ? "bg-slate-700 text-white hover:bg-slate-600"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}>
              vs Benchmark
            </button>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickFormatter={(value) => formatCompactCurrency(value)}
                width={60}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value: number) => [formatCurrency(value), '']}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Area 
                type="monotone" 
                dataKey="portfolio" 
                stroke="#14B8A6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorPortfolio)" 
                name="Portfolio"
              />
              <Area 
                type="monotone" 
                dataKey="cash" 
                stroke="#F59E0B" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorCash)"
                name="Cash" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-6 mt-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#14B8A6]" />
            <span className="text-sm text-muted-foreground">Portfolio</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
            <span className="text-sm text-muted-foreground">Cash</span>
          </div>
        </div>
      </div>
    </div>
  );
}
