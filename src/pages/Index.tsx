import { Header } from '@/components/layout/Header';
import { ClientHeader } from '@/components/layout/ClientHeader';
import { Toast } from '@/components/layout/Toast';
import { HoldingsHeader } from '@/components/holdings/HoldingsHeader';
import { HoldingsTable } from '@/components/holdings/HoldingsTable';
import { PortfolioHero } from '@/components/holdings/PortfolioHero';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';
import { TourPopover } from '@/components/onboarding/TourPopover';
import { HelpPanel } from '@/components/help/HelpPanel';
import { SmartSuggestionBanner } from '@/components/banners/SmartSuggestionBanner';
import { DashboardTab } from '@/components/tabs/DashboardTab';
import { PerformanceTab } from '@/components/tabs/PerformanceTab';
import { GainsLossesTab } from '@/components/tabs/GainsLossesTab';
import { TransactionsTab } from '@/components/tabs/TransactionsTab';
import { DetailsTab } from '@/components/tabs/DetailsTab';
import { ReportsTab } from '@/components/tabs/ReportsTab';
import { AIAssistantPanel } from '@/components/ai/AIAssistantPanel';
import { AppProvider, useApp } from '@/context/AppContext';

function DashboardContent() {
  const { contextMode, activeTab } = useApp();
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />;
      case 'portfolio':
        return (
          <>
            <PortfolioHero />
            <HoldingsHeader />
            <HoldingsTable />
          </>
        );
      case 'performance':
        return <PerformanceTab />;
      case 'gains':
        return <GainsLossesTab />;
      case 'transactions':
        return <TransactionsTab />;
      case 'details':
        return <DetailsTab />;
      case 'reports':
        return <ReportsTab />;
      default:
        return null;
    }
  };
  
  return (
    <div className={`min-h-screen bg-surface transition-colors duration-300 ${contextMode === 'private' ? 'context-private' : ''}`}>
      <Header />
      <ClientHeader />
      
      <SmartSuggestionBanner />
      
      <main className="p-6 pt-0 overflow-auto">
        <div className="max-w-[1600px] mx-auto">
          {renderTabContent()}
        </div>
      </main>
      
      {/* Overlays */}
      <Toast />
      <OnboardingModal />
      <TourPopover />
      <HelpPanel />
      <AIAssistantPanel />
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
