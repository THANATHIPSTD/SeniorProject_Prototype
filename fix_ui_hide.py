import re
with open('/Users/chefthanathip/Repositories/DentalC3/src/components/odontogram/OdontogramUI.tsx', 'r') as f:
    content = f.read()

# Change '{step === 1 && (' to '<div className={step === 1 ? "" : "hidden"}>'
content = content.replace('{step === 1 && (', '<div className={step === 1 ? "" : "hidden"}>')
# Change ')}' closing step 1 to '</div>'
content = content.replace('</SectionCard>\n                )}', '</SectionCard>\n                </div>')

# Change '{step === 2 && (' to '<div className={step === 2 ? "space-y-4" : "hidden"}>'
content = content.replace('{step === 2 && (\n                    <div className="space-y-4">', '<div className={step === 2 ? "space-y-4" : "hidden"}>')
# We need to replace the last ')}' of step 2 with '</div>'
# But since this is fragile, let's just do a manual replace using regex
content = re.sub(r'\{step === 1 && \(\s*(<SectionCard.*?</SectionCard>)\s*\)\}', r'<div className={step === 1 ? "" : "hidden"}>\1</div>', content, flags=re.DOTALL)

with open('/Users/chefthanathip/Repositories/DentalC3/src/components/odontogram/OdontogramUI.tsx', 'w') as f:
    f.write(content)
