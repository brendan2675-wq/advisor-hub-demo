import { Search, User, HelpCircle, ChevronDown, Check } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const { contextMode, setContextMode, setShowHelpPanel } = useApp();

  const contextOptions = [
    { value: 'retail' as const, label: 'Retail Clients' },
    { value: 'private' as const, label: 'Private Clients' },
    { value: 'all' as const, label: 'All Clients' },
  ];

  const currentContext = contextOptions.find(opt => opt.value === contextMode);

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 transition-colors duration-300">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center transition-colors duration-300">
          <span className="text-primary-foreground font-bold text-sm">D</span>
        </div>
        <span className="text-xl font-semibold text-foreground">DASH</span>
      </div>

      {/* Context Switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors duration-200 outline-none">
          <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
            contextMode === 'private' ? 'bg-private' : 'bg-retail'
          }`} />
          <span className="text-sm font-medium text-foreground">{currentContext?.label}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-48">
          {contextOptions.map(option => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setContextMode(option.value)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  option.value === 'private' ? 'bg-private' : option.value === 'retail' ? 'bg-retail' : 'bg-muted-foreground'
                }`} />
                <span>{option.label}</span>
              </div>
              {contextMode === option.value && <Check className="w-4 h-4 text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Right Icons */}
      <div className="flex items-center gap-1">
        <button className="btn-icon">
          <Search className="w-5 h-5 text-muted-foreground" />
        </button>
        <button className="btn-icon">
          <User className="w-5 h-5 text-muted-foreground" />
        </button>
        <button 
          className="btn-icon" 
          onClick={() => setShowHelpPanel(true)}
          id="help-button"
        >
          <HelpCircle className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}
