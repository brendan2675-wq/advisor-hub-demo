import { Check } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function Toast() {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-toast-slide">
      <div className="flex items-center gap-3 px-4 py-3 bg-foreground text-background rounded-lg shadow-lg">
        <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center">
          <Check className="w-3 h-3 text-success-foreground" />
        </div>
        <span className="text-sm font-medium">{toastMessage}</span>
      </div>
    </div>
  );
}
