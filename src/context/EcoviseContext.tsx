import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  INITIAL_APPLIANCES,
  INITIAL_NOTIFICATIONS,
  INITIAL_PROFILE,
  INITIAL_REWARD_HISTORY,
  INITIAL_VOUCHERS,
  STORE_PRODUCTS,
} from '../data/initialData';
import type {
  Appliance,
  CartItem,
  HouseholdProfile,
  NotificationItem,
  PartnerVoucher,
  RewardHistoryItem,
  StoreProduct,
  TabId,
} from '../types/ecovise';

interface PersistedState {
  profile: HouseholdProfile;
  appliances: Appliance[];
  cart: CartItem[];
  walletEur: number;
  storeCreditEur: number;
  ecoPoints: number;
  co2SavedKg: number;
  recycledCount: number;
  rewardHistory: RewardHistoryItem[];
  vouchers: PartnerVoucher[];
  notifications: NotificationItem[];
}

const STORAGE_KEY = 'ecovise_app_state_v1';

const getInitialState = (): PersistedState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedState>;
      if (parsed.profile && Array.isArray(parsed.appliances)) {
        return {
          profile: parsed.profile,
          appliances: parsed.appliances,
          cart: parsed.cart ?? [],
          walletEur: typeof parsed.walletEur === 'number' ? parsed.walletEur : 45,
          storeCreditEur: typeof parsed.storeCreditEur === 'number' ? parsed.storeCreditEur : 0,
          ecoPoints: typeof parsed.ecoPoints === 'number' ? parsed.ecoPoints : 1450,
          co2SavedKg: typeof parsed.co2SavedKg === 'number' ? parsed.co2SavedKg : 142,
          recycledCount: typeof parsed.recycledCount === 'number' ? parsed.recycledCount : 2,
          rewardHistory: parsed.rewardHistory ?? INITIAL_REWARD_HISTORY,
          vouchers: parsed.vouchers ?? INITIAL_VOUCHERS,
          notifications: parsed.notifications ?? INITIAL_NOTIFICATIONS,
        };
      }
    }
  } catch {
    // Ignore storage read failures
  }
  return {
    profile: INITIAL_PROFILE,
    appliances: INITIAL_APPLIANCES,
    cart: [],
    walletEur: 45,
    storeCreditEur: 0,
    ecoPoints: 1450,
    co2SavedKg: 142,
    recycledCount: 2,
    rewardHistory: INITIAL_REWARD_HISTORY,
    vouchers: INITIAL_VOUCHERS,
    notifications: INITIAL_NOTIFICATIONS,
  };
};

interface EcoviseContextValue {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  forecastMode: 'annual' | 'monthly';
  setForecastMode: (mode: 'annual' | 'monthly') => void;
  profile: HouseholdProfile;
  appliances: Appliance[];
  cart: CartItem[];
  walletEur: number;
  storeCreditEur: number;
  ecoPoints: number;
  co2SavedKg: number;
  recycledCount: number;
  rewardHistory: RewardHistoryItem[];
  vouchers: PartnerVoucher[];
  notifications: NotificationItem[];
  unreadCount: number;

  // Derived metrics
  getApplianceAnnualCost: (kwh: number) => number;
  monitoredAnnualCostEur: number;
  totalProjectedAnnualEur: number;
  potentialAnnualSavingsEur: number;
  healthScore: number;
  energyDrainingCount: number;
  ecoEfficientCount: number;

  // Actions
  showToast: (msg: string) => void;
  toastMessage: string | null;
  dismissToast: () => void;
  updateTariff: (newTariff: number) => void;
  updateProfileDetails: (updates: Partial<HouseholdProfile>) => void;
  togglePreference: (key: keyof HouseholdProfile['preferences']) => void;
  syncSmartMeter: () => void;
  isSyncing: boolean;
  addScannedAppliance: (appliance: Omit<Appliance, 'id' | 'sharePercent'>) => void;
  addReferralScanBonus: (friendLabel: string) => void;
  addToCart: (product: StoreProduct, withTradeIn?: boolean, paymentMode?: 'buy' | 'lease') => void;
  removeFromCart: (productId: string) => void;
  checkoutCart: () => void;
  withdrawWalletToIban: () => void;
  convertWalletToStoreCredit: () => void;
  unlockVoucher: (voucherId: string) => void;
  markAllNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;
  resetDemoData: () => void;

