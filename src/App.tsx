import { EcoviseProvider, useEcovise } from './context/EcoviseContext';
import { AppShell } from './components/AppShell';
import { HomeView } from './views/HomeView';
import { AppliancesView } from './views/AppliancesView';
import { StoreView } from './views/StoreView';
import { RewardsView } from './views/RewardsView';
import { ProfileView } from './views/ProfileView';
import {
  AdvisorModal,
  CartDrawer,
  DiagnosticApplianceModal,
  DocumentPreviewModal,
  EditProfileModal,
  LabelsGuideModal,
  NotificationsDrawer,
  ProductDetailModal,
  RebateModal,
  ScanModal,
  ShareModal,
  TarifModal,
  ToastBanner,
} from './components/Modals';

function ActiveScreen() {
  const { activeTab } = useEcovise();

  switch (activeTab) {
    case 'home':
      return <HomeView />;
    case 'appliances':
      return <AppliancesView />;
    case 'store':
      return <StoreView />;
    case 'rewards':
      return <RewardsView />;
    case 'profile':
      return <ProfileView />;
    default:
      return <HomeView />;
  }
}

export default function App() {
  return (
    <EcoviseProvider>
      <AppShell>
        <ActiveScreen />
      </AppShell>
      <ToastBanner />
      <ScanModal />
      <RebateModal />
      <CartDrawer />
      <ProductDetailModal />
      <NotificationsDrawer />
      <TarifModal />
      <EditProfileModal />
      <DiagnosticApplianceModal />
      <AdvisorModal />
      <LabelsGuideModal />
      <DocumentPreviewModal />
      <ShareModal />
    </EcoviseProvider>
  );
}
