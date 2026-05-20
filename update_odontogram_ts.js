const fs = require('fs');
const file = '/Users/chefthanathip/Repositories/DentalC3/src/components/odontogram/odontogram.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/function updateSelectionUI\(\) \{[\s\S]*?\}\n/, `function updateSelectionUI() {
  $$(".tooth-tile").forEach(tile => {
    const toothNo = Number(tile.dataset.tooth);
    tile.classList.toggle("active", selectedTeeth.has(toothNo));
  });
  if (typeof updateSelectionFilterButtons === 'function') {
    try { updateSelectionFilterButtons(); } catch (e) {}
  }
  if (typeof updateActiveLabel === 'function') {
    try { updateActiveLabel(); } catch (e) {}
  }
  if (typeof notifyStateChange === 'function') {
    notifyStateChange();
  }
}\n`);

// Append the new functions
code += `
// --- React Integration Exports ---
type OdontogramListener = () => void;
const listeners = new Set<OdontogramListener>();
export function subscribeOdontogram(listener: OdontogramListener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
export function notifyStateChange() {
  listeners.forEach(l => l());
}
export function getActiveTooth(): number | null { return activeTooth; }
export function getToothState(toothNo: number): ToothState { return toothState.get(toothNo) || defaultState(); }
export function setToothState(toothNo: number, state: Partial<ToothState>) {
  const current = getToothState(toothNo);
  toothState.set(toothNo, { ...current, ...state });
  applyStateToSvg(toothNo);
  notifyStateChange();
}
export function nextTooth() {
  if (!activeTooth) return;
  const idx = ALL_TEETH.indexOf(activeTooth);
  if (idx < ALL_TEETH.length - 1) {
    activeTooth = ALL_TEETH[idx + 1];
    selectedTeeth = new Set([activeTooth]);
    updateSelectionUI();
  }
}
export function prevTooth() {
  if (!activeTooth) return;
  const idx = ALL_TEETH.indexOf(activeTooth);
  if (idx > 0) {
    activeTooth = ALL_TEETH[idx - 1];
    selectedTeeth = new Set([activeTooth]);
    updateSelectionUI();
  }
}
export function setGlobalEdentulousState() {
  setEdentulous(true);
  notifyStateChange();
}
export function setGlobalPrimary() {
  setEdentulous(false);
  suppressEdentulousSync = true;
  for (const toothNo of ALL_TEETH) {
    const s = defaultState();
    if (PRIMARY_MILK.has(toothNo)) {
      s.toothSelection = "milktooth";
    } else {
      s.toothSelection = "none";
    }
    toothState.set(toothNo, s);
    applyStateToSvg(toothNo);
    updateToothTileNumber(toothNo);
  }
  suppressEdentulousSync = false;
  notifyStateChange();
}
export function setGlobalMixed() {
  setEdentulous(false);
  suppressEdentulousSync = true;
  for (const toothNo of ALL_TEETH) {
    const s = defaultState();
    if (MIXED_PERMANENT.has(toothNo)) {
      s.toothSelection = "tooth-base";
    } else if (MIXED_MILK.has(toothNo)) {
      s.toothSelection = "milktooth";
    } else if (MIXED_NONE.has(toothNo)) {
      s.toothSelection = "none";
    }
    toothState.set(toothNo, s);
    applyStateToSvg(toothNo);
    updateToothTileNumber(toothNo);
  }
  suppressEdentulousSync = false;
  notifyStateChange();
}
export function resetAllGlobal() {
  setEdentulous(false);
  for (const toothNo of ALL_TEETH) {
    toothState.set(toothNo, defaultState());
    applyStateToSvg(toothNo);
    updateToothTileNumber(toothNo);
  }
  notifyStateChange();
}
`;

fs.writeFileSync(file, code, 'utf8');
