import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsUUID, IsObject, IsBoolean, IsEnum, IsArray, ValidateNested, ArrayMinSize, Min, Max, Matches, ValidateIf, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export enum RegionType {
  SCHEDULING = 'scheduling',
  REPORTS = 'reports',
  CUSTOMER_SEARCH = 'customer-search',
  SETTINGS = 'settings',
  QUICK_ACTIONS = 'quick-actions',
  ANALYTICS = 'analytics',
  TEAM_OVERVIEW = 'team-overview',
  FINANCIAL_SUMMARY = 'financial-summary',
  CUSTOM = 'custom'
}

export enum LayoutVersionStatus {
  DRAFT = 'draft',
  PREVIEW = 'preview',
  PUBLISHED = 'published'
}

export enum PrincipalType {
  USER = 'user',
  ROLE = 'role',
  TEAM = 'team'
}

export class CreateDashboardRegionDto {
  @ApiProperty({ description: 'Layout ID (optional if provided in URL)', required: false })
  @IsOptional()
  @IsUUID()
  layout_id?: string;

  @ApiProperty({ description: 'Region type', enum: RegionType })
  @IsEnum(RegionType)
  region_type!: RegionType;

  @ApiProperty({ description: 'Grid row position', default: 0, minimum: 0, maximum: 100 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0, { message: 'Grid row must be at least 0' })
  @Max(100, { message: 'Grid row must be at most 100' })
  grid_row?: number;

  @ApiProperty({ description: 'Grid column position', default: 0, minimum: 0, maximum: 11 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0, { message: 'Grid column must be at least 0' })
  @Max(11, { message: 'Grid column must be at most 11 (columns are 0-indexed)' })
  grid_col?: number;

  @ApiProperty({ description: 'Row span', default: 1, minimum: 1, maximum: 20 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1, { message: 'Row span must be at least 1' })
  @Max(20, { message: 'Row span must be at most 20' })
  row_span?: number;

  @ApiProperty({ description: 'Column span', default: 1, minimum: 1, maximum: 12 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1, { message: 'Column span must be at least 1' })
  @Max(12, { message: 'Column span must be at most 12' })
  col_span?: number;

  @ApiProperty({ description: 'Minimum width in pixels', default: 200, minimum: 100, maximum: 2000 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(100, { message: 'Minimum width must be at least 100 pixels' })
  @Max(2000, { message: 'Minimum width must be at most 2000 pixels' })
  min_width?: number;

  @ApiProperty({ description: 'Minimum height in pixels', default: 150, minimum: 100, maximum: 2000 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(100, { message: 'Minimum height must be at least 100 pixels' })
  @Max(2000, { message: 'Minimum height must be at most 2000 pixels' })
  min_height?: number;

  @ApiProperty({ description: 'Whether region is collapsed', default: false })
  @IsOptional()
  @IsBoolean()
  is_collapsed?: boolean;

  @ApiProperty({ description: 'Whether region is locked', default: false })
  @IsOptional()
  @IsBoolean()
  is_locked?: boolean;

  @ApiProperty({ description: 'Whether region is hidden on mobile', default: false })
  @IsOptional()
  @IsBoolean()
  is_hidden_mobile?: boolean;

  @ApiProperty({ description: 'Region configuration JSON', required: false })
  @IsOptional()
  @IsObject()
  config?: any;

  @ApiProperty({ description: 'Widget type', required: false })
  @IsOptional()
  @IsString()
  widget_type?: string;

  @ApiProperty({ description: 'Widget configuration JSON', required: false })
  @IsOptional()
  @IsObject()
  widget_config?: any;

  @ApiProperty({ description: 'Display order for drag/drop', default: 0, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0, { message: 'Display order must be at least 0' })
  display_order?: number;
}

/**
 * Region config DTO with XSS prevention
 */
export class RegionConfigDto {
  @ApiProperty({ description: 'Region title', required: false, maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Title must be less than 100 characters' })
  @Matches(/^[a-zA-Z0-9\s\-_]+$/, { message: 'Title contains invalid characters' })
  title?: string;

  @ApiProperty({ description: 'Description', required: false, maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description must be less than 500 characters' })
  description?: string;

  @ApiProperty({ description: 'Background color', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^(#[0-9A-Fa-f]{6}|rgb\(\d{1,3},\s?\d{1,3},\s?\d{1,3}\))$/, { message: 'Invalid color format' })
  backgroundColor?: string;

  @ApiProperty({ description: 'Header color', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^(#[0-9A-Fa-f]{6}|rgb\(\d{1,3},\s?\d{1,3},\s?\d{1,3}\))$/, { message: 'Invalid color format' })
  headerColor?: string;

  @ApiProperty({ description: 'Border color', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^(#[0-9A-Fa-f]{6}|rgb\(\d{1,3},\s?\d{1,3},\s?\d{1,3}\))$/, { message: 'Invalid color format' })
  borderColor?: string;

  @ApiProperty({ description: 'Font size', required: false, enum: ['small', 'medium', 'large'] })
  @IsOptional()
  @IsEnum(['small', 'medium', 'large'])
  fontSize?: 'small' | 'medium' | 'large';

  @ApiProperty({ description: 'Font family', required: false, maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  fontFamily?: string;

  @ApiProperty({ description: 'Padding in pixels', required: false, minimum: 0, maximum: 48 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(48)
  padding?: number;

  @ApiProperty({ description: 'Border radius in pixels', required: false, minimum: 0, maximum: 24 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(24)
  borderRadius?: number;

  @ApiProperty({ description: 'Shadow depth', required: false, minimum: 0, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(5)
  shadowDepth?: number;

  @ApiProperty({ description: 'Enable animations', required: false })
  @IsOptional()
  @IsBoolean()
  enableAnimations?: boolean;

  @ApiProperty({ description: 'Enable hover effects', required: false })
  @IsOptional()
  @IsBoolean()
  enableHoverEffects?: boolean;
}

export class UpdateDashboardRegionDto {
  @ApiProperty({ description: 'Version number for optimistic locking', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1, { message: 'Version must be at least 1' })
  version?: number;

  @ApiProperty({ description: 'Region type', required: false, enum: RegionType })
  @IsOptional()
  @IsEnum(RegionType)
  region_type?: RegionType;

  @ApiProperty({ description: 'Grid row position', required: false, minimum: 0, maximum: 100 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0, { message: 'Grid row must be at least 0' })
  @Max(100, { message: 'Grid row must be at most 100' })
  grid_row?: number;

  @ApiProperty({ description: 'Grid column position', required: false, minimum: 0, maximum: 11 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0, { message: 'Grid column must be at least 0' })
  @Max(11, { message: 'Grid column must be at most 11 (columns are 0-indexed)' })
  grid_col?: number;

  @ApiProperty({ description: 'Row span', required: false, minimum: 1, maximum: 20 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1, { message: 'Row span must be at least 1' })
  @Max(20, { message: 'Row span must be at most 20' })
  row_span?: number;

  @ApiProperty({ description: 'Column span', required: false, minimum: 1, maximum: 12 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1, { message: 'Column span must be at least 1' })
  @Max(12, { message: 'Column span must be at most 12' })
  col_span?: number;

  @ApiProperty({ description: 'Minimum width in pixels', required: false, minimum: 100, maximum: 2000 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(100, { message: 'Minimum width must be at least 100 pixels' })
  @Max(2000, { message: 'Minimum width must be at most 2000 pixels' })
  min_width?: number;

  @ApiProperty({ description: 'Minimum height in pixels', required: false, minimum: 100, maximum: 2000 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(100, { message: 'Minimum height must be at least 100 pixels' })
  @Max(2000, { message: 'Minimum height must be at most 2000 pixels' })
  min_height?: number;

  @ApiProperty({ description: 'Whether region is collapsed', required: false })
  @IsOptional()
  @IsBoolean()
  is_collapsed?: boolean;

  @ApiProperty({ description: 'Whether region is locked', required: false })
  @IsOptional()
  @IsBoolean()
  is_locked?: boolean;

  @ApiProperty({ description: 'Whether region is hidden on mobile', required: false })
  @IsOptional()
  @IsBoolean()
  is_hidden_mobile?: boolean;

  @ApiProperty({ description: 'Region configuration JSON', required: false })
  @IsOptional()
  @IsObject()
  @ValidateIf((o) => o.config !== undefined)
  @ValidateNested()
  @Type(() => RegionConfigDto)
  config?: RegionConfigDto;

  @ApiProperty({ description: 'Widget type', required: false })
  @IsOptional()
  @IsString()
  widget_type?: string;

  @ApiProperty({ description: 'Widget configuration JSON', required: false })
  @IsOptional()
  @IsObject()
  widget_config?: any;

  @ApiProperty({ description: 'Display order for drag/drop', required: false })
  @IsOptional()
  @IsNumber()
  display_order?: number;
}

export class DashboardRegionResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  layout_id!: string;

  @ApiProperty()
  tenant_id!: string;

  @ApiProperty()
  user_id!: string;

  @ApiProperty({ enum: RegionType })
  region_type!: RegionType;

  @ApiProperty()
  grid_row!: number;

  @ApiProperty()
  grid_col!: number;

  @ApiProperty()
  row_span!: number;

  @ApiProperty()
  col_span!: number;

  @ApiProperty()
  min_width!: number;

  @ApiProperty()
  min_height!: number;

  @ApiProperty()
  is_collapsed!: boolean;

  @ApiProperty()
  is_locked!: boolean;

  @ApiProperty()
  is_hidden_mobile!: boolean;

  @ApiProperty()
  config!: any;

  @ApiProperty({ required: false })
  widget_type?: string;

  @ApiProperty({ required: false })
  widget_config?: any;

  @ApiProperty()
  display_order!: number;

  @ApiProperty()
  created_at!: string;

  @ApiProperty()
  updated_at!: string;

  @ApiProperty({ required: false })
  deleted_at?: string;

  @ApiProperty({ description: 'Version for optimistic locking', required: false })
  version?: number;
}

export class RegionLayoutDto {
  @ApiProperty({ description: 'Grid rows', default: 2 })
  @IsNumber()
  rows!: number;

  @ApiProperty({ description: 'Grid columns', default: 2 })
  @IsNumber()
  cols!: number;

  @ApiProperty({ description: 'Grid gap in pixels', default: 16 })
  @IsNumber()
  gap!: number;
}

export class RegionPermissionSet {
  @ApiProperty({ description: 'Read permission', default: true })
  read!: boolean;

  @ApiProperty({ description: 'Edit permission', default: false })
  edit!: boolean;

  @ApiProperty({ description: 'Share permission', default: false })
  share!: boolean;
}

export class CreateRegionACLDto {
  @ApiProperty({ description: 'Region ID' })
  @IsUUID()
  region_id!: string;

  @ApiProperty({ description: 'Principal type', enum: PrincipalType })
  @IsEnum(PrincipalType)
  principal_type!: PrincipalType;

  @ApiProperty({ description: 'Principal ID (user, role, or team UUID)' })
  @IsUUID()
  principal_id!: string;

  @ApiProperty({ description: 'Permission set' })
  @ValidateNested()
  @Type(() => RegionPermissionSet)
  permission_set!: RegionPermissionSet;
}

export class UpdateRegionACLDto {
  @ApiProperty({ description: 'Permission set' })
  @ValidateNested()
  @Type(() => RegionPermissionSet)
  permission_set!: RegionPermissionSet;
}

export class RegionACLResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  region_id!: string;

  @ApiProperty({ enum: PrincipalType })
  principal_type!: PrincipalType;

  @ApiProperty()
  principal_id!: string;

  @ApiProperty()
  permission_set!: RegionPermissionSet;

  @ApiProperty()
  tenant_id!: string;

  @ApiProperty()
  created_at!: string;
}

export class CreateLayoutVersionDto {
  @ApiProperty({ description: 'Layout ID' })
  @IsUUID()
  layout_id!: string;

  @ApiProperty({ description: 'Version status', enum: LayoutVersionStatus, default: LayoutVersionStatus.DRAFT })
  @IsOptional()
  @IsEnum(LayoutVersionStatus)
  status?: LayoutVersionStatus;

  @ApiProperty({ description: 'Version notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class LayoutVersionResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  layout_id!: string;

  @ApiProperty()
  version_number!: number;

  @ApiProperty({ enum: LayoutVersionStatus })
  status!: LayoutVersionStatus;

  @ApiProperty()
  created_by!: string;

  @ApiProperty()
  created_at!: string;

  @ApiProperty({ required: false })
  diff?: any;

  @ApiProperty({ required: false })
  notes?: string;

  @ApiProperty()
  payload!: any;
}

export class PublishVersionDto {
  @ApiProperty({ description: 'Version ID to publish' })
  @IsUUID()
  version_id!: string;

  @ApiProperty({ description: 'Publish notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class ReorderRegionsDto {
  @ApiProperty({ description: 'Array of region IDs in new order' })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID(4, { each: true })
  region_ids!: string[];
}

export class WidgetManifestDto {
  @ApiProperty({ description: 'Widget ID (unique identifier)' })
  @IsString()
  widget_id!: string;

  @ApiProperty({ description: 'Widget name' })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Widget version' })
  @IsString()
  version!: string;

  @ApiProperty({ description: 'Widget description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Widget author', required: false })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiProperty({ description: 'Widget entry point URL' })
  @IsString()
  entry_point!: string;

  @ApiProperty({ description: 'Widget configuration schema', required: false })
  @IsOptional()
  @IsObject()
  config_schema?: any;

  @ApiProperty({ description: 'Required permissions', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];

  @ApiProperty({ description: 'PII tags', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  pii_tags?: string[];

  @ApiProperty({ description: 'Performance budget (ms)', required: false })
  @IsOptional()
  @IsNumber()
  performance_budget?: number;
}

export class RegisterWidgetDto {
  @ApiProperty({ description: 'Widget manifest' })
  @ValidateNested()
  @Type(() => WidgetManifestDto)
  manifest!: WidgetManifestDto;

  @ApiProperty({ description: 'Allowed tenant IDs', required: false })
  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true })
  allowed_tenants?: string[];

  @ApiProperty({ description: 'Whether widget is public', default: false })
  @IsOptional()
  @IsBoolean()
  is_public?: boolean;
}

export class WidgetRegistryResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  widget_id!: string;

  @ApiProperty()
  manifest!: WidgetManifestDto;

  @ApiProperty({ required: false })
  signature?: string;

  @ApiProperty({ required: false })
  allowed_tenants?: string[];

  @ApiProperty()
  is_public!: boolean;

  @ApiProperty()
  is_approved!: boolean;

  @ApiProperty({ required: false })
  created_by?: string;

  @ApiProperty()
  created_at!: string;

  @ApiProperty()
  updated_at!: string;
}

