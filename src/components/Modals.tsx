import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  Headset,
  Info,
  Leaf,
  MessageSquare,
  QrCode,
  Recycle,
  ScanLine,
  Send,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Video,
  X,
} from 'lucide-react';
import { useEcovise } from '../context/EcoviseContext';
import type { ApplianceCategory, ApplianceRoom } from '../types/ecovise';
import { SafeImage } from './SafeImage';

function ModalShell({
  open,
  onClose,
  title,
  children,
  maxWidth = 'max-w-md',
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-inverse-surface/45 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={`bg-surface-container-lowest w-full ${maxWidth} rounded-t-3xl sm:rounded-2xl p-5 md:p-6 shadow-xl max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="font-display text-lg md:text-xl font-bold text-primary">
            {title}
          </h2>
          <button
            type="button"
            aria-label="Fermer"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ScanModal() {
  const {
    scanModalMode,
    closeScanModal,
    addScannedAppliance,
    addReferralScanBonus,
    setActiveTab,
  } = useEcovise();

  const [manualMode, setManualMode] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [brandModel, setBrandModel] = useState('Beko EcoDry Sèche-linge');
  const [category, setCategory] = useState<ApplianceCategory>('other');
  const [room, setRoom] = useState<ApplianceRoom>('laundry');
  const [ageYears, setAgeYears] = useState(9);

  useEffect(() => {
    if (!scanModalMode) {
      setManualMode(false);
      setScanning(false);
    }
  }, [scanModalMode]);

  const handleSimulatedAiScan = () => {
    setScanning(true);
    window.setTimeout(() => {
      setScanning(false);
      if (scanModalMode === 'referral') {
        addReferralScanBonus('Réfrigérateur voisin (Liebherr 11 ans)');
        closeScanModal();
        setActiveTab('rewards');
      } else {
        addScannedAppliance({
          name: 'Congélateur Cave',
          brandModel: 'Liebherr FrostProtect 10 ans',
          category: 'fridge',
          room: 'kitchen',
          roomLabel: 'Cuisine',
          ageYears: 10,
          energyClass: 'Classe F',
          status: 'replace',
          statusLabel: 'Énergivore',
          kwhPerYear: 420,
          overpayKwhPerYear: 210,
          tradeInBonusEur: 50,
          diagnosticNote: 'Dégivrage manuel requis · Givre détecté',
          imageUrl: '/src/assets/images/bosch_fridge_kitchen_1795604757296.jpg',
          recommendedProductId: 'prod-liebherr-a',
        });
        closeScanModal();
        setActiveTab('appliances');
      }
    }, 900);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandModel.trim()) return;
    if (scanModalMode === 'referral') {
      addReferralScanBonus(`${brandModel.trim()} (Parrainage)`);
      closeScanModal();
      setActiveTab('rewards');
      return;
    }
    const isOld = ageYears >= 7;
    addScannedAppliance({
      name:
        category === 'fridge'
          ? 'Réfrigérateur'
          : category === 'washer'
          ? 'Lave-linge'
          : category === 'dishwasher'
          ? 'Lave-vaisselle'
          : category === 'cooktop'
          ? 'Cuisson'
          : 'Sèche-linge',
      brandModel: brandModel.trim(),
      category,
      room,
      roomLabel: room === 'kitchen' ? 'Cuisine' : 'Buanderie',
      ageYears,
      energyClass: isOld ? 'Classe E' : 'Classe B',
      status: isOld ? 'replace' : 'standard',
      statusLabel: isOld ? 'Énergivore' : 'Standard',
      kwhPerYear: isOld ? 490 : 210,
      overpayKwhPerYear: isOld ? 220 : 25,
      tradeInBonusEur: isOld ? 55 : 20,
      diagnosticNote: isOld
        ? 'Ancienneté élevée : potentiel d’économie important'
        : 'Fonctionnement conforme aux normes actuelles',
      imageUrl:
        room === 'laundry'
          ? '/src/assets/images/whirlpool_washer_laundry_1795604756973.jpg'
          : '/src/assets/images/siemens_dishwasher_kitchen_1795604758885.jpg',
      recommendedProductId:
        category === 'washer'
          ? 'prod-bosch-washer'
          : category === 'dishwasher'
          ? 'prod-miele-dishwasher'
          : 'prod-liebherr-a',
    });
    closeScanModal();
    setActiveTab('appliances');
  };

  return (
    <ModalShell
      open={Boolean(scanModalMode)}
      onClose={closeScanModal}
      title={
        scanModalMode === 'referral'
          ? 'Scanner l’appareil d’un proche (+15 €)'
          : 'Scanner un appareil'
      }
    >
      {!manualMode ? (
        <div className="space-y-4">
          <div className="h-44 rounded-2xl bg-surface-container-high/50 border border-dashed border-outline-variant flex flex-col items-center justify-center p-4 text-center">
            <div className="w-14 h-14 rounded-full bg-primary-fixed flex items-center justify-center text-primary mb-2.5">
              <ScanLine className={`w-7 h-7 ${scanning ? 'animate-bounce' : ''}`} />
            </div>
            <span className="text-sm font-semibold text-on-surface">
              {scanning
                ? 'Analyse optique de la plaque en cours…'
                : 'Pointez la plaque signalétique'}
            </span>
            <span className="text-xs text-on-surface-variant mt-1">
              Généralement située à l’intérieur de la porte ou au dos
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              disabled={scanning}
              onClick={handleSimulatedAiScan}
              className="w-full min-h-[46px] py-3 rounded-xl bg-primary-container text-on-primary text-sm font-semibold shadow-xs flex items-center justify-center gap-2 hover:bg-primary transition-colors cursor-pointer disabled:opacity-70"
            >
              <Camera className="w-4 h-4" />
              <span>
                {scanning
                  ? 'Identification du modèle…'
                  : 'Démarrer l’analyse photo IA'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setManualMode(true)}
              className="w-full min-h-[44px] py-2.5 rounded-xl bg-surface-container text-on-surface text-sm font-medium hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              Saisir le modèle / numéro de série manuellement
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleManualSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">
              Marque &amp; modèle
            </label>
            <input
              type="text"
              required
              value={brandModel}
              onChange={(e) => setBrandModel(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-surface-container-low text-sm text-on-surface border border-outline-variant/50 focus:outline-2 focus:outline-secondary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">
                Catégorie
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ApplianceCategory)}
                className="w-full h-11 px-3 rounded-xl bg-surface-container-low text-sm text-on-surface border border-outline-variant/50"
              >
                <option value="fridge">Réfrigérateur / Congélo</option>
                <option value="washer">Lave-linge</option>
                <option value="dishwasher">Lave-vaisselle</option>
                <option value="cooktop">Cuisson</option>
                <option value="other">Sèche-linge / Autre</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">
                Âge (années)
              </label>
              <input
                type="number"
                min={0}
                max={30}
                value={ageYears}
                onChange={(e) => setAgeYears(Number(e.target.value) || 0)}
                className="w-full h-11 px-3 rounded-xl bg-surface-container-low text-sm font-mono text-on-surface border border-outline-variant/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">
              Pièce
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: 'kitchen', label: 'Cuisine' },
                  { id: 'laundry', label: 'Buanderie' },
                ] as const
              ).map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRoom(r.id)}
                  className={`h-10 rounded-xl text-sm font-semibold cursor-pointer ${
                    room === r.id
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setManualMode(false)}
              className="flex-1 min-h-[44px] rounded-xl bg-surface-container text-on-surface text-sm font-semibold cursor-pointer"
            >
              Retour
            </button>
            <button
              type="submit"
              className="flex-1 min-h-[44px] rounded-xl bg-primary-container text-on-primary text-sm font-semibold cursor-pointer"
            >
              Calculer &amp; Ajouter
            </button>
          </div>
        </form>
      )}
    </ModalShell>
  );
}

