import re

with open("src/components/odontogram/odontogram.ts", "r") as f:
    text = f.read()

# Replace $("#id").addEventListener with $("#id")?.addEventListener
# But handle $(...).addEventListener in general if it matches simple ID
text = re.sub(r'\$\(("[^"]+")\)\.addEventListener', r'$(\1)?.addEventListener', text)
text = re.sub(r'toothNoteEl\.addEventListener', r'toothNoteEl?.addEventListener', text)
text = re.sub(r'statusToggle\.addEventListener', r'statusToggle?.addEventListener', text)
text = re.sub(r'controlsToggle\.addEventListener', r'controlsToggle?.addEventListener', text)
text = re.sub(r'btnEl\.addEventListener', r'btnEl?.addEventListener', text)

with open("src/components/odontogram/odontogram.ts", "w") as f:
    f.write(text)