  // Modals & Drawers
  scanModalMode: 'household' | 'referral' | null;
  openScanModal: (mode?: 'household' | 'referral') => void;
  closeScanModal: () => void;
  rebateModalOpen: boolean;
  setRebateModalOpen: (open: boolean) => void;
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;
  tarifModalOpen: boolean;
  setTarifModalOpen: (open: boolean) => void;
  editProfileOpen: boolean;
  setEditProfileOpen: (open: boolean) => void;
  selectedProduct: StoreProduct | null;
  setSelectedProduct: (product: StoreProduct | null) => void;
  leaseSimulatorOpen: boolean;
  setLeaseSimulatorOpen: (open: boolean) => void;
  advisorModalMode: 'chat' | 'video' | null;
  setAdvisorModalMode: (mode: 'chat' | 'video' | null) => void;
  labelsGuideOpen: boolean;
  setLabelsGuideOpen: (open: boolean) => void;
  documentPreview: 'audit' | 'recycling' | null;
  setDocumentPreview: (doc: 'audit' | 'recycling' | null) => void;
  shareModalOpen: boolean;
  setShareModalOpen: (open: boolean) => void;
  diagnosticAppliance: Appliance | null;
  setDiagnosticAppliance: (appliance: Appliance | null) => void;
  goToReplacementInStore: (productId?: string) => void;
}

const EcoviseContext = createContext<EcoviseContextValue | undefined>(undefined);

