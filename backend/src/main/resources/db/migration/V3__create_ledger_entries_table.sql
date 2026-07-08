-- V3: Create ledger entries table (double-entry bookkeeping)
CREATE TABLE ledger_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL,
    type VARCHAR(30) NOT NULL,
    credit DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    debit DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    balance_after DECIMAL(15, 2) NOT NULL,
    reference VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_ledger_wallet FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE,
    CONSTRAINT chk_ledger_credit CHECK (credit >= 0),
    CONSTRAINT chk_ledger_debit CHECK (debit >= 0),
    CONSTRAINT chk_ledger_entry CHECK (
        (credit > 0 AND debit = 0) OR (credit = 0 AND debit > 0)
    )
);

CREATE INDEX idx_ledger_wallet_id ON ledger_entries (wallet_id);
CREATE INDEX idx_ledger_type ON ledger_entries (type);
CREATE INDEX idx_ledger_reference ON ledger_entries (reference);
CREATE INDEX idx_ledger_created_at ON ledger_entries (created_at DESC);
