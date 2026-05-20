with open("src/components/odontogram/odontogram.ts", "r") as f:
    text = f.read()

index = text.find('buildSelect($("#toothSelect")')
print(text[index-100:index+200])
