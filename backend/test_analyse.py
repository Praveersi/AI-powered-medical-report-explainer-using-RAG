import sys, json
sys.path.insert(0, ".")

from app.services.analyse_service import analyse_document

DOC_ID = "276af7dc-b70b-41a6-aa2c-ea1a05c90cf2"

result = analyse_document(DOC_ID)

print("\n=== SUMMARY ===")
print(result.summary)

print(f"\n=== FLAGS ({len(result.flags)}) ===")
for flag in result.flags:
    icon = "🔴" if flag.severity.value == "high" else \
           "🔵" if flag.severity.value == "low"  else \
           "🟡" if flag.severity.value == "borderline" else "🟢"
    print(f"\n{icon} {flag.name}: {flag.value} {flag.unit or ''}")
    print(f"   Range    : {flag.normal_range}")
    print(f"   Severity : {flag.severity.value}")
    print(f"   Explained: {flag.plain_english}")

print("\n=== DOCTOR QUESTIONS ===")
for i, q in enumerate(result.doctor_questions, 1):
    print(f"{i}. {q}")

print("\n=== DISCLAIMER ===")
print(result.disclaimer)