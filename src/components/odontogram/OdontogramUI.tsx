import { useEffect, useRef, useState } from "react";
import {
  clearSelection,
  destroyOdontogram,
  initOdontogram,
  setHealthyPulpVisible,
  setNumberingSystem,
  setOcclusalVisible,
  setShowBase,
  setWisdomVisible,
} from "./odontogram";
export { clearSelection, setOcclusalVisible, setWisdomVisible, setShowBase, setHealthyPulpVisible };
import { useI18n } from "./i18n/useI18n";
import type { Language } from "./i18n/translations";
import type { NumberingSystem } from "./utils/numbering";
import { applyThemeConfig, type OdontogramThemeConfig } from "./theme";
import { OdontogramWizard } from "./OdontogramWizard";
export type { OdontogramThemeConfig };

const icon8Url = "/icon-svgs/icon_8.svg";
const iconGumUrl = "/icon-svgs/icon_gum.svg";
const iconNoSelUrl = "/icon-svgs/icon_no_selection.svg";
const iconOcclUrl = "/icon-svgs/icon_occl.svg";
const iconPulpUrl = "/icon-svgs/icon_pulp.svg";

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

export default function OdontogramUI({
  language,
  onLanguageChange,
  numberingSystem,
  onNumberingChange,
  themeConfig,
}: AppProps) {
  const { t } = useI18n({ language, onLanguageChange });
  const [internalNumbering, setInternalNumbering] = useState<NumberingSystem>(numberingSystem ?? "FDI");
  const [numberingOpen, setNumberingOpen] = useState(false);

  const themeRootRef = useRef<HTMLDivElement | null>(null);
  const numberingRef = useRef<HTMLDivElement | null>(null);
  const currentNumbering = numberingSystem ?? internalNumbering;

  const setNumbering = (next: NumberingSystem) => {
    if (!numberingSystem) setInternalNumbering(next);
    onNumberingChange?.(next);
  };

  useEffect(() => {
    initOdontogram();
    return () => { destroyOdontogram(); };
  }, []);

  useEffect(() => { setNumberingSystem(currentNumbering); }, [currentNumbering]);
  useEffect(() => { applyThemeConfig(themeRootRef.current, themeConfig); }, [themeConfig]);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!numberingRef.current?.contains(event.target as Node)) setNumberingOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const numberingLabelKey =
    currentNumbering === "FDI" ? "numbering.fdi" :
      currentNumbering === "UNIVERSAL" ? "numbering.universal" : "numbering.palmer";

  const viewButtons = [
    { id: "btnOcclView", src: iconOcclUrl, title: t("chart.actions.occlusal") },
    { id: "btnWisdomVisible", src: icon8Url, title: t("chart.actions.wisdom") },
    { id: "btnBoneVisible", src: iconGumUrl, title: t("chart.actions.bone") },
    { id: "btnPulpVisible", src: iconPulpUrl, title: t("chart.actions.pulp") },
  ];

  return (
    <div
      ref={themeRootRef}
      className="odontogram-root h-full flex flex-col overflow-hidden bg-slate-50 font-sans"
    >
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <div className="relative" ref={numberingRef}>
          <button
            type="button"
            onClick={() => setNumberingOpen((open) => !open)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
          >
            {t("numbering.label")}: {t(numberingLabelKey)}
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          {numberingOpen && (
            <div className="absolute left-0 top-full z-50 mt-1 w-44 rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
              {NUMBERING_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setNumbering(option.value);
                    setNumberingOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-xs font-medium transition-colors ${
                    currentNumbering === option.value
                      ? "bg-teal-50 text-teal-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {t(option.labelKey)}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1" />

        <button
          id="btnStatusExport"
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
        >
          {t("topbar.exportStatus")}
        </button>
        <button
          id="btnStatusImport"
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
        >
          {t("topbar.importStatus")}
        </button>
        <input id="statusImportInput" type="file" accept="application/json" hidden />
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <section className="flex w-[58%] min-w-0 flex-col overflow-hidden border-r border-slate-200 bg-white">
          <div className="shrink-0 border-b border-slate-100 bg-white px-5 py-3 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800">{t("chart.title")}</p>
                <p className="mt-0.5 text-[11px] text-slate-400">{t("chart.hint")}</p>
              </div>

              <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 p-1.5 shadow-inner">
              <button
                id="btnSelectNoneChart"
                type="button"
                onClick={() => clearSelection()}
                title={t("chart.actions.clearSelection")}
                aria-label={t("chart.actions.clearSelection")}
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-sm transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
              >
                <img className="h-5 w-5 opacity-80" src={iconNoSelUrl} alt="" aria-hidden="true" />
                Clear
              </button>

                <div className="h-8 w-px bg-slate-200" />

                <div className="flex items-center gap-1.5">
                {viewButtons.map((button) => (
                  <button
                    key={button.id}
                    id={button.id}
                    title={button.title}
                    aria-label={button.title}
                    aria-pressed="true"
                    data-icon-src={button.src}
                    data-xline="1"
                      className="btn btn-toggle btn-icon flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition-colors hover:bg-white"
                  />
                ))}
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex-1 overflow-y-auto bg-white">
            <div
              id="toothGrid"
              aria-label={t("chart.aria.toothGrid")}
              className="tooth-grid shrink-0 px-4 pb-4 pt-1"
            />

            <div className="mt-auto flex w-full flex-col gap-3 border-t border-slate-100 bg-slate-50/50 p-5">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-bold uppercase tracking-wide text-slate-700">Image References</p>
                <button className="rounded-md bg-teal-50 px-2.5 py-1 text-[11px] font-semibold text-teal-600 transition-colors hover:bg-teal-100">
                  View All Images
                </button>
              </div>
              <div className="flex h-[180px] flex-row gap-4">
                <div className="flex flex-1 flex-col gap-1.5">
                  <p className="text-xs font-semibold text-slate-500">Intraoral</p>
                  <div className="group relative h-full w-full cursor-zoom-in">
                    <img
                      src="/intraoral.png"
                      alt="Intraoral Reference"
                      className="absolute inset-0 z-10 h-full w-full origin-bottom-left rounded-xl border border-slate-200 object-cover shadow-sm transition-all duration-300 group-hover:z-50 group-hover:scale-[1.5] group-hover:shadow-2xl"
                    />
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-1.5">
                  <p className="text-xs font-semibold text-slate-500">Panoramic X-Ray</p>
                  <div className="group relative h-full w-full cursor-zoom-in">
                    <img
                      src="/Paronamic.png"
                      alt="Panoramic X-Ray Reference"
                      className="absolute inset-0 z-10 h-full w-full origin-bottom-right rounded-xl border border-slate-200 object-cover shadow-sm transition-all duration-300 group-hover:z-50 group-hover:scale-[1.5] group-hover:shadow-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="flex w-[42%] min-w-0 flex-col overflow-hidden bg-slate-50">
          <OdontogramWizard />
        </aside>
      </div>
    </div>
  );
}
