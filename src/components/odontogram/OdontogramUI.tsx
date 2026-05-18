
import { JSX, useEffect, useRef, useState } from "react";
import {
  destroyOdontogram,
  initOdontogram,
  setNumberingSystem,
  clearSelection,
  setOcclusalVisible,
  setWisdomVisible,
  setShowBase,
  setHealthyPulpVisible,
} from "./odontogram";
export { clearSelection, setOcclusalVisible, setWisdomVisible, setShowBase, setHealthyPulpVisible };
import { useI18n } from "./i18n/useI18n";
import type { Language } from "./i18n/translations";
import type { NumberingSystem } from "./utils/numbering";
import { applyThemeConfig, type OdontogramThemeConfig } from "./theme";
export type { OdontogramThemeConfig };

// Changed to fix Next.js Global CSS Error

/* ─── icon paths (same as before) ─────────────────────────────── */
const icon8Url = "/icon-svgs/icon_8.svg";
const iconGumUrl = "/icon-svgs/icon_gum.svg";
const iconNoSelUrl = "/icon-svgs/icon_no_selection.svg";
const iconOcclUrl = "/icon-svgs/icon_occl.svg";
const iconPulpUrl = "/icon-svgs/icon_pulp.svg";

/* ─── types ────────────────────────────────────────────────────── */
type AppProps = {
  language?: Language;
  onLanguageChange?: (lang: Language) => void;
  numberingSystem?: NumberingSystem;
  onNumberingChange?: (system: NumberingSystem) => void;
  themeConfig?: OdontogramThemeConfig;
};

const NUMBERING_OPTIONS: { value: NumberingSystem; labelKey: string }[] = [
  { value: "FDI", labelKey: "numbering.fdi" },
  { value: "UNIVERSAL", labelKey: "numbering.universal" },
  { value: "PALMER", labelKey: "numbering.palmer" },
];

type PanelTab = "status" | "treatment" | "endo";

/* ─── tiny design tokens ────────────────────────────────────────── */
const TAB_ICON: Record<PanelTab, JSX.Element> = {
  status: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8 2 4 6 4 10c0 4 2 6 3 8s1 4 5 4 4-2 5-4 3-4 3-8c0-4-4-8-8-8z" />
      <line x1="9" y1="18" x2="15" y2="18" /><line x1="9" y1="21" x2="15" y2="21" />
    </svg>
  ),
  treatment: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M8 12h8" /><path d="M12 8v8" />
    </svg>
  ),
  endo: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
};

/* ─── sub-components ────────────────────────────────────────────── */

