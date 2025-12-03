import { Calendar, ChevronDown, Download, ToggleLeft, ToggleRight, FileText } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { clients, Client } from '@/data/mockData';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function HoldingsHeader() {
  const { 
    selectedClient, 
    setSelectedClient, 
    isDetailedView, 
    setIsDetailedView,
    hasSeenOnboarding,
    setShowOnboarding,
    grouping,
    setGrouping,
    filteredClients,
    showToast,
  } = useApp();

  const handleViewToggle = () => {
    if (!isDetailedView && !hasSeenOnboarding) {
      setShowOnboarding(true);
    }
    setIsDetailedView(!isDetailedView);
  };

  const groupingOptions = [
    { value: 'assetClass' as const, label: 'Asset Class' },
    { value: 'account' as const, label: 'Account' },
    { value: 'gics' as const, label: 'GICs' },
  ];

  const currentGrouping = groupingOptions.find(opt => opt.value === grouping);

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        {/* Client Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border hover:bg-muted transition-colors duration-200 outline-none">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">{selectedClient.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                selectedClient.type === 'private' ? 'badge-private' : 'badge-retail'
              }`}>
                {selectedClient.type === 'private' ? 'Private' : 'Retail'}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            {filteredClients.map(client => (
              <DropdownMenuItem
                key={client.id}
                onClick={() => setSelectedClient(client)}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>{client.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  client.type === 'private' ? 'badge-private' : 'badge-retail'
                }`}>
                  {client.type === 'private' ? 'Private' : 'Retail'}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Date Selector */}
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border hover:bg-muted transition-colors duration-200">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-foreground">3 Dec 2024</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        {/* Grouping Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger 
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border hover:bg-muted transition-colors duration-200 outline-none"
            id="grouping-dropdown"
          >
            <span className="text-sm text-muted-foreground">Group by:</span>
            <span className="text-sm font-medium text-foreground">{currentGrouping?.label}</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {groupingOptions.map(option => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => setGrouping(option.value)}
                className="cursor-pointer"
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* View Toggle */}
        <button
          onClick={handleViewToggle}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
          id="view-toggle"
        >
          {isDetailedView ? (
            <ToggleRight className="w-4 h-4" />
          ) : (
            <ToggleLeft className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">
            {isDetailedView ? 'Detailed View' : 'Compact View'}
          </span>
        </button>

        {/* Generate Report Button */}
        <button
          onClick={() => showToast('Generating performance report...')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border hover:bg-muted transition-colors duration-200"
        >
          <FileText className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Generate Report</span>
        </button>

        {/* Export Button */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border hover:bg-muted transition-colors duration-200 outline-none">
            <Download className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Export</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="cursor-pointer">Export as PDF</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Export as CSV</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Export as Excel</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