export function RebateModal() {
  const { rebateModalOpen, setRebateModalOpen, profile, setActiveTab } = useEcovise();
  const [selectedAge, setSelectedAge] = useState(12);
  const [oldClass, setOldClass] = useState<'F/G' | 'E' | 'D'>('F/G');

  const stateBonus = oldClass === 'F/G' ? 170 : oldClass === 'E' ? 130 : 90;
  const tradeIn = selectedAge >= 10 ? 80 : selectedAge >= 5 ? 60 : 40;
  const totalGrant = stateBonus + tradeIn;

  return (
    <ModalShell
      open={rebateModalOpen}
      onClose={() => setRebateModalOpen(false)}
      title="Simulateur Primes & Reprise"
    >
      <div className="space-y-4">
        <p className="text-sm text-on-surface-variant">
          Estimation personnalisée pour votre foyer à{' '}
          <strong className="text-on-surface">{profile.city}</strong> ({profile.region}).
        </p>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1.5">
              Classe énergétique actuelle de l’appareil
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['F/G', 'E', 'D'] as const).map((cls) => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => setOldClass(cls)}
                  className={`min-h-[42px] rounded-xl text-sm font-semibold cursor-pointer ${
                    oldClass === cls
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  Classe {cls}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-on-surface-variant uppercase mb-1">
              <span>Ancienneté de l’équipement</span>
              <span className="font-mono text-primary">{selectedAge} ans</span>
            </div>
            <input
              type="range"
              min={2}
              max={20}
              value={selectedAge}
              onChange={(e) => setSelectedAge(Number(e.target.value))}
              className="w-full accent-secondary"
            />
          </div>
        </div>

        <div className="rounded-2xl bg-surface-container-low p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Prime État &amp; BAFA</span>
            <span className="font-mono font-semibold text-on-surface tabular-nums">
              {stateBonus} €
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Bonus Reprise DEEE garantie</span>
            <span className="font-mono font-semibold text-on-surface tabular-nums">
              {tradeIn} €
            </span>
          </div>
          <div className="border-t border-outline-variant/40 pt-2 flex justify-between items-baseline">
            <span className="font-semibold text-on-surface">Total déduit immédiatement</span>
            <span className="font-mono text-2xl font-bold text-secondary tabular-nums">
              {totalGrant} €
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setRebateModalOpen(false);
            setActiveTab('store');
          }}
          className="w-full min-h-[46px] rounded-xl bg-primary-container text-on-primary font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary cursor-pointer"
        >
          <span>Appliquer dans l’Éco-Store</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </ModalShell>
  );
}

export function CartDrawer() {
  const {
    cart,
    cartDrawerOpen,
    setCartDrawerOpen,
    storeCreditEur,
    removeFromCart,
    checkoutCart,
    setActiveTab,
  } = useEcovise();

  if (!cartDrawerOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.priceEur, 0);
  const tradeInDiscount = cart.reduce(
    (sum, item) => sum + (item.withTradeIn ? item.product.tradeInEur : 0),
    0
  );
  const total = Math.max(0, Number((subtotal - tradeInDiscount - storeCreditEur).toFixed(2)));
  const yearlySavings = cart.reduce((sum, item) => sum + item.product.annualSavingEur, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-inverse-surface/45 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) setCartDrawerOpen(false);
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Panier Éco-Store"
    >
      <div className="bg-surface-container-lowest w-full max-w-md h-full flex flex-col justify-between p-5 shadow-2xl overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-secondary" />
              <h2 className="font-display text-lg font-bold text-primary">
                Votre panier Éco-Store
              </h2>
            </div>
            <button
              type="button"
              aria-label="Fermer le panier"
              onClick={() => setCartDrawerOpen(false)}
              className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <p className="text-sm text-on-surface-variant">
                Votre sélection Éco-Store est vide.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCartDrawerOpen(false);
                  setActiveTab('store');
                }}
                className="px-4 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-semibold cursor-pointer"
              >
                Explorer les appareils A+++
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="p-3 rounded-xl bg-surface-container-low flex gap-3 items-center"
                >
                  <SafeImage
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-on-surface truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-on-surface-variant">
                      {item.product.energyClass} · Livraison &amp; reprise incluses
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono font-bold text-sm text-primary tabular-nums">
                        {item.product.priceEur} €
                      </span>
                      {item.withTradeIn && (
                        <span className="text-[11px] font-semibold text-secondary">
                          Reprise -{item.product.tradeInEur} €
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label={`Retirer ${item.product.name}`}
                    onClick={() => removeFromCart(item.product.id)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-error cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-surface-container-high pt-4 space-y-3 mt-6">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-on-surface-variant">
                <span>Sous-total (aides déduites)</span>
                <span className="font-mono tabular-nums">{subtotal} €</span>
              </div>
              <div className="flex justify-between text-secondary">
                <span>Prime reprise DEEE</span>
                <span className="font-mono tabular-nums">-{tradeInDiscount} €</span>
              </div>
              {storeCreditEur > 0 && (
                <div className="flex justify-between text-secondary">
                  <span>Bon Cagnotte converti</span>
                  <span className="font-mono tabular-nums">
                    -{storeCreditEur.toFixed(2).replace('.', ',')} €
                  </span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base text-primary pt-2 border-t border-surface-container">
                <span>Reste à payer</span>
                <span className="font-mono tabular-nums">
                  {total.toFixed(2).replace('.', ',')} €
                </span>
              </div>
              <p className="text-xs text-secondary font-medium">
                Économie d’électricité estimée : +{yearlySavings} €/an dès installation
              </p>
            </div>

            <button
              type="button"
              onClick={checkoutCart}
              className="w-full min-h-[48px] rounded-xl bg-primary-container text-on-primary font-semibold text-sm hover:bg-primary transition-colors shadow-sm cursor-pointer"
            >
              Valider la commande &amp; programmer la reprise
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function ProductDetailModal() {
  const { selectedProduct, setSelectedProduct, addToCart } = useEcovise();
  if (!selectedProduct) return null;

  return (
    <ModalShell
      open={Boolean(selectedProduct)}
      onClose={() => setSelectedProduct(null)}
      title={selectedProduct.name}
      maxWidth="max-w-lg"
    >
      <div className="space-y-4">
        <div className="flex gap-4 items-center">
          <SafeImage
            src={selectedProduct.imageUrl}
            alt={selectedProduct.name}
            className="w-24 h-28 rounded-xl object-cover shrink-0"
          />
          <div>
            <span className="text-xs font-semibold text-secondary uppercase">
              {selectedProduct.energyClass} · {selectedProduct.badgeText}
            </span>
            <p className="text-sm text-on-surface-variant mt-0.5">
              {selectedProduct.subtitle}
            </p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-mono text-2xl font-bold text-primary tabular-nums">
                {selectedProduct.priceEur} €
              </span>
              <span className="text-sm line-through text-outline tabular-nums">
                {selectedProduct.originalPriceEur} €
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-surface-container-low p-3.5 space-y-2">
          {selectedProduct.specs.map((s) => (
            <div key={s.label} className="flex justify-between text-xs">
              <span className="text-on-surface-variant">{s.label}</span>
              <span className="font-semibold text-on-surface">{s.value}</span>
            </div>
          ))}
        </div>

        <ul className="space-y-2 text-sm text-on-surface">
          {selectedProduct.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span>{h}</span>
            </li>
          ))}
        </ul>

        <div className="flex gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => {
              addToCart(selectedProduct, true, 'buy');
              setSelectedProduct(null);
            }}
            className="flex-1 min-h-[46px] rounded-xl bg-primary text-on-primary text-sm font-semibold cursor-pointer"
          >
            Ajouter avec reprise (-{selectedProduct.tradeInEur} €)
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

export function NotificationsDrawer() {
  const {
    notifications,
    notificationsOpen,
    setNotificationsOpen,
    markAllNotificationsRead,
    markNotificationRead,
    setActiveTab,
  } = useEcovise();

  return (
    <ModalShell
      open={notificationsOpen}
      onClose={() => setNotificationsOpen(false)}
      title="Alertes & Notifications"
      maxWidth="max-w-lg"
    >
      <div className="space-y-3">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={markAllNotificationsRead}
            className="text-xs font-semibold text-secondary hover:underline cursor-pointer"
          >
            Tout marquer comme lu
          </button>
        </div>

        {notifications.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => {
              markNotificationRead(n.id);
              if (n.targetTab) setActiveTab(n.targetTab);
              setNotificationsOpen(false);
            }}
            className={`w-full text-left p-3.5 rounded-xl transition-colors cursor-pointer ${
              n.read
                ? 'bg-surface-container-low/60'
                : 'bg-surface-container-low ring-1 ring-secondary/30'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                {n.severity === 'error' ? (
                  <AlertTriangle className="w-4 h-4 text-error shrink-0" />
                ) : (
                  <Info className="w-4 h-4 text-secondary shrink-0" />
                )}
                <span className="text-sm font-semibold text-on-surface">
                  {n.title}
                </span>
              </div>
              <span className="text-[11px] text-on-surface-variant whitespace-nowrap">
                {n.time}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
              {n.detail}
            </p>
          </button>
        ))}
      </div>
    </ModalShell>
  );
}

