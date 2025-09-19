@echo off
echo 🔍 Docker Supply Chain Attestation Verification

echo.
echo == 1. Basic Image Info ==
docker images kriaa693/getting-started-todo-app

echo.
echo == 2. Detailed Attestation Inspection ==
docker buildx imagetools inspect kriaa693/getting-started-todo-app:latest --format "{{json .}}" > image-details.json
echo Image details saved to image-details.json

echo.
echo == 3. Check for SBOM ==
docker buildx imagetools inspect kriaa693/getting-started-todo-app:latest --format "{{ range .Attestations }}{{ if eq .Type \"application/spdx+json\" }}✅ SBOM Found{{ end }}{{ end }}"

echo.
echo == 4. Check for Provenance ==
docker buildx imagetools inspect kriaa693/getting-started-todo-app:latest --format "{{ range .Attestations }}{{ if eq .Type \"application/vnd.in-toto+json\" }}✅ Provenance Found{{ end }}{{ end }}"

echo.
echo == 5. Platform Information ==
docker buildx imagetools inspect kriaa693/getting-started-todo-app:latest --format "{{ range .Manifest.Platforms }}Platform: {{.OS}}/{{.Architecture}}{{ end }}"

echo.
echo == 6. Docker Scout Compliance Check ==
docker scout cves kriaa693/getting-started-todo-app:latest

echo.
echo == 7. Cosign Verification (if signed) ==
if exist cosign.pub (
    echo Verifying signature...
    cosign verify --key cosign.pub kriaa693/getting-started-todo-app:latest
) else (
    echo No cosign.pub found - image not signed with cosign
)

echo.
echo 📋 Verification complete!
echo Check the output above for compliance status.
