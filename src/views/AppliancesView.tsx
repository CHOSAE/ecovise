import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Camera,
  CheckCircle2,
  Clock,
  Droplets,
  Leaf,
  PiggyBank,
  QrCode,
  RefreshCw,
  Wrench,
  Zap,
} from 'lucide-react';
import { useEcovise } from '../context/EcoviseContext';
import { SafeImage } from '../components/SafeImage';

type FilterType = 'all' | 'replace' | 'eco' | 'kitchen' | 'laundry';

export function AppliancesView() {
  const {
    appliances,
    healthScore,
    energyDrainingCount,
    ecoEfficientCount,
    monitoredAnnualCostEur,
    getApplianceAnnualCost,
    openScanModal,
    goToReplacementInStore,
    setDiagnosticAppliance,
  } = useEcovise();

  const [filter, setFilter] = useState<FilterType>('all');

  const counts = useMemo(
    () => ({
      all: appliances.length,
      replace: appliances.filter((a) => a.status === 'replace').length,
      eco: appliances.filter((a) => a.status !== 'replace').length,
      kitchen: appliances.filter((a) => a.room === 'kitchen').length,
      laundry: appliances.filter((a) => a.room === 'laundry').length,
    }),
    [appliances]
  );

  const filteredAppliances = useMemo(() => {
    switch (filter) {
      case 'replace':
        return appliances.filter((a) => a.status === 'replace');
      case 'eco':
        return appliances.filter((a) => a.status !== 'replace');
      case 'kitchen':
        return appliances.filter((a) => a.room === 'kitchen');
      case 'laundry':
        return appliances.filter((a) => a.room === 'laundry');
      default:
        return appliances;
    }
  }, [appliances, filter]);

  const filterOptions: { id: FilterType; label: string }[] = [
    { id: 'all', label: `Tous (${counts.all})` },
    { id: 'replace', label: `À remplacer (${counts.replace})` },
    { id: 'eco', label: `Éco-performants (${counts.eco})` },
    { id: 'kitchen', label: `Cuisine (${counts.kitchen})` },
    { id: 'laundry', label: `Buanderie (${counts.laundry})` },
  ];

  const primaryFridge = appliances.find((a) => a.status === 'replace');

  return (
    <div className="flex flex-col space-y-5 pb-6">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary">
            Diagnostic Éco-Énergie
          </span>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary tracking-tight">
            Mes Appareils
          </h1>
        </div>

        <button
          type="button"
          onClick={() => openScanModal('household')}
          className="min-h-[44px] flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-container text-on-primary text-sm font-semibold shadow-xs hover:bg-primary active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap shrink-0"
        >
          <Camera className="w-4 h-4" />
          <span>Scanner</span>
        </button>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Household Health Score Card */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                Santé du parc domestique
              </span>
              <span className="text-sm text-on-surface mt-0.5 font-medium tabular-nums">
                {appliances.length} appareils connectés
              </span>
            </div>
            <div className="flex items-baseline gap-1 bg-surface-container px-3 py-1 rounded-lg">
              <span className="font-display text-xl font-bold text-primary tabular-nums">
                {healthScore}
              </span>
              <span className="text-xs text-on-surface-variant font-medium">/ 100</span>
            </div>
          </div>

          <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-secondary h-full rounded-full transition-all duration-500"
              style={{ width: `${healthScore}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs mt-3 font-medium">
            <span className="text-tertiary-container font-semibold tabular-nums">
              {energyDrainingCount} énergivore{energyDrainingCount > 1 ? 's' : ''}
            </span>
            <span className="text-secondary font-semibold tabular-nums">
              {ecoEfficientCount} éco-efficient{ecoEfficientCount > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Consumption Breakdown Bar */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex justify-between items-baseline gap-2">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wide">
              Répartition annuelle estimée
            </span>
            <span className="font-mono tabular-nums text-sm text-primary font-semibold">
              {monitoredAnnualCostEur} €/an total
            </span>
          </div>

          <div className="h-4 w-full flex rounded-lg overflow-hidden gap-0.5 bg-surface-container-low p-0.5">
            <div className="bg-error rounded-xs h-full" style={{ width: '37%' }} title="Réfrigérateur 37%" />
            <div className="bg-tertiary-fixed-dim rounded-xs h-full" style={{ width: '26%' }} title="Lave-linge 26%" />
            <div className="bg-secondary-fixed-dim rounded-xs h-full" style={{ width: '17%' }} title="Lave-vaisselle 17%" />
            <div className="bg-secondary rounded-xs h-full" style={{ width: '10%' }} title="Cuisson 10%" />
            <div className="bg-surface-variant rounded-xs h-full" style={{ width: '10%' }} title="Autres 10%" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-error shrink-0" />
              <span className="text-on-surface truncate">Frigo Bosch (37%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-tertiary-fixed-dim shrink-0" />
              <span className="text-on-surface truncate">Lave-linge (26%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-secondary-fixed-dim shrink-0" />
              <span className="text-on-surface truncate">Lave-vaisselle (17%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-secondary shrink-0" />
              <span className="text-on-surface truncate">Table Miele (10%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Savings Opportunity Hero Callout */}
      {primaryFridge && (
        <div className="bg-primary-container text-on-primary rounded-2xl p-4 md:p-5 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-surface-container-lowest/15 shrink-0 flex items-center justify-center">
              <Zap className="w-5 h-5 text-secondary-fixed" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-semibold text-secondary-fixed tracking-wider uppercase">
                Opportunité d’épargne prioritaire
              </span>
              <p className="text-sm text-on-primary/95 leading-snug mt-1">
                Le remplacement de votre {primaryFridge.brandModel} amorti ({primaryFridge.ageYears} ans) vous fera économiser{' '}
                <strong className="text-secondary-fixed font-mono tabular-nums font-semibold">
                  {getApplianceAnnualCost(primaryFridge.overpayKwhPerYear)} €/an
                </strong>{' '}
                et évitera{' '}
                <strong className="text-secondary-fixed font-mono tabular-nums font-semibold">
                  140 kg de CO₂
                </strong>
                .
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter Segmented Bar */}
      <div
        className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar"
        role="tablist"
        aria-label="Filtrer les appareils"
      >
        {filterOptions.map((opt) => {
          const active = filter === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(opt.id)}
              className={`min-h-[40px] px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap shrink-0 shadow-xs transition-colors cursor-pointer ${
                active
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Appliances Grid */}
      {filteredAppliances.length === 0 ? (
        <div className="rounded-2xl bg-surface-container-lowest p-8 text-center text-on-surface-variant">
          <p className="font-medium">Aucun appareil dans cette catégorie.</p>
          <button
            type="button"
            onClick={() => setFilter('all')}
            className="mt-3 text-sm font-semibold text-secondary hover:underline cursor-pointer"
          >
            Afficher tous les appareils
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAppliances.map((app) => {
            const annualCost = getApplianceAnnualCost(app.kwhPerYear);
            const overpayCost = getApplianceAnnualCost(app.overpayKwhPerYear);
            const isCritical = app.energyClass.includes('F');
            const isReplace = app.status === 'replace';
            const isEco = app.status === 'eco';

            return (
              <article
                key={app.id}
                className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs flex flex-col justify-between"
              >
                <div className="flex gap-4">
                  <div className="relative w-20 h-24 rounded-xl overflow-hidden shrink-0 bg-surface-container">
                    <SafeImage
                      src={app.imageUrl}
                      alt={app.brandModel}
                      className="w-full h-full object-cover"
                    />
                    <span
                      className={`absolute top-1 left-1 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                        isCritical
                          ? 'bg-error text-on-error'
                          : isReplace
                          ? 'bg-tertiary-fixed-dim text-on-tertiary-fixed'
                          : isEco
                          ? 'bg-secondary text-on-secondary'
                          : 'bg-surface-variant text-on-surface'
                      }`}
                    >
                      {app.energyClass.replace('Classe ', '')}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wide truncate">
                          {app.roomLabel} · {app.ageYears} ans
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[11px] font-semibold shrink-0 ${
                            isCritical
                              ? 'bg-error-container text-on-error-container'
                              : isReplace
                              ? 'bg-tertiary-fixed/70 text-on-tertiary-fixed'
                              : isEco
                              ? 'bg-secondary-fixed text-on-secondary-fixed'
                              : 'bg-surface-container-high text-on-surface'
                          }`}
                        >
                          {app.statusLabel}
                        </span>
                      </div>

                      <h2 className="font-display text-lg font-semibold text-on-surface truncate mt-0.5">
                        {app.brandModel}
                      </h2>

                      <div className="flex items-baseline gap-2 mt-1">
                        <span
                          className={`font-mono tabular-nums text-xl font-bold ${
                            isEco ? 'text-secondary' : 'text-on-surface'
                          }`}
                        >
                          {annualCost} €
                          <span className="font-sans text-xs font-normal text-on-surface-variant">
                            /an
                          </span>
                        </span>
                        {overpayCost > 0 ? (
                          <span
                            className={`text-xs font-semibold tabular-nums ${
                              isCritical ? 'text-error' : 'text-on-tertiary-container'
                            }`}
                          >
                            +{overpayCost} € de surcoût
                          </span>
                        ) : (
                          <span className="text-xs text-secondary font-medium">
                            Basse conso
                          </span>
                        )}
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-1.5 text-xs mt-2 px-2.5 py-1.5 rounded-lg ${
                        isCritical
                          ? 'text-tertiary bg-tertiary-fixed/30'
                          : isEco
                          ? 'text-secondary bg-secondary-fixed/20'
                          : 'text-on-surface-variant bg-surface-container-low'
                      }`}
                    >
                      {isCritical ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-tertiary shrink-0" />
                      ) : isReplace ? (
                        <Droplets className="w-3.5 h-3.5 text-on-surface-variant shrink-0" />
                      ) : isEco ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-secondary shrink-0" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-on-surface-variant shrink-0" />
                      )}
                      <span className="truncate font-medium">{app.diagnosticNote}</span>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                {isReplace && (
                  <div className="flex items-center gap-2 mt-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setDiagnosticAppliance(app)}
                      className="flex-1 min-h-[42px] py-2 px-3 rounded-xl bg-surface-container text-on-surface text-xs md:text-sm font-semibold hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {isCritical ? (
                        <>
                          <Leaf className="w-4 h-4 text-secondary shrink-0" />
                          <span>Reprise +{app.tradeInBonusEur} €</span>
                        </>
                      ) : (
                        <>
                          <Wrench className="w-4 h-4 shrink-0" />
                          <span>Diagnostic</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => goToReplacementInStore(app.recommendedProductId)}
                      className={`flex-1 min-h-[42px] py-2 px-3 rounded-xl text-xs md:text-sm font-semibold shadow-xs active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isCritical
                          ? 'bg-primary-container text-on-primary hover:bg-primary'
                          : 'bg-primary text-on-primary hover:bg-primary-container'
                      }`}
                    >
                      {isCritical ? (
                        <>
                          <RefreshCw className="w-4 h-4 shrink-0" />
                          <span>Voir remplaçants</span>
                        </>
                      ) : (
                        <>
                          <PiggyBank className="w-4 h-4 shrink-0" />
                          <span>Économiser {overpayCost} €</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* Add via Nameplate Scanner Card */}
      <button
        type="button"
        onClick={() => openScanModal('household')}
        className="w-full p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between text-left cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-on-surface">
              Ajouter via Plaque Constructeur
            </h3>
            <p className="text-sm text-on-surface-variant">
              Détection automatique du modèle, de l’année et de la consommation
            </p>
          </div>
        </div>
        <div className="w-9 h-9 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary shadow-xs shrink-0">
          <ArrowRight className="w-4 h-4" />
        </div>
      </button>
    </div>
  );
}
