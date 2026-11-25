import {
  AlertTriangle,
  ArrowRight,
  Calculator,
  ChevronRight,
  Clock,
  Disc3,
  Flame,
  Leaf,
  QrCode,
  Refrigerator,
  Share2,
  ShieldCheck,
  Trees,
  TrendingUp,
  UserPlus,
  Utensils,
} from 'lucide-react';
import { useEcovise } from '../context/EcoviseContext';
import type { Appliance } from '../types/ecovise';

function ApplianceIcon({ category, className }: { category: Appliance['category']; className?: string }) {
  switch (category) {
    case 'fridge':
      return <Refrigerator className={className} />;
    case 'washer':
      return <Disc3 className={className} />;
    case 'cooktop':
      return <Flame className={className} />;
    case 'dishwasher':
      return <Utensils className={className} />;
    default:
      return <Leaf className={className} />;
  }
}

export function HomeView() {
  const {
    profile,
    appliances,
    forecastMode,
    setForecastMode,
    totalProjectedAnnualEur,
    potentialAnnualSavingsEur,
    healthScore,
    energyDrainingCount,
    co2SavedKg,
    getApplianceAnnualCost,
    setActiveTab,
    openScanModal,
    setRebateModalOpen,
    setShareModalOpen,
    goToReplacementInStore,
  } = useEcovise();

  const firstName = profile.fullName.split(' ')[0] || 'Sarah';
  const displayedCost =
    forecastMode === 'annual'
      ? totalProjectedAnnualEur
      : Math.round(totalProjectedAnnualEur / 12);
  const displayedDelta =
    forecastMode === 'annual'
      ? Math.max(0, totalProjectedAnnualEur - 630)
      : Math.max(0, Math.round((totalProjectedAnnualEur - 630) / 12));

  const scoreLabel =
    healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Modéré' : 'À optimiser';

  return (
    <div className="flex flex-col space-y-5 lg:space-y-6">
      {/* Greeting & Health Score Header + Toggle */}
      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
              Bonjour, {firstName}
            </h1>
            <p className="text-sm text-on-surface-variant font-medium mt-1">
              Score Santé Foyer :{' '}
              <span
                className={`font-semibold ${
                  healthScore >= 80
                    ? 'text-secondary'
                    : 'text-tertiary-container'
                }`}
              >
                {scoreLabel} ({healthScore}/100)
              </span>
            </p>
          </div>
          <div className="md:hidden w-11 h-11 rounded-full bg-surface-container-high flex items-center justify-center text-primary shrink-0">
            <Leaf className="w-5 h-5" />
          </div>
        </div>

        {/* Toggle Selector */}
        <div
          className="flex p-1 bg-surface-container rounded-xl max-w-xs w-full md:w-72"
          role="tablist"
          aria-label="Mode de prévision"
        >
          <button
            type="button"
            role="tab"
            aria-selected={forecastMode === 'annual'}
            onClick={() => setForecastMode('annual')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              forecastMode === 'annual'
                ? 'bg-primary-container text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Prévision annuelle
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={forecastMode === 'monthly'}
            onClick={() => setForecastMode('monthly')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              forecastMode === 'monthly'
                ? 'bg-primary-container text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Direct mensuel
          </button>
        </div>
      </section>

      {/* Top Desktop Grid: Hero Expense Card + Quick Actions & Referral */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Primary Hero Card: Cost & Urgent Drain Callout */}
        <section className="lg:col-span-7 rounded-2xl bg-surface-container-lowest shadow-[0_4px_16px_rgba(20,83,45,0.06)] p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                Dépense énergétique projetée
              </span>
              <div className="flex flex-wrap items-baseline gap-2.5 mt-1">
                <h2 className="font-mono tabular-nums text-3xl md:text-4xl text-on-surface font-bold tracking-tight">
                  {displayedCost} €
                  <span className="font-sans text-sm font-normal text-on-surface-variant ml-1">
                    /{forecastMode === 'annual' ? 'an' : 'mois'}
                  </span>
                </h2>
                {displayedDelta > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-error-container text-on-error-container text-[11px] font-semibold tabular-nums">
                    +{displayedDelta} € vs moyenne
                  </span>
                )}
              </div>
            </div>
            <div className="h-10 w-10 rounded-xl bg-surface-container flex items-center justify-center text-secondary shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          {/* Drain Warning Banner Inside Hero */}
          <div className="rounded-xl bg-surface-container-high p-3.5 flex flex-col space-y-1.5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-error shrink-0" />
              <p className="text-sm font-semibold text-on-surface">
                {energyDrainingCount > 0
                  ? `${energyDrainingCount} appareil${energyDrainingCount > 1 ? 's' : ''} plombe${energyDrainingCount > 1 ? 'nt' : ''} votre budget`
                  : 'Votre parc domestique est optimisé'}
              </p>
            </div>
            <p className="text-sm text-on-surface-variant">
              {energyDrainingCount > 0 ? (
                <>
                  Économies potentielles jusqu’à{' '}
                  <span className="font-mono tabular-nums font-semibold text-secondary">
                    {potentialAnnualSavingsEur} €/an
                  </span>{' '}
                  avec les primes de rénovation A+++.
                </>
              ) : (
                'Tous vos équipements majeurs affichent une efficacité énergétique maîtrisée.'
              )}
            </p>
          </div>

          {/* Primary CTA Trigger */}
          <button
            type="button"
            onClick={() => setRebateModalOpen(true)}
            className="w-full h-11 bg-primary-container hover:bg-primary text-on-primary rounded-xl flex items-center justify-between px-4 transition-colors shadow-xs text-sm font-semibold cursor-pointer active:scale-[0.99]"
          >
            <span>Estimer ma prime reprise &amp; cashback</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>

        {/* Right Column on Desktop: Quick Actions + Referral Card */}
        <div className="lg:col-span-5 flex flex-col gap-4 justify-between">
          {/* Quick Action Row */}
          <section className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => openScanModal('household')}
              className="flex flex-col text-left p-4 rounded-2xl bg-surface-container-lowest shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:bg-surface-container-low transition-colors cursor-pointer min-h-[112px]"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center mb-2.5">
                <QrCode className="w-5 h-5" />
              </div>
              <span className="font-display text-sm font-semibold text-on-surface">
                Scanner un appareil
              </span>
              <span className="text-xs text-on-surface-variant mt-0.5 leading-tight">
                Note énergie &amp; fuites
              </span>
            </button>

            <button
              type="button"
              onClick={() => setRebateModalOpen(true)}
              className="flex flex-col text-left p-4 rounded-2xl bg-surface-container-lowest shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:bg-surface-container-low transition-colors cursor-pointer min-h-[112px]"
            >
              <div className="w-10 h-10 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center mb-2.5">
                <Calculator className="w-5 h-5" />
              </div>
              <span className="font-display text-sm font-semibold text-on-surface">
                Calculer mes aides
              </span>
              <span className="text-xs text-on-surface-variant mt-0.5 leading-tight">
                Primes État &amp; éco-bonus
              </span>
            </button>
          </section>

          {/* Promotional Referral Card */}
          <section className="rounded-2xl bg-primary-container text-on-primary p-4 md:p-5 shadow-[0_4px_16px_rgba(20,83,45,0.12)] flex flex-col space-y-3 flex-1 justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-secondary-fixed tracking-wide">
                Prime solidarité quartier
              </span>
              <UserPlus className="w-5 h-5 text-secondary-fixed" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-on-primary leading-tight">
                Parrainez &amp; gagnez 15 € + Reprise garantie
              </h3>
              <p className="text-xs md:text-sm text-on-primary-container mt-1.5 leading-relaxed">
                Aidez vos proches ou voisins à vérifier leurs vieux appareils : 15 € cash pour vous et jusqu’à 120 € de reprise pour eux.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShareModalOpen(true)}
              className="w-full h-11 bg-surface-container-lowest text-primary rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-xs hover:bg-surface-bright transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Inviter un proche ou scanner</span>
            </button>
          </section>
        </div>
      </div>

      {/* My Household Appliances Section */}
      <section className="flex flex-col space-y-3.5 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2.5">
            <h2 className="font-display text-xl font-semibold text-on-surface">
              Mes Appareils
            </h2>
            <span className="text-xs font-medium text-on-surface-variant tabular-nums">
              {appliances.length} actifs
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('appliances')}
            className="text-sm text-secondary font-semibold hover:underline cursor-pointer min-h-[44px] px-2 flex items-center"
          >
            Tout voir
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appliances.map((app) => {
            const runCost = getApplianceAnnualCost(app.kwhPerYear);
            const overpay = getApplianceAnnualCost(app.overpayKwhPerYear);
            const isCritical = app.energyClass.includes('F');
            const isReplace = app.status === 'replace';
            const isEco = app.status === 'eco';

            return (
              <article
                key={app.id}
                className="rounded-2xl bg-surface-container-lowest p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        isCritical
                          ? 'bg-error-container text-on-error-container'
                          : isReplace
                          ? 'bg-tertiary-fixed/60 text-on-tertiary-fixed'
                          : isEco
                          ? 'bg-secondary-fixed text-on-secondary-fixed'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      <ApplianceIcon category={app.category} className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display text-base md:text-lg font-semibold text-on-surface leading-tight truncate">
                        {app.name}
                      </h3>
                      <p className="text-sm text-on-surface-variant truncate">
                        {app.brandModel}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap shrink-0 ${
                      isCritical
                        ? 'bg-error-container text-on-error-container'
                        : isEco
                        ? 'bg-secondary-container text-on-secondary-container'
                        : 'bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    {app.energyClass}
                    {app.legacyClass ? ` (${app.legacyClass})` : ` · ${app.ageYears} ans`}
                  </span>
                </div>

                {isReplace ? (
                  <>
                    <div className="bg-surface-container-low rounded-xl p-3 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wide">
                          Coût annuel estimé
                        </span>
                        <span className="font-mono tabular-nums text-sm font-bold text-on-surface mt-0.5">
                          {runCost} € / an
                        </span>
                      </div>
                      <div className="h-7 w-px bg-surface-variant" />
                      <div className="flex flex-col text-right">
                        <span
                          className={`text-[11px] font-semibold uppercase tracking-wide ${
                            isCritical ? 'text-error' : 'text-tertiary'
                          }`}
                        >
                          {isCritical ? 'Surcoût' : 'Inefficace'}
                        </span>
                        <span
                          className={`font-mono tabular-nums text-sm font-bold mt-0.5 ${
                            isCritical ? 'text-error' : 'text-tertiary'
                          }`}
                        >
                          ~{overpay} € / an
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-0.5">
                      <span className="text-xs text-on-surface-variant flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-tertiary" />
                        <span>Installé depuis {app.ageYears} ans</span>
                      </span>

                      {isCritical ? (
                        <button
                          type="button"
                          onClick={() => goToReplacementInStore(app.recommendedProductId)}
                          className="min-h-[40px] px-3 rounded-xl bg-primary-container text-on-primary text-xs font-semibold flex items-center gap-1.5 shadow-xs hover:bg-primary active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap shrink-0"
                        >
                          <span>Remplacer (-{overpay} €)</span>
                          {app.tradeInBonusEur > 0 && (
                            <span className="px-1.5 py-0.5 bg-secondary-fixed text-on-secondary-fixed rounded text-[10px] font-bold">
                              +{app.tradeInBonusEur} € reprise
                            </span>
                          )}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => goToReplacementInStore(app.recommendedProductId)}
                          className="min-h-[40px] px-3 rounded-xl text-secondary bg-surface-container text-xs font-semibold flex items-center gap-1 hover:bg-surface-container-high transition-colors cursor-pointer whitespace-nowrap shrink-0"
                        >
                          <span>Alternatives éco</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-between pt-1 border-t border-surface-container-high/60">
                    <span className="font-mono tabular-nums text-sm text-on-surface font-semibold">
                      {runCost} €{' '}
                      <span className="font-sans text-xs font-normal text-on-surface-variant">
                        / an
                      </span>
                    </span>
                    {isEco ? (
                      <div className="flex items-center gap-1.5 text-secondary text-xs font-medium">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Certifié Éco-Optimal</span>
                      </div>
                    ) : (
                      <span className="text-xs text-on-surface-variant">
                        Plage de conso standard
                      </span>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* Community Micro-Stat Impact */}
      <section className="rounded-2xl bg-surface-container-low p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-container-highest text-secondary flex items-center justify-center shrink-0">
            <Trees className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-on-surface font-semibold">
              Classement Éco du quartier : Top 38% à {profile.city}
            </p>
            <p className="text-xs text-on-surface-variant">
              <span className="font-mono tabular-nums font-semibold text-primary">
                {co2SavedKg} kg
              </span>{' '}
              de CO₂ évités dans votre secteur jusqu’ici.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setActiveTab('rewards')}
          className="text-xs font-semibold text-secondary hover:underline whitespace-nowrap shrink-0 cursor-pointer min-h-[40px] px-2"
        >
          Voir classement
        </button>
      </section>
    </div>
  );
}
