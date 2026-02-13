# External Integrations

**Analysis Date:** 2025-02-13

## APIs & External Services

**LLM Providers:**
- Multiple Providers (Generic) - Planned support for various LLM providers such as OpenAI, Anthropic, or Gemini.
  - SDK/Client: Planned modular wrapper (referenced in `README.md`).
  - Auth: API Keys (referenced in `README.md`).

## Data Storage

**Databases:**
- None - No external database planned for MVP.

**File Storage:**
- Local Storage - Browser-based persistence for trees and nodes (referenced in TDD Section 2.1).

**Caching:**
- None - Not detected in current plans.

## Authentication & Identity

**Auth Provider:**
- Custom - API key management for LLM providers directly in the client (referenced in `README.md`).

## Monitoring & Observability

**Error Tracking:**
- None - Not detected.

**Logs:**
- Console - Likely approach for development.

## CI/CD & Deployment

**Hosting:**
- Not detected - Likely static hosting for the React application.

**CI Pipeline:**
- None - Not detected.

## Environment Configuration

**Required env vars:**
- LLM API Keys - Required for connectivity to AI services.

**Secrets location:**
- Not yet implemented - Likely `.env` files for local development.

## Webhooks & Callbacks

**Incoming:**
- None - Not detected.

**Outgoing:**
- None - Not detected.

---

*Integration audit: 2025-02-13*
