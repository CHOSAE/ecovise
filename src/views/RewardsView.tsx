import { useState } from 'react';
import {
  Camera,
  Check,
  Coins,
  Copy,
  Filter,
  Home,
  Landmark,
  Leaf,
  MapPin,
  PartyPopper,
  QrCode,
  Refrigerator,
  Share2,
  ShoppingBag,
  Sparkles,
  Sun,
  Truck,
} from 'lucide-react';
import { useEcovise } from '../context/EcoviseContext';

export function RewardsView() {
  const {
    profile,
    walletEur,
    ecoPoints,
    co2SavedKg,
    rewardHistory,
    vouchers,
    showToast,
    withdrawWalletToIban,
    convertWalletToStoreCredit,
    unlockVoucher,
    openScanModal,
    setShareModalOpen,
  } = useEcovise();

  const [showAllHistory, setShowAllHistory] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const referralCode = 'SARAH-ECO15';

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(referralCode).catch(() => {});
    setCopiedCode(true);
    showToast(`Code « ${referralCode} » copié dans le presse-papier.`);
    window.setTimeout(() => setCopiedCode(false), 2000);
  };

  const visibleHistory = showAllHistory ? rewardHistory : rewardHistory.slice(0, 3);

  return (
    <div className="flex flex-col space-y-5 pb-8">
      {/* Header Subtitle & Level */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div>
          <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
            Cagnotte &amp; Solidarité
          </span>
          <h1 className="font-display text-2xl md:text-3xl text-on-surface font-bold tracking-tight">
            Récompenses &amp; Parrainage
          </h1>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold shadow-xs shrink-0">
          <Leaf className="w-4 h-4" />
          <span>Niveau 3</span>
        </div>
      </div>

      {/* Top Desktop Split: Wallet Hero + Scan & Earn Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Primary Wallet Hero Bento */}
        <section className="lg:col-span-5 relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary-container to-primary text-on-primary p-5 md:p-6 shadow-sm flex flex-col justify-between">
          <svg
            className="absolute -right-8 -bottom-10 w-44 h-44 text-white/5 pointer-events-none"
            fill="currentColor"
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            <path d="M50 0 C70 25 90 45 90 75 C90 90 75 100 50 100 C25 100 10 90 10 75 C10 45 30 25 50 0 Z" />
          </svg>

          <div className="relative z-10 flex flex-col gap-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold text-primary-fixed-dim uppercase tracking-wider">
                  Cagnotte disponible
                </p>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="font-mono tabular-nums text-4xl font-bold tracking-tight text-white">
                    {walletEur.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="font-display text-xl text-primary-fixed font-semibold">
                    €
                  </span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl text-right">
                <div className="flex items-center justify-end gap-1.5 text-secondary-fixed">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-mono tabular-nums text-sm font-semibold text-white">
                    {ecoPoints.toLocaleString('fr-FR')}
                  </span>
                </div>
                <span className="text-[11px] text-primary-fixed-dim font-medium">
                  Éco-Pionnier · {profile.city}
                </span>
              </div>
            </div>

            {/* Quick Transfer Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={withdrawWalletToIban}
                className="w-full min-h-[44px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-surface-container-lowest text-primary font-semibold text-xs md:text-sm shadow-xs hover:bg-surface-bright active:scale-[0.98] transition-all cursor-pointer"
              >
                <Landmark className="w-4 h-4 shrink-0" />
                <span>Transférer sur mon compte</span>
              </button>

              <button
                type="button"
                onClick={convertWalletToStoreCredit}
                className="w-full min-h-[44px] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-secondary-fixed text-on-secondary-fixed font-semibold text-xs md:text-sm shadow-xs active:scale-[0.98] transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span>Convertir en Store</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary text-secondary-fixed">
                  +10%
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Featured Referral / Scan & Earn Card */}
        <section className="lg:col-span-7 rounded-2xl bg-surface-container-lowest p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-lg md:text-xl font-semibold text-on-surface tracking-tight">
                Programme « Scan &amp; Earn »
              </h2>
              <p className="text-sm text-on-surface-variant">
                Traquez les passoires thermiques avec vos proches
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0">
              <Coins className="w-5 h-5" />
            </div>
            <p className="text-sm text-on-surface font-medium leading-snug">
              Gagnez <strong className="text-secondary font-bold">15 €</strong> par appareil énergivore scanné chez un voisin, parent ou ami.
            </p>
          </div>

          {/* 3-Step Visual Stepper */}
          <div className="grid grid-cols-3 gap-2 text-center py-1">
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-surface-container-high text-primary flex items-center justify-center font-bold text-xs mb-1.5">
                1
              </div>
              <span className="text-xs text-on-surface-variant font-medium leading-tight">
                Scannez la plaque électro
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-surface-container-high text-primary flex items-center justify-center font-bold text-xs mb-1.5">
                2
              </div>
              <span className="text-xs text-on-surface-variant font-medium leading-tight">
                Bilan éco offert immédiat
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-xs mb-1.5">
                <PartyPopper className="w-4 h-4" />
              </div>
              <span className="text-xs text-on-surface font-semibold leading-tight">
                +15 € pour vous
              </span>
            </div>
          </div>

          {/* Referral Code & Actions */}
          <div className="bg-surface-container-low rounded-xl p-3.5 flex flex-col gap-2.5">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
              Votre code parrain éco unique
            </span>
            <div className="flex items-center justify-between bg-surface-container-lowest px-3.5 py-2.5 rounded-xl shadow-xs">
              <span className="font-mono tracking-wider font-semibold text-primary text-sm">
                {referralCode}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1.5 text-secondary hover:text-primary font-semibold text-xs transition-colors cursor-pointer min-h-[32px] px-2"
              >
                {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'Copié' : 'Copier'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mt-0.5">
              <button
                type="button"
                onClick={() => setShareModalOpen(true)}
                className="min-h-[42px] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container active:scale-[0.98] transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Partager l’invitation</span>
              </button>
              <button
                type="button"
                onClick={() => openScanModal('referral')}
                className="min-h-[42px] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-surface-container-highest text-on-surface text-xs font-semibold hover:bg-surface-dim active:scale-[0.98] transition-colors cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Scanner un frigo</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Neighborhood Eco Ranking Munich */}
      <section className="rounded-2xl bg-surface-container-lowest p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3.5 gap-3">
          <div className="flex items-center gap-2.5">
            <MapPin className="w-5 h-5 text-secondary shrink-0" />
            <div>
              <h2 className="font-display text-lg font-semibold text-on-surface">
                {profile.city} Bogenhausen
              </h2>
              <p className="text-xs text-on-surface-variant">
                Défi sobriété du quartier · Mars 2025
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-primary-fixed text-on-primary-fixed whitespace-nowrap">
            Top 38%
          </span>
        </div>

        <div className="bg-surface-container-low p-3.5 rounded-xl flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
              Impact évité
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="font-mono tabular-nums text-2xl text-primary font-bold">
                {co2SavedKg}
              </span>
              <span className="text-sm font-semibold text-on-surface-variant">
                kg CO₂
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-surface-container-highest"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                />
                <path
                  className="text-secondary"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="62, 100"
                  strokeLinecap="round"
                  strokeWidth="3.5"
                />
              </svg>
              <span className="absolute text-[10px] font-bold text-primary font-mono">
                #42
              </span>
            </div>
            <div className="text-right">
              <p className="text-xs text-on-surface-variant leading-tight">
                sur 110 foyers
              </p>
              <p className="text-xs text-secondary font-semibold">
                +2 places cette sem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Grid: Earnings History + Unlockable Vouchers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recent Rewards & Earnings History */}
        <section className="lg:col-span-6 rounded-2xl bg-surface-container-lowest p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="font-display text-lg font-semibold text-on-surface">
              Historique des gains
            </h2>
            {rewardHistory.length > 3 && (
              <button
                type="button"
                onClick={() => setShowAllHistory(!showAllHistory)}
                className="text-xs font-semibold text-secondary hover:underline cursor-pointer"
              >
                {showAllHistory ? 'Réduire' : `Tout voir (${rewardHistory.length})`}
              </button>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {visibleHistory.map((item) => {
              const Icon =
                item.icon === 'fridge'
                  ? Refrigerator
                  : item.icon === 'audit'
                  ? Home
                  : item.icon === 'truck'
                  ? Truck
                  : item.icon === 'bank'
                  ? Landmark
                  : ShoppingBag;

              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-xl bg-surface-container-low ${
                    item.status === 'pending' ? 'opacity-85' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        item.status === 'pending'
                          ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                          : item.icon === 'audit'
                          ? 'bg-primary-fixed text-on-primary-fixed'
                          : 'bg-secondary-fixed text-on-secondary-fixed'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-on-surface truncate">
                        {item.title}
                      </h3>
                      <p className="text-xs text-on-surface-variant truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <span
                      className={`font-mono tabular-nums text-sm font-bold ${
                        item.amountEur < 0
                          ? 'text-on-surface-variant'
                          : item.status === 'pending'
                          ? 'text-on-surface'
                          : 'text-secondary'
                      }`}
                    >
                      {item.amountEur >= 0 ? '+' : ''}
                      {item.amountEur.toFixed(2).replace('.', ',')} €
                    </span>
                    <span
                      className={`block text-[10px] font-semibold mt-0.5 ${
                        item.status === 'pending'
                          ? 'text-tertiary-container'
                          : item.status === 'withdrawn'
                          ? 'text-on-surface-variant'
                          : 'text-secondary'
                      }`}
                    >
                      {item.status === 'pending'
                        ? 'En attente'
                        : item.status === 'withdrawn'
                        ? 'Viré'
                        : 'Validé'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Unlockable Partner Vouchers */}
        <section className="lg:col-span-6 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-on-surface">
                Bons partenaires déblocables
              </h2>
              <p className="text-xs text-on-surface-variant">
                Convertissez vos points en rabais immédiats
              </p>
            </div>
            <span className="text-xs font-semibold text-secondary bg-secondary-fixed/50 px-2.5 py-1 rounded-md">
              {vouchers.filter((v) => !v.unlockedCode).length} dispo
            </span>
          </div>

          {vouchers.map((voucher) => {
            const Icon = voucher.icon === 'solar' ? Sun : Filter;
            const isUnlocked = Boolean(voucher.unlockedCode);

            return (
              <div
                key={voucher.id}
                className="rounded-2xl bg-surface-container-lowest p-4 shadow-xs flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      voucher.icon === 'solar'
                        ? 'bg-secondary-container text-on-secondary-container'
                        : 'bg-surface-container text-primary'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-semibold text-secondary uppercase tracking-wide">
                      {voucher.category}
                    </span>
                    <h3 className="font-display text-base font-semibold text-on-surface leading-tight">
                      {voucher.title}
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {voucher.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-surface-container-high">
                  <div className="flex items-center gap-1.5 text-on-surface-variant text-xs">
                    <Coins className="w-4 h-4 text-tertiary" />
                    <span>
                      Coût :{' '}
                      <strong className="font-mono tabular-nums text-on-surface">
                        {voucher.costPoints} pts
                      </strong>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => unlockVoucher(voucher.id)}
                    className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold active:scale-95 transition-all cursor-pointer ${
                      isUnlocked
                        ? 'bg-secondary-fixed text-on-secondary-fixed font-mono'
                        : voucher.icon === 'solar'
                        ? 'bg-primary text-on-primary hover:bg-primary-container'
                        : 'bg-surface-container-highest text-on-surface hover:bg-surface-dim'
                    }`}
                  >
                    {isUnlocked ? `${voucher.unlockedCode} · Copier` : 'Débloquer l’offre'}
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}
