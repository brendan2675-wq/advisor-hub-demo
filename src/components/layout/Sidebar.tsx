import { LayoutDashboard, TrendingUp, Wallet, FileText, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { id: 'summary', label: 'Summary', icon: LayoutDashboard },
  { id: 'holdings', label: 'Holdings', icon: TrendingUp },
  { id: 'cashbook', label: 'Cashbook', icon: Wallet },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
];

interface SidebarProps {
  activeItem?: string;
}

export function Sidebar({ activeItem = 'holdings' }: SidebarProps) {
  return (
    <aside className="w-60 border-r border-border bg-card h-full flex flex-col">
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = item.id === activeItem;
            
            return (
              <li key={item.id}>
                <button
                  className={cn(
                    'sidebar-item w-full text-left',
                    isActive && 'sidebar-item-active'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          <p>DASH Advisor Portal</p>
          <p className="mt-1">Version 2.4.1</p>
        </div>
      </div>
    </aside>
  );
}
