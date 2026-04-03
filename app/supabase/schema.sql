-- Monstr Phase 01 Database Schema
-- Run this in the Supabase dashboard SQL editor (Settings > SQL Editor)
-- Requires: pg_net extension for database webhooks

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS pg_net;

-- ============================================================
-- Tables
-- ============================================================

-- Organizations
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  plan text NOT NULL DEFAULT 'vekst',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Departments (defined before users because users.department_id references it)
CREATE TABLE departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  keywords text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Users (extends Supabase auth.users)
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'salgssjef', 'teammedlem')),
  department_id uuid REFERENCES departments(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Leads
CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  department_id uuid REFERENCES departments(id) ON DELETE SET NULL,
  first_name text NOT NULL,
  last_name text,
  email text,
  phone text,
  company text,
  description text,
  source text NOT NULL DEFAULT 'webhook',
  status text NOT NULL DEFAULT 'ny'
    CHECK (status IN ('ny', 'sms_sendt', 'venter', 'fulgt_opp', 'booket', 'ikke_relevant')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Push tokens (for APNs)
CREATE TABLE push_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token text NOT NULL,
  platform text NOT NULL CHECK (platform IN ('ios', 'android', 'web')),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, platform)
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;

-- Organizations: users can read their own org
CREATE POLICY "Users read own org"
  ON organizations FOR SELECT
  USING (id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

-- Departments: users can read departments in their org
CREATE POLICY "Users read own org departments"
  ON departments FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

-- Users: users can read members of their own org
CREATE POLICY "Users read own org users"
  ON users FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

-- Users: users can update their own record
CREATE POLICY "Users update own record"
  ON users FOR UPDATE
  USING (id = auth.uid());

-- Leads: users can read leads in their org
CREATE POLICY "Users read own org leads"
  ON leads FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

-- Leads: users can update leads in their org (status changes)
CREATE POLICY "Users update own org leads"
  ON leads FOR UPDATE
  USING (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

-- Push tokens: users can manage only their own tokens
CREATE POLICY "Users manage own push tokens"
  ON push_tokens FOR ALL
  USING (user_id = auth.uid());

-- ============================================================
-- Realtime
-- ============================================================

-- Enable realtime for leads table so dashboard updates live
ALTER PUBLICATION supabase_realtime ADD TABLE leads;

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX leads_organization_id_idx ON leads (organization_id);
CREATE INDEX leads_status_idx ON leads (status);
CREATE INDEX leads_created_at_idx ON leads (created_at DESC);
CREATE INDEX users_organization_id_idx ON users (organization_id);
CREATE INDEX push_tokens_user_id_idx ON push_tokens (user_id);
