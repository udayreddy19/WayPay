-- WayPay PostgreSQL Initialization
-- This script runs once when the container is first created

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Grant privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO waypay;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO waypay;

-- Log successful initialization
DO $$
BEGIN
    RAISE NOTICE 'WayPay database initialized successfully';
END $$;
