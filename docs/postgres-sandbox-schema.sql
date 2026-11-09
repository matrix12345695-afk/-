-- InvoiceGuard disposable PostgreSQL QA fixture.
-- QA ONLY: TEMP tables mirror the current Paddle sandbox adapter contract.
-- Run on ONE session connected only to the dedicated disposable database
-- qualisift_qa_c415. These tables are session-local and disappear when the
-- connection closes. Never run this file against a shared/production database.
-- The native QA helper creates equivalent TEMP tables itself; this file is
-- provided for manual inspection/reproduction, not as a production migration.

CREATE TEMP TABLE paddle_webhook_events (
  event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  resource_key TEXT NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL
) ON COMMIT PRESERVE ROWS;

CREATE TEMP TABLE paddle_entitlements (
  resource_key TEXT PRIMARY KEY,
  customer_id TEXT,
  subscription_id TEXT,
  transaction_id TEXT,
  status TEXT NOT NULL CHECK (
    status IN ('active', 'past_due', 'paused', 'canceled')
  ),
  valid_until TIMESTAMPTZ,
  occurred_at TIMESTAMPTZ NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL,
  source_event_id TEXT NOT NULL
    REFERENCES paddle_webhook_events(event_id),
  CONSTRAINT active_requires_paid_through CHECK (
    status <> 'active'
    OR (
      customer_id IS NOT NULL
      AND subscription_id IS NOT NULL
      AND valid_until IS NOT NULL
    )
  ),
  CONSTRAINT revoked_has_no_paid_through CHECK (
    status = 'active' OR valid_until IS NULL
  )
) ON COMMIT PRESERVE ROWS;

CREATE TEMP TABLE paddle_account_customers (
  account_id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL UNIQUE,
  verified_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  CONSTRAINT paddle_account_customers_verified_before_revoked_check CHECK (
    revoked_at IS NULL
    OR verified_at IS NULL
    OR revoked_at >= verified_at
  )
) ON COMMIT PRESERVE ROWS;

CREATE TEMP TABLE paddle_product_bindings (
  resource_key TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  price_id TEXT NOT NULL,
  environment TEXT NOT NULL CHECK (environment = 'sandbox'),
  source_event_id TEXT NOT NULL
    REFERENCES paddle_webhook_events(event_id)
) ON COMMIT PRESERVE ROWS;

CREATE INDEX idx_paddle_entitlements_customer
  ON paddle_entitlements(customer_id);
CREATE INDEX idx_paddle_entitlements_subscription
  ON paddle_entitlements(subscription_id);
CREATE INDEX idx_paddle_product_bindings_product
  ON paddle_product_bindings(product_id);

-- Failure-injection checks belong only in a separate test fixture. The
-- native QA probe adds a temporary CHECK constraint for its synthetic
-- evt_c464_fail event so the adapter can prove atomic rollback.
