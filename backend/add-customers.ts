import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Adding customers to existing tenant...');

  const tenantId = 'fb39f15b-b382-4525-8404-1e32ca1486c9';
  
  // Check if tenant exists
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
  });

  if (!tenant) {
    console.log('❌ Tenant not found, creating it...');
    await prisma.tenant.create({
      data: {
        id: tenantId,
        name: 'VeroPest Solutions',
        domain: 'veropest-solutions.com', // Use different domain
        status: 'active',
        subscription_tier: 'premium',
      },
    });
  }

  // Create sample accounts
  const accounts = await Promise.all([
    prisma.account.create({
      data: {
        tenant_id: tenantId,
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
        status: 'active',
      },
    }),
    prisma.account.create({
      data: {
        tenant_id: tenantId,
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
        status: 'active',
      },
    }),
    prisma.account.create({
      data: {
        tenant_id: tenantId,
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
        status: 'active',
      },
    }),
    prisma.account.create({
      data: {
        tenant_id: tenantId,
        name: 'Maria Lopez Family',
        account_type: 'residential',
        phone: '(555) 234-5678',
        email: 'maria.lopez@email.com',
        address: '321 Oak Avenue',
        city: 'Anytown',
        state: 'CA',
        zip_code: '90213',
        property_type: 'single_family',
        property_size: '1800 sq ft',
        ar_balance: 0.00,
        status: 'active',
      },
    }),
    prisma.account.create({
      data: {
        tenant_id: tenantId,
        name: 'Acme Corporation',
        account_type: 'commercial',
        phone: '(555) 345-6789',
        email: 'contact@acme.com',
        address: '654 Industrial Way',
        city: 'Anytown',
        state: 'CA',
        zip_code: '90214',
        property_type: 'warehouse',
        property_size: '10000 sq ft',
        ar_balance: 0.00,
        status: 'active',
      },
    }),
  ]);

  console.log('✅ Created sample accounts:', accounts.length);
  console.log('Account names:', accounts.map(a => a.name));

  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  });
