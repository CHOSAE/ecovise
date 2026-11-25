export type TabId = 'home' | 'appliances' | 'store' | 'rewards' | 'profile';

export type ApplianceStatus = 'replace' | 'eco' | 'standard';
export type ApplianceRoom = 'kitchen' | 'laundry';
export type ApplianceCategory = 'fridge' | 'washer' | 'cooktop' | 'dishwasher' | 'other';

export interface Appliance {
  id: string;
  name: string;
  brandModel: string;
  category: ApplianceCategory;
  room: ApplianceRoom;
  roomLabel: string;
  ageYears: number;
  energyClass: string;
  legacyClass?: string;
  status: ApplianceStatus;
  statusLabel: string;
  kwhPerYear: number;
  overpayKwhPerYear: number;
  tradeInBonusEur: number;
  diagnosticNote: string;
  imageUrl?: string;
  recommendedProductId?: string;
  sharePercent: number;
}

export type StoreCategoryFilter = 'recommended' | 'all' | 'fridge' | 'washer' | 'dishwasher';

export interface StoreProduct {
  id: string;
  name: string;
  subtitle: string;
  category: 'fridge' | 'washer' | 'dishwasher';
  energyClass: string;
  badgeText: string;
  priceEur: number;
  originalPriceEur: number;
  discountEur: number;
  grantAppliedEur: number;
  tradeInEur: number;
  kwhPerYear: number;
  annualSavingEur: number;
  replacesApplianceId?: string;
  replacesLabel?: string;
  imageUrl: string;
  monthlyLeaseEur: number;
  highlights: string[];
  specs: { label: string; value: string }[];
}

export interface CartItem {
  product: StoreProduct;
  withTradeIn: boolean;
  paymentMode: 'buy' | 'lease';
  quantity: number;
}

export interface RewardHistoryItem {
  id: string;
  title: string;
  subtitle: string;
  amountEur: number;
  status: 'validated' | 'pending' | 'withdrawn';
  icon: 'fridge' | 'audit' | 'truck' | 'bank' | 'store';
}

export interface PartnerVoucher {
  id: string;
  category: string;
  title: string;
  description: string;
  costPoints: number;
  unlockedCode?: string;
  icon: 'solar' | 'filter';
}

export interface HouseholdProfile {
  fullName: string;
  email: string;
  city: string;
  region: string;
  housingType: string;
  areaSqm: number;
  occupants: number;
  providerName: string;
  tarifKwh: number;
  lastSyncTime: string;
  avatarUrl: string;
  preferences: {
    overconsumptionAlerts: boolean;
    localGrantsWatch: boolean;
    weeklyEcoSuggestions: boolean;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  detail: string;
  time: string;
  severity: 'error' | 'warning' | 'info';
  read: boolean;
  targetTab?: TabId;
}
