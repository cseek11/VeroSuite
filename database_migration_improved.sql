-- Improved Migration: Separate tables for agreements and payments
-- Run this in your Supabase SQL editor

-- Create agreements table
CREATE TABLE IF NOT EXISTS agreements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  account_id UUID NOT NULL,
  agreement_type TEXT NOT NULL CHECK (agreement_type IN (
    'annual_pest_control',
    'monthly_pest_control', 
    'annual_termite_renewal',
    'termite_bait_stations',
    'rat_monitoring'
  )),
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled', 'pending')),
  monthly_amount DECIMAL(10,2),
  annual_amount DECIMAL(10,2),
  auto_renewal BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Foreign key constraints
  CONSTRAINT fk_agreements_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT fk_agreements_account FOREIGN KEY (account_id, tenant_id) REFERENCES accounts(id, tenant_id) ON DELETE CASCADE,
  
  -- Unique constraint: one active agreement per type per account
  CONSTRAINT unique_active_agreement UNIQUE (account_id, agreement_type, status)
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  account_id UUID NOT NULL,
  agreement_id UUID,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  overdue_days INTEGER DEFAULT 0,
  payment_method TEXT,
  reference_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Foreign key constraints
  CONSTRAINT fk_payments_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT fk_payments_account FOREIGN KEY (account_id, tenant_id) REFERENCES accounts(id, tenant_id) ON DELETE CASCADE,
  CONSTRAINT fk_payments_agreement FOREIGN KEY (agreement_id) REFERENCES agreements(id) ON DELETE SET NULL
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_agreements_tenant_account ON agreements(tenant_id, account_id);
CREATE INDEX IF NOT EXISTS idx_agreements_type_status ON agreements(agreement_type, status);
CREATE INDEX IF NOT EXISTS idx_agreements_dates ON agreements(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_payments_tenant_account ON payments(tenant_id, account_id);
CREATE INDEX IF NOT EXISTS idx_payments_due_date ON payments(due_date);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_overdue ON payments(overdue_days) WHERE overdue_days > 0;

-- Enable RLS
ALTER TABLE agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY tenant_isolation_agreements ON agreements
  USING (tenant_id = current_setting('app.tenant_id')::uuid);

CREATE POLICY tenant_isolation_payments ON payments
  USING (tenant_id = current_setting('app.tenant_id')::uuid);

-- Functions for automatic overdue calculation
CREATE OR REPLACE FUNCTION calculate_overdue_days()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.paid_date IS NULL AND NEW.due_date < CURRENT_DATE THEN
    NEW.overdue_days = CURRENT_DATE - NEW.due_date;
    NEW.status = 'overdue';
  ELSE
    NEW.overdue_days = 0;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically calculate overdue days
CREATE TRIGGER trigger_calculate_overdue_days
  BEFORE INSERT OR UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION calculate_overdue_days();

-- Function to get account agreement summary
CREATE OR REPLACE FUNCTION get_account_agreement_summary(account_uuid UUID)
RETURNS TABLE (
  account_id UUID,
  active_agreements TEXT[],
  total_overdue_days INTEGER,
  next_payment_date DATE,
  total_monthly_amount DECIMAL(10,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id as account_id,
    ARRAY_AGG(DISTINCT ag.agreement_type) as active_agreements,
    COALESCE(MAX(p.overdue_days), 0) as total_overdue_days,
    MIN(p.due_date) FILTER (WHERE p.status = 'pending') as next_payment_date,
    SUM(ag.monthly_amount) FILTER (WHERE ag.status = 'active') as total_monthly_amount
  FROM accounts a
  LEFT JOIN agreements ag ON ag.account_id = a.id AND ag.status = 'active'
  LEFT JOIN payments p ON p.account_id = a.id AND p.status IN ('pending', 'overdue')
  WHERE a.id = account_uuid
  GROUP BY a.id;
END;
$$ LANGUAGE plpgsql;

-- Add comments
COMMENT ON TABLE agreements IS 'Stores customer service agreements with start/end dates and amounts';
COMMENT ON TABLE payments IS 'Stores payment records with due dates and overdue tracking';
COMMENT ON FUNCTION get_account_agreement_summary IS 'Returns summary of agreements and payments for an account';
