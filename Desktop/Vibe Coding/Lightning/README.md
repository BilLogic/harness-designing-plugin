# Lightning

EcoeLed Smart Lighting Platform (易壳照明智慧平台) — a smart street lighting management system for monitoring and controlling 5,000+ IoT-connected street lights.

## Contents

### Smart Lighting Platform Reference (`易壳照明智慧平台/`)

Screenshots and reference materials for the EcoeLed Smart Lighting Management Platform, including UI views for:
- Dashboard and asset management
- Monitoring and alert reports
- Energy management
- Inspection and maintenance workflows
- Custom reports

### Software Resource Package (`交大软件资料包/`)

Java middleware deployment package for the smart lighting platform, including:
- Application launcher scripts (Linux/Windows)
- Library dependencies (JARs)
- Deployment manual and training guide

> **Note:** The Java dependencies in this package are outdated and contain known security vulnerabilities. See `docs/solutions/security-issues/` for details and remediation guidance.

## Documentation

- `docs/solutions/` — Documented findings from code review, including security vulnerabilities and remediation strategies.

## Security Notice

This repository's code review identified critical security issues in the Java middleware dependencies (including Log4Shell). See the full analysis at `docs/solutions/security-issues/log4shell-outdated-deps-repo-hygiene.md`.
