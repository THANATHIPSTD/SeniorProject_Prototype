with open("src/components/odontogram/odontogram.ts", "r") as f:
    text = f.read()

# Make buildSelect safe
text = text.replace(
'''function buildSelect(selectEl: Any, options: Any, onChange: Any) {
  selectEl.innerHTML = "";''',
'''function buildSelect(selectEl: Any, options: Any, onChange: Any) {
  if (!selectEl) return;
  selectEl.innerHTML = "";''')

# Make setSelectOptions safe
text = text.replace(
'''function setSelectOptions(selectEl: Any, options: Any, activeValue: Any) {
  selectEl.innerHTML = "";''',
'''function setSelectOptions(selectEl: Any, options: Any, activeValue: Any) {
  if (!selectEl) return;
  selectEl.innerHTML = "";''')

# Make simple inputs safe
import re
text = re.sub(r'\$\(("\#btnOcclView")\)\.addEventListener', r'$( \1 )?.addEventListener', text)
text = re.sub(r'\$\(("\#btnWisdomVisible")\)\.addEventListener', r'$( \1 )?.addEventListener', text)
text = re.sub(r'\$\(("\#btnBoneVisible")\)\.addEventListener', r'$( \1 )?.addEventListener', text)
text = re.sub(r'\$\(("\#btnPulpVisible")\)\.addEventListener', r'$( \1 )?.addEventListener', text)

text = re.sub(r'\$\(("\#btnSelectNone")\)\.addEventListener', r'$( \1 )?.addEventListener', text)
text = re.sub(r'\$\(("\#btnSelectNoneChart")\)\.addEventListener', r'$( \1 )?.addEventListener', text)
text = re.sub(r'\$\(("\#btnEdentulous")\)\.addEventListener', r'$( \1 )?.addEventListener', text)

# For status extras
text = text.replace(
'''    $("#statusExtraApply").addEventListener("click", () => {''',
'''    $("#statusExtraApply")?.addEventListener("click", () => {''')

with open("src/components/odontogram/odontogram.ts", "w") as f:
    f.write(text)
