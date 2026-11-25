import React from 'react';
import {
  Bell,
  Gift,
  Home,
  QrCode,
  Refrigerator,
  ShoppingBag,
  User,
} from 'lucide-react';
import { useEcovise } from '../context/EcoviseContext';
import type { TabId } from '../types/ecovise';
import { SafeImage } from './SafeImage';

function EcoviseLogoMark() {
  return (
    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-secondary-fixed shrink-0 shadow-xs">
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>
    </div>
  );
}

const NAV_ITEMS: { id: TabId; label: string; mobileLabel: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'home', label: 'Accueil', mobileLabel: 'Accueil', icon: Home },
  { id: 'appliances', label: 'Mes Appareils', mobileLabel: 'Appareils', icon: Refrigerator },
  { id: 'store', label: 'Éco-Store', mobileLabel: 'Store', icon: ShoppingBag },
  { id: 'rewards', label: 'Récompenses', mobileLabel: 'Gains', icon: Gift },
  { id: 'profile', label: 'Mon Foyer', mobileLabel: 'Profil', icon: User },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const {
    activeTab,
    setActiveTab,
    profile,
    unreadCount,
    cart,
    setNotificationsOpen,
    setCartDrawerOpen,
    openScanModal,
  } = useEcovise();

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      {/* Desktop Top Bar — 3-Zone Contract: Brand | 5 Nav Links | 1 Primary CTA */}
      <header className="hidden md:block sticky top-0 z-40 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/40">
        <div className="max-w-6xl mx-auto h-16 px-6 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line brand mark */}
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary rounded-lg cursor-pointer"
          >
            <EcoviseLogoMark />
            <span className="font-display text-xl font-bold tracking-tight text-primary">
              Ecovise
            </span>
          </button>

          {/* Zone 2: 5 concise single-line text nav links */}
          <nav className="flex items-center gap-7" aria-label="Navigation principale">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative py-2 text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive
                      ? 'text-primary font-semibold'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <button
            type="button"
            onClick={() => openScanModal('household')}
            className="h-10 px-4 rounded-xl bg-primary-container text-on-primary text-sm font-semibold flex items-center gap-2 hover:bg-primary transition-colors shadow-xs whitespace-nowrap shrink-0 cursor-pointer active:scale-[0.98]"
          >
            <QrCode className="w-4 h-4" />
            <span>Scanner un appareil</span>
          </button>
        </div>
      </header>

      {/* Mobile Compact Header (< md) */}
      <header className="md:hidden fixed top-0 inset-x-0 z-40 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
        <div className="h-14 px-4 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <EcoviseLogoMark />
            <span className="font-display text-lg font-bold text-primary tracking-tight">
              Ecovise
            </span>
          </button>

          <div className="flex items-center gap-1">
            {cart.length > 0 && (
              <button
                type="button"
                aria-label="Ouvrir le panier"
                onClick={() => setCartDrawerOpen(true)}
                className="relative w-11 h-11 flex items-center justify-center rounded-full text-primary hover:bg-surface-container-high/60 transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute top-2 right-2 min-w-[16px] h-4 px-1 rounded-full bg-secondary text-on-secondary text-[10px] font-bold flex items-center justify-center">
                  {cart.length}
                </span>
              </button>
            )}
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => setNotificationsOpen(true)}
              className="relative w-11 h-11 flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60 transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-secondary ring-2 ring-surface" />
              )}
            </button>
            <button
              type="button"
              aria-label="Profil de Sarah"
              onClick={() => setActiveTab('profile')}
              className="w-11 h-11 flex items-center justify-center rounded-full hover:opacity-90 transition-opacity cursor-pointer"
            >
              <SafeImage
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-outline-variant"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Desktop Contextual Utility Strip (keeps <header> purely 3-zone) */}
      <div className="hidden md:block max-w-6xl w-full mx-auto px-6 pt-5">
        <div className="flex items-center justify-between text-xs text-on-surface-variant pb-3 border-b border-outline-variant/30">
          <div className="flex items-center gap-2">
            <span>{profile.city}, {profile.region}</span>
            <span aria-hidden="true">·</span>
            <span>Tarif actif : <strong className="font-mono tabular-nums text-primary">{profile.tarifKwh.toFixed(2).replace('.', ',')} €/kWh</strong></span>
            <span aria-hidden="true">·</span>
            <span>Compteur {profile.providerName}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCartDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary font-medium transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Panier ({cart.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setNotificationsOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary font-medium transition-colors cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Alertes{unreadCount > 0 ? ` (${unreadCount})` : ''}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Canvas */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-6 pt-16 md:pt-6 pb-24 md:pb-12">
        {children}
      </main>

      {/* Mobile Fixed Bottom Tab Bar (< md) */}
      <nav
        aria-label="Navigation mobile"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 pb-safe bg-surface-container-lowest/92 backdrop-blur-xl shadow-[0_-2px_12px_rgba(20,83,45,0.06)] border-t border-outline-variant/30"
      >
        <div className="grid grid-cols-5 items-center h-[60px] px-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex flex-col items-center justify-center min-h-[44px] gap-0.5 transition-colors cursor-pointer ${
                  isActive
                    ? 'text-secondary font-semibold'
                    : 'text-on-surface-variant hover:text-secondary'
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                  {item.id === 'rewards' && (
                    <span className="absolute -top-1.5 -right-5 bg-secondary-fixed text-on-secondary-fixed text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs leading-none">
                      +15€
                    </span>
                  )}
                </div>
                <span className="text-[11px] leading-tight tracking-tight whitespace-nowrap shrink-0">
                  {item.mobileLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
