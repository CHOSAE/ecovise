import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  Info,
  Leaf,
  PiggyBank,
  Recycle,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Sun,
  Truck,
  Zap,
} from 'lucide-react';
import { STORE_PRODUCTS } from '../data/initialData';
import { useEcovise } from '../context/EcoviseContext';
import type { StoreCategoryFilter } from '../types/ecovise';
import { SafeImage } from '../components/SafeImage';

export function StoreView() {
  const {
    profile,
    appliances,
    cart,
    storeCreditEur,
    energyDrainingCount,
    addToCart,
    setSelectedProduct,
    setCartDrawerOpen,
    leaseSimulatorOpen,
    setLeaseSimulatorOpen,
  } = useEcovise();

  const [category, setCategory] = useState<StoreCategoryFilter>('recommended');
  const [leaseMonths, setLeaseMonths] = useState(36);

  const firstName = profile.fullName.split(' ')[0] || 'Sarah';

  const categories: { id: StoreCategoryFilter; label: string }[] = [
    { id: 'recommended', label: 'Recommandé pour vous' },
    { id: 'all', label: 'Tous les appareils' },
    { id: 'fridge', label: 'Réfrigérateurs A+++' },
    { id: 'washer', label: 'Lave-linge éco' },
    { id: 'dishwasher', label: 'Lave-vaisselle' },
  ];

  const filteredProducts = useMemo(() => {
    if (category === 'recommended' || category === 'all') {
      return STORE_PRODUCTS;
    }
    return STORE_PRODUCTS.filter((p) => p.category === category);
  }, [category]);

  const leaseMonthlyEur = leaseMonths === 24 ? 26 : leaseMonths === 36 ? 19 : 15;
  const energySavingMonthlyEur = 21;
  const netBalanceMonthly = energySavingMonthlyEur - leaseMonthlyEur;

  const totalKwhOldFridge =
    appliances.find((a) => a.category === 'fridge')?.kwhPerYear ?? 950;

  return (
    <div className="flex flex-col space-y-5 pb-8">
      {/* Contextual Header */}
      <div className="flex items-start justify-between gap-3 pt-1">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
            <Leaf className="w-3.5 h-3.5" />
            <span>Aides déduites directement</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary tracking-tight">
            Éco-Store &amp; Primes
          </h1>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Rénovez vos équipements gourmands sans avance de frais.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCartDrawerOpen(true)}
          aria-label="Voir le panier Éco-Store"
          className="relative min-h-[44px] px-3.5 rounded-xl bg-surface-container-high text-primary font-semibold text-sm flex items-center gap-2 hover:bg-surface-variant transition-colors cursor-pointer shrink-0"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Panier ({cart.length})</span>
        </button>
      </div>

      {/* Store Credit Banner if user converted Cagnotte */}
      {storeCreditEur > 0 && (
        <div className="rounded-xl bg-secondary-fixed text-on-secondary-fixed px-4 py-3 flex items-center justify-between text-sm font-medium">
          <span>
            Bon d’achat Cagnotte actif :{' '}
            <strong className="font-mono tabular-nums">
              {storeCreditEur.toFixed(2).replace('.', ',')} €
            </strong>{' '}
            déduits au paiement.
          </span>
          <button
            type="button"
            onClick={() => setCartDrawerOpen(true)}
            className="text-xs font-bold underline cursor-pointer whitespace-nowrap ml-2"
          >
            Voir panier
          </button>
        </div>
      )}

      {/* Éco-Prime Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary-container to-secondary p-5 md:p-6 text-on-primary shadow-sm">
        <Sun className="absolute -right-8 -bottom-10 w-44 h-44 text-white/10 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          <div className="lg:col-span-8 space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center p-1 rounded-lg bg-secondary-container text-on-secondary-container">
                <Zap className="w-4 h-4" />
              </span>
              <span className="text-xs font-semibold tracking-wider uppercase text-secondary-fixed">
                Coup de Pouce Rénovation 2025
              </span>
            </div>
            <h2 className="font-display text-xl md:text-2xl font-bold text-white leading-tight">
              Jusqu’à 250 € d’aides de l’État &amp; primes énergie
            </h2>
            <p className="text-sm text-primary-fixed">
              Déduction immédiate au panier + livraison soignée et reprise de votre ancien matériel 100% offertes.
            </p>
          </div>

          {/* Live Grant Tracker Meter */}
          <div className="lg:col-span-4 bg-black/20 rounded-xl p-3.5">
            <div className="flex justify-between items-center text-xs mb-2 text-surface-container-low">
              <span>{firstName} : Éligibilité validée</span>
              <span className="font-mono tabular-nums font-bold text-secondary-fixed">
                250 € / 250 €
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-black/30 overflow-hidden">
              <div className="h-full bg-secondary-fixed rounded-full w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories & Filters */}
      <div className="flex flex-col space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
            Catégories éligibles
          </span>
          <span className="text-xs md:text-sm text-secondary font-medium">
            Diagnostic {firstName} ({energyDrainingCount} alerte{energyDrainingCount > 1 ? 's' : ''})
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1" role="tablist">
          {categories.map((cat) => {
            const active = category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setCategory(cat.id)}
                className={`min-h-[40px] px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  active
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {cat.id === 'recommended' && <CheckCircle2 className="w-4 h-4" />}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredProducts.map((product, index) => {
          const isTopPick = index === 0 && product.id === 'prod-liebherr-a';

          return (
            <article
              key={product.id}
              className={`rounded-2xl bg-surface-container-lowest p-4 md:p-5 shadow-xs flex flex-col justify-between space-y-4 ${
                isTopPick ? 'lg:col-span-2' : ''
              }`}
            >
              <div className="space-y-3.5">
                {/* Top Status Row */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-secondary-container bg-secondary-container/70 px-2.5 py-1 rounded-md">
                    <Award className="w-3.5 h-3.5" />
                    <span>{product.badgeText}</span>
                  </span>
                  {product.replacesLabel && (
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                        isTopPick
                          ? 'text-error bg-error-container/70'
                          : 'text-on-surface-variant bg-surface-container'
                      }`}
                    >
                      {product.replacesLabel}
                    </span>
                  )}
                </div>

                {/* Product Showcase */}
                <div className="flex gap-4 items-center">
                  <div className="w-24 h-28 rounded-xl overflow-hidden bg-surface-container shrink-0 relative">
                    <SafeImage
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 left-1 bg-primary text-on-primary text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {product.energyClass}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg md:text-xl font-semibold text-on-surface leading-tight truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-on-surface-variant">{product.subtitle}</p>
                    <div className="mt-2 flex flex-wrap items-baseline gap-2">
                      <span className="font-mono tabular-nums text-2xl text-primary font-bold">
                        {product.priceEur} €
                      </span>
                      <span className="text-sm text-outline line-through tabular-nums">
                        {product.originalPriceEur} €
                      </span>
                      <span className="text-xs text-secondary font-bold bg-secondary-fixed/60 px-2 py-0.5 rounded">
                        -{product.discountEur} €
                      </span>
                    </div>
                  </div>
                </div>

                {/* Energy Comparison Matrix */}
                {isTopPick ? (
                  <div className="rounded-xl bg-surface-container-low p-3.5 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-on-surface-variant">Conso annuelle :</span>
                      <span className="font-mono tabular-nums font-semibold text-primary">
                        {product.kwhPerYear} kWh/an (~{Math.round(product.kwhPerYear * profile.tarifKwh)} €/an)
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-on-surface-variant">Votre appareil actuel :</span>
                      <span className="font-mono tabular-nums text-error font-medium">
                        {totalKwhOldFridge} kWh/an (~{Math.round(totalKwhOldFridge * profile.tarifKwh)} €/an)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-surface-variant overflow-hidden flex">
                      <div className="h-full bg-secondary w-[12%] rounded-full" />
                      <div className="h-full bg-error/40 w-[88%]" />
                    </div>
                    <p className="text-xs text-secondary font-semibold flex items-center gap-1.5 pt-0.5">
                      <PiggyBank className="w-4 h-4 shrink-0" />
                      <span>
                        Gain net estimé : +{product.annualSavingEur} €/an d’électricité immédiatement
                      </span>
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-surface-container-low px-3.5 py-2.5 rounded-xl text-xs">
                    <span className="text-on-surface-variant">
                      {product.category === 'washer'
                        ? '46 kWh / 100 cycles'
                        : '54 kWh / 100 cycles · 39 dB'}
                    </span>
                    <span className="font-mono tabular-nums font-semibold text-secondary">
                      Économie : ~{product.annualSavingEur} €/an
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                {isTopPick ? (
                  <>
                    <button
                      type="button"
                      onClick={() => addToCart(product, true, 'buy')}
                      className="flex-1 min-h-[44px] py-2.5 px-4 rounded-xl bg-primary text-on-primary text-sm font-semibold flex items-center justify-center gap-2 shadow-xs hover:bg-primary-container transition-colors cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Ajouter avec reprise (-{product.tradeInEur} €)</span>
                    </button>
                    <button
                      type="button"
                      aria-label={`Détails de ${product.name}`}
                      onClick={() => setSelectedProduct(product)}
                      className="w-11 h-11 flex items-center justify-center rounded-xl bg-surface-container-high text-primary hover:bg-surface-variant transition-colors shrink-0 cursor-pointer"
                    >
                      <Info className="w-5 h-5" />
                    </button>
                  </>
                ) : product.id === 'prod-bosch-washer' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => addToCart(product, true, 'buy')}
                      className="flex-1 min-h-[44px] py-2.5 px-4 rounded-xl bg-primary-container text-on-primary text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary transition-colors cursor-pointer"
                    >
                      <span>Sélectionner cet appareil</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Détails de ${product.name}`}
                      onClick={() => setSelectedProduct(product)}
                      className="w-11 h-11 flex items-center justify-center rounded-xl bg-surface-container-high text-primary hover:bg-surface-variant transition-colors shrink-0 cursor-pointer"
                    >
                      <Info className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(product)}
                    className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-surface-container-high text-primary text-sm font-semibold flex items-center justify-center gap-2 hover:bg-surface-variant transition-colors cursor-pointer"
                  >
                    <span>Découvrir la fiche complète</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Bottom Row: Leasing Éco Simulator + Sérénité Guarantees */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Simulateur Express Mensualité / Leasing Éco */}
        <section className="rounded-2xl bg-surface-container-low p-5 space-y-3.5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-secondary" />
              <h3 className="font-display text-lg font-semibold text-on-surface">
                Option Abonnement &amp; Leasing Éco
              </h3>
            </div>
            <p className="text-sm text-on-surface-variant">
              Financez à partir de{' '}
              <span className="font-semibold text-primary font-mono tabular-nums">
                {leaseMonthlyEur} €/mois
              </span>
              , compensé par vos économies d’électricité mensuelles.
            </p>

            {/* Visual equation card */}
            <div className="grid grid-cols-3 gap-2 bg-surface-container-lowest p-3.5 rounded-xl text-center items-center">
              <div>
                <p className="text-[11px] font-semibold text-on-surface-variant uppercase">
                  Mensualité
                </p>
                <p className="font-mono tabular-nums text-base text-primary font-bold mt-0.5">
                  {leaseMonthlyEur} €
                </p>
              </div>
              <div className="text-secondary font-bold text-lg">−</div>
              <div>
                <p className="text-[11px] font-semibold text-on-surface-variant uppercase">
                  Éco énergie
                </p>
                <p className="font-mono tabular-nums text-base text-secondary font-bold mt-0.5">
                  -{energySavingMonthlyEur} €
                </p>
              </div>
            </div>

            {leaseSimulatorOpen && (
              <div className="bg-surface-container-lowest rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span>Durée d’abonnement tout compris :</span>
                  <span className="font-mono font-bold text-primary">{leaseMonths} mois</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[24, 36, 48].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setLeaseMonths(m)}
                      className={`py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        leaseMonths === m
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {m} mois
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-xs px-1 text-on-surface-variant">
              <span>Reste à charge effectif :</span>
              <span className="font-bold text-secondary font-mono tabular-nums">
                {netBalanceMonthly >= 0
                  ? `+${netBalanceMonthly} €/mois en votre faveur`
                  : `${Math.abs(netBalanceMonthly)} €/mois net`}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setLeaseSimulatorOpen(!leaseSimulatorOpen)}
            className="w-full min-h-[44px] py-2.5 rounded-xl bg-surface-container-highest text-primary text-sm font-semibold text-center hover:bg-surface-variant transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>
              {leaseSimulatorOpen
                ? 'Masquer les durées de leasing'
                : 'Simuler mon reste à charge zéro'}
            </span>
          </button>
        </section>

        {/* Ecovise Guarantees Banner */}
        <section className="rounded-2xl bg-surface-container-lowest p-5 space-y-3.5 shadow-xs">
          <h3 className="font-display text-lg text-primary font-semibold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-secondary" />
            <span>Les Engagements Sérénité Ecovise</span>
          </h3>

          <div className="space-y-3 pt-1">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary-fixed/40 flex items-center justify-center text-secondary shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-on-surface">
                  Garantie 5 ans constructeur &amp; pièces incluse
                </p>
                <p className="text-xs text-on-surface-variant">
                  Protection totale sans franchise ni coût caché
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary-fixed/40 flex items-center justify-center text-secondary shrink-0 mt-0.5">
                <Recycle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-on-surface">
                  Reprise et recyclage certifié de l’ancien matériel
                </p>
                <p className="text-xs text-on-surface-variant">
                  Filière éco-responsable certifiée DEEE
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary-fixed/40 flex items-center justify-center text-secondary shrink-0 mt-0.5">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-on-surface">
                  Livraison &amp; installation soignée à domicile
                </p>
                <p className="text-xs text-on-surface-variant">
                  Mise en service et configuration éco par nos experts
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
