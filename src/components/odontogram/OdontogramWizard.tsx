import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import {
  canBePrimaryTooth,
  defaultState,
  getAllTeeth,
  getOdontogramSnapshot,
  replaceToothState,
  resetToothState,
  selectTooth,
  subscribeOdontogram,
  updateToothState,
  type CariesDepth,
  type EptResult,
  type ImplantComponent,
  type ImplantRetentionType,
  type OdontogramSnapshot,
  type RestorationMaterial,
  type RestorationType,
  type ToothState,
} from "./odontogram";

type WizardPath = "tooth" | "edentulous" | "implant";

const FISSURE_ALLOWED = new Set([16, 17, 26, 27, 36, 37, 46, 47]);

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");

function isUpperTooth(toothNo: number) {
  return [1, 2].includes(Math.floor(toothNo / 10));
}

function toCrownMaterial(material: RestorationMaterial) {
  if (material === "zircon" || material === "pfz") return "zircon";
  if (material === "metal" || material === "pfm") return "metal";
  if (material === "emax") return "emax";
  return "natural";
}

function makeSelectionState(toothSelection: ToothState["toothSelection"]) {
  const next = defaultState();
  next.toothSelection = toothSelection;
  if (toothSelection === "implant" || toothSelection === "none" || toothSelection === "tooth-under-gum") {
    next.caries.clear();
    next.fillingMaterial = "none";
    next.fillingSurfaces.clear();
    next.endo = "none";
    next.pulpInflam = false;
  }
  return next;
}

function inferPath(state: ToothState | null): WizardPath {
  if (state?.toothSelection === "implant") return "implant";
  if (state?.toothSelection === "none" || state?.toothSelection === "tooth-under-gum") return "edentulous";
  return "tooth";
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50">
        <h3 className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{title}</h3>
      </div>
      <div className="p-4 space-y-4">{children}</div>
    </section>
  );
}

function Chip({
  children,
  active,
  disabled,
  onClick,
  tone = "teal",
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  tone?: "teal" | "rose" | "amber" | "slate";
}) {
  const activeClass = {
    teal: "border-teal-500 bg-teal-50 text-teal-800",
    rose: "border-rose-500 bg-rose-50 text-rose-800",
    amber: "border-amber-500 bg-amber-50 text-amber-800",
    slate: "border-slate-500 bg-slate-100 text-slate-800",
  }[tone];

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cx(
        "min-h-10 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-teal-300",
        active ? activeClass : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
        disabled && "cursor-not-allowed opacity-40 hover:bg-white"
      )}
    >
      {children}
    </button>
  );
}

function TextInput({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-300 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-200"
      />
    </label>
  );
}

function NoteInput({
  label = "Note",
  value,
  onChange,
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
      />
    </label>
  );
}

