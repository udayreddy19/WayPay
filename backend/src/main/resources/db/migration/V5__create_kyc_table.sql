-- V5: Create KYC table
CREATE TABLE kyc_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    aadhaar_hash VARCHAR(255),
    pan_hash VARCHAR(255),
    aadhaar_last_four VARCHAR(4),
    pan_last_four VARCHAR(4),
    full_name VARCHAR(255),
    date_of_birth DATE,
    address TEXT,
    verification_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    rejection_reason TEXT,
    verified_at TIMESTAMP WITH TIME ZONE,
    document_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_kyc_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_kyc_user UNIQUE (user_id)
);

CREATE INDEX idx_kyc_user_id ON kyc_records (user_id);
CREATE INDEX idx_kyc_status ON kyc_records (verification_status);
