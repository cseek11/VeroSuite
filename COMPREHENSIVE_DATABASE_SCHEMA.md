# 🗄️ Comprehensive Pest Control Database Schema Design

## 📊 **Current Schema Analysis**

### **Existing Strengths**
- ✅ Multi-tenant architecture with proper isolation
- ✅ Comprehensive customer management (accounts, locations)
- ✅ Service tracking (work orders, jobs, service history)
- ✅ Communication and notes system
- ✅ Compliance and chemical tracking
- ✅ Photo and document management
- ✅ Audit logging

### **Areas for Enhancement**
- 🔄 Customer segmentation needs expansion
- 🔄 Service types need categorization
- 🔄 Scheduling and routing optimization
- 🔄 Financial management enhancement
- 🔄 Analytics and reporting expansion

## 🏗️ **Enhanced Database Schema**

### **1. Customer Segmentation & Service Types**

#### **Customer Segments Table**
```sql
CREATE TABLE customer_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenant(id),
  segment_name VARCHAR(100) NOT NULL,
  segment_code VARCHAR(20) NOT NULL UNIQUE,
  description TEXT,
  default_service_types JSONB,
  pricing_tier VARCHAR(20) DEFAULT 'standard',
  compliance_requirements JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, segment_code)
);

-- Segment Types: residential, commercial, industrial, property_management, 
-- real_estate, healthcare, education, government, agriculture, specialty
```

#### **Service Categories Table**
```sql
CREATE TABLE service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenant(id),
  category_name VARCHAR(100) NOT NULL,
  category_code VARCHAR(20) NOT NULL UNIQUE,
  description TEXT,
  applicable_segments JSONB,
  estimated_duration INTEGER DEFAULT 60,
  base_price DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, category_code)
);

-- Categories: general_pest, termite_control, rodent_control, bed_bugs,
-- mosquito_control, wildlife_control, seasonal_services, emergency_services
```

#### **Service Types Table**
```sql
CREATE TABLE service_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenant(id),
  category_id UUID REFERENCES service_categories(id),
  service_name VARCHAR(100) NOT NULL,
  service_code VARCHAR(20) NOT NULL UNIQUE,
  description TEXT,
  required_equipment JSONB,
  required_chemicals JSONB,
  safety_requirements JSONB,
  compliance_requirements JSONB,
  estimated_duration INTEGER DEFAULT 60,
  base_price DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, service_code)
);
```

### **2. Enhanced Customer Management**

#### **Customer Profiles Table**
```sql
CREATE TABLE customer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenant(id),
  account_id UUID NOT NULL REFERENCES accounts(id),
  segment_id UUID REFERENCES customer_segments(id),
  
  -- Business Information
  business_name VARCHAR(255),
  business_type VARCHAR(100),
  tax_id VARCHAR(50),
  credit_limit DECIMAL(10,2),
  credit_score INTEGER,
  credit_check_date DATE,
  
  -- Property Information
  property_type VARCHAR(50),
  property_size VARCHAR(50),
  year_built INTEGER,
  square_footage INTEGER,
  
  -- Access Information
  access_codes TEXT,
  gate_codes TEXT,
  key_locations TEXT,
  special_instructions TEXT,
  
  -- Communication Preferences
  preferred_language VARCHAR(20) DEFAULT 'English',
  timezone VARCHAR(20) DEFAULT 'UTC',
  communication_methods JSONB,
  
  -- Contract Information
  contract_start_date DATE,
  contract_end_date DATE,
  contract_type VARCHAR(50),
  contract_value DECIMAL(10,2),
  auto_renew BOOLEAN DEFAULT false,
  cancellation_policy TEXT,
  
  -- Status Information
  account_status VARCHAR(20) DEFAULT 'active',
  payment_status VARCHAR(20) DEFAULT 'current',
  service_status VARCHAR(20) DEFAULT 'scheduled',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, account_id)
);
```

#### **Customer Contacts Table**
```sql
CREATE TABLE customer_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenant(id),
  account_id UUID NOT NULL REFERENCES accounts(id),
  contact_type VARCHAR(20) NOT NULL, -- primary, secondary, emergency, billing
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(20),
  mobile VARCHAR(20),
  position VARCHAR(100),
  is_primary BOOLEAN DEFAULT false,
  is_emergency_contact BOOLEAN DEFAULT false,
  preferred_contact_method VARCHAR(20),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, account_id, contact_type)
);
```

### **3. Advanced Scheduling & Routing**

#### **Service Areas Table**
```sql
CREATE TABLE service_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenant(id),
  area_name VARCHAR(100) NOT NULL,
  area_code VARCHAR(20) NOT NULL UNIQUE,
  description TEXT,
  boundaries GEOGRAPHY(POLYGON),
  center_lat DECIMAL(10,8),
  center_lng DECIMAL(11,8),
  estimated_travel_time INTEGER, -- minutes
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, area_code)
);
```

