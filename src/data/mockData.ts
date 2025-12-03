export type ClientType = 'retail' | 'private';

export interface Client {
  id: string;
  name: string;
  type: ClientType;
  totalPortfolioValue: number;
}

export interface Holding {
  id: string;
  name: string;
  code: string;
  assetClass: string;
  units: number;
  currentPrice: number;
  costBase: number;
  estimatedIncome: number;
}

export interface HoldingWithCalculations extends Holding {
  value: number;
  portfolioPercent: number;
  avgUnitCost: number;
  unrealisedGainLoss: number;
  unrealisedGainLossPercent: number;
  estimatedYield: number;
}

export const clients: Client[] = [
  {
    id: 'client-1',
    name: 'John Smith',
    type: 'retail',
    totalPortfolioValue: 4166250,
  },
  {
    id: 'client-2',
    name: 'Sarah Chen',
    type: 'private',
    totalPortfolioValue: 8425000,
  },
  {
    id: 'client-3',
    name: 'Michael Roberts',
    type: 'retail',
    totalPortfolioValue: 2150000,
  },
];

export const holdingsData: Record<string, Holding[]> = {
  'client-1': [
    { id: 'h1', name: 'Australia & New Zealand Banking Group', code: 'ANZ.ASX', assetClass: 'Australian Equities', units: 5814, currentPrice: 38.65, costBase: 139706.86, estimatedIncome: 14523.50 },
    { id: 'h2', name: 'BHP Group Limited', code: 'BHP.ASX', assetClass: 'Australian Equities', units: 3200, currentPrice: 45.20, costBase: 112640.00, estimatedIncome: 8960.00 },
    { id: 'h3', name: 'Commonwealth Bank of Australia', code: 'CBA.ASX', assetClass: 'Australian Equities', units: 2100, currentPrice: 128.50, costBase: 189420.00, estimatedIncome: 11865.00 },
    { id: 'h4', name: 'Westpac Banking Corporation', code: 'WBC.ASX', assetClass: 'Australian Equities', units: 4500, currentPrice: 28.90, costBase: 108000.00, estimatedIncome: 9675.00 },
    { id: 'h5', name: 'Australian Government Bond 2027', code: 'GSBI27.ASX', assetClass: 'Fixed Income', units: 15000, currentPrice: 98.45, costBase: 1500000.00, estimatedIncome: 52500.00 },
    { id: 'h6', name: 'Corporate Bond Fund', code: 'CBOND.ASX', assetClass: 'Fixed Income', units: 8000, currentPrice: 52.30, costBase: 400000.00, estimatedIncome: 21040.00 },
    { id: 'h7', name: 'Cash Management Account', code: 'CMA001', assetClass: 'Cash', units: 1, currentPrice: 285000, costBase: 285000, estimatedIncome: 12825.00 },
    { id: 'h8', name: 'Apple Inc.', code: 'AAPL.US', assetClass: 'International Equities', units: 850, currentPrice: 189.25, costBase: 127500.00, estimatedIncome: 816.00 },
    { id: 'h9', name: 'Microsoft Corporation', code: 'MSFT.US', assetClass: 'International Equities', units: 600, currentPrice: 378.90, costBase: 180540.00, estimatedIncome: 1584.00 },
    { id: 'h10', name: 'Vanguard MSCI Index International', code: 'VGS.ASX', assetClass: 'International Equities', units: 2500, currentPrice: 118.40, costBase: 237500.00, estimatedIncome: 5920.00 },
  ],
  'client-2': [
    { id: 'h11', name: 'Australia & New Zealand Banking Group', code: 'ANZ.ASX', assetClass: 'Australian Equities', units: 12000, currentPrice: 38.65, costBase: 348000.00, estimatedIncome: 30000.00 },
    { id: 'h12', name: 'BHP Group Limited', code: 'BHP.ASX', assetClass: 'Australian Equities', units: 8500, currentPrice: 45.20, costBase: 323000.00, estimatedIncome: 23800.00 },
    { id: 'h13', name: 'Commonwealth Bank of Australia', code: 'CBA.ASX', assetClass: 'Australian Equities', units: 5500, currentPrice: 128.50, costBase: 550000.00, estimatedIncome: 31075.00 },
    { id: 'h14', name: 'CSL Limited', code: 'CSL.ASX', assetClass: 'Australian Equities', units: 3200, currentPrice: 285.60, costBase: 800000.00, estimatedIncome: 9152.00 },
    { id: 'h15', name: 'Australian Government Bond 2030', code: 'GSBI30.ASX', assetClass: 'Fixed Income', units: 25000, currentPrice: 96.80, costBase: 2500000.00, estimatedIncome: 87500.00 },
    { id: 'h16', name: 'High Yield Bond Fund', code: 'HYBND.ASX', assetClass: 'Fixed Income', units: 12000, currentPrice: 48.75, costBase: 540000.00, estimatedIncome: 35100.00 },
    { id: 'h17', name: 'Cash Management Account', code: 'CMA002', assetClass: 'Cash', units: 1, currentPrice: 650000, costBase: 650000, estimatedIncome: 29250.00 },
    { id: 'h18', name: 'NVIDIA Corporation', code: 'NVDA.US', assetClass: 'International Equities', units: 1200, currentPrice: 485.50, costBase: 360000.00, estimatedIncome: 480.00 },
    { id: 'h19', name: 'Amazon.com Inc.', code: 'AMZN.US', assetClass: 'International Equities', units: 900, currentPrice: 178.25, costBase: 126000.00, estimatedIncome: 0 },
    { id: 'h20', name: 'iShares Global Healthcare ETF', code: 'IXJ.ASX', assetClass: 'International Equities', units: 4500, currentPrice: 112.80, costBase: 450000.00, estimatedIncome: 7605.00 },
  ],
  'client-3': [
    { id: 'h21', name: 'Telstra Corporation', code: 'TLS.ASX', assetClass: 'Australian Equities', units: 15000, currentPrice: 3.85, costBase: 52500.00, estimatedIncome: 2400.00 },
    { id: 'h22', name: 'Woolworths Group', code: 'WOW.ASX', assetClass: 'Australian Equities', units: 2800, currentPrice: 32.45, costBase: 84000.00, estimatedIncome: 3220.00 },
    { id: 'h23', name: 'Wesfarmers Limited', code: 'WES.ASX', assetClass: 'Australian Equities', units: 1500, currentPrice: 62.80, costBase: 82500.00, estimatedIncome: 3210.00 },
    { id: 'h24', name: 'Australian Government Bond 2025', code: 'GSBI25.ASX', assetClass: 'Fixed Income', units: 10000, currentPrice: 99.20, costBase: 1000000.00, estimatedIncome: 35000.00 },
    { id: 'h25', name: 'Cash Management Account', code: 'CMA003', assetClass: 'Cash', units: 1, currentPrice: 180000, costBase: 180000, estimatedIncome: 8100.00 },
    { id: 'h26', name: 'Alphabet Inc.', code: 'GOOGL.US', assetClass: 'International Equities', units: 450, currentPrice: 141.80, costBase: 54000.00, estimatedIncome: 0 },
    { id: 'h27', name: 'Vanguard All-World ETF', code: 'VEU.ASX', assetClass: 'International Equities', units: 3500, currentPrice: 85.25, costBase: 262500.00, estimatedIncome: 8942.50 },
  ],
};

