import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Use the existing tenant ID from the user's metadata
  const tenantId = 'fb39f15b-b382-4525-8404-1e32ca1486c9';
  
  // Check if tenant exists, if not create it
  let tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
  });

  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: {
        id: tenantId,
        name: 'VeroPest Solutions',
        domain: 'veropest.com',
        status: 'active',
        subscription_tier: 'premium',
      },
    });
    console.log('✅ Created tenant:', tenant.name);
  } else {
    console.log('✅ Using existing tenant:', tenant.name);
  }

  // Create customer segments
  const segments = await Promise.all([
    prisma.customerSegment.create({
      data: {
        tenant_id: tenant.id,
        segment_name: 'Residential',
        segment_code: 'RES',
        description: 'Homeowners and residential properties',
        pricing_tier: 'standard',
        default_service_types: ['general_pest', 'termite_control', 'rodent_control'],
      },
    }),
    prisma.customerSegment.create({
      data: {
        tenant_id: tenant.id,
        segment_name: 'Commercial',
        segment_code: 'COM',
        description: 'Commercial businesses and offices',
        pricing_tier: 'premium',
        default_service_types: ['general_pest', 'termite_control', 'bed_bugs', 'compliance'],
      },
    }),
    prisma.customerSegment.create({
      data: {
        tenant_id: tenant.id,
        segment_name: 'Industrial',
        segment_code: 'IND',
        description: 'Industrial facilities and warehouses',
        pricing_tier: 'enterprise',
        default_service_types: ['general_pest', 'rodent_control', 'compliance', 'specialty'],
      },
    }),
    prisma.customerSegment.create({
      data: {
        tenant_id: tenant.id,
        segment_name: 'Property Management',
        segment_code: 'PM',
        description: 'Property management companies',
        pricing_tier: 'premium',
        default_service_types: ['general_pest', 'termite_control', 'bed_bugs', 'multi_unit'],
      },
    }),
    prisma.customerSegment.create({
      data: {
        tenant_id: tenant.id,
        segment_name: 'Healthcare',
        segment_code: 'HC',
        description: 'Healthcare facilities and hospitals',
        pricing_tier: 'enterprise',
        default_service_types: ['general_pest', 'compliance', 'specialty', 'emergency'],
      },
    }),
  ]);

  console.log('✅ Created customer segments:', segments.length);

  // Create service categories
  const categories = await Promise.all([
    prisma.serviceCategory.create({
      data: {
        tenant_id: tenant.id,
        category_name: 'General Pest Control',
        category_code: 'GPC',
        description: 'General pest control services',
        estimated_duration: 60,
        base_price: 150.00,
        applicable_segments: ['RES', 'COM', 'IND', 'PM', 'HC'],
      },
    }),
    prisma.serviceCategory.create({
      data: {
        tenant_id: tenant.id,
        category_name: 'Termite Control',
        category_code: 'TC',
        description: 'Termite inspection and treatment',
        estimated_duration: 120,
        base_price: 300.00,
        applicable_segments: ['RES', 'COM', 'IND', 'PM'],
      },
    }),
    prisma.serviceCategory.create({
      data: {
        tenant_id: tenant.id,
        category_name: 'Bed Bug Treatment',
        category_code: 'BBT',
        description: 'Bed bug inspection and treatment',
        estimated_duration: 180,
        base_price: 500.00,
        applicable_segments: ['RES', 'COM', 'PM', 'HC'],
      },
    }),
    prisma.serviceCategory.create({
      data: {
        tenant_id: tenant.id,
        category_name: 'Rodent Control',
        category_code: 'RC',
        description: 'Rodent control and exclusion',
        estimated_duration: 90,
        base_price: 250.00,
        applicable_segments: ['RES', 'COM', 'IND', 'PM'],
      },
    }),
    prisma.serviceCategory.create({
      data: {
        tenant_id: tenant.id,
        category_name: 'Compliance Services',
        category_code: 'CS',
        description: 'Regulatory compliance services',
        estimated_duration: 60,
        base_price: 200.00,
        applicable_segments: ['COM', 'IND', 'HC'],
      },
    }),
  ]);

  console.log('✅ Created service categories:', categories.length);

  // Create service types
  const serviceTypes = await Promise.all([
    prisma.serviceType.create({
      data: {
        tenant_id: tenant.id,
        category_id: categories[0].id, // General Pest Control
        service_name: 'Standard Pest Control',
        service_code: 'GPC_STD',
        description: 'Standard pest control treatment',
        estimated_duration: 60,
        base_price: 150.00,
        required_equipment: ['sprayer', 'safety_gear'],
        required_chemicals: ['general_pesticide'],
      },
    }),
    prisma.serviceType.create({
      data: {
        tenant_id: tenant.id,
        category_id: categories[1].id, // Termite Control
        service_name: 'Termite Inspection',
        service_code: 'TC_INSP',
        description: 'Comprehensive termite inspection',
        estimated_duration: 90,
        base_price: 200.00,
        required_equipment: ['moisture_meter', 'inspection_tools'],
      },
    }),
    prisma.serviceType.create({
      data: {
        tenant_id: tenant.id,
        category_id: categories[2].id, // Bed Bug Treatment
        service_name: 'Bed Bug Heat Treatment',
        service_code: 'BBT_HEAT',
        description: 'Heat treatment for bed bugs',
        estimated_duration: 240,
        base_price: 800.00,
        required_equipment: ['heat_equipment', 'temperature_monitors'],
      },
    }),
    prisma.serviceType.create({
      data: {
        tenant_id: tenant.id,
        category_id: categories[3].id, // Rodent Control
        service_name: 'Rodent Exclusion',
        service_code: 'RC_EXCL',
        description: 'Rodent exclusion and prevention',
        estimated_duration: 120,
        base_price: 350.00,
        required_equipment: ['exclusion_materials', 'tools'],
      },
    }),
    prisma.serviceType.create({
      data: {
        tenant_id: tenant.id,
        category_id: categories[4].id, // Compliance Services
        service_name: 'HACCP Compliance',
        service_code: 'CS_HACCP',
        description: 'HACCP compliance for food industry',
        estimated_duration: 90,
        base_price: 300.00,
        required_equipment: ['inspection_tools', 'documentation'],
      },
    }),
  ]);

  console.log('✅ Created service types:', serviceTypes.length);

  // Create pricing tiers
  const pricingTiers = await Promise.all([
    prisma.pricingTier.create({
      data: {
        tenant_id: tenant.id,
        tier_name: 'Standard',
        tier_code: 'STD',
        description: 'Standard pricing tier',
        base_multiplier: 1.00,
        payment_terms: 30,
        late_fee_percentage: 1.50,
      },
    }),
    prisma.pricingTier.create({
      data: {
        tenant_id: tenant.id,
        tier_name: 'Premium',
        tier_code: 'PREM',
        description: 'Premium pricing tier',
        base_multiplier: 1.25,
        payment_terms: 30,
        late_fee_percentage: 1.00,
      },
    }),
    prisma.pricingTier.create({
      data: {
        tenant_id: tenant.id,
        tier_name: 'Enterprise',
        tier_code: 'ENT',
        description: 'Enterprise pricing tier',
        base_multiplier: 1.50,
        payment_terms: 45,
        late_fee_percentage: 0.50,
      },
    }),
  ]);

  console.log('✅ Created pricing tiers:', pricingTiers.length);

  // Create service pricing
  const servicePricing = await Promise.all([
    // Standard tier pricing
    prisma.servicePricing.create({
      data: {
        tenant_id: tenant.id,
        service_type_id: serviceTypes[0].id,
        pricing_tier_id: pricingTiers[0].id,
        base_price: 150.00,
        hourly_rate: 75.00,
        travel_fee: 25.00,
        effective_date: new Date(),
      },
    }),
    prisma.servicePricing.create({
      data: {
        tenant_id: tenant.id,
        service_type_id: serviceTypes[1].id,
        pricing_tier_id: pricingTiers[0].id,
        base_price: 200.00,
        hourly_rate: 100.00,
        travel_fee: 25.00,
        effective_date: new Date(),
      },
    }),
    // Premium tier pricing
    prisma.servicePricing.create({
      data: {
        tenant_id: tenant.id,
        service_type_id: serviceTypes[0].id,
        pricing_tier_id: pricingTiers[1].id,
        base_price: 187.50,
        hourly_rate: 93.75,
        travel_fee: 25.00,
        effective_date: new Date(),
      },
    }),
    prisma.servicePricing.create({
      data: {
        tenant_id: tenant.id,
        service_type_id: serviceTypes[2].id,
        pricing_tier_id: pricingTiers[1].id,
        base_price: 1000.00,
        hourly_rate: 250.00,
        travel_fee: 50.00,
        effective_date: new Date(),
      },
    }),
  ]);

  console.log('✅ Created service pricing:', servicePricing.length);

  // Create sample accounts
  const accounts = await Promise.all([
    prisma.account.create({
      data: {
        tenant_id: tenant.id,
        name: 'John Smith Residence',
        account_type: 'residential',
        phone: '(555) 123-4567',
        email: 'john.smith@email.com',
        address: '123 Main Street',
        city: 'Anytown',
        state: 'CA',
        zip_code: '90210',
        property_type: 'single_family',
        property_size: '2000 sq ft',
        ar_balance: 0.00,
      },
    }),
    prisma.account.create({
      data: {
        tenant_id: tenant.id,
        name: 'Downtown Office Complex',
        account_type: 'commercial',
        phone: '(555) 987-6543',
        email: 'manager@downtownoffice.com',
        address: '456 Business Blvd',
        city: 'Anytown',
        state: 'CA',
        zip_code: '90211',
        property_type: 'office_building',
        property_size: '5000 sq ft',
        ar_balance: 0.00,
      },
    }),
    prisma.account.create({
      data: {
        tenant_id: tenant.id,
        name: 'City General Hospital',
        account_type: 'healthcare',
        phone: '(555) 456-7890',
        email: 'facilities@cityhospital.com',
        address: '789 Medical Center Dr',
        city: 'Anytown',
        state: 'CA',
        zip_code: '90212',
        property_type: 'hospital',
        property_size: '50000 sq ft',
        ar_balance: 0.00,
      },
    }),
  ]);

  console.log('✅ Created sample accounts:', accounts.length);

  // Create customer profiles
  const customerProfiles = await Promise.all([
    prisma.customerProfile.create({
      data: {
        tenant_id: tenant.id,
        account_id: accounts[0].id,
        segment_id: segments[0].id, // Residential
        business_name: null,
        property_type: 'single_family',
        property_size: '2000 sq ft',
        year_built: 1995,
        square_footage: 2000,
        preferred_language: 'English',
        timezone: 'America/Los_Angeles',
        account_status: 'active',
        payment_status: 'current',
        service_status: 'scheduled',
      },
    }),
    prisma.customerProfile.create({
      data: {
        tenant_id: tenant.id,
        account_id: accounts[1].id,
        segment_id: segments[1].id, // Commercial
        business_name: 'Downtown Office Complex LLC',
        business_type: 'office_management',
        property_type: 'office_building',
        property_size: '5000 sq ft',
        year_built: 2005,
        square_footage: 5000,
        preferred_language: 'English',
        timezone: 'America/Los_Angeles',
        account_status: 'active',
        payment_status: 'current',
        service_status: 'scheduled',
      },
    }),
    prisma.customerProfile.create({
      data: {
        tenant_id: tenant.id,
        account_id: accounts[2].id,
        segment_id: segments[4].id, // Healthcare
        business_name: 'City General Hospital',
        business_type: 'healthcare',
        property_type: 'hospital',
        property_size: '50000 sq ft',
        year_built: 2010,
        square_footage: 50000,
        preferred_language: 'English',
        timezone: 'America/Los_Angeles',
        account_status: 'active',
        payment_status: 'current',
        service_status: 'scheduled',
      },
    }),
  ]);

  console.log('✅ Created customer profiles:', customerProfiles.length);

  // Create customer contacts
  const customerContacts = await Promise.all([
    prisma.customerContact.create({
      data: {
        tenant_id: tenant.id,
        account_id: accounts[0].id,
        contact_type: 'primary',
        first_name: 'John',
        last_name: 'Smith',
        email: 'john.smith@email.com',
        phone: '(555) 123-4567',
        is_primary: true,
        preferred_contact_method: 'email',
      },
    }),
    prisma.customerContact.create({
      data: {
        tenant_id: tenant.id,
        account_id: accounts[1].id,
        contact_type: 'primary',
        first_name: 'Sarah',
        last_name: 'Johnson',
        email: 'sarah.johnson@downtownoffice.com',
        phone: '(555) 987-6543',
        position: 'Facility Manager',
        is_primary: true,
        preferred_contact_method: 'phone',
      },
    }),
    prisma.customerContact.create({
      data: {
        tenant_id: tenant.id,
        account_id: accounts[2].id,
        contact_type: 'primary',
        first_name: 'Dr. Michael',
        last_name: 'Brown',
        email: 'michael.brown@cityhospital.com',
        phone: '(555) 456-7890',
        position: 'Facilities Director',
        is_primary: true,
        preferred_contact_method: 'email',
      },
    }),
  ]);

  console.log('✅ Created customer contacts:', customerContacts.length);

  // Create communication templates
  const communicationTemplates = await Promise.all([
    prisma.communicationTemplate.create({
      data: {
        tenant_id: tenant.id,
        template_name: 'Service Reminder',
        template_type: 'email',
        subject: 'Upcoming Pest Control Service',
        content: 'Dear {{customer_name}},\n\nThis is a reminder that your pest control service is scheduled for {{service_date}} at {{service_time}}.\n\nPlease ensure access to the property and remove any items that may interfere with treatment.\n\nIf you need to reschedule, please contact us at least 24 hours in advance.\n\nThank you,\n{{company_name}}',
        variables: ['customer_name', 'service_date', 'service_time', 'company_name'],
        applicable_segments: ['RES', 'COM', 'IND', 'PM', 'HC'],
      },
    }),
    prisma.communicationTemplate.create({
      data: {
        tenant_id: tenant.id,
        template_name: 'Payment Reminder',
        template_type: 'email',
        subject: 'Payment Due Reminder',
        content: 'Dear {{customer_name}},\n\nThis is a friendly reminder that payment of ${{amount}} is due on {{due_date}}.\n\nYou can make your payment online at {{payment_link}} or contact us for other payment options.\n\nThank you for your business,\n{{company_name}}',
        variables: ['customer_name', 'amount', 'due_date', 'payment_link', 'company_name'],
        applicable_segments: ['RES', 'COM', 'IND', 'PM', 'HC'],
      },
    }),
  ]);

  console.log('✅ Created communication templates:', communicationTemplates.length);

  // Create compliance requirements
  const complianceRequirements = await Promise.all([
    prisma.complianceRequirement.create({
      data: {
        tenant_id: tenant.id,
        requirement_name: 'HACCP Pest Control',
        requirement_type: 'fda',
        applicable_segments: ['HC'],
        applicable_service_types: ['CS_HACCP'],
        frequency: 'monthly',
        documentation_required: true,
        auto_reminder: true,
        reminder_days: 7,
      },
    }),
    prisma.complianceRequirement.create({
      data: {
        tenant_id: tenant.id,
        requirement_name: 'EPA Chemical Usage Log',
        requirement_type: 'epa',
        applicable_segments: ['COM', 'IND', 'HC'],
        applicable_service_types: ['GPC_STD', 'TC_INSP', 'BBT_HEAT', 'RC_EXCL'],
        frequency: 'quarterly',
        documentation_required: true,
        auto_reminder: true,
        reminder_days: 14,
      },
    }),
  ]);

  console.log('✅ Created compliance requirements:', complianceRequirements.length);

  console.log('🎉 Database seeding completed successfully!');
  console.log(`📊 Created:`);
  console.log(`   - 1 Tenant`);
  console.log(`   - ${segments.length} Customer Segments`);
  console.log(`   - ${categories.length} Service Categories`);
  console.log(`   - ${serviceTypes.length} Service Types`);
  console.log(`   - ${pricingTiers.length} Pricing Tiers`);
  console.log(`   - ${servicePricing.length} Service Pricing Records`);
  console.log(`   - ${accounts.length} Sample Accounts`);
  console.log(`   - ${customerProfiles.length} Customer Profiles`);
  console.log(`   - ${customerContacts.length} Customer Contacts`);
  console.log(`   - ${communicationTemplates.length} Communication Templates`);
  console.log(`   - ${complianceRequirements.length} Compliance Requirements`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