#### **Technician Skills Matrix**
```sql
CREATE TABLE technician_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenant(id),
  technician_id UUID NOT NULL REFERENCES users(id),
  service_type_id UUID NOT NULL REFERENCES service_types(id),
  skill_level VARCHAR(20) DEFAULT 'basic', -- basic, intermediate, expert
  certification_required BOOLEAN DEFAULT false,
  certification_expiry DATE,
  training_completed_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, technician_id, service_type_id)
);
```

#### **Scheduling Rules Table**
```sql
CREATE TABLE scheduling_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenant(id),
  rule_name VARCHAR(100) NOT NULL,
  rule_type VARCHAR(50) NOT NULL, -- availability, capacity, travel_time, weather
  rule_conditions JSONB,
  rule_actions JSONB,
  priority INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **4. Enhanced Financial Management**

#### **Pricing Tiers Table**
```sql
CREATE TABLE pricing_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenant(id),
  tier_name VARCHAR(100) NOT NULL,
  tier_code VARCHAR(20) NOT NULL UNIQUE,
  description TEXT,
  base_multiplier DECIMAL(5,2) DEFAULT 1.00,
  minimum_contract_value DECIMAL(10,2),
  payment_terms INTEGER DEFAULT 30, -- days
  late_fee_percentage DECIMAL(5,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, tier_code)
);
```

#### **Service Pricing Table**
```sql
CREATE TABLE service_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenant(id),
  service_type_id UUID NOT NULL REFERENCES service_types(id),
  pricing_tier_id UUID NOT NULL REFERENCES pricing_tiers(id),
  base_price DECIMAL(10,2) NOT NULL,
  hourly_rate DECIMAL(10,2),
  minimum_charge DECIMAL(10,2),
  travel_fee DECIMAL(10,2),
  emergency_fee DECIMAL(10,2),
  effective_date DATE NOT NULL,
  expiry_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, service_type_id, pricing_tier_id, effective_date)
);
```

#### **Payment Methods Table**
```sql
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenant(id),
  account_id UUID NOT NULL REFERENCES accounts(id),
  payment_type VARCHAR(20) NOT NULL, -- credit_card, ach, check, cash, cod
  payment_name VARCHAR(100),
  account_number VARCHAR(50),
  routing_number VARCHAR(20),
  card_type VARCHAR(20),
  card_last4 VARCHAR(4),
  card_expiry VARCHAR(7),
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, account_id, payment_type)
);
```

### **5. Compliance & Documentation**

#### **Compliance Requirements Table**
```sql
CREATE TABLE compliance_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenant(id),
  requirement_name VARCHAR(255) NOT NULL,
  requirement_type VARCHAR(50) NOT NULL, -- epa, fda, usda, state, local
  applicable_segments JSONB,
  applicable_service_types JSONB,
  frequency VARCHAR(20), -- daily, weekly, monthly, quarterly, annually
  documentation_required BOOLEAN DEFAULT true,
  auto_reminder BOOLEAN DEFAULT true,
  reminder_days INTEGER DEFAULT 30,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **Compliance Records Table**
```sql
CREATE TABLE compliance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenant(id),
  account_id UUID NOT NULL REFERENCES accounts(id),
  requirement_id UUID NOT NULL REFERENCES compliance_requirements(id),
  service_id UUID REFERENCES jobs(id),
  status VARCHAR(20) DEFAULT 'pending', -- pending, completed, overdue, waived
  due_date DATE NOT NULL,
  completion_date DATE,
  completed_by UUID REFERENCES users(id),
  documentation_url VARCHAR(500),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **6. Analytics & Reporting**

#### **Customer Analytics Table**
```sql
CREATE TABLE customer_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenant(id),
  account_id UUID NOT NULL REFERENCES accounts(id),
  metric_date DATE NOT NULL,
  metric_type VARCHAR(50) NOT NULL, -- lifetime_value, service_frequency, payment_history
  metric_value DECIMAL(15,4),
  metric_metadata JSONB,
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, account_id, metric_date, metric_type)
);
```

#### **Service Analytics Table**
```sql
CREATE TABLE service_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenant(id),
  service_type_id UUID REFERENCES service_types(id),
  service_area_id UUID REFERENCES service_areas(id),
  technician_id UUID REFERENCES users(id),
  metric_date DATE NOT NULL,
  metric_type VARCHAR(50) NOT NULL, -- completion_time, customer_satisfaction, efficiency
  metric_value DECIMAL(15,4),
  metric_metadata JSONB,
  calculated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **7. Communication & Marketing**