export function calculateHoldings(holdings: Holding[], totalPortfolioValue: number): HoldingWithCalculations[] {
  return holdings.map(holding => {
    const value = holding.units * holding.currentPrice;
    const unrealisedGainLoss = value - holding.costBase;
    const unrealisedGainLossPercent = ((value - holding.costBase) / holding.costBase) * 100;
    const estimatedYield = (holding.estimatedIncome / value) * 100;
    const avgUnitCost = holding.costBase / holding.units;
    const portfolioPercent = (value / totalPortfolioValue) * 100;

    return {
      ...holding,
      value,
      portfolioPercent,
      avgUnitCost,
      unrealisedGainLoss,
      unrealisedGainLossPercent,
      estimatedYield,
    };
  });
}

export const assetClassOrder = [
  'Australian Equities',
  'Fixed Income',
  'Cash',
  'International Equities',
];

export function groupByAssetClass(holdings: HoldingWithCalculations[]): Record<string, HoldingWithCalculations[]> {
  const grouped: Record<string, HoldingWithCalculations[]> = {};
  
  assetClassOrder.forEach(assetClass => {
    const items = holdings.filter(h => h.assetClass === assetClass);
    if (items.length > 0) {
      grouped[assetClass] = items;
    }
  });
  
  return grouped;
}

export const columnTooltips: Record<string, string> = {
  'Cost Base': 'Your original investment amount including brokerage and other acquisition costs.',
  'Avg Unit Cost': 'The average price paid per unit based on your cost base.',
  'Unrealised Gain/Loss ($)': 'The difference between current value and your cost base. Not yet realized as profit or loss.',
  'Unrealised Gain/Loss (%)': 'Current performance compared to your purchase price, expressed as a percentage.',
  'Est. Income': 'Projected annual income from dividends, distributions, or interest payments.',
  'Est. Yield': 'Expected annual return as a percentage of the current investment value.',
  'Port%': 'The percentage this holding represents of your total portfolio value.',
  'Value (AUD)': 'Current market value calculated as units multiplied by current price.',
};
