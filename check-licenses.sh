#!/bin/bash

# Script to check for AGPL v3 licenses and suggest alternatives

echo "🔍 Checking for AGPL v3 licenses..."

# Check backend dependencies
echo "📦 Backend dependencies:"
cd backend && npx license-checker --onlyAllow 'MIT;Apache-2.0;BSD;ISC;LGPL;GPL-2.0;GPL-3.0' --summary 2>/dev/null || echo "license-checker not installed. Run: npm install -g license-checker"

# Check client dependencies  
echo "📦 Client dependencies:"
cd ../client && npx license-checker --onlyAllow 'MIT;Apache-2.0;BSD;ISC;LGPL;GPL-2.0;GPL-3.0' --summary 2>/dev/null || echo "license-checker not installed. Run: npm install -g license-checker"

echo ""
echo "🚨 AGPL v3 License Issues and Solutions:"
echo ""
echo "If AGPL v3 packages are found, consider these alternatives:"
echo ""
echo "Common AGPL packages and their MIT/Apache alternatives:"
echo "❌ ghostscript → ✅ pdf-lib (MIT)"
echo "❌ mongodb (Community) → ✅ mongodb (drivers are Apache)"
echo "❌ elastic search (some versions) → ✅ opensearch (Apache)"
echo "❌ grafana (AGPL) → ✅ prometheus + custom dashboards (Apache)"
echo ""
echo "💡 Options for AGPL compliance:"
echo "1. Replace with MIT/Apache alternatives (recommended)"
echo "2. Obtain commercial license from vendor"
echo "3. Open source your application under AGPL"
echo "4. Use hosted services instead of self-hosting"
echo ""
echo "🔧 To fix vulnerabilities run:"
echo "npm audit fix --force"
