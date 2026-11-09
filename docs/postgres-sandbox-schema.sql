-- InvoiceGuard disposable PostgreSQL QA schema.
-- QA ONLY: this file is not a production migration and must not be applied
-- to the connected/shared database without an owner-approved migration.
BEGIN;

CREATE TABLE IF NOT EXISTS billing_events (
  id BIGSERIAL PRIMARY KEY,
  provider_event_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processing_status TEXT NOT NULL CHECK (
    processing_status IN ('received', 'processed', 'failed', 'ignored')
  ),
  failure_code TEXT,
  failure_message TEXT
);

CREATE TABLE IF NOT EXISTS entitlements (
  id BIGSERIAL PRIMARY KEY,
  account_ref TEXT NOT NULL,
  product_id TEXT NOT NULL,
  plan_tier TEXT NOT NULL CHECK (
    plan_tier IN ('free', 'pro', 'business', 'agency')
  ),
  provider_ref TEXT,
  status TEXT NOT NULL CHECK (
    status IN ('pending', 'active', 'revoked', 'expired')
  ),
  effective_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT entitlements_provider_ref_unique UNIQUE (provider_ref)
);

CREATE TABLE IF NOT EXISTS entitlement_events (
  id BIGSERIAL PRIMARY KEY,
  entitlement_id BIGINT NOT NULL REFERENCES entitlements(id) ON DELETE CASCADE,
  provider_event_id TEXT NOT NULL REFERENCES billing_events(provider_event_id),
  action TEXT NOT NULL CHECK (
    action IN ('created', 'activated', 'revoked', 'expired', 'updated')
  ),
  status TEXT NOT NULL CHECK (
    status IN ('pending', 'active', 'revoked', 'expired', 'failed')
  ),
  event_at TIMESTAMPTZ NOT NULL,
  correlation_ref TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_billing_events_status
  ON billing_events(processing_status);

CREATE INDEX IF NOT EXISTS idx_entitlements_account_status
  ON entitlements(account_ref, status);

CREATE INDEX IF NOT EXISTS idx_entitlement_events_entitlement
  ON entitlement_events(entitlement_id);

COMMIT;
