@echo off
echo 🔍 Quick Supply Chain Attestation Check

echo.
echo == Checking for Attestations ==
docker buildx imagetools inspect kriaa693/getting-started-todo-app:latest --format "{{ range .Attestations }}{{.Type}}: ✅{{ end }}"

echo.
echo == Running Docker Scout ==
docker scout cves kriaa693/getting-started-todo-app:latest

echo.
echo ✅ If you see supply chain attestations as COMPLIANT above, the fix worked!
