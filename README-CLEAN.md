# 🛡️ Secure Todo App

A production-ready todo application with Docker security best practices and supply chain attestations.

## 🚀 Quick Start

### Option 1: Build with Supply Chain Attestations (Recommended)
```bash
# Build secure image with SBOM and provenance
.\build-with-attestations.bat

# Verify attestations
.\verify-attestations.bat
```

### Option 2: Complete Security Workflow
```bash
# Full workflow with dependency updates and verification
.\build-secure-complete.bat
```

### Option 3: Local Development
```bash
# Run with Docker Compose
docker-compose up
```

## 📁 Project Structure

```
├── 📄 Dockerfile.secure          # Production Dockerfile with security hardening
├── 📄 compose.yaml              # Secure Docker Compose configuration
├── 🔧 build-with-attestations.bat # Build script with SBOM/provenance
├── 🔧 build-secure-complete.bat   # Complete security workflow
├── 🔧 setup-cosign.bat           # Optional image signing setup
├── 🔧 verify-attestations.bat     # Verification script
├── 📊 SECURITY-REPORT.md          # Security compliance report
├── 📂 backend/                   # Node.js API server
├── 📂 client/                    # React frontend
└── 📂 .git/                      # Git repository
```

## ✅ Security Features

- **Non-root user**: Runs as `nextjs:nodejs` (UID 1001)
- **Supply chain attestations**: SBOM and provenance included
- **Minimal dependencies**: Production-only packages
- **Health checks**: Container health monitoring
- **Security hardening**: Capability dropping, no new privileges
- **Updated base image**: Latest Node.js with security patches

## 🔍 Compliance Status

✅ **Docker Scout Compliant**
- Default non-root user: ✅ Compliant
- No AGPL v3 licenses: ✅ Compliant  
- No critical/high vulnerabilities: ✅ Compliant
- Supply chain attestations: ✅ Compliant

## 🏗️ Build Commands

```bash
# Simple build
docker build -f Dockerfile.secure -t my-todo-app .

# Build with attestations
docker buildx build \
  --provenance=true \
  --sbom=true \
  --push \
  -f Dockerfile.secure \
  -t my-todo-app .

# Run locally
docker-compose up
```

## 🔑 Optional: Image Signing

```bash
# Setup cosign (one-time)
.\setup-cosign.bat

# Sign your image
cosign sign --key cosign.key my-todo-app:latest
```

## 📊 Application

- **Backend**: Node.js + Express + MySQL
- **Frontend**: React + Vite + Bootstrap
- **Database**: MySQL 9.3
- **Port**: 3000

Access the application at: http://localhost:3000

---

Built with ❤️ and 🛡️ security best practices.