/** A labelled section card inside the panel */
function SectionCard({
  title,
  id,
  toggleId,
  children,
  requiresSelection = false,
  className = "",
}: {
  title: string;
  id?: string;
  toggleId?: string;
  children: React.ReactNode;
  requiresSelection?: boolean;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`
        relative rounded-2xl border border-slate-200/80 bg-white
        shadow-sm overflow-hidden
        ${requiresSelection ? "requires-selection" : ""}
        ${className}
      `}
    >
      {/* Card header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/60">
        <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500 select-none">
          {title}
        </span>
        {toggleId && (
          <button
            id={toggleId}
            className="icon-btn w-6 h-6 rounded-md hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
            aria-label={`Toggle ${title}`}
          >
            <span className="toggle-icon text-base leading-none" aria-hidden="true">−</span>
          </button>
        )}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

/** Pill toggle button */
function PillBtn({ id, label, className = "" }: { id?: string; label: string; className?: string }) {
  return (
    <button
      id={id}
      className={`
        px-3 py-1.5 rounded-xl text-xs font-semibold
        border border-slate-200 bg-white text-slate-600
        hover:bg-slate-100 hover:border-slate-300
        transition-all duration-150 shadow-sm active:scale-95
        ${className}
      `}
    >
      {label}
    </button>
  );
}

/** Checkbox pill */
function CheckPill({ id, label, dangerOnCheck = false }: { id: string; label: string; dangerOnCheck?: boolean }) {
  return (
    <label className="cursor-pointer select-none">
      <input type="checkbox" id={id} className="peer sr-only" />
      <div className={`
        px-3 py-1.5 rounded-xl border text-xs font-medium transition-all duration-150
        border-slate-200 bg-white text-slate-600
        hover:bg-slate-50
        ${dangerOnCheck
          ? "peer-checked:bg-rose-50 peer-checked:border-rose-400 peer-checked:text-rose-700"
          : "peer-checked:bg-teal-50 peer-checked:border-teal-400 peer-checked:text-teal-700"
        }
      `}>
        {label}
      </div>
    </label>
  );
}

/** Select input */
function StyledSelect({ id, className = "" }: { id: string; className?: string }) {
  return (
    <select
      id={id}
      className={`
        text-sm p-2 rounded-xl border border-slate-200 bg-white text-slate-700
        focus:ring-2 focus:ring-teal-400/30 focus:border-teal-400 outline-none transition-all
        ${className}
      `}
    />
  );
}

/** Empty-selection overlay */
function SelectionOverlay({ icon = "tooth", message }: { icon?: "tooth" | "cross" | "wave"; message: string }) {
  const icons = {
    tooth: <path d="M12 2C8 2 4 6 4 10c0 4 2 6 3 8s1 4 5 4 4-2 5-4 3-4 3-8c0-4-4-8-8-8z" />,
    cross: <><circle cx="12" cy="12" r="10" /><path d="M8 12h8" /><path d="M12 8v8" /></>,
    wave: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  };
  return (
    <div className="selection-overlay absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10 rounded-2xl">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2 text-slate-300">
        {icons[icon]}
      </svg>
      <p className="text-xs text-slate-400 font-medium text-center px-4">{message}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════ */
export default function OdontogramUI({
  language,
  onLanguageChange,
  numberingSystem,
  onNumberingChange,
  themeConfig,
}: AppProps) {
  const { t } = useI18n({ language, onLanguageChange });

  const [internalNumbering, setInternalNumbering] = useState<NumberingSystem>(numberingSystem ?? "FDI");
  const [activeTab, setActiveTab] = useState<PanelTab>("status");
  const [numberingOpen, setNumberingOpen] = useState(false);

  const themeRootRef = useRef<HTMLDivElement | null>(null);
  const numberingRef = useRef<HTMLDivElement | null>(null);

  const currentNumbering = numberingSystem ?? internalNumbering;

  /* numbering */
  const setNumbering = (next: NumberingSystem) => {
    if (numberingSystem) { onNumberingChange?.(next); return; }
    setInternalNumbering(next);
    onNumberingChange?.(next);
  };

  /* lifecycle */
  useEffect(() => { initOdontogram(); return () => { destroyOdontogram(); }; }, []);
  useEffect(() => { setNumberingSystem(currentNumbering); }, [currentNumbering]);
  useEffect(() => { applyThemeConfig(themeRootRef.current, themeConfig); }, [themeConfig]);

  /* close numbering dropdown on outside click */
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!numberingRef.current?.contains(e.target as Node)) setNumberingOpen(false);
    };
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, []);

  const numberingLabelKey =
    currentNumbering === "FDI" ? "numbering.fdi" :
      currentNumbering === "UNIVERSAL" ? "numbering.universal" : "numbering.palmer";

  /* ── render ─────────────────────────────────────────────────── */
  return (
    <div
      ref={themeRootRef}
      className="odontogram-root h-full flex flex-col overflow-hidden bg-slate-50 font-sans"
    >
      {/* ══════════════════════════════════════════════════════
          TOP BAR
      ══════════════════════════════════════════════════════ */}
      <header className="
        flex items-center gap-3 px-5 h-14 shrink-0
        bg-white border-b border-slate-200
        shadow-[0_1px_3px_rgba(0,0,0,0.06)]
      ">
        {/* Numbering dropdown */}
        <div className="relative" ref={numberingRef}>
          <button
            onClick={() => setNumberingOpen(o => !o)}
            className="
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg
              text-xs font-semibold text-slate-600 border border-slate-200
              bg-white hover:bg-slate-50 transition-colors
            "
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            {t("numbering.label")}: {t(numberingLabelKey)}
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          {numberingOpen && (
            <div className="
              absolute top-full left-0 mt-1 w-44 z-50
              bg-white border border-slate-200 rounded-xl shadow-lg py-1
            ">
              {NUMBERING_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setNumbering(opt.value); setNumberingOpen(false); }}
                  className={`
                    w-full text-left px-4 py-2 text-xs font-medium transition-colors
                    ${currentNumbering === opt.value
                      ? "text-teal-700 bg-teal-50"
                      : "text-slate-600 hover:bg-slate-50"
                    }
                  `}
                >
                  {t(opt.labelKey)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button id="btnStatusExport" className="
            px-3 py-1.5 rounded-lg text-xs font-semibold
            border border-slate-200 bg-white text-slate-600
            hover:bg-slate-50 transition-colors
          ">{t("topbar.exportStatus")}</button>

          <button id="btnStatusImport" className="
            px-3 py-1.5 rounded-lg text-xs font-semibold
            border border-slate-200 bg-white text-slate-600
            hover:bg-slate-50 transition-colors
          ">{t("topbar.importStatus")}</button>
          <input id="statusImportInput" type="file" accept="application/json" hidden />

        </div>
      </header>

      {/* ══════════════════════════════════════════════════════
          BODY  (fills remaining height, no outer scroll)
      ══════════════════════════════════════════════════════ */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── LEFT: Tooth Chart ────────────────────────────── */}
        <section className="
          flex flex-col w-[58%] min-w-0 border-r border-slate-200
          bg-white overflow-hidden
        ">
          {/* Chart sub-header */}
          <div className="
            flex items-center justify-between
            px-5 py-3 border-b border-slate-100 bg-slate-50/50 shrink-0
          ">
            <div>
              <p className="text-sm font-bold text-slate-800">{t("chart.title")}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{t("chart.hint")}</p>
            </div>

            {/* Chart view toggles */}
            <div className="flex items-center gap-2">
              {[
                { id: "btnOcclView", src: iconOcclUrl, title: t("chart.actions.occlusal") },
                { id: "btnWisdomVisible", src: icon8Url, title: t("chart.actions.wisdom") },
                { id: "btnBoneVisible", src: iconGumUrl, title: t("chart.actions.bone") },
                { id: "btnPulpVisible", src: iconPulpUrl, title: t("chart.actions.pulp") },
              ].map(btn => (
                <button
                  key={btn.id}
                  id={btn.id}
                  title={btn.title}
                  aria-label={btn.title}
                  aria-pressed="true"
                  data-icon-src={btn.src}
                  data-xline="1"
                  className="
                    btn btn-toggle btn-icon
                    w-12 h-12 rounded-xl flex items-center justify-center
                    border border-slate-200 bg-white shadow-sm
                    hover:bg-slate-50 transition-colors
                  "
                />
              ))}
            </div>
          </div>

          {/* Tooth grid and X-Ray section */}
          <div className="flex-1 flex flex-col overflow-y-auto relative bg-white">
            <div className="flex justify-end pt-3 pr-6 pb-1 bg-white">
              <button
                id="btnSelectNoneChart"
                title={t("chart.actions.clearSelection")}
                aria-label={t("chart.actions.clearSelection")}
                className="
                  flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-bold
                  border border-slate-200 bg-slate-50 shadow-sm
                  text-slate-700 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-all active:scale-95 cursor-pointer
                "
              >
                <img className="icon-img w-5 h-5 opacity-80" src={iconNoSelUrl} alt="" aria-hidden="true" />
                Clear Selection
              </button>
            </div>
            
            <div
              id="toothGrid"
              aria-label={t("chart.aria.toothGrid")}
              className="tooth-grid shrink-0 px-4 pb-4 pt-1"
            />
            
            {/* Images Reference Area (Moved to bottom to utilize space freed from fixing tooth stretch) */}
            <div className="p-5 mt-auto w-full border-t border-slate-100 bg-slate-50/50 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-bold text-slate-700 uppercase tracking-wide">Image References</p>
                <button className="text-[11px] font-semibold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md hover:bg-teal-100 transition-colors">
                  View All Images
                </button>
              </div>
              
              <div className="flex flex-row gap-4 h-[180px]">
                {/* Intraoral Reference */}
                <div className="flex-1 flex flex-col gap-1.5">
                  <p className="text-xs font-semibold text-slate-500 z-0">Intraoral</p>
                  <div className="w-full h-full relative cursor-zoom-in group">
                    <img 
                      src="/intraoral.png" 
                      alt="Intraoral Reference" 
                      className="absolute inset-0 w-full h-full object-cover rounded-xl border border-slate-200 shadow-sm z-10 origin-bottom-left transition-all duration-300 group-hover:scale-[1.5] group-hover:z-50 group-hover:shadow-2xl" 
                    />
                  </div>
                </div>

                {/* Panoramic X-ray Reference */}
                <div className="flex-1 flex flex-col gap-1.5">
                  <p className="text-xs font-semibold text-slate-500 z-0">Panoramic X-Ray</p>
                  <div className="w-full h-full relative cursor-zoom-in group">
                    <img 
                      src="/Paronamic.png" 
                      alt="Panoramic X-Ray Reference" 
                      className="absolute inset-0 w-full h-full object-cover rounded-xl border border-slate-200 shadow-sm z-10 origin-bottom-right transition-all duration-300 group-hover:scale-[1.5] group-hover:z-50 group-hover:shadow-2xl" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── RIGHT: Control Panel ─────────────────────────── */}
        <aside className="
          flex flex-col w-[42%] min-w-0
          bg-slate-50 overflow-hidden
        ">

          {/* Panel top bar: active tooth + bulk select */}
          <div className="
            px-4 pt-3 pb-2 border-b border-slate-200 bg-white shrink-0
          ">
            {/* Active tooth + clear */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                  {t("panel.activeTooth")}
                </span>
                <span
                  id="activeToothLabel"
                  className="
                    pill px-2 py-0.5 rounded-md bg-teal-50 border border-teal-200
                    text-xs font-bold text-teal-700
                  "
                >
                  {t("selection.none")}
                </span>
              </div>
              <button
                id="btnSelectNone"
                className="
                  px-3 py-1.5 rounded-lg text-xs font-semibold
                  border border-rose-200 bg-rose-50 text-rose-600
                  hover:bg-rose-100 transition-colors
                "
              >
                {t("panel.clearSelection")}
              </button>
            </div>

            {/* Bulk-select buttons — two compact rows */}
            <div className="flex flex-col gap-1.5">
              <div className="flex flex-wrap gap-1">
                {[
                  { id: "btnSelectAll", label: t("panel.selectActions.all") || "All" },
                  { id: "btnSelectAllPresent", label: t("panel.selectActions.present") || "Teeth" },
                  { id: "btnSelectPermanent", label: t("panel.selectActions.permanent") || "Permanent" },
                  { id: "btnSelectMilk", label: t("panel.selectActions.milk") || "Milk" },
                  { id: "btnSelectImplants", label: t("panel.selectActions.implants") || "Implants" },
                  { id: "btnSelectAllMissing", label: t("panel.selectActions.missing") || "Missing" },
                ].map(b => <PillBtn key={b.id} id={b.id} label={b.label} />)}
              </div>
              <div className="flex flex-wrap gap-1">
                {[
                  { id: "btnSelectUpper", label: t("panel.selectActions.upper") || "Upper" },
                  { id: "btnSelectUpperFront", label: t("panel.selectActions.upperFront") || "Upper front" },
                  { id: "btnSelectUpperMolar", label: t("panel.selectActions.upperMolar") || "Upper molars" },
                  { id: "btnSelectLower", label: t("panel.selectActions.lower") || "Lower" },
                  { id: "btnSelectLowerFront", label: t("panel.selectActions.lowerFront") || "Lower front" },
                  { id: "btnSelectLowerMolar", label: t("panel.selectActions.lowerMolar") || "Lower molars" },
                ].map(b => <PillBtn key={b.id} id={b.id} label={b.label} />)}
              </div>
            </div>

            <div id="warnings" className="warnings mt-2" />
          </div>

          {/* Tab bar */}
          <div className="flex gap-0 border-b border-slate-200 bg-white shrink-0">
            {(["status", "treatment", "endo"] as PanelTab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  flex items-center gap-1.5 px-4 py-2.5
                  text-xs font-semibold border-b-2 transition-all duration-150 flex-1 justify-center
                  ${activeTab === tab
                    ? "border-teal-500 text-teal-700 bg-teal-50/50"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }
                `}
              >
                {TAB_ICON[tab]}
                {tab === "status" && `${t("status.title")} & ${t("tooth.title")}`}
                {tab === "treatment" && `${t("caries.title")} & ${t("filling.title")}`}
                {tab === "endo" && t("endo.title")}
              </button>
            ))}
          </div>

          {/* Scrollable panel body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" data-has-selection="false">

            {/* ══════════ TAB 1 – Status & Tooth ══════════ */}
            <div className={activeTab === "status" ? "space-y-3" : "hidden"}>

              {/* — Status presets — */}
              <SectionCard title={t("status.title")} id="statusCard" toggleId="btnToggleStatusCard">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {[
                    { id: "btnResetAll", label: t("status.resetAll") || "Reset mouth" },
                    { id: "btnPrimaryDentition", label: t("status.primaryDentition") },
                    { id: "btnMixedDentition", label: t("status.mixedDentition") },
                    { id: "btnEdentulous", label: t("status.edentulous") },
                  ].map(b => <PillBtn key={b.id} id={b.id} label={b.label} />)}
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-500 shrink-0">
                    {t("status.extraLabel") || "Add:"}
                  </span>
                  <StyledSelect id="statusExtraSelect" className="flex-1 min-w-0" />
                  <button id="statusExtraApply" className="
                    px-3 py-1.5 rounded-lg text-xs font-bold
                    border border-slate-200 bg-white text-slate-700
                    hover:bg-slate-100 transition-colors shrink-0
                  ">{t("status.extraApply") || "OK"}</button>
                </div>
              </SectionCard>

              {/* — Tooth details (requires selection) — */}
              <SectionCard
                title={t("tooth.title") || "Tooth details"}
                id="toothDetailsCard"
                toggleId="btnToggleStatusCard2"
                requiresSelection
              >
                <SelectionOverlay message="Select a tooth to edit details" />

                {/* Row: reset */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wide font-bold">
                    Selected tooth
                  </span>
                  <button id="btnResetTooth" className="
                    px-2.5 py-1 rounded-lg text-[11px] font-bold
                    border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors
                  ">{t("tooth.reset") || "Reset"}</button>
                </div>

                {/* Base + Crown */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                      {t("tooth.baseLabel") || "Base"}
                    </label>
                    <StyledSelect id="toothSelect" className="w-full" />
                  </div>
                  <div id="crownRow" className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                      {t("tooth.crownLabel") || "Crown"}
                    </label>
                    <StyledSelect id="crownSelect" className="w-full" />
                  </div>
                </div>

                {/* Bridge */}
                <div id="bridgeUnitRow" className="flex items-center gap-2 mb-3">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide shrink-0">
                    {t("tooth.bridgeLabel") || "Bridge"}
                  </label>
                  <StyledSelect id="bridgeUnitSelect" className="flex-1" />
                </div>

                {/* Checkbox pills */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                  <CheckPill id="crownNeeded" label={t("tooth.crownNeeded") || "Crown needed"} />
                  <CheckPill id="extractionWound" label={t("tooth.extractionWound")} />
                  <CheckPill id="missingClosed" label={t("tooth.missingClosed")} />
                  <CheckPill id="crownReplace" label={t("tooth.crownReplace")} />
                  <CheckPill id="bridgePillar" label={t("tooth.bridgePillar")} />
                  <CheckPill id="extractionPlan" label={t("tooth.extractionPlan") || "Planned extraction"} dangerOnCheck />
                </div>

                {/* Missing contact */}
                <div id="contactPointRow" className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2">
                    Missing contact
                  </p>
                  <div className="flex gap-1.5">
                    <CheckPill id="contactMesial" label={t("tooth.contact.mesialMissing") || "Mesial"} />
                    <CheckPill id="contactDistal" label={t("tooth.contact.distalMissing") || "Distal"} />
                  </div>
                </div>

                {/* Bruxism */}
                <div id="bruxismRow" className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2">
                    Bruxism
                  </p>
                  <div className="flex gap-1.5">
                    <CheckPill id="bruxismWear" label={t("tooth.bruxism.edgeWear") || "Incisal wear"} />
                    <CheckPill id="bruxismNeckWear" label={t("tooth.bruxism.neckWear") || "Cervical wear"} />
                  </div>
                </div>

                {/* Broken (hidden by default in odontogram.ts) */}
                <div id="brokenCrownRow" className="mt-3 pt-3 border-t border-slate-100 hidden">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2">
                    Broken parts
                  </p>
                  <div className="flex gap-1.5">
                    <CheckPill id="brokenMesial" label={t("tooth.broken.mesial")} />
                    <CheckPill id="brokenIncisal" label={t("tooth.broken.incisal")} />
                    <CheckPill id="brokenDistal" label={t("tooth.broken.distal")} />
                  </div>
                </div>
              </SectionCard>

              {/* — Note — */}
              <SectionCard title={t("tooth.noteLabel") || "Note"} requiresSelection>
                <SelectionOverlay message="Select a tooth to add a note" />
                <textarea
                  id="toothNote"
                  rows={3}
                  placeholder="Add a clinical note for this tooth…"
                  className="
                    w-full text-sm p-3 rounded-xl resize-none
                    border border-slate-200 bg-slate-50
                    focus:bg-white focus:ring-2 focus:ring-teal-400/30 focus:border-teal-400
                    outline-none transition-all placeholder:text-slate-300 text-slate-700
                  "
                />
              </SectionCard>
            </div>

            {/* ══════════ TAB 2 – Caries & Fillings ══════════ */}
            <div className={activeTab === "treatment" ? "space-y-3 relative" : "hidden"}>

              {/* Caries */}
              <SectionCard title={t("caries.title")} id="cariesSection" toggleId="btnToggleCariesCard" requiresSelection>
                <SelectionOverlay icon="cross" message="Select a tooth to record caries" />
                <p className="text-xs text-slate-400 mb-3">{t("caries.hint") || "Select caries surfaces"}</p>
                <div id="cariesChecks" className="dpad-wrapper flex justify-center" />
              </SectionCard>

              {/* Fillings */}
              <SectionCard title={t("filling.title")} id="fillingSection" toggleId="btnToggleFillingCard" requiresSelection>
                <SelectionOverlay icon="cross" message="Select a tooth to record fillings" />
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-slate-500 shrink-0">
                    {t("filling.typeLabel") || "Type"}
                  </span>
                  <StyledSelect id="fillingSelect" className="flex-1" />
                </div>
                <div id="fillingSurfaceChecks" className="dpad-wrapper hidden flex justify-center" />
                <label id="fissureSealingRow" className="cursor-pointer block mt-3">
                  <input type="checkbox" id="fissureSealing" className="peer sr-only" />
                  <div className="
                    w-full text-center px-4 py-2.5 rounded-xl border-2 text-xs font-bold
                    border-slate-200 text-slate-600 transition-all
                    peer-checked:bg-teal-50 peer-checked:border-teal-400 peer-checked:text-teal-700
                    hover:bg-slate-50
                  ">{t("filling.fissureSealing")}</div>
                </label>
              </SectionCard>
            </div>

            {/* ══════════ TAB 3 – Endo ══════════ */}
            <div className={activeTab === "endo" ? "space-y-3 relative" : "hidden"}>

              {/* Endo */}
              <SectionCard title={t("endo.title")} id="endoSection" toggleId="btnToggleEndoCard" requiresSelection>
                <SelectionOverlay icon="wave" message="Select a tooth to configure endo" />
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
                  {t("endo.hint") || "Root status"}
                </p>
                <StyledSelect id="endoSelect" className="w-full mb-3" />
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                  <CheckPill id="pulpInflam" label={t("endo.pulpitis")} />
                  <CheckPill id="endoResection" label={t("endo.resection")} />
                  <CheckPill id="parapulpalPin" label={t("endo.parapulpalPin")} />
                </div>
              </SectionCard>

              {/* Inflammation */}
              <SectionCard title={t("inflammation.title") || "Inflammation & mobility"} id="inflammationSection" toggleId="btnToggleInflammationCard" requiresSelection>
                <SelectionOverlay icon="wave" message="Select a tooth to configure inflammation" />
                <div id="mobilityRow" className="flex items-center gap-3 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-500 shrink-0">
                    {t("inflammation.mobilityLabel") || "Mobility"}
                  </span>
                  <StyledSelect id="mobilitySelect" className="flex-1" />
                </div>
                <div id="modsChecksWrapper" className="grid grid-cols-2 gap-2 pt-1">
                  {[
                    { id: "modPeriapical", val: "inflammation", label: t("mods.periapicalInflammation") },
                    { id: "modPeriodontal", val: "parodontal", label: t("mods.periodontalInflammation") },
                    { id: "modMobilityChecks", val: "mobility", label: t("inflammation.mobilityLabel") || "Mobility" },
                  ].map(m => (
                    <label key={m.id} className="cursor-pointer">
                      <input type="checkbox" id={m.id} value={m.val} className="peer sr-only mod-chk" />
                      <div className="
                        px-3 py-2 rounded-xl border text-xs font-medium transition-all
                        border-slate-200 bg-white text-slate-600
                        peer-checked:bg-teal-50 peer-checked:border-teal-400 peer-checked:text-teal-700
                        hover:bg-slate-50
                      ">{m.label}</div>
                    </label>
                  ))}
                </div>
              </SectionCard>
            </div>

          </div>{/* end scrollable panel body */}
        </aside>
      </div>{/* end body row */}
    </div>
  );
}