function SurfaceDPad({
  toothNo,
  selected,
  onToggle,
  mode,
}: {
  toothNo: number;
  selected: Set<string>;
  onToggle: (surface: string) => void;
  mode: "caries" | "filling";
}) {
  const lingualLabel = isUpperTooth(toothNo) ? "Palatal" : "Lingual";
  const lingualShort = isUpperTooth(toothNo) ? "P" : "L";
  const surfaces = [
    { key: "buccal", label: "Buccal", short: "B", place: "col-start-2 row-start-1" },
    { key: "mesial", label: "Mesial", short: "M", place: "col-start-1 row-start-2" },
    { key: "occlusal", label: "Occlusal", short: "O", place: "col-start-2 row-start-2" },
    { key: "distal", label: "Distal", short: "D", place: "col-start-3 row-start-2" },
    { key: "lingual", label: lingualLabel, short: lingualShort, place: "col-start-2 row-start-3" },
  ];

  const valueFor = (key: string) => (mode === "caries" ? `caries-${key}` : key);

  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-2 max-w-[220px]">
      {surfaces.map((surface) => {
        const value = valueFor(surface.key);
        return (
          <button
            key={surface.key}
            type="button"
            onClick={() => onToggle(value)}
            title={surface.label}
            className={cx(
              "h-14 rounded-lg border text-center transition-colors",
              "flex flex-col items-center justify-center leading-none",
              surface.place,
              selected.has(value)
                ? "border-teal-500 bg-teal-50 text-teal-800"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            )}
          >
            <span className="text-sm font-black">{surface.short}</span>
            <span className="mt-1 text-[9px] font-semibold uppercase tracking-wide">{surface.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function CariesSection({ toothNo, state }: { toothNo: number; state: ToothState }) {
  const update = (fn: (state: ToothState) => void) => updateToothState(toothNo, fn);
  const activeDepth = state.depth || state.cariesDepth;
  const depthOptions: Array<{ value: CariesDepth; label: string }> = [
    { value: "enamel", label: "Enamel" },
    { value: "dentine", label: "Dentine" },
    { value: "pulp", label: "Pulp" },
  ];

  return (
    <Section title="Caries">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SurfaceDPad
          toothNo={toothNo}
          selected={state.caries}
          mode="caries"
          onToggle={(surface) => update((draft) => {
            if (draft.caries.has(surface)) draft.caries.delete(surface);
            else draft.caries.add(surface);
          })}
        />
        <div className="flex flex-1 flex-wrap gap-2">
          {depthOptions.map((option) => (
            <Chip
              key={option.value}
              active={activeDepth === option.value}
              tone={option.value === "pulp" ? "rose" : "teal"}
              onClick={() => update((draft) => {
                const nextDepth = (draft.depth || draft.cariesDepth) === option.value ? "none" : option.value;
                draft.depth = nextDepth;
                draft.cariesDepth = nextDepth;
              })}
            >
              {option.label}
            </Chip>
          ))}
        </div>
      </div>
      <NoteInput value={state.cariesNote} onChange={(value) => update((draft) => { draft.cariesNote = value; })} />
    </Section>
  );
}

function FillingSection({ toothNo, state, isPrimary }: { toothNo: number; state: ToothState; isPrimary: boolean }) {
  const update = (fn: (state: ToothState) => void) => updateToothState(toothNo, fn);
  const materials = [
    { value: "composite", label: "Composite" },
    { value: "amalgam", label: "Amalgam" },
    { value: "gic", label: "GIC" },
    { value: "temporary", label: "Temporary" },
  ].filter((item) => !(isPrimary && item.value === "amalgam"));

  return (
    <Section title="Filling">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <SurfaceDPad
          toothNo={toothNo}
          selected={state.fillingSurfaces}
          mode="filling"
          onToggle={(surface) => update((draft) => {
            if (draft.fillingSurfaces.has(surface)) draft.fillingSurfaces.delete(surface);
            else draft.fillingSurfaces.add(surface);
          })}
        />
        <div className="flex flex-1 flex-wrap gap-2">
          {materials.map((material) => (
            <Chip
              key={material.value}
              active={state.fillingMaterial === material.value}
              onClick={() => update((draft) => { draft.fillingMaterial = material.value; })}
            >
              {material.label}
            </Chip>
          ))}
          <Chip
            active={state.fillingMaterial === "none"}
            tone="slate"
            onClick={() => update((draft) => {
              draft.fillingMaterial = "none";
              draft.fillingSurfaces.clear();
            })}
          >
            None
          </Chip>
        </div>
      </div>
      <TextInput
        label="Size (mm)"
        value={state.size_mm}
        onChange={(value) => update((draft) => { draft.size_mm = value; })}
      />
      <NoteInput value={state.fillingNote} onChange={(value) => update((draft) => { draft.fillingNote = value; })} />
    </Section>
  );
}

function PeriodontalSection({ toothNo, state }: { toothNo: number; state: ToothState }) {
  const update = (fn: (state: ToothState) => void) => updateToothState(toothNo, fn);
  const mobility = [
    { value: "none", label: "Normal" },
    { value: "m1", label: "M1" },
    { value: "m2", label: "M2" },
    { value: "m3", label: "M3" },
  ];

  return (
    <Section title="Periodontal">
      <div className="flex flex-wrap gap-2">
        {mobility.map((item) => (
          <Chip
            key={item.value}
            active={state.mobility === item.value}
            tone={item.value === "none" ? "slate" : "amber"}
            onClick={() => update((draft) => { draft.mobility = item.value; })}
          >
            {item.label}
          </Chip>
        ))}
      </div>
      <TextInput
        label="Recession (mm)"
        value={state.recession_mm}
        onChange={(value) => update((draft) => { draft.recession_mm = value; })}
      />
      <NoteInput value={state.periodontalNote} onChange={(value) => update((draft) => { draft.periodontalNote = value; })} />
    </Section>
  );
}

function VitalitySection({ toothNo, state }: { toothNo: number; state: ToothState }) {
  const update = (fn: (state: ToothState) => void) => updateToothState(toothNo, fn);
  const eptOptions: Array<{ value: EptResult; label: string }> = [
    { value: "positive", label: "Positive" },
    { value: "negative", label: "Negative" },
  ];

  return (
    <Section title="Vitality">
      <div className="flex flex-wrap gap-2">
        <Chip
          active={state.pulpInflam}
          tone="rose"
          onClick={() => update((draft) => { draft.pulpInflam = !draft.pulpInflam; })}
        >
          Pulpitis
        </Chip>
        {eptOptions.map((item) => (
          <Chip
            key={item.value}
            active={state.ept_result === item.value}
            tone={item.value === "negative" ? "rose" : "teal"}
            onClick={() => update((draft) => {
              draft.ept_result = draft.ept_result === item.value ? "none" : item.value;
            })}
          >
            EPT {item.label}
          </Chip>
        ))}
      </div>
      <NoteInput value={state.vitalityNote} onChange={(value) => update((draft) => { draft.vitalityNote = value; })} />
    </Section>
  );
}

function RestorationSection({ toothNo, state, isPrimary }: { toothNo: number; state: ToothState; isPrimary: boolean }) {
  const update = (fn: (state: ToothState) => void) => updateToothState(toothNo, fn);
  const types: Array<{ value: RestorationType; label: string }> = [
    { value: "crown", label: "Crown" },
    { value: "bridge", label: "Bridge" },
    { value: "veneer", label: "Veneer" },
    { value: "onlay", label: "Onlay" },
    { value: "vonlay", label: "Vonlay" },
  ];
  const materials: Array<{ value: RestorationMaterial; label: string }> = [
    { value: "zircon", label: "Zirconia" },
    { value: "emax", label: "Emax" },
    { value: "metal", label: "Full metal" },
    { value: "pfm", label: "PFM" },
    { value: "pfz", label: "PFZ" },
  ];

  const chooseType = (type: RestorationType) => update((draft) => {
    if (draft.restorationType === type) {
      draft.restorationType = "none";
      draft.restorationMaterial = "none";
      draft.crownMaterial = "natural";
      draft.bridgePillar = false;
      return;
    }
    draft.restorationType = type;
    if (draft.restorationMaterial === "none") draft.restorationMaterial = "zircon";
    draft.crownMaterial = toCrownMaterial(draft.restorationMaterial);
    draft.bridgePillar = type === "bridge";
  });

  const chooseMaterial = (material: RestorationMaterial) => update((draft) => {
    draft.restorationMaterial = material;
    draft.crownMaterial = toCrownMaterial(material);
    draft.bridgePillar = draft.restorationType === "bridge";
  });

  return (
    <Section title="Restoration">
      {!isPrimary && (
        <div className="space-y-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
          <div className="flex flex-wrap items-center gap-2">
            <Chip
              active={state.postCore}
              onClick={() => update((draft) => {
                draft.postCore = !draft.postCore;
                if (!draft.postCore) {
                  draft.postCoreType = "none";
                  if (draft.endo === "endo-metal-pin" || draft.endo === "endo-glass-pin") draft.endo = "none";
                } else if (draft.postCoreType === "none") {
                  draft.postCoreType = "metal-post";
                  draft.endo = "endo-metal-pin";
                }
              })}
            >
              ใส่ Post & Core
            </Chip>
            {state.postCore && (
              <>
                <Chip
                  active={state.postCoreType === "metal-post"}
                  onClick={() => update((draft) => {
                    draft.postCore = true;
                    draft.postCoreType = "metal-post";
                    draft.endo = "endo-metal-pin";
                  })}
                >
                  Metal Post
                </Chip>
                <Chip
                  active={state.postCoreType === "fiber-post"}
                  onClick={() => update((draft) => {
                    draft.postCore = true;
                    draft.postCoreType = "fiber-post";
                    draft.endo = "endo-glass-pin";
                  })}
                >
                  Fiber Post
                </Chip>
              </>
            )}
          </div>
          {state.postCore && (
            <NoteInput
              label="Foundation note"
              value={state.postCoreNote}
              onChange={(value) => update((draft) => { draft.postCoreNote = value; })}
            />
          )}
        </div>
      )}

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <Chip
              key={type.value}
              active={state.restorationType === type.value}
              onClick={() => chooseType(type.value)}
            >
              {type.label}
            </Chip>
          ))}
        </div>
        {state.restorationType !== "none" && (
          <>
            <div className="flex flex-wrap gap-2">
              {materials.map((material) => (
                <Chip
                  key={material.value}
                  active={state.restorationMaterial === material.value}
                  onClick={() => chooseMaterial(material.value)}
                >
                  {material.label}
                </Chip>
              ))}
            </div>
            <NoteInput
              label="Final restoration note"
              value={state.restorationNote}
              onChange={(value) => update((draft) => { draft.restorationNote = value; })}
            />
          </>
        )}
      </div>
    </Section>
  );
}

function OthersSection({ toothNo, state, isPrimary }: { toothNo: number; state: ToothState; isPrimary: boolean }) {
  const update = (fn: (state: ToothState) => void) => updateToothState(toothNo, fn);
  const endos = [
    { value: "none", label: "No endo" },
    { value: "endo-medical-filling", label: "Medicated" },
    { value: "endo-filling", label: "Completed" },
    { value: "endo-filling-incomplete", label: "Incomplete" },
  ].filter((item) => !(isPrimary && !["none", "endo-medical-filling"].includes(item.value)));

  return (
    <Section title="Others">
      <div className="flex flex-wrap gap-2">
        <Chip
          active={state.fissureSealing}
          disabled={!FISSURE_ALLOWED.has(toothNo) || isPrimary}
          onClick={() => update((draft) => { draft.fissureSealing = !draft.fissureSealing; })}
        >
          Fissure Sealing
        </Chip>
        <Chip
          active={state.bruxismWear}
          onClick={() => update((draft) => { draft.bruxismWear = !draft.bruxismWear; })}
        >
          Bruxism
        </Chip>
        <Chip
          active={state.contactMesial || state.contactDistal}
          onClick={() => update((draft) => {
            const next = !(draft.contactMesial || draft.contactDistal);
            draft.contactMesial = next;
            draft.contactDistal = next;
          })}
        >
          Missing Contact
        </Chip>
        <Chip
          active={state.extractionPlan}
          tone="rose"
          onClick={() => update((draft) => { draft.extractionPlan = !draft.extractionPlan; })}
        >
          Extraction Plan
        </Chip>
      </div>
      <div className="flex flex-wrap gap-2">
        {endos.map((endo) => (
          <Chip
            key={endo.value}
            active={state.endo === endo.value}
            tone={endo.value === "none" ? "slate" : "teal"}
            onClick={() => update((draft) => { draft.endo = endo.value; })}
          >
            {endo.label}
          </Chip>
        ))}
      </div>
      <NoteInput value={state.othersNote} onChange={(value) => update((draft) => { draft.othersNote = value; })} />
    </Section>
  );
}

function ToothPath({ toothNo, state }: { toothNo: number; state: ToothState }) {
  const isPrimary = state.toothSelection === "milktooth";
  return (
    <div className="space-y-3">
      <CariesSection toothNo={toothNo} state={state} />
      <FillingSection toothNo={toothNo} state={state} isPrimary={isPrimary} />
      <PeriodontalSection toothNo={toothNo} state={state} />
      <VitalitySection toothNo={toothNo} state={state} />
      <RestorationSection toothNo={toothNo} state={state} isPrimary={isPrimary} />
      <OthersSection toothNo={toothNo} state={state} isPrimary={isPrimary} />
    </div>
  );
}

function EdentulousPath({ toothNo, state }: { toothNo: number; state: ToothState }) {
  const update = (fn: (state: ToothState) => void) => updateToothState(toothNo, fn);
  const branch = state.toothSelection === "tooth-under-gum" ? "impacted" : state.toothSelection === "none" ? "missing" : "none";

  return (
    <Section title="Edentulous area">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Chip
          active={branch === "missing"}
          onClick={() => replaceToothState(toothNo, makeSelectionState("none"))}
        >
          Missing / Extracted
        </Chip>
        <Chip
          active={branch === "impacted"}
          onClick={() => replaceToothState(toothNo, makeSelectionState("tooth-under-gum"))}
        >
          Impacted / Embedded
        </Chip>
      </div>

      {branch === "missing" && (
        <div className="flex flex-wrap gap-2">
          <Chip
            active={state.bridgeUnit === "removable"}
            onClick={() => update((draft) => { draft.bridgeUnit = draft.bridgeUnit === "removable" ? "none" : "removable"; })}
          >
            Removable Denture
          </Chip>
          <Chip
            active={state.bridgeUnit !== "none" && state.bridgeUnit !== "removable"}
            onClick={() => update((draft) => { draft.bridgeUnit = draft.bridgeUnit !== "none" && draft.bridgeUnit !== "removable" ? "none" : "zircon"; })}
          >
            Bridge Unit
          </Chip>
          <Chip
            active={state.extractionWound}
            tone="rose"
            onClick={() => update((draft) => { draft.extractionWound = !draft.extractionWound; })}
          >
            Extraction Wound
          </Chip>
        </div>
      )}

      {branch === "impacted" && (
        <div className="flex flex-wrap gap-2">
          <Chip
            active={state.extractionPlan}
            tone="rose"
            onClick={() => update((draft) => { draft.extractionPlan = !draft.extractionPlan; })}
          >
            Extraction Plan
          </Chip>
        </div>
      )}

      {branch !== "none" && (
        <NoteInput value={state.note} onChange={(value) => update((draft) => { draft.note = value; })} />
      )}
    </Section>
  );
}

function ImplantPath({ toothNo, state }: { toothNo: number; state: ToothState }) {
  const update = (fn: (state: ToothState) => void) => updateToothState(toothNo, fn);
  const components: Array<{ value: ImplantComponent; label: string }> = [
    { value: "cover-screw", label: "Cover Screw" },
    { value: "healing-abutment", label: "Healing Abutment" },
    { value: "crown", label: "Crown" },
    { value: "bridge", label: "Bridge" },
  ];
  const materials: Array<{ value: RestorationMaterial; label: string }> = [
    { value: "zircon", label: "Zirconia" },
    { value: "emax", label: "Emax" },
    { value: "metal", label: "Full metal" },
    { value: "pfm", label: "PFM" },
    { value: "pfz", label: "PFZ" },
  ];
  const hasProstheticTop = state.implant_component === "crown" || state.implant_component === "bridge";

  const chooseComponent = (component: ImplantComponent) => update((draft) => {
    draft.toothSelection = "implant";
    draft.implant_component = component;
    if (component === "cover-screw" || component === "healing-abutment") {
      draft.restorationMaterial = "none";
      draft.retention_type = "none";
      draft.crownMaterial = "natural";
      draft.crown_brand = "";
    } else if (component === "crown" || component === "bridge") {
      if (draft.restorationMaterial === "none") draft.restorationMaterial = "zircon";
      draft.crownMaterial = toCrownMaterial(draft.restorationMaterial);
      if (draft.retention_type === "none") draft.retention_type = "screw";
    }
  });

  return (
    <Section title="Implant">
      <TextInput
        label="Implant Brand"
        value={state.implant_brand}
        onChange={(value) => update((draft) => {
          draft.toothSelection = "implant";
          draft.implant_brand = value;
        })}
      />

      <div className="space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Component on Top</p>
        <div className="flex flex-wrap gap-2">
          {components.map((component) => (
            <Chip
              key={component.value}
              active={state.implant_component === component.value}
              onClick={() => chooseComponent(component.value)}
            >
              {component.label}
            </Chip>
          ))}
        </div>
      </div>

      {hasProstheticTop && (
        <>
          <div className="flex flex-wrap gap-2">
            {([
              { value: "screw", label: "Screw-retained" },
              { value: "cement", label: "Cement-retained" },
            ] as Array<{ value: ImplantRetentionType; label: string }>).map((item) => (
              <Chip
                key={item.value}
                active={state.retention_type === item.value}
                onClick={() => update((draft) => { draft.retention_type = item.value; })}
              >
                {item.label}
              </Chip>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {materials.map((material) => (
              <Chip
                key={material.value}
                active={state.restorationMaterial === material.value}
                onClick={() => update((draft) => {
                  draft.restorationMaterial = material.value;
                  draft.crownMaterial = toCrownMaterial(material.value);
                })}
              >
                {material.label}
              </Chip>
            ))}
          </div>
          <TextInput
            label="Crown Brand/Lab"
            value={state.crown_brand}
            onChange={(value) => update((draft) => { draft.crown_brand = value; })}
          />
        </>
      )}

      <NoteInput
        label="Component note"
        value={state.implantNote}
        onChange={(value) => update((draft) => { draft.implantNote = value; })}
      />
    </Section>
  );
}

function StatusChoice({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cx(
        "min-h-16 rounded-lg border px-4 py-3 text-left text-sm font-bold transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-teal-300",
        disabled
          ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
          : "border-slate-200 bg-white text-slate-800 hover:border-teal-400 hover:bg-teal-50"
      )}
    >
      {children}
    </button>
  );
}

export function OdontogramWizard() {
  const [snapshot, setSnapshot] = useState<OdontogramSnapshot>(() => getOdontogramSnapshot());
  const [step, setStep] = useState<1 | 2>(1);
  const [path, setPath] = useState<WizardPath>("tooth");
  const activeToothRef = useRef<number | null>(snapshot.activeTooth);
  const teeth = useMemo(() => getAllTeeth(), []);

  useEffect(() => {
    return subscribeOdontogram((nextSnapshot) => {
      setSnapshot(nextSnapshot);
      if (activeToothRef.current !== nextSnapshot.activeTooth) {
        activeToothRef.current = nextSnapshot.activeTooth;
        setStep(1);
        setPath(inferPath(nextSnapshot.state));
      }
    });
  }, []);

  const toothNo = snapshot.activeTooth;
  const state = snapshot.state;
  const activeIndex = toothNo == null ? -1 : teeth.indexOf(toothNo);
  const primaryAllowed = toothNo != null && canBePrimaryTooth(toothNo);

  const moveTooth = (direction: -1 | 1) => {
    if (activeIndex < 0) return;
    const nextIndex = (activeIndex + direction + teeth.length) % teeth.length;
    selectTooth(teeth[nextIndex]);
  };

  const chooseBase = (nextPath: WizardPath, toothSelection?: ToothState["toothSelection"]) => {
    if (toothNo == null) return;
    if (toothSelection) {
      replaceToothState(toothNo, makeSelectionState(toothSelection));
    }
    setPath(nextPath);
    setStep(2);
  };

  if (toothNo == null || !state) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center">
        <div className="max-w-xs">
          <p className="text-sm font-bold text-slate-700">Select a tooth</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">Click one tooth on the chart to open the wizard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="shrink-0 border-b border-slate-200 bg-white px-4 py-3">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Active Tooth</p>
            <p className="text-xl font-black text-slate-900">{snapshot.activeLabel}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              resetToothState(toothNo);
              setStep(1);
              setPath("tooth");
            }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50"
            aria-label="Reset tooth"
            title="Reset tooth"
          >
            <RotateCcw size={16} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => moveTooth(-1)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <ChevronLeft size={16} />
            Prev Tooth
          </button>
          <button
            type="button"
            onClick={() => moveTooth(1)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Next Tooth
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {step === 1 ? (
          <div className="space-y-3">
            <Section title="Base Status">
              <div className="grid grid-cols-1 gap-2">
                <StatusChoice onClick={() => chooseBase("tooth", "tooth-base")}>🦷 Permanent tooth</StatusChoice>
                <StatusChoice disabled={!primaryAllowed} onClick={() => chooseBase("tooth", "milktooth")}>🧒 Primary tooth</StatusChoice>
                <StatusChoice onClick={() => chooseBase("edentulous")}>🕳️ Edentulous area</StatusChoice>
                <StatusChoice onClick={() => chooseBase("implant", "implant")}>🔩 Implant</StatusChoice>
              </div>
            </Section>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <ChevronLeft size={16} />
              Back to Status
            </button>
            {path === "tooth" && <ToothPath toothNo={toothNo} state={state} />}
            {path === "edentulous" && <EdentulousPath toothNo={toothNo} state={state} />}
            {path === "implant" && <ImplantPath toothNo={toothNo} state={state} />}
          </div>
        )}
      </div>
    </div>
  );
}
