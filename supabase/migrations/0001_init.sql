-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: scans
CREATE TABLE IF NOT EXISTS scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain TEXT NOT NULL,
    brand_description TEXT NOT NULL,
    custom_queries JSONB DEFAULT '[]'::jsonb,
    visibility_score NUMERIC NOT NULL DEFAULT 0,
    is_unlocked BOOLEAN NOT NULL DEFAULT false,
    unlocked_by_email TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table: scan_queries
CREATE TABLE IF NOT EXISTS scan_queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id UUID NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
    query_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table: scan_results
CREATE TABLE IF NOT EXISTS scan_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_query_id UUID NOT NULL REFERENCES scan_queries(id) ON DELETE CASCADE,
    model_name TEXT NOT NULL,
    raw_response TEXT NOT NULL,
    mentioned BOOLEAN NOT NULL DEFAULT false,
    competitors_mentioned JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'success',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table: domain_scan_limits
CREATE TABLE IF NOT EXISTS domain_scan_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain TEXT NOT NULL UNIQUE,
    last_scan_id UUID REFERENCES scans(id) ON DELETE SET NULL,
    last_scanned_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_scans_domain ON scans(domain);
CREATE INDEX IF NOT EXISTS idx_scan_queries_scan_id ON scan_queries(scan_id);
CREATE INDEX IF NOT EXISTS idx_scan_results_scan_query_id ON scan_results(scan_query_id);
CREATE INDEX IF NOT EXISTS idx_scan_results_created_at ON scan_results(created_at);
