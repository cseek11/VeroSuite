import { IsString, IsEmail, IsUrl, IsOptional, MaxLength } from 'class-validator';

export class UpdateCompanySettingsDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  company_name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  state?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  zip_code?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  country?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  website?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  logo_url?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  header_logo_url?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  invoice_logo_url?: string;
}

export interface CompanySettingsResponseDto {
  id: string;
  tenant_id: string;
  company_name: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo_url: string | null;
  header_logo_url: string | null;  // Now required - database columns exist
  invoice_logo_url: string | null; // Now required - database columns exist
  created_at: Date;
  updated_at: Date;
}