#### **Communication Templates Table**
```sql
CREATE TABLE communication_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenant(id),
  template_name VARCHAR(100) NOT NULL,
  template_type VARCHAR(50) NOT NULL, -- email, sms, letter, notification
  subject VARCHAR(255),
  content TEXT NOT NULL,
  variables JSONB, -- template variables
  applicable_segments JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **Automated Communications Table**
```sql
CREATE TABLE automated_communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenant(id),
  account_id UUID NOT NULL REFERENCES accounts(id),
  template_id UUID REFERENCES communication_templates(id),
  trigger_type VARCHAR(50) NOT NULL, -- service_reminder, payment_reminder, follow_up
  trigger_conditions JSONB,
  scheduled_date TIMESTAMPTZ,
  sent_date TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'pending', -- pending, sent, failed, cancelled
  recipient_contact_id UUID REFERENCES customer_contacts(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **8. Mobile & Field Operations**

#### **Field Equipment Table**
```sql
CREATE TABLE field_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenant(id),
  equipment_name VARCHAR(100) NOT NULL,
  equipment_type VARCHAR(50) NOT NULL, -- vehicle, sprayer, monitor, safety_gear
  serial_number VARCHAR(100),
  assigned_technician_id UUID REFERENCES users(id),
  service_area_id UUID REFERENCES service_areas(id),
  maintenance_schedule JSONB,
  last_maintenance_date DATE,
  next_maintenance_date DATE,
  status VARCHAR(20) DEFAULT 'active', -- active, maintenance, retired
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **Inventory Management Table**
```sql
CREATE TABLE inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenant(id),
  item_name VARCHAR(100) NOT NULL,
  item_type VARCHAR(50) NOT NULL, -- chemical, equipment, safety_gear, office_supplies
  sku VARCHAR(50) UNIQUE,
  description TEXT,
  unit_of_measure VARCHAR(20),
  current_stock INTEGER DEFAULT 0,
  minimum_stock INTEGER DEFAULT 0,
  reorder_point INTEGER,
  supplier_info JSONB,
  cost_per_unit DECIMAL(10,2),
  expiry_date DATE,
  storage_location VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🔗 **Key Relationships & Indexes**

### **Critical Indexes**
```sql
-- Customer lookup optimization
CREATE INDEX idx_accounts_tenant_segment ON accounts(tenant_id, account_type);
CREATE INDEX idx_customer_profiles_tenant_status ON customer_profiles(tenant_id, account_status);

-- Service scheduling optimization
CREATE INDEX idx_jobs_tenant_technician_date ON jobs(tenant_id, technician_id, scheduled_date);
CREATE INDEX idx_jobs_tenant_status_date ON jobs(tenant_id, status, scheduled_date);
CREATE INDEX idx_jobs_tenant_area_date ON jobs(tenant_id, service_area_id, scheduled_date);

-- Financial optimization
CREATE INDEX idx_service_pricing_tenant_service ON service_pricing(tenant_id, service_type_id);
CREATE INDEX idx_customer_analytics_tenant_date ON customer_analytics(tenant_id, metric_date);

-- Compliance optimization
CREATE INDEX idx_compliance_records_tenant_due ON compliance_records(tenant_id, due_date);
CREATE INDEX idx_compliance_records_tenant_status ON compliance_records(tenant_id, status);
```

### **Geographic Indexes**
```sql
-- Location-based queries
CREATE INDEX idx_locations_geography ON locations USING GIST(boundaries);
CREATE INDEX idx_service_areas_geography ON service_areas USING GIST(boundaries);
```

## 📊 **Data Migration Strategy**

### **Phase 1: Schema Enhancement**
1. Add new tables without breaking existing functionality
2. Create data migration scripts for existing data
3. Implement new features alongside existing ones

### **Phase 2: Data Population**
1. Populate customer segments and service types
2. Migrate existing customer data to new profile structure
3. Set up compliance requirements and pricing tiers

### **Phase 3: Feature Rollout**
1. Enable new scheduling and routing features
2. Implement enhanced financial management
3. Activate analytics and reporting capabilities

## 🎯 **Performance Considerations**

### **Partitioning Strategy**
- Partition large tables by tenant_id and date
- Use table partitioning for historical data
- Implement archiving for old records

### **Caching Strategy**
- Cache frequently accessed customer data
- Cache service area and routing information
- Implement Redis for session and temporary data

### **Query Optimization**
- Use materialized views for complex analytics
- Implement query result caching
- Optimize indexes based on usage patterns

This comprehensive schema design provides a robust foundation for the pest control customer management system while maintaining backward compatibility with existing data.
