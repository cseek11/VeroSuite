import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with 10 Pittsburgh area customers...');

  // Get the first tenant (assuming you have at least one)
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) {
    console.error('❌ No tenant found. Please create a tenant first.');
    return;
  }

  const customers = [
    {
      name: 'Downtown Pittsburgh Office Complex',
      email: 'sarah.johnson@downtownoffice.com',
      phone: '(412) 555-0123',
      address: '500 Grant St',
      city: 'Pittsburgh',
      state: 'PA',
      zip_code: '15219',
      billing_address: '500 Grant St, Pittsburgh, PA 15219',
      payment_method: 'credit_card',
      billing_cycle: 'monthly',
      status: 'active',
      property_type: 'office_building',
      property_size: 'large',
      access_instructions: 'Main entrance, security badge required',
      emergency_contact: 'Sarah Johnson - (412) 555-0123',
      preferred_contact_method: 'email',
      ar_balance: 450.00,
      account_type: 'commercial'
    },
    {
      name: 'Oakland University District',
      email: 'mchen@pitt.edu',
      phone: '(412) 555-0456',
      address: '456 Forbes Ave',
      city: 'Pittsburgh',
      state: 'PA',
      zip_code: '15213',
      billing_address: '456 Forbes Ave, Pittsburgh, PA 15213',
      payment_method: 'check',
      billing_cycle: 'quarterly',
      status: 'active',
      property_type: 'university',
      property_size: 'large',
      access_instructions: 'Student housing access, contact security',
      emergency_contact: 'Dr. Michael Chen - (412) 555-0456',
      preferred_contact_method: 'phone',
      ar_balance: 0.00,
      account_type: 'commercial'
    },
    {
      name: 'Strip District Restaurant Row',
      email: 'maria@italianbistro.com',
      phone: '(412) 555-0789',
      address: '789 Penn Ave',
      city: 'Pittsburgh',
      state: 'PA',
      zip_code: '15222',
      billing_address: '789 Penn Ave, Pittsburgh, PA 15222',
      payment_method: 'credit_card',
      billing_cycle: 'monthly',
      status: 'active',
      property_type: 'restaurant',
      property_size: 'medium',
      access_instructions: 'Back entrance, kitchen access',
      emergency_contact: 'Maria Rodriguez - (412) 555-0789',
      preferred_contact_method: 'phone',
      ar_balance: 225.50,
      account_type: 'commercial'
    },
    {
      name: 'Squirrel Hill Residential',
      email: 'dthompson@email.com',
      phone: '(412) 555-0321',
      address: '321 Murray Ave',
      city: 'Pittsburgh',
      state: 'PA',
      zip_code: '15217',
      billing_address: '321 Murray Ave, Pittsburgh, PA 15217',
      payment_method: 'credit_card',
      billing_cycle: 'annual',
      status: 'active',
      property_type: 'single_family',
      property_size: 'medium',
      access_instructions: 'Side gate, key under mat',
      emergency_contact: 'David and Lisa Thompson - (412) 555-0321',
      preferred_contact_method: 'email',
      ar_balance: 150.00,
      account_type: 'residential'
    },
    {
      name: 'Monroeville Mall Complex',
      email: 'rwilson@monroevillemall.com',
      phone: '(412) 555-0654',
      address: '200 Mall Blvd',
      city: 'Monroeville',
      state: 'PA',
      zip_code: '15146',
      billing_address: '200 Mall Blvd, Monroeville, PA 15146',
      payment_method: 'check',
      billing_cycle: 'quarterly',
      status: 'active',
      property_type: 'shopping_center',
      property_size: 'large',
      access_instructions: 'Loading dock entrance, security escort',
      emergency_contact: 'Robert Wilson - (412) 555-0654',
      preferred_contact_method: 'phone',
      ar_balance: 875.00,
      account_type: 'commercial'
    },
    {
      name: 'Cranberry Township Business Park',
      email: 'jpark@techcorp.com',
      phone: '(724) 555-0987',
      address: '1000 Cranberry Woods Dr',
      city: 'Cranberry Twp',
      state: 'PA',
      zip_code: '16066',
      billing_address: '1000 Cranberry Woods Dr, Cranberry Twp, PA 16066',
      payment_method: 'credit_card',
      billing_cycle: 'monthly',
      status: 'active',
      property_type: 'office_building',
      property_size: 'large',
      access_instructions: 'Main lobby, visitor badge required',
      emergency_contact: 'Jennifer Park - (724) 555-0987',
      preferred_contact_method: 'email',
      ar_balance: 0.00,
      account_type: 'commercial'
    },
    {
      name: 'Greensburg Suburban Homes',
      email: 'frank.miller@email.com',
      phone: '(724) 555-0123',
      address: '456 Main St',
      city: 'Greensburg',
      state: 'PA',
      zip_code: '15601',
      billing_address: '456 Main St, Greensburg, PA 15601',
      payment_method: 'credit_card',
      billing_cycle: 'annual',
      status: 'active',
      property_type: 'single_family',
      property_size: 'medium',
      access_instructions: 'Front door, garage access available',
      emergency_contact: 'Frank and Nancy Miller - (724) 555-0123',
      preferred_contact_method: 'phone',
      ar_balance: 75.00,
      account_type: 'residential'
    },
    {
      name: 'Butler County Industrial',
      email: 'tanderson@manufacturing.com',
      phone: '(724) 555-0456',
      address: '200 Industrial Blvd',
      city: 'Butler',
      state: 'PA',
      zip_code: '16001',
      billing_address: '200 Industrial Blvd, Butler, PA 16001',
      payment_method: 'check',
      billing_cycle: 'monthly',
      status: 'active',
      property_type: 'manufacturing',
      property_size: 'large',
      access_instructions: 'Security gate, ID required',
      emergency_contact: 'Thomas Anderson - (724) 555-0456',
      preferred_contact_method: 'phone',
      ar_balance: 1200.00,
      account_type: 'commercial'
    },
    {
      name: 'Washington County Apartments',
      email: 'afoster@apartments.com',
      phone: '(724) 555-0789',
      address: '100 Apartment Dr',
      city: 'Washington',
      state: 'PA',
      zip_code: '15301',
      billing_address: '100 Apartment Dr, Washington, PA 15301',
      payment_method: 'credit_card',
      billing_cycle: 'quarterly',
      status: 'active',
      property_type: 'apartment_complex',
      property_size: 'large',
      access_instructions: 'Maintenance entrance, call ahead',
      emergency_contact: 'Amanda Foster - (724) 555-0789',
      preferred_contact_method: 'email',
      ar_balance: 650.00,
      account_type: 'commercial'
    },
    {
      name: 'Beaver County Residential',
      email: 'mdavis@email.com',
      phone: '(724) 555-0321',
      address: '789 River Rd',
      city: 'Beaver',
      state: 'PA',
      zip_code: '15009',
      billing_address: '789 River Rd, Beaver, PA 15009',
      payment_method: 'credit_card',
      billing_cycle: 'annual',
      status: 'active',
      property_type: 'single_family',
      property_size: 'medium',
      access_instructions: 'Back deck entrance, key in lockbox',
      emergency_contact: 'Mark and Susan Davis - (724) 555-0321',
      preferred_contact_method: 'email',
      ar_balance: 125.00,
      account_type: 'residential'
    }
  ];

  for (const customerData of customers) {
    const customer = await prisma.account.create({
      data: {
        ...customerData,
        tenant_id: tenant.id,
      },
    });
    console.log(`✅ Created customer: ${customer.name}`);
  }

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
