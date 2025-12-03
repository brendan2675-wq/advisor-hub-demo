import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ClientType, Client, clients } from '@/data/mockData';

type ContextMode = 'retail' | 'private' | 'all';

interface AppContextType {
  contextMode: ContextMode;
  setContextMode: (mode: ContextMode) => void;
  selectedClient: Client;
  setSelectedClient: (client: Client) => void;
  isDetailedView: boolean;
  setIsDetailedView: (detailed: boolean) => void;
  hasSeenOnboarding: boolean;
  setHasSeenOnboarding: (seen: boolean) => void;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  showTour: boolean;
  setShowTour: (show: boolean) => void;
  tourStep: number;
  setTourStep: (step: number) => void;
  showHelpPanel: boolean;
  setShowHelpPanel: (show: boolean) => void;
  toastMessage: string | null;
  showToast: (message: string) => void;
  grouping: 'assetClass' | 'account' | 'gics';
  setGrouping: (grouping: 'assetClass' | 'account' | 'gics') => void;
  filteredClients: Client[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const ONBOARDING_KEY = 'dash-onboarding-seen';

export function AppProvider({ children }: { children: ReactNode }) {
  const [contextMode, setContextModeState] = useState<ContextMode>('retail');
  const [selectedClient, setSelectedClient] = useState<Client>(clients[0]);
  const [isDetailedView, setIsDetailedView] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboardingState] = useState(() => {
    return localStorage.getItem(ONBOARDING_KEY) === 'true';
  });
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [showHelpPanel, setShowHelpPanel] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [grouping, setGrouping] = useState<'assetClass' | 'account' | 'gics'>('assetClass');

  const setContextMode = useCallback((mode: ContextMode) => {
    setContextModeState(mode);
    const modeLabel = mode === 'retail' ? 'Retail Clients' : mode === 'private' ? 'Private Clients' : 'All Clients';
    showToast(`Switched to ${modeLabel} view`);
  }, []);

  const setHasSeenOnboarding = useCallback((seen: boolean) => {
    localStorage.setItem(ONBOARDING_KEY, String(seen));
    setHasSeenOnboardingState(seen);
  }, []);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  const filteredClients = contextMode === 'all' 
    ? clients 
    : clients.filter(c => c.type === contextMode);

  return (
    <AppContext.Provider
      value={{
        contextMode,
        setContextMode,
        selectedClient,
        setSelectedClient,
        isDetailedView,
        setIsDetailedView,
        hasSeenOnboarding,
        setHasSeenOnboarding,
        showOnboarding,
        setShowOnboarding,
        showTour,
        setShowTour,
        tourStep,
        setTourStep,
        showHelpPanel,
        setShowHelpPanel,
        toastMessage,
        showToast,
        grouping,
        setGrouping,
        filteredClients,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