export function TarifModal() {
  const { profile, tarifModalOpen, setTarifModalOpen, updateTariff } = useEcovise();
  const [val, setVal] = useState(profile.tarifKwh.toString());

  useEffect(() => {
    setVal(profile.tarifKwh.toString());
  }, [profile.tarifKwh, tarifModalOpen]);

  return (
    <ModalShell
      open={tarifModalOpen}
      onClose={() => setTarifModalOpen(false)}
      title="Ajuster Tarif SWM"
      maxWidth="max-w-sm"
    >
      <div className="space-y-4">
        <p className="text-sm text-on-surface-variant">
          Mettez à jour le coût au kilowattheure de votre facture pour recalculer les économies réelles de vos appareils.
        </p>
        <div className="space-y-1.5">
          <label
            htmlFor="kwhInput"
            className="text-[11px] font-semibold text-on-surface-variant uppercase"
          >
            Tarif (€/kWh)
          </label>
          <div className="relative flex items-center">
            <input
              id="kwhInput"
              type="number"
              step="0.01"
              min="0.05"
              max="1.50"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              className="w-full h-12 px-3 rounded-xl bg-surface-container-low font-mono text-xl font-bold text-primary focus:outline-2 focus:outline-secondary"
            />
            <span className="absolute right-3 text-sm text-on-surface-variant">
              € / kWh
            </span>
          </div>
        </div>
        <div className="flex gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => setTarifModalOpen(false)}
            className="flex-1 min-h-[44px] rounded-xl bg-surface-container text-on-surface text-sm font-semibold hover:bg-surface-container-high cursor-pointer"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={() => {
              const num = parseFloat(val);
              if (!Number.isNaN(num)) updateTariff(num);
              setTarifModalOpen(false);
            }}
            className="flex-1 min-h-[44px] rounded-xl bg-primary text-on-primary text-sm font-semibold hover:bg-primary-container shadow-xs cursor-pointer"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

export function EditProfileModal() {
  const { profile, editProfileOpen, setEditProfileOpen, updateProfileDetails } = useEcovise();
  const [fullName, setFullName] = useState(profile.fullName);
  const [city, setCity] = useState(profile.city);
  const [housingType, setHousingType] = useState(profile.housingType);
  const [areaSqm, setAreaSqm] = useState(profile.areaSqm);
  const [occupants, setOccupants] = useState(profile.occupants);

  useEffect(() => {
    if (editProfileOpen) {
      setFullName(profile.fullName);
      setCity(profile.city);
      setHousingType(profile.housingType);
      setAreaSqm(profile.areaSqm);
      setOccupants(profile.occupants);
    }
  }, [editProfileOpen, profile]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileDetails({
      fullName: fullName.trim() || profile.fullName,
      city: city.trim() || profile.city,
      housingType,
      areaSqm,
      occupants,
    });
    setEditProfileOpen(false);
  };

  return (
    <ModalShell
      open={editProfileOpen}
      onClose={() => setEditProfileOpen(false)}
      title="Modifier mon profil & foyer"
    >
      <form onSubmit={handleSave} className="space-y-3.5">
        <div>
          <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">
            Nom complet
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full h-11 px-3 rounded-xl bg-surface-container-low text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">
              Ville
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-surface-container-low text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">
              Habitat
            </label>
            <select
              value={housingType}
              onChange={(e) => setHousingType(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-surface-container-low text-sm"
            >
              <option value="Maison individuelle">Maison individuelle</option>
              <option value="Appartement">Appartement</option>
              <option value="Maison mitoyenne">Maison mitoyenne</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">
              Surface (m²)
            </label>
            <input
              type="number"
              min={15}
              max={600}
              value={areaSqm}
              onChange={(e) => setAreaSqm(Number(e.target.value) || 60)}
              className="w-full h-11 px-3 rounded-xl bg-surface-container-low text-sm font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">
              Personnes
            </label>
            <input
              type="number"
              min={1}
              max={12}
              value={occupants}
              onChange={(e) => setOccupants(Number(e.target.value) || 1)}
              className="w-full h-11 px-3 rounded-xl bg-surface-container-low text-sm font-mono"
            />
          </div>
        </div>

        <div className="flex gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => setEditProfileOpen(false)}
            className="flex-1 min-h-[44px] rounded-xl bg-surface-container text-sm font-semibold cursor-pointer"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="flex-1 min-h-[44px] rounded-xl bg-primary text-on-primary text-sm font-semibold cursor-pointer"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

export function DiagnosticApplianceModal() {
  const {
    diagnosticAppliance,
    setDiagnosticAppliance,
    getApplianceAnnualCost,
    goToReplacementInStore,
  } = useEcovise();

  if (!diagnosticAppliance) return null;

  const cost = getApplianceAnnualCost(diagnosticAppliance.kwhPerYear);
  const overpay = getApplianceAnnualCost(diagnosticAppliance.overpayKwhPerYear);

  return (
    <ModalShell
      open={Boolean(diagnosticAppliance)}
      onClose={() => setDiagnosticAppliance(null)}
      title={`Diagnostic · ${diagnosticAppliance.brandModel}`}
    >
      <div className="space-y-4">
        <div className="rounded-xl bg-surface-container-low p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Classe énergétique</span>
            <span className="font-semibold text-on-surface">
              {diagnosticAppliance.energyClass}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Consommation relevée</span>
            <span className="font-mono font-semibold text-on-surface tabular-nums">
              {diagnosticAppliance.kwhPerYear} kWh/an ({cost} €/an)
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Surcoût évitable</span>
            <span className="font-mono font-semibold text-error tabular-nums">
              +{overpay} €/an
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Bonus Reprise DEEE</span>
            <span className="font-mono font-semibold text-secondary tabular-nums">
              +{diagnosticAppliance.tradeInBonusEur} €
            </span>
          </div>
        </div>

        <p className="text-sm text-on-surface-variant">
          Observation capteur :{' '}
          <strong className="text-on-surface">
            {diagnosticAppliance.diagnosticNote}
          </strong>
          . En remplaçant cet équipement avant la fin de l’année, le gain cumulé sur 5 ans dépasse{' '}
          <strong className="font-mono text-secondary">{overpay * 5} €</strong>.
        </p>

        <button
          type="button"
          onClick={() => {
            const recId = diagnosticAppliance.recommendedProductId;
            setDiagnosticAppliance(null);
            goToReplacementInStore(recId);
          }}
          className="w-full min-h-[46px] rounded-xl bg-primary-container text-on-primary text-sm font-semibold cursor-pointer"
        >
          Voir l’appareil A+++ recommandé
        </button>
      </div>
    </ModalShell>
  );
}

export function AdvisorModal() {
  const { advisorModalMode, setAdvisorModalMode, showToast } = useEcovise();
  const [message, setMessage] = useState('');
  const [slot, setSlot] = useState('Demain · 10:30');

  if (!advisorModalMode) return null;

  return (
    <ModalShell
      open={Boolean(advisorModalMode)}
      onClose={() => setAdvisorModalMode(null)}
      title={
        advisorModalMode === 'chat'
          ? 'Messagerie Conseiller Ecovise'
          : 'Réserver une Visio Éco (15 min)'
      }
    >
      {advisorModalMode === 'chat' ? (
        <div className="space-y-4">
          <div className="rounded-xl bg-surface-container-low p-3.5 text-sm space-y-2">
            <div className="flex items-center gap-2 font-semibold text-primary">
              <Headset className="w-4 h-4 text-secondary" />
              <span>Lukas (Expert Énergie Munich)</span>
            </div>
            <p className="text-on-surface-variant">
              Bonjour Sarah ! Votre dossier Coup de Pouce 250 € est prêt. Souhaitez-vous vérifier les dimensions du Liebherr BioFresh avant reprise ?
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!message.trim()) return;
              showToast('Message envoyé à votre conseiller Lukas (réponse < 15 min).');
              setMessage('');
              setAdvisorModalMode(null);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="Écrire à votre conseiller…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 h-11 px-3 rounded-xl bg-surface-container-low text-sm"
            />
            <button
              type="submit"
              aria-label="Envoyer"
              className="w-11 h-11 rounded-xl bg-primary text-on-primary flex items-center justify-center cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-on-surface-variant">
            Choisissez un créneau gratuit avec un conseiller certifié pour optimiser vos primes BAFA &amp; reprise.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              'Aujourd’hui · 17:00',
              'Demain · 10:30',
              'Demain · 14:15',
              'Jeudi · 09:00',
            ].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSlot(s)}
                className={`min-h-[42px] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                  slot === s
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{s}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              showToast(`Visio de 15 min confirmée : ${slot}.`);
              setAdvisorModalMode(null);
            }}
            className="w-full min-h-[46px] rounded-xl bg-primary-container text-on-primary text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
          >
            <Video className="w-4 h-4" />
            <span>Confirmer le créneau</span>
          </button>
        </div>
      )}
    </ModalShell>
  );
}

export function LabelsGuideModal() {
  const { labelsGuideOpen, setLabelsGuideOpen } = useEcovise();
  const rows = [
    { grade: 'A', legacy: 'Ex A+++ (-30%)', color: 'bg-secondary text-on-secondary', desc: 'Efficacité maximale, éligible aux primes pleines' },
    { grade: 'B / C', legacy: 'Ex A+++ / A++', color: 'bg-primary-fixed text-on-primary-fixed', desc: 'Très bonne performance énergétique' },
    { grade: 'D', legacy: 'Ex A++ / A+', color: 'bg-surface-container-high text-on-surface', desc: 'Consommation standard modérée' },
    { grade: 'E / F / G', legacy: 'Ex A+ / A', color: 'bg-error-container text-on-error-container', desc: 'Appareils énergivores : remplacement rentable rapidement' },
  ];

  return (
    <ModalShell
      open={labelsGuideOpen}
      onClose={() => setLabelsGuideOpen(false)}
      title="Guide des étiquettes européennes"
    >
      <div className="space-y-3">
        <p className="text-sm text-on-surface-variant">
          Depuis la réforme européenne, l’échelle A+++ à D a été recalibrée vers une grille plus exigeante de A à G.
        </p>
        <div className="space-y-2">
          {rows.map((r) => (
            <div
              key={r.grade}
              className="p-3 rounded-xl bg-surface-container-low flex items-center gap-3"
            >
              <span
                className={`px-2.5 py-1 rounded-md font-mono font-bold text-xs shrink-0 ${r.color}`}
              >
                {r.grade}
              </span>
              <div>
                <p className="text-xs font-semibold text-on-surface">{r.legacy}</p>
                <p className="text-xs text-on-surface-variant">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModalShell>
  );
}

export function DocumentPreviewModal() {
  const {
    documentPreview,
    setDocumentPreview,
    profile,
    appliances,
    totalProjectedAnnualEur,
    recycledCount,
    showToast,
  } = useEcovise();

  if (!documentPreview) return null;

  const handleDownload = () => {
    const content =
      documentPreview === 'audit'
        ? [
            `Ecovise — Audit Énergétique Foyer (${profile.fullName})`,
            `Adresse : ${profile.city}, ${profile.region}`,
            `Habitat : ${profile.housingType} (${profile.areaSqm} m², ${profile.occupants} pers.)`,
            `Fournisseur : ${profile.providerName} (${profile.tarifKwh} €/kWh)`,
            `Dépense annuelle projetée : ${totalProjectedAnnualEur} €/an`,
            '',
            'Appareils suivis :',
            ...appliances.map(
              (a) => `- ${a.brandModel} (${a.energyClass}) : ${a.kwhPerYear} kWh/an`
            ),
          ].join('\n')
        : [
            `Ecovise — Certificats de Recyclage DEEE`,
            `Titulaire : ${profile.fullName} (${profile.city})`,
            `Nombre d'appareils remis en filière agréée : ${recycledCount}`,
            `Statut : Recyclage conforme directive UE 2012/19/UE`,
          ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download =
      documentPreview === 'audit'
        ? 'ecovise-audit-energetique.txt'
        : 'ecovise-certificat-recyclage-deee.txt';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast('Document téléchargé avec succès.');
  };

  return (
    <ModalShell
      open={Boolean(documentPreview)}
      onClose={() => setDocumentPreview(null)}
      title={
        documentPreview === 'audit'
          ? 'Audit énergétique global'
          : 'Certificats de recyclage DEEE'
      }
    >
      <div className="space-y-4">
        <div className="rounded-xl bg-surface-container-low p-4 space-y-2 text-sm">
          {documentPreview === 'audit' ? (
            <>
              <div className="flex items-center gap-2 font-semibold text-primary">
                <FileText className="w-4 h-4 text-secondary" />
                <span>Relevé trimestriel — {profile.fullName}</span>
              </div>
              <p className="text-xs text-on-surface-variant">
                {profile.housingType} · {profile.areaSqm} m² · Tarif {profile.tarifKwh.toFixed(2).replace('.', ',')} €/kWh
              </p>
              <div className="pt-2 border-t border-outline-variant/30 space-y-1 text-xs">
                {appliances.map((a) => (
                  <div key={a.id} className="flex justify-between">
                    <span>{a.brandModel}</span>
                    <span className="font-mono font-semibold">{a.kwhPerYear} kWh/an</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 font-semibold text-primary">
                <Recycle className="w-4 h-4 text-secondary" />
                <span>Attestation filière DEEE certifiée</span>
              </div>
              <p className="text-xs text-on-surface-variant">
                {recycledCount} appareil{recycledCount > 1 ? 's' : ''} dépollué
                {recycledCount > 1 ? 's' : ''} et valorisé
                {recycledCount > 1 ? 's' : ''} à {profile.city}. Fluides frigorigènes récupérés à 99,4%.
              </p>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={handleDownload}
          className="w-full min-h-[46px] rounded-xl bg-primary text-on-primary text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Télécharger le justificatif</span>
        </button>
      </div>
    </ModalShell>
  );
}

export function ShareModal() {
  const { shareModalOpen, setShareModalOpen, showToast, openScanModal } = useEcovise();
  const [copiedMsg, setCopiedMsg] = useState(false);

  const inviteMsg =
    "Salut ! Scanne ton vieil électroménager avec Ecovise pour savoir s'il surconsomme. Utilise mon code SARAH-ECO15 pour débloquer ton bilan éco offert et jusqu'à 120 € de reprise !";

  const copyMessage = () => {
    navigator.clipboard?.writeText(inviteMsg).catch(() => {});
    setCopiedMsg(true);
    showToast('Message d’invitation copié !');
    window.setTimeout(() => setCopiedMsg(false), 2000);
  };

  return (
    <ModalShell
      open={shareModalOpen}
      onClose={() => setShareModalOpen(false)}
      title="Inviter un proche (+15 €)"
    >
      <div className="space-y-4">
        <p className="text-sm text-on-surface-variant">
          Partagez votre lien de parrainage par SMS, WhatsApp ou e-mail, ou scannez directement leur appareil lors de votre prochaine visite.
        </p>

        <div className="p-3.5 rounded-xl bg-surface-container-low text-xs text-on-surface leading-relaxed">
          {inviteMsg}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={copyMessage}
            className="min-h-[44px] rounded-xl bg-primary text-on-primary text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
          >
            {copiedMsg ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedMsg ? 'Message copié' : 'Copier l’invitation'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShareModalOpen(false);
              openScanModal('referral');
            }}
            className="min-h-[44px] rounded-xl bg-secondary-fixed text-on-secondary-fixed text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Scanner chez un proche</span>
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

export function ToastBanner() {
  const { toastMessage, dismissToast } = useEcovise();
  if (!toastMessage) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-16 md:top-20 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 p-3.5 bg-inverse-surface text-inverse-on-surface rounded-xl shadow-xl flex items-center justify-between gap-3"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <Leaf className="w-4 h-4 text-secondary-fixed shrink-0" />
        <span className="text-sm font-medium">{toastMessage}</span>
      </div>
      <button
        type="button"
        aria-label="Fermer la notification"
        onClick={dismissToast}
        className="text-inverse-on-surface/70 hover:text-white cursor-pointer shrink-0 p-1"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
