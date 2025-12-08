// Agreement types and interfaces

export type AgreementType = 
  | 'annual_pest_control'
  | 'monthly_pest_control'
  | 'annual_termite_renewal'
  | 'termite_bait_stations'
  | 'rat_monitoring';

export type AgreementStatus = 'active' | 'expired' | 'cancelled' | 'pending';

export interface AgreementData {
  agreements: AgreementType[];
  overdue_days: number;
  last_payment_date?: string;
  next_payment_date?: string;
  agreement_status: AgreementStatus;
}

export interface AccountWithAgreements {
  id: string;
  tenant_id: string;
  name: string;
  account_type: string;
  phone?: string;
  email?: string;
  billing_address?: string;
  ar_balance?: number;
  status?: string;
  created_at: string;
  updated_at: string;
  agreements: AgreementType[];
  overdue_days: number;
  last_payment_date?: string;
  next_payment_date?: string;
  agreement_status: AgreementStatus;
}

export interface AgreementIndicator {
  type: AgreementType;
  name: string;
  color: string;
  icon: string;
  tooltip: string;
}

export const AGREEMENT_CONFIG: Record<AgreementType, AgreementIndicator> = {
  annual_pest_control: {
    type: 'annual_pest_control',
    name: 'Annual Pest Control Agreement',
    color: 'bg-green-500',
    icon: 'Shield',
    tooltip: 'Annual Pest Control Agreement'
  },
  monthly_pest_control: {
    type: 'monthly_pest_control',
    name: 'Monthly Pest Control Agreement',
    color: 'bg-blue-500',
    icon: 'Shield',
    tooltip: 'Monthly Pest Control Agreement'
  },
  annual_termite_renewal: {
    type: 'annual_termite_renewal',
    name: 'Annual Termite Renewal',
    color: 'bg-yellow-500',
    icon: 'Shield',
    tooltip: 'Annual Termite Renewal'
  },
  termite_bait_stations: {
    type: 'termite_bait_stations',
    name: 'Termite Bait Stations',
    color: 'bg-orange-500',
    icon: 'Shield',
    tooltip: 'Termite Bait Stations'
  },
  rat_monitoring: {
    type: 'rat_monitoring',
    name: 'Active Rat Monitoring',
    color: 'bg-purple-500',
    icon: 'Shield',
    tooltip: 'Active Rat Monitoring'
  }
};
