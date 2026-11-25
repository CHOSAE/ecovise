import {
  Activity,
  Bell,
  ChevronRight,
  Download,
  FileText,
  Headset,
  Home,
  Leaf,
  Lightbulb,
  LogOut,
  MapPin,
  MessageSquare,
  Pencil,
  PiggyBank,
  RefreshCw,
  ShieldCheck,
  SlidersHorizontal,
  Tag,
  Video,
  Zap,
} from 'lucide-react';
import { useEcovise } from '../context/EcoviseContext';
import { SafeImage } from '../components/SafeImage';

export function ProfileView() {
  const {
    profile,
    appliances,
    recycledCount,
    isSyncing,
    syncSmartMeter,
    togglePreference,
    setTarifModalOpen,
    setEditProfileOpen,
    setAdvisorModalMode,
    setLabelsGuideOpen,
    setDocumentPreview,
    resetDemoData,
  } = useEcovise();

  return (
    <div className="flex flex-col space-y-5 pb-8">
      {/* Top Desktop Grid: Identity + Mon Foyer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Profile Identity Card */}
        <section className="lg:col-span-5 bg-surface-container-lowest rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <SafeImage
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="w-16 h-16 rounded-full object-cover shadow-xs ring-2 ring-primary-fixed"
              />
              <span className="absolute bottom-0 right-0 w-5 h-5 bg-secondary rounded-full flex items-center justify-center text-on-secondary ring-2 ring-surface-container-lowest">
                <Leaf className="w-3 h-3" />
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h1 className="font-display text-xl font-bold text-on-surface truncate">
                  {profile.fullName}
                </h1>
                <button
                  type="button"
                  aria-label="Éditer le profil"
                  onClick={() => setEditProfileOpen(true)}
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-surface-container-high/70 text-on-surface-variant hover:text-primary transition-colors cursor-pointer shrink-0"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-on-surface-variant truncate">{profile.email}</p>
              <div className="flex items-center gap-1.5 mt-1 text-on-surface-variant text-sm">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>
                  {profile.city}, {profile.region}
                </span>
              </div>
            </div>
          </div>

          {/* Membership status */}
          <div className="bg-surface-container-low rounded-xl p-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <div>
                <p className="text-sm text-primary font-semibold leading-tight">
                  Membre Premium Éco-Transition
                </p>
                <p className="text-xs text-on-surface-variant leading-tight mt-0.5">
                  Actif depuis Mars 2024
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-secondary-container text-on-secondary-container text-[11px] font-bold uppercase">
              Pro
            </span>
          </div>
        </section>

        {/* Mon Foyer & Données Énergie */}
        <section className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-display text-lg text-primary font-semibold flex items-center gap-2">
              <Home className="w-5 h-5 text-secondary" />
              <span>Mon Foyer &amp; Données Énergie</span>
            </h2>
            <button
              type="button"
              onClick={() => setEditProfileOpen(true)}
              className="text-xs font-semibold text-secondary uppercase hover:underline cursor-pointer"
            >
              Modifier
            </button>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-4 md:p-5 shadow-xs space-y-4">
            {/* Housing specs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-container-low rounded-xl p-3 flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-on-surface-variant">
                  <Home className="w-4 h-4" />
                  <span className="text-[11px] font-semibold uppercase tracking-wide">
                    Type d’habitat
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-sm md:text-base text-on-surface font-semibold">
                    {profile.housingType}
                  </p>
                  <p className="text-xs text-on-surface-variant tabular-nums">
                    {profile.areaSqm} m² · {profile.occupants} personnes
                  </p>
                </div>
              </div>

              <div className="bg-surface-container-low rounded-xl p-3 flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-on-surface-variant">
                  <Activity className="w-4 h-4" />
                  <span className="text-[11px] font-semibold uppercase tracking-wide">
                    Surveillance
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-sm md:text-base text-on-surface font-semibold tabular-nums">
                    {appliances.length} Appareils
                  </p>
                  <p className="text-xs text-secondary font-medium">100% monitorés</p>
                </div>
              </div>
            </div>

            {/* Electricity provider card */}
            <div className="bg-surface-container-low rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary shadow-xs">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wide">
                      Fournisseur d’électricité
                    </p>
                    <p className="text-sm md:text-base text-on-surface font-semibold">
                      {profile.providerName}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-secondary">
                  Connecté
                </span>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <span className="text-[11px] font-semibold text-on-surface-variant uppercase">
                    Tarif de base appliqué
                  </span>
                  <div className="font-mono tabular-nums text-2xl text-primary font-bold">
                    {profile.tarifKwh.toFixed(2).replace('.', ',')}{' '}
                    <span className="font-sans text-sm font-normal text-on-surface-variant">
                      € / kWh
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setTarifModalOpen(true)}
                  className="min-h-[40px] px-3.5 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Ajuster tarif</span>
                </button>
              </div>
            </div>

            {/* Smart Meter Sync module */}
            <div className="bg-surface-container-high/50 rounded-xl p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface">
                    Compteur SWM / Smart Link
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    Synchro auto toutes les 15 min · Dernière : {profile.lastSyncTime}
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label="Forcer la synchronisation"
                onClick={syncSmartMeter}
                className="w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:bg-surface-container-high transition-colors cursor-pointer shrink-0"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom Grid: Preferences + Assistance & Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Paramètres & Préférences */}
        <section className="lg:col-span-6 space-y-3">
          <h2 className="font-display text-lg text-primary font-semibold flex items-center gap-2 px-1">
            <SlidersHorizontal className="w-5 h-5 text-secondary" />
            <span>Paramètres &amp; Préférences</span>
          </h2>

          <div className="bg-surface-container-lowest rounded-2xl shadow-xs divide-y divide-surface-container">
            <label className="flex items-center justify-between p-4 cursor-pointer hover:bg-surface-container-low/40 rounded-t-2xl transition-colors">
              <div className="flex items-center gap-3 pr-3">
                <div className="w-9 h-9 rounded-xl bg-surface-container-low flex items-center justify-center text-primary shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface">
                    Alertes de surconsommation
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    Notification instantanée lors d’un pic inhabituel
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={profile.preferences.overconsumptionAlerts}
                onChange={() => togglePreference('overconsumptionAlerts')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary relative shrink-0" />
            </label>

            <label className="flex items-center justify-between p-4 cursor-pointer hover:bg-surface-container-low/40 transition-colors">
              <div className="flex items-center gap-3 pr-3">
                <div className="w-9 h-9 rounded-xl bg-surface-container-low flex items-center justify-center text-primary shrink-0">
                  <PiggyBank className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface">
                    Aides &amp; subventions locales
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    Veille sur les primes Bavière et fédérales BAFA
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={profile.preferences.localGrantsWatch}
                onChange={() => togglePreference('localGrantsWatch')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary relative shrink-0" />
            </label>

            <label className="flex items-center justify-between p-4 cursor-pointer hover:bg-surface-container-low/40 transition-colors">
              <div className="flex items-center gap-3 pr-3">
                <div className="w-9 h-9 rounded-xl bg-surface-container-low flex items-center justify-center text-primary shrink-0">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface">
                    Mode Éco-Suggestion hebdo
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    Recommandations intelligentes chaque lundi
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={profile.preferences.weeklyEcoSuggestions}
                onChange={() => togglePreference('weeklyEcoSuggestions')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary relative shrink-0" />
            </label>

            <div className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-surface-container-low flex items-center justify-center text-primary shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface">
                    Audit énergétique global
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    Dernier relevé trimestriel complet
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDocumentPreview('audit')}
                className="min-h-[38px] flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container text-primary text-xs font-semibold hover:bg-surface-container-high transition-colors cursor-pointer shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>
            </div>
          </div>
        </section>

        {/* Assistance, Recyclage & Conseils */}
        <section className="lg:col-span-6 space-y-3">
          <h2 className="font-display text-lg text-primary font-semibold flex items-center gap-2 px-1">
            <Headset className="w-5 h-5 text-secondary" />
            <span>Assistance &amp; Documents</span>
          </h2>

          <div className="bg-surface-container-lowest rounded-2xl shadow-xs p-4 md:p-5 space-y-3.5">
            {/* Recycling certificates */}
            <div className="bg-secondary-fixed/25 rounded-xl p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-secondary shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-on-secondary-fixed-variant">
                    Certificats de recyclage &amp; reprise
                  </p>
                  <p className="text-xs text-on-secondary-fixed-variant/85 tabular-nums">
                    {recycledCount} appareil{recycledCount > 1 ? 's' : ''} certifié
                    {recycledCount > 1 ? 's' : ''} remis en filière DEEE
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Télécharger les certificats de recyclage"
                onClick={() => setDocumentPreview('recycling')}
                className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-secondary shadow-xs hover:scale-105 transition-transform cursor-pointer shrink-0"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            {/* Eco-advisor direct contact */}
            <div className="bg-surface-container-low rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary shrink-0">
                  <Headset className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface">
                    Conseiller Éco-Énergie Ecovise
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    Accompagnement personnalisé inclus
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setAdvisorModalMode('chat')}
                  className="w-full min-h-[40px] py-2 px-3 rounded-xl bg-surface-container-lowest text-primary text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs hover:bg-surface-container transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Messagerie</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAdvisorModalMode('video')}
                  className="w-full min-h-[40px] py-2 px-3 rounded-xl bg-primary text-on-primary text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs hover:bg-primary-container transition-colors cursor-pointer"
                >
                  <Video className="w-4 h-4" />
                  <span>Visio 15 min</span>
                </button>
              </div>
            </div>

            {/* Guide des étiquettes européennes */}
            <button
              type="button"
              onClick={() => setLabelsGuideOpen(true)}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low/70 hover:bg-surface-container-low transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Tag className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-on-surface">
                    Guide des étiquettes européennes
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    Comprendre l’échelle A+++ à G et les nouvelles normes A–G
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-on-surface-variant shrink-0" />
            </button>
          </div>
        </section>
      </div>

      {/* Footer Actions */}
      <section className="pt-2 space-y-4">
        <button
          type="button"
          onClick={resetDemoData}
          className="w-full max-w-md mx-auto min-h-[46px] py-3 rounded-xl bg-surface-container-low text-error text-sm font-semibold flex items-center justify-center gap-2 hover:bg-error-container/40 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Réinitialiser la session foyer</span>
        </button>

        <div className="text-center text-xs text-outline space-y-0.5">
          <p>Ecovise · Données hébergées en Allemagne · Conforme RGPD</p>
        </div>
      </section>
    </div>
  );
}