export function EcoviseProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(getInitialState);
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [forecastMode, setForecastMode] = useState<'annual' | 'monthly'>('annual');
  const [isSyncing, setIsSyncing] = useState(false);

  // Modal & Drawer states
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [scanModalMode, setScanModalMode] = useState<'household' | 'referral' | null>(null);
  const [rebateModalOpen, setRebateModalOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [tarifModalOpen, setTarifModalOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(null);
  const [leaseSimulatorOpen, setLeaseSimulatorOpen] = useState(false);
  const [advisorModalMode, setAdvisorModalMode] = useState<'chat' | 'video' | null>(null);
  const [labelsGuideOpen, setLabelsGuideOpen] = useState(false);
  const [documentPreview, setDocumentPreview] = useState<'audit' | 'recycling' | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [diagnosticAppliance, setDiagnosticAppliance] = useState<Appliance | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage write errors
    }
  }, [state]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const showToast = (msg: string) => setToastMessage(msg);
  const dismissToast = () => setToastMessage(null);

  const getApplianceAnnualCost = (kwh: number) => Math.round(kwh * state.profile.tarifKwh);

  const monitoredAnnualCostEur = useMemo(
    () => state.appliances.reduce((sum, a) => sum + getApplianceAnnualCost(a.kwhPerYear), 0),
    [state.appliances, state.profile.tarifKwh]
  );

  // Baseline household standby/lighting (~237 kWh/yr => ~90€ at 0.38€)
  const totalProjectedAnnualEur = useMemo(
    () => monitoredAnnualCostEur + Math.round(237 * state.profile.tarifKwh),
    [monitoredAnnualCostEur, state.profile.tarifKwh]
  );

  const potentialAnnualSavingsEur = useMemo(() => {
    const rawSavings = state.appliances.reduce(
      (sum, a) => sum + Math.round(a.overpayKwhPerYear * state.profile.tarifKwh),
      0
    );
    // Includes peak-hour smart optimization (~83€) when inefficient appliances exist
    const bonusOptimization = state.appliances.some((a) => a.status === 'replace')
      ? Math.round(218 * state.profile.tarifKwh)
      : 0;
    return rawSavings + bonusOptimization;
  }, [state.appliances, state.profile.tarifKwh]);

  const energyDrainingCount = useMemo(
    () => state.appliances.filter((a) => a.status === 'replace').length,
    [state.appliances]
  );

  const ecoEfficientCount = useMemo(
    () => state.appliances.filter((a) => a.status !== 'replace').length,
    [state.appliances]
  );

  const healthScore = useMemo(() => {
    if (state.appliances.length === 0) return 80;
    const scores = state.appliances.map((a) => {
      if (a.status === 'eco') return 94;
      if (a.status === 'standard') return 72;
      if (a.energyClass.includes('F')) return 34;
      return 56;
    });
    const avg = Math.round(scores.reduce((s, n) => s + n, 0) / scores.length);
    return Math.min(99, Math.max(25, avg));
  }, [state.appliances]);

  const unreadCount = useMemo(
    () => state.notifications.filter((n) => !n.read).length,
    [state.notifications]
  );

  const updateTariff = (newTariff: number) => {
    const safeTariff = Math.min(1.5, Math.max(0.05, Number(newTariff.toFixed(2))));
    setState((prev) => ({
      ...prev,
      profile: { ...prev.profile, tarifKwh: safeTariff },
    }));
    showToast(`Tarif mis à jour à ${safeTariff.toFixed(2).replace('.', ',')} €/kWh — coûts recalculés.`);
  };

  const updateProfileDetails = (updates: Partial<HouseholdProfile>) => {
    setState((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...updates },
    }));
    showToast('Informations du foyer mises à jour.');
  };

  const togglePreference = (key: keyof HouseholdProfile['preferences']) => {
    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        preferences: {
          ...prev.profile.preferences,
          [key]: !prev.profile.preferences[key],
        },
      },
    }));
  };

  const syncSmartMeter = () => {
    setIsSyncing(true);
    window.setTimeout(() => {
      setIsSyncing(false);
      setState((prev) => ({
        ...prev,
        profile: { ...prev.profile, lastSyncTime: "À l'instant" },
      }));
      showToast('Compteur SWM Smart Link synchronisé.');
    }, 650);
  };

  const addScannedAppliance = (appliance: Omit<Appliance, 'id' | 'sharePercent'>) => {
    const newId = `app-scan-${Date.now()}`;
    setState((prev) => {
      const updated = [
        {
          ...appliance,
          id: newId,
          sharePercent: 14,
        },
        ...prev.appliances,
      ];
      return {
        ...prev,
        appliances: updated,
        ecoPoints: prev.ecoPoints + 50,
      };
    });
    showToast(`${appliance.brandModel} ajouté au diagnostic (+50 pts éco).`);
  };

  const addReferralScanBonus = (friendLabel: string) => {
    setState((prev) => ({
      ...prev,
      walletEur: prev.walletEur + 15,
      ecoPoints: prev.ecoPoints + 150,
      co2SavedKg: prev.co2SavedKg + 45,
      rewardHistory: [
        {
          id: `rew-${Date.now()}`,
          title: friendLabel,
          subtitle: 'Scan & Earn validé · À l’instant',
          amountEur: 15,
          status: 'validated',
          icon: 'fridge',
        },
        ...prev.rewardHistory,
      ],
    }));
    showToast('Diagnostic validé : +15,00 € ajoutés à votre cagnotte !');
  };

  const addToCart = (product: StoreProduct, withTradeIn = true, paymentMode: 'buy' | 'lease' = 'buy') => {
    setState((prev) => {
      const existing = prev.cart.find((c) => c.product.id === product.id);
      if (existing) {
        return {
          ...prev,
          cart: prev.cart.map((c) =>
            c.product.id === product.id ? { ...c, withTradeIn, paymentMode } : c
          ),
        };
      }
      return {
        ...prev,
        cart: [...prev.cart, { product, withTradeIn, paymentMode, quantity: 1 }],
      };
    });
    setCartDrawerOpen(true);
    showToast(`${product.name} ajouté à votre sélection Éco-Store.`);
  };

  const removeFromCart = (productId: string) => {
    setState((prev) => ({
      ...prev,
      cart: prev.cart.filter((c) => c.product.id !== productId),
    }));
  };

  const checkoutCart = () => {
    setState((prev) => {
      if (prev.cart.length === 0) return prev;
      let updatedAppliances = [...prev.appliances];
      let addedCo2 = 0;
      let replacedItems = 0;

      prev.cart.forEach((item) => {
        addedCo2 += 120;
        if (item.withTradeIn) replacedItems += 1;
        if (item.product.replacesApplianceId) {
          const targetIdx = updatedAppliances.findIndex(
            (a) => a.id === item.product.replacesApplianceId
          );
          if (targetIdx !== -1) {
            const old = updatedAppliances[targetIdx];
            updatedAppliances[targetIdx] = {
              ...old,
              brandModel: item.product.name,
              ageYears: 0,
              energyClass: item.product.energyClass,
              legacyClass: undefined,
              status: 'eco',
              statusLabel: 'Éco-Optimal',
              kwhPerYear: item.product.kwhPerYear,
              overpayKwhPerYear: 0,
              tradeInBonusEur: 0,
              diagnosticNote: 'Remplacement éco installé · Garantie 5 ans',
              imageUrl: item.product.imageUrl,
              recommendedProductId: undefined,
              sharePercent: Math.max(6, Math.round(old.sharePercent * 0.25)),
            };
          }
        }
      });

      return {
        ...prev,
        appliances: updatedAppliances,
        cart: [],
        storeCreditEur: 0,
        ecoPoints: prev.ecoPoints + 300 * prev.cart.length,
        co2SavedKg: prev.co2SavedKg + addedCo2,
        recycledCount: prev.recycledCount + replacedItems,
      };
    });
    setCartDrawerOpen(false);
    setActiveTab('appliances');
    showToast('Commande confirmée ! Appareil mis à jour et reprise DEEE programmée.');
  };

  const withdrawWalletToIban = () => {
    if (state.walletEur <= 0) {
      showToast('Votre cagnotte disponible est actuellement de 0,00 €.');
      return;
    }
    const amount = state.walletEur;
    setState((prev) => ({
      ...prev,
      walletEur: 0,
      rewardHistory: [
        {
          id: `rew-bank-${Date.now()}`,
          title: 'Virement vers compte bancaire',
          subtitle: 'IBAN DE89 •••• 4821 · À l’instant',
          amountEur: -amount,
          status: 'withdrawn',
          icon: 'bank',
        },
        ...prev.rewardHistory,
      ],
    }));
    showToast(`Virement de ${amount.toFixed(2).replace('.', ',')} € initié vers votre IBAN.`);
  };

  const convertWalletToStoreCredit = () => {
    if (state.walletEur <= 0) {
      showToast('Votre cagnotte disponible est actuellement de 0,00 €.');
      return;
    }
    const base = state.walletEur;
    const boosted = Number((base * 1.1).toFixed(2));
    setState((prev) => ({
      ...prev,
      walletEur: 0,
      storeCreditEur: Number((prev.storeCreditEur + boosted).toFixed(2)),
      rewardHistory: [
        {
          id: `rew-store-${Date.now()}`,
          title: 'Bon Éco-Store (+10% offerts)',
          subtitle: 'Converti immédiatement · Utilisable au panier',
          amountEur: boosted,
          status: 'validated',
          icon: 'store',
        },
        ...prev.rewardHistory,
      ],
    }));
    showToast(`Bon d’achat Éco-Store de ${boosted.toFixed(2).replace('.', ',')} € activé !`);
  };

  const unlockVoucher = (voucherId: string) => {
    const target = state.vouchers.find((v) => v.id === voucherId);
    if (!target) return;
    if (target.unlockedCode) {
      navigator.clipboard?.writeText(target.unlockedCode).catch(() => {});
      showToast(`Code ${target.unlockedCode} copié dans le presse-papier.`);
      return;
    }
    if (state.ecoPoints < target.costPoints) {
      showToast(`Points insuffisants (${target.costPoints} pts requis).`);
      return;
    }
    const code =
      voucherId === 'vouch-solar' ? 'SOLAR-MUNICH50' : 'BIOFILTER-15ECO';
    setState((prev) => ({
      ...prev,
      ecoPoints: prev.ecoPoints - target.costPoints,
      vouchers: prev.vouchers.map((v) =>
        v.id === voucherId ? { ...v, unlockedCode: code } : v
      ),
    }));
    showToast(`Offre débloquée ! Votre code partenaire : ${code}`);
  };

  const markAllNotificationsRead = () => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  };

  const markNotificationRead = (id: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      profile: INITIAL_PROFILE,
      appliances: INITIAL_APPLIANCES,
      cart: [],
      walletEur: 45,
      storeCreditEur: 0,
      ecoPoints: 1450,
      co2SavedKg: 142,
      recycledCount: 2,
      rewardHistory: INITIAL_REWARD_HISTORY,
      vouchers: INITIAL_VOUCHERS,
      notifications: INITIAL_NOTIFICATIONS,
    });
    setActiveTab('home');
    showToast('Session réinitialisée aux données du foyer.');
  };

  const openScanModal = (mode: 'household' | 'referral' = 'household') =>
    setScanModalMode(mode);
  const closeScanModal = () => setScanModalMode(null);

  const goToReplacementInStore = (productId?: string) => {
    setActiveTab('store');
    if (productId) {
      const prod = STORE_PRODUCTS.find((p) => p.id === productId);
      if (prod) {
        setSelectedProduct(prod);
      }
    }
  };

  return (
    <EcoviseContext.Provider
      value={{
        activeTab,
        setActiveTab,
        forecastMode,
        setForecastMode,
        profile: state.profile,
        appliances: state.appliances,
        cart: state.cart,
        walletEur: state.walletEur,
        storeCreditEur: state.storeCreditEur,
        ecoPoints: state.ecoPoints,
        co2SavedKg: state.co2SavedKg,
        recycledCount: state.recycledCount,
        rewardHistory: state.rewardHistory,
        vouchers: state.vouchers,
        notifications: state.notifications,
        unreadCount,
        getApplianceAnnualCost,
        monitoredAnnualCostEur,
        totalProjectedAnnualEur,
        potentialAnnualSavingsEur,
        healthScore,
        energyDrainingCount,
        ecoEfficientCount,
        showToast,
        toastMessage,
        dismissToast,
        updateTariff,
        updateProfileDetails,
        togglePreference,
        syncSmartMeter,
        isSyncing,
        addScannedAppliance,
        addReferralScanBonus,
        addToCart,
        removeFromCart,
        checkoutCart,
        withdrawWalletToIban,
        convertWalletToStoreCredit,
        unlockVoucher,
        markAllNotificationsRead,
        markNotificationRead,
        resetDemoData,
        scanModalMode,
        openScanModal,
        closeScanModal,
        rebateModalOpen,
        setRebateModalOpen,
        cartDrawerOpen,
        setCartDrawerOpen,
        notificationsOpen,
        setNotificationsOpen,
        tarifModalOpen,
        setTarifModalOpen,
        editProfileOpen,
        setEditProfileOpen,
        selectedProduct,
        setSelectedProduct,
        leaseSimulatorOpen,
        setLeaseSimulatorOpen,
        advisorModalMode,
        setAdvisorModalMode,
        labelsGuideOpen,
        setLabelsGuideOpen,
        documentPreview,
        setDocumentPreview,
        shareModalOpen,
        setShareModalOpen,
        diagnosticAppliance,
        setDiagnosticAppliance,
        goToReplacementInStore,
      }}
    >
      {children}
    </EcoviseContext.Provider>
  );
}

export function useEcovise() {
  const ctx = useContext(EcoviseContext);
  if (!ctx) throw new Error('useEcovise must be used within EcoviseProvider');
  return ctx;
}
