import re

with open("src/components/odontogram/odontogram.ts", "r") as f:
    text = f.read()

# Replace $("#id").checked = ... with if ($("#id")) $("#id").checked = ...
def repl_checked(match):
    id_str = match.group(1)
    val = match.group(2)
    return f'if ($({id_str})) $({id_str}).checked = {val}'

text = re.sub(r'\$\(("[^"]+")\)\.checked = (.*)', repl_checked, text)

# Replace $("#id").value = ... with if ($("#id")) $("#id").value = ...
def repl_value(match):
    id_str = match.group(1)
    val = match.group(2)
    return f'if ($({id_str})) $({id_str}).value = {val}'

text = re.sub(r'\$\(("[^"]+")\)\.value = (.*)', repl_value, text)

# Safely set toothNoteEl.value = state.note || ""
text = text.replace(
    'toothNoteEl.value = state.note || "";',
    'if (toothNoteEl) toothNoteEl.value = state.note || "";'
)

with open("src/components/odontogram/odontogram.ts", "w") as f:
    f.write(text)
