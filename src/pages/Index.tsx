import { Header } from '@/components/layout/Header';
import { ClientHeader } from '@/components/layout/ClientHeader';
import { Toast } from '@/components/layout/Toast';
import { HoldingsHeader } from '@/components/holdings/HoldingsHeader';
import { HoldingsTable } from '@/components/holdings/HoldingsTable';
import { PortfolioHero } from '@/components/holdings/PortfolioHero';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';
import { TourPopover } from '@/components/onboarding/TourPopover';
import { HelpPanel } from '@/components/help/HelpPanel';
import { AppProvider, useApp } from '@/context/AppContext';

function DashboardContent() {
  const { contextMode } = useApp();
  
  return (
    <div className={`min-h-screen bg-surface transition-colors duration-300 ${contextMode === 'private' ? 'context-private' : ''}`}>
      <Header />
      <ClientHeader />
      
      <main className="p-6 overflow-auto">
        <div className="max-w-[1600px] mx-auto">
          <PortfolioHero />
          <HoldingsHeader />
          <HoldingsTable />
        </div>
      </main>
      
      {/* Overlays */}
      <Toast />
      <OnboardingModal />
      <TourPopover />
      <HelpPanel />
    </div>
  );
}

const Index = () => {
  return (
    <AppProvider>
      <DashboardContent />
    </AppProvider>
  );
};

export default Index;
