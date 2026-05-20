content = """import { JSX, useEffect, useRef, useState } from "react";
import {
  destroyOdontogram,
  initOdontogram,
  setNumberingSystem,
  clearSelection,
  setOcclusalVisible,
  setWisdomVisible,
  setShowBase,
  setHealthyPulpVisible,
  subscribeOdontogram,
  getActiveTooth,
  getToothState,
  setToothState,
  nextTooth,
  prevTooth,
} from "./odontogram";
export { clearSelection, setOcclusalVisible, setWisdomVisible, setShowBase, setHealthyPulpVisible };
import { useI18n } from "./i18n/useI18n";
import type { Language } from "./i18n/translations";
import type { NumberingSystem } from "./utils/numbering";
import { applyThemeConfig, type OdontogramThemeConfig } from "./theme";
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

function SectionCard({ title, id, children, className = "" }: { title: string; id?: string; children: React.ReactNode; className?: string; }) {
  return (
    <section id={id} className={`relative rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden ${className}`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/60">
        <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500 select-none">{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function StyledSelect({ value, onChange, options, className = "" }: { value: string, onChange: (v: string) => void, options: {label: string, value: string}[], className?: string }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} className={`text-sm p-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-teal-400/30 focus:border-teal-400 outline-none transition-all ${className}`}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function SelectionOverlay({ message }: { message: string }) {
  return (
    <div className="selection-overlay flex flex-col items-center justify-center bg-transparent z-10 rounded-2xl py-12">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2 text-slate-300">
        <path d="M12 2C8 2 4 6 4 10c0 4 2 6 3 8s1 4 5 4 4-2 5-4 3-4 3-8c0-4-4-8-8-8z" />
      </svg>
      <p className="text-xs text-slate-400 font-medium text-center px-4">{message}</p>
    </div>
  );
}

export default function OdontogramUI({ language, onLanguageChange, numberingSystem, onNumberingChange, themeConfig }: AppProps) {
  const { t } = useI18n({ language, onLanguageChange });
  const [internalNumbering, setInternalNumbering] = useState<NumberingSystem>(numberingSystem ?? "FDI");
  const [numberingOpen, setNumberingOpen] = useState(false);
  const [activeResTooth, setActiveResTooth] = useState<number | null>(null);
  const [toothData, setToothData] = useState<any>(null);
  const [step, setStep] = useState(1);

  const themeRootRef = useRef<HTMLDivElement | null>(null);
  const numberingRef = useRef<HTMLDivElement | null>(null);
  const currentNumbering = numberingSystem ?? internalNumbering;

  const setNumbering = (next: NumberingSystem) => {
    if (numberingSystem) { onNumberingChange?.(next); return; }
    setInternalNumbering(next);
    onNumberingChange?.(next);
  };

  useEffect(() => { 
    initOdontogram(); 
    const unsub = subscribeOdontogram(() => {
        const at = getActiveTooth();
        setActiveResTooth(at);
        if (at) {
          setToothData(getToothState(at));
        } else {
          setToothData(null);
          setStep(1);
        }
    });
    return () => { unsub(); destroyOdontogram(); }; 
  }, []);

  const prevToothRef = useRef<number | null>(null);
  useEffect(() => {
    if (activeResTooth !== prevToothRef.current) {
        setStep(1);
        prevToothRef.current = activeResTooth;
    }
  }, [activeResTooth]);

  useEffect(() => { setNumberingSystem(currentNumbering); }, [currentNumbering]);
  useEffect(() => { applyThemeConfig(themeRootRef.current, themeConfig); }, [themeConfig]);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (!numberingRef.current?.contains(e.target as Node)) setNumberingOpen(false); };
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, []);

  const updateProp = (updates: any) => {
    if (!activeResTooth) return;
    setToothState(activeResTooth, updates);
  };

  const getPath = () => {
    if (!toothData) return 'A';
    if (toothData.toothSelection === 'implant') return 'C';
    if (toothData.toothSelection === 'none' || toothData.toothSelection === 'tooth-under-gum') return 'B';
    return 'A';
  };

  return (
    <div ref={themeRootRef} className="odontogram-root h-full flex flex-col overflow-hidden bg-slate-50 font-sans">
      <header className="flex items-center gap-3 px-5 h-14 shrink-0 bg-white border-b border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <div className="relative" ref={numberingRef}>
          <button onClick={() => setNumberingOpen(o => !o)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            {t("numbering.label")}: {t(currentNumbering === "FDI" ? "numbering.fdi" : currentNumbering === "UNIVERSAL" ? "numbering.universal" : "numbering.palmer")}
          </button>
          {numberingOpen && (
            <div className="absolute top-full left-0 mt-1 w-44 z-50 bg-white border border-slate-200 rounded-xl shadow-lg py-1">
              {NUMBERING_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => { setNumbering(opt.value); setNumberingOpen(false); }} className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors ${currentNumbering === opt.value ? "text-teal-700 bg-teal-50" : "text-slate-600 hover:bg-slate-50"}`}>{t(opt.labelKey)}</button>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <section className="flex flex-col w-[58%] min-w-0 border-r border-slate-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50/50 shrink-0">
            <div>
              <p className="text-sm font-bold text-slate-800">{t("chart.title")}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{t("chart.hint")}</p>
            </div>
            <div className="flex items-center gap-2">
              {[
                { id: "btnOcclView", src: iconOcclUrl, title: t("chart.actions.occlusal") },
                { id: "btnWisdomVisible", src: icon8Url, title: t("chart.actions.wisdom") },
                { id: "btnBoneVisible", src: iconGumUrl, title: t("chart.actions.bone") },
                { id: "btnPulpVisible", src: iconPulpUrl, title: t("chart.actions.pulp") },
              ].map(btn => (
                <button key={btn.id} id={btn.id} title={btn.title} aria-label={btn.title} aria-pressed="true" data-icon-src={btn.src} data-xline="1" className="btn btn-toggle btn-icon w-12 h-12 rounded-xl flex items-center justify-center border border-slate-200 bg-white shadow-sm hover:bg-slate-50 transition-colors" />
              ))}
            </div>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto relative bg-white">
            <div className="flex justify-end pt-3 pr-6 pb-1 bg-white">
              <button onClick={() => clearSelection()} className="flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-bold border border-slate-200 bg-slate-50 shadow-sm text-slate-700 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-all active:scale-95 cursor-pointer">
                <img className="icon-img w-5 h-5 opacity-80" src={iconNoSelUrl} alt="" aria-hidden="true" /> Clear Selection
              </button>
            </div>
            <div id="toothGrid" aria-label={t("chart.aria.toothGrid")} className="tooth-grid shrink-0 px-4 pb-4 pt-1" />
            <div className="p-5 mt-auto w-full border-t border-slate-100 bg-slate-50/50 flex flex-col gap-3">
              <div className="flex items-center justify-between"><p className="text-[13px] font-bold text-slate-700 uppercase tracking-wide">Image References</p></div>
              <div className="flex flex-row gap-4 h-[180px]">
                <div className="flex-1 flex flex-col gap-1.5"><p className="text-xs font-semibold text-slate-500 z-0">Intraoral</p><img src="/intraoral.png" alt="Intraoral Reference" className="w-full h-full object-cover rounded-xl border border-slate-200" /></div>
                <div className="flex-1 flex flex-col gap-1.5"><p className="text-xs font-semibold text-slate-500 z-0">Panoramic X-Ray</p><img src="/Paronamic.png" alt="Panoramic X-Ray Reference" className="w-full h-full object-cover rounded-xl border border-slate-200" /></div>
              </div>
            </div>
          </div>
        </section>

        <aside className="flex flex-col w-[42%] min-w-0 bg-slate-50 overflow-hidden">
          <div className="px-4 pt-3 pb-2 border-b border-slate-200 bg-white shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">{t("panel.activeTooth")}</span>
                <span className="pill px-2 py-0.5 rounded-md bg-teal-50 border border-teal-200 text-xs font-bold text-teal-700">{activeResTooth || t("selection.none")}</span>
              </div>
              <div className="flex items-center gap-2">
                 <button onClick={() => prevTooth()} className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 bg-slate-50 hover:bg-slate-100">⬅️ Prev</button>
                 <button onClick={() => nextTooth()} className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 bg-slate-50 hover:bg-slate-100">Next ➡️</button>
              </div>
            </div>
            <div id="warnings" className="warnings" />
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 relative">
            {!activeResTooth ? (
              <SelectionOverlay message="Select a tooth to begin chart entry" />
            ) : (
                <>
                <div className={step === 1 ? "" : "hidden"}>
                    <SectionCard title="Step 1: Base Status (What do you see?)" className="space-y-3">
                    <button className="w-full py-3 px-4 mb-2 bg-blue-50 text-blue-700 text-sm font-semibold rounded-xl border border-blue-200 hover:bg-blue-100 text-left flex gap-2" onClick={() => { updateProp({toothSelection: 'tooth-base'}); setStep(2); }}><span className="text-xl">🦷</span> Present Tooth</button>
                    <button className="w-full py-3 px-4 mb-2 bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl border border-slate-200 hover:bg-slate-100 text-left flex gap-2" onClick={() => { updateProp({toothSelection: 'none'}); setStep(2); }}><span className="text-xl">🕳️</span> Empty Space</button>
                    <button className="w-full py-3 px-4 bg-teal-50 text-teal-700 text-sm font-semibold rounded-xl border border-teal-200 hover:bg-teal-100 text-left flex gap-2" onClick={() => { updateProp({toothSelection: 'implant'}); setStep(2); }}><span className="text-xl">🔩</span> Implant</button>
                    </SectionCard>
                </div>
                
                <div className={step === 2 ? "space-y-4" : "hidden"}>
                        <button onClick={() => setStep(1)} className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-2">⬅️ Back to Status</button>
                        <div className={getPath() === 'A' ? "space-y-4" : "hidden"}>
                                <SectionCard title="Caries">
                                    <div className="flex items-center gap-2 mb-2">
                                        <label className="text-xs font-semibold text-slate-500">Depth</label>
                                        <StyledSelect value={toothData?.cariesDepth || 'none'} onChange={v => updateProp({ cariesDepth: v })} options={[{label: 'None', value: 'none'}, {label: 'Enamel', value: 'enamel'}, {label: 'Dentine', value: 'dentine'}, {label: 'Pulp', value: 'pulp'}]} />
                                    </div>
                                    <div id="cariesChecks" className="dpad-wrapper flex justify-center mt-2" />
                                </SectionCard>
                                <SectionCard title="Filling">
                                    <div className="flex items-center gap-2 mb-2">
                                        <label className="text-xs font-semibold text-slate-500">Material & Size</label>
                                        <StyledSelect className="flex-1" value={toothData?.fillingMaterial || 'composite'} onChange={v => updateProp({ fillingMaterial: v })} options={[{label: 'Composite', value: 'composite'}, {label: 'Amalgam', value: 'amalgam'}, {label: 'GIC', value: 'gic'}, {label: 'Temporary', value: 'temporary'}, {label: 'PFM', value: 'pfm'}, {label: 'PFZ', value: 'pfz'}, {label: 'None', value: 'none'}]} />
                                        <input type="text" placeholder="Size (mm)" value={toothData?.fillingSizeMm || ''} onChange={e => updateProp({ fillingSizeMm: e.target.value })} className="w-20 text-sm p-1.5 rounded-xl border border-slate-200 outline-none focus:ring-1 focus:ring-teal-400" />
                                    </div>
                                    <div id="fillingSurfaceChecks" className="dpad-wrapper flex justify-center mt-2" />
                                </SectionCard>
                                <SectionCard title="Vitality & Endo">
                                    <div className="flex items-center gap-3 mb-2">
                                        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600"><input type="checkbox" checked={toothData?.pulpInflam || false} onChange={e => updateProp({ pulpInflam: e.target.checked })} /> Pulpitis</label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <label className="text-xs font-semibold text-slate-500">EPT Result</label>
                                        <StyledSelect value={toothData?.eptResult || 'none'} onChange={v => updateProp({ eptResult: v })} options={[{label: 'None', value: 'none'}, {label: 'Positive (+)', value: 'positive'}, {label: 'Negative (-)', value: 'negative'}]} />
                                    </div>
                                </SectionCard>
                                <SectionCard title="Periodontal">
                                    <div className="flex items-center gap-2 mb-2">
                                        <label className="text-xs font-semibold text-slate-500 min-w-16">Mobility</label>
                                        <StyledSelect className="flex-1" value={toothData?.mobility || 'none'} onChange={v => updateProp({ mobility: v })} options={[{label: 'None', value: 'none'}, {label: 'Grade I', value: 'm1'}, {label: 'Grade II', value: 'm2'}, {label: 'Grade III', value: 'm3'}]} />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <label className="text-xs font-semibold text-slate-500 min-w-16">Recession</label>
                                        <input type="text" placeholder="(mm)" value={toothData?.recessionMm || ''} onChange={e => updateProp({ recessionMm: e.target.value })} className="w-20 text-sm p-1.5 rounded-xl border border-slate-200 outline-none focus:ring-1 focus:ring-teal-400" />
                                    </div>
                                </SectionCard>
                                <SectionCard title="Restoration">
                                   <div className="flex flex-col gap-2">
                                      <div className="flex items-center gap-2">
                                          <label className="text-xs font-semibold text-slate-500 min-w-14">Type</label>
                                          <StyledSelect className="flex-1" value={toothData?.crownMaterial === 'natural' ? 'none' : toothData?.crownMaterial || 'none'} onChange={v => updateProp({ crownMaterial: v === 'none' ? 'natural' : v })} options={[{label: 'None', value: 'none'}, {label: 'Crown', value: 'zircon'}, {label: 'Bridge Unit', value: 'bridge'}, {label: 'Veneer', value: 'veneer'}, {label: 'Onlay', value: 'onlay'}, {label: 'Vonlay', value: 'vonlay'}, {label: 'Post & Core', value: 'postcore'}]} />
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <label className="text-xs font-semibold text-slate-500 min-w-14">Material</label>
                                        <StyledSelect className="flex-1" value={toothData?.crownMaterial || 'zircon'} onChange={v => updateProp({ crownMaterial: v })} options={[{label: 'Zirconia', value: 'zircon'}, {label: 'Emax', value: 'emax'}, {label: 'Full Metal', value: 'metal'}, {label: 'PFM', value: 'pfm'}, {label: 'PFZ', value: 'pfz'}, {label: 'Telescope', value: 'telescope'}]} />
                                      </div>
                                   </div>
                                </SectionCard>
                                <SectionCard title="Others">
                                   <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-2"><input type="checkbox" checked={toothData?.extractionPlan || false} onChange={e => updateProp({ extractionPlan: e.target.checked })} /> Planned Extraction</label>
                                   <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-2"><input type="checkbox" checked={toothData?.fissureSealing || false} onChange={e => updateProp({ fissureSealing: e.target.checked })} /> Fissure Sealing</label>
                                </SectionCard>
                        </div>

                        <div className={getPath() === 'B' ? "space-y-4" : "hidden"}>
                            <SectionCard title="Empty Space State">
                               <div className="flex flex-col gap-2">
                                <button className={`py-2 px-3 text-sm font-semibold rounded-xl border text-left ${toothData?.toothSelection === 'none' ? 'bg-teal-50 border-teal-300 text-teal-700' : 'bg-white border-slate-200'}`} onClick={() => updateProp({toothSelection: 'none'})}>Missing / Extracted</button>
                                {toothData?.toothSelection === 'none' && (
                                    <div className="ml-4 pl-4 border-l-2 border-slate-100 flex flex-col gap-2 mb-2">
                                        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600"><input type="checkbox" checked={toothData?.extractionWound || false} onChange={e => updateProp({ extractionWound: e.target.checked })} /> Extraction Wound</label>
                                        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600"><input type="checkbox" checked={toothData?.bridgeUnit === 'zircon' || toothData?.bridgeUnit === 'metal'} onChange={e => updateProp({ bridgeUnit: e.target.checked ? 'zircon' : 'none' })} /> Bridge Unit</label>
                                    </div>
                                )}
                                <button className={`py-2 px-3 text-sm font-semibold rounded-xl border text-left ${toothData?.toothSelection === 'tooth-under-gum' ? 'bg-teal-50 border-teal-300 text-teal-700' : 'bg-white border-slate-200'}`} onClick={() => updateProp({toothSelection: 'tooth-under-gum'})}>Impacted / Embedded</button>
                                {toothData?.toothSelection === 'tooth-under-gum' && (
                                     <div className="ml-4 pl-4 border-l-2 border-slate-100 flex flex-col gap-2">
                                        <label className="flex items-center gap-1.5 text-xs font-semibold text-red-600"><input type="checkbox" checked={toothData?.extractionPlan || false} onChange={e => updateProp({ extractionPlan: e.target.checked })} /> Planned Extraction</label>
                                     </div>
                                )}
                               </div>
                            </SectionCard>
                        </div>
                        
                        <div className={getPath() === 'C' ? "space-y-4" : "hidden"}>
                             <SectionCard title="Implant Base">
                               <div className="flex flex-col gap-2">
                                 <div>
                                   <label className="text-xs font-semibold text-slate-500 mb-1 block">Implant Brand</label>
                                   <input type="text" value={toothData?.implantBrand || ''} onChange={e => updateProp({implantBrand: e.target.value})} className="w-full text-sm p-2 rounded-xl border border-slate-200 outline-none focus:ring-1 focus:ring-teal-400" placeholder="e.g. Straumann" />
                                 </div>
                                 <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mt-2"><input type="checkbox" checked={toothData?.coverScrew || false} onChange={e => updateProp({ coverScrew: e.target.checked })} /> Cover Screw Instead of Healing Abutment</label>
                               </div>
                             </SectionCard>
                             <SectionCard title="Restoration on Implant">
                               <div className="flex flex-col gap-3">
                                  <div className="flex items-center gap-2">
                                      <label className="text-xs font-semibold text-slate-500 min-w-16">Retention</label>
                                      <StyledSelect className="flex-1" value={toothData?.retentionType || 'screw'} onChange={v => updateProp({ retentionType: v })} options={[{label: 'Screw-Retained', value: 'screw'}, {label: 'Cement-Retained', value: 'cement'}]} />
                                  </div>
                                  <div className="flex items-center gap-2">
                                      <label className="text-xs font-semibold text-slate-500 min-w-16">Material</label>
                                      <StyledSelect className="flex-1" value={toothData?.crownMaterial || 'zircon'} onChange={v => updateProp({ crownMaterial: v })} options={[{label: 'Zirconia', value: 'zircon'}, {label: 'Lithium Disilicate (Emax)', value: 'emax'}, {label: 'Full Metal', value: 'metal'}, {label: 'PFM', value: 'pfm'}, {label: 'PFZ', value: 'pfz'}]} />
                                  </div>
                                  <div>
                                   <label className="text-xs font-semibold text-slate-500 mb-1 block">Crown Brand / Lab</label>
                                   <input type="text" value={toothData?.crownBrand || ''} onChange={e => updateProp({crownBrand: e.target.value})} className="w-full text-sm p-2 rounded-xl border border-slate-200 outline-none focus:ring-1 focus:ring-teal-400" placeholder="Details..." />
                                 </div>
                               </div>
                             </SectionCard>
                        </div>
                        <SectionCard title="Clinical Note">
                            <textarea value={toothData?.note || ''} onChange={e => updateProp({ note: e.target.value })} rows={3} placeholder="Add a clinical note for this tooth..." className="w-full text-sm p-3 rounded-xl resize-none border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-400/30 focus:border-teal-400 outline-none transition-all placeholder:text-slate-300 text-slate-700" />
                        </SectionCard>
                </div>
                </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
"""
with open("/Users/chefthanathip/Repositories/DentalC3/src/components/odontogram/OdontogramUI.tsx", "w") as f:
    f.write(content)
