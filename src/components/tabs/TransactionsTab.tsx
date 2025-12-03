import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, RefreshCw, DollarSign } from 'lucide-react';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
  }).format(value).replace('A$', '$');
}

// Mock transaction data
const generateMockTransactions = (clientId: string) => {
  const transactionTypes = ['Buy', 'Sell', 'Dividend', 'Interest', 'Transfer In', 'Transfer Out'];
  const securities = [
    { code: 'ANZ.ASX', name: 'ANZ Banking Group' },
    { code: 'BHP.ASX', name: 'BHP Group Limited' },
    { code: 'CBA.ASX', name: 'Commonwealth Bank' },
    { code: 'CMA', name: 'Cash Management Account' },
    { code: 'AAPL.US', name: 'Apple Inc.' },
    { code: 'MSFT.US', name: 'Microsoft Corp' },
  ];
  
  const transactions = [];
  const baseDate = new Date('2024-12-03');
  
  for (let i = 0; i < 20; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i * 3);
    
    const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
    const security = securities[Math.floor(Math.random() * securities.length)];
    const units = type === 'Dividend' || type === 'Interest' ? 0 : Math.floor(Math.random() * 500) + 50;
    const price = Math.random() * 100 + 10;
    const amount = type === 'Dividend' || type === 'Interest' 
      ? Math.random() * 5000 + 100 
      : units * price;
    
    transactions.push({
      id: `txn-${clientId}-${i}`,
      date: date.toISOString().split('T')[0],
      type,
      security: security.code,
      securityName: security.name,
      units,
      price: price,
      amount: type === 'Sell' || type === 'Transfer Out' ? -amount : amount,
    });
  }
  
  return transactions;
};

export function TransactionsTab() {
  const { selectedClient } = useApp();
  
  const transactions = generateMockTransactions(selectedClient.id);
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Buy':
      case 'Transfer In':
        return <ArrowDownRight className="w-4 h-4 text-gain" />;
      case 'Sell':
      case 'Transfer Out':
        return <ArrowUpRight className="w-4 h-4 text-loss" />;
      case 'Dividend':
      case 'Interest':
        return <DollarSign className="w-4 h-4 text-primary" />;
      default:
        return <RefreshCw className="w-4 h-4 text-muted-foreground" />;
    }
  };
  
  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'Buy':
      case 'Transfer In':
        return 'bg-gain/10 text-gain';
      case 'Sell':
      case 'Transfer Out':
        return 'bg-loss/10 text-loss';
      case 'Dividend':
      case 'Interest':
        return 'bg-primary/10 text-primary';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-surface p-4">
          <p className="text-sm text-muted-foreground">Total Transactions</p>
          <p className="text-2xl font-bold text-foreground mt-1">{transactions.length}</p>
        </div>
        <div className="card-surface p-4">
          <p className="text-sm text-muted-foreground">Buys</p>
          <p className="text-2xl font-bold text-gain mt-1">
            {transactions.filter(t => t.type === 'Buy').length}
          </p>
        </div>
        <div className="card-surface p-4">
          <p className="text-sm text-muted-foreground">Sells</p>
          <p className="text-2xl font-bold text-loss mt-1">
            {transactions.filter(t => t.type === 'Sell').length}
          </p>
        </div>
        <div className="card-surface p-4">
          <p className="text-sm text-muted-foreground">Income Events</p>
          <p className="text-2xl font-bold text-primary mt-1">
            {transactions.filter(t => t.type === 'Dividend' || t.type === 'Interest').length}
          </p>
        </div>
      </div>
      
      {/* Transactions Table */}
      <div className="card-surface overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Transaction History</h3>
          <div className="flex items-center gap-2">
            <select className="text-sm border border-border rounded-lg px-3 py-2 bg-card text-foreground">
              <option>All Types</option>
              <option>Buy</option>
              <option>Sell</option>
              <option>Dividend</option>
              <option>Interest</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header border-b border-border">
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Type</th>
                <th className="py-3 px-4 text-left">Security</th>
                <th className="py-3 px-4 text-right">Units</th>
                <th className="py-3 px-4 text-right">Price</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(txn => (
                <tr key={txn.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-foreground">{txn.date}</td>
                  <td className="py-3 px-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full",
                      getTypeBadgeClass(txn.type)
                    )}>
                      {getTypeIcon(txn.type)}
                      {txn.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm font-medium text-foreground">{txn.security}</p>
                    <p className="text-xs text-muted-foreground">{txn.securityName}</p>
                  </td>
                  <td className="py-3 px-4 text-sm text-foreground text-right tabular-nums">
                    {txn.units > 0 ? new Intl.NumberFormat('en-AU').format(txn.units) : '-'}
                  </td>
                  <td className="py-3 px-4 text-sm text-foreground text-right tabular-nums">
                    {txn.units > 0 ? formatCurrency(txn.price) : '-'}
                  </td>
                  <td className={cn(
                    "py-3 px-4 text-sm text-right tabular-nums font-medium",
                    txn.amount >= 0 ? "text-gain" : "text-loss"
                  )}>
                    {formatCurrency(Math.abs(txn.amount))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
