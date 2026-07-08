-- V4: Create transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_wallet_id UUID,
    to_wallet_id UUID,
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    type VARCHAR(30) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    stripe_payment_id VARCHAR(255),
    stripe_checkout_session_id VARCHAR(255),
    payment_method VARCHAR(50),
    description TEXT,
    metadata JSONB DEFAULT '{}',
    failure_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_txn_from_wallet FOREIGN KEY (from_wallet_id) REFERENCES wallets(id),
    CONSTRAINT fk_txn_to_wallet FOREIGN KEY (to_wallet_id) REFERENCES wallets(id),
    CONSTRAINT chk_txn_amount CHECK (amount > 0)
);

CREATE INDEX idx_txn_from_wallet ON transactions (from_wallet_id);
CREATE INDEX idx_txn_to_wallet ON transactions (to_wallet_id);
CREATE INDEX idx_txn_status ON transactions (status);
CREATE INDEX idx_txn_type ON transactions (type);
CREATE INDEX idx_txn_stripe_payment ON transactions (stripe_payment_id);
CREATE INDEX idx_txn_stripe_session ON transactions (stripe_checkout_session_id);
CREATE INDEX idx_txn_created_at ON transactions (created_at DESC);
