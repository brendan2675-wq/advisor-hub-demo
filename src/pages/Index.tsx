import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Toast } from '@/components/layout/Toast';
import { HoldingsHeader } from '@/components/holdings/HoldingsHeader';
import { HoldingsTable } from '@/components/holdings/HoldingsTable';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';
import { TourPopover } from '@/components/onboarding/TourPopover';
import { HelpPanel } from '@/components/help/HelpPanel';
import { AppProvider, useApp } from '@/context/AppContext';

function DashboardContent() {
  const { contextMode } = useApp();
  
  return (
    <div className={`min-h-screen bg-surface transition-colors duration-300 ${contextMode === 'private' ? 'context-private' : ''}`}>
      <Header />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar activeItem="holdings" />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-[1600px] mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground">Portfolio Holdings</h1>
              <p className="text-sm text-muted-foreground mt-1">
                View and analyze client portfolio positions
              </p>
            </div>
            
            <HoldingsHeader />
            <HoldingsTable />
          </div>
        </main>
      </div>
      
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
