const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

// Pittsburgh area addresses for the mock customers
const customerAddresses = [
  {
    name: "Smith Family Residence",
    address: "123 Oak Street",
    city: "Pittsburgh",
    state: "PA",
    postal_code: "15213",
    lat: 40.4406,
    lng: -79.9959
  },
  {
    name: "Johnson Home",
    address: "456 Maple Avenue",
    city: "Pittsburgh",
    state: "PA",
    postal_code: "15217",
    lat: 40.4284,
    lng: -79.9228
  },
  {
    name: "Williams Residence",
    address: "789 Pine Road",
    city: "Pittsburgh",
    state: "PA",
    postal_code: "15206",
    lat: 40.4654,
    lng: -79.9248
  },
  {
    name: "Brown Family Home",
    address: "321 Elm Street",
    city: "Pittsburgh",
    state: "PA",
    postal_code: "15208",
    lat: 40.4584,
    lng: -79.8968
  },
  {
    name: "Davis Residence",
    address: "654 Birch Lane",
    city: "Pittsburgh",
    state: "PA",
    postal_code: "15210",
    lat: 40.4084,
    lng: -79.9868
  },
  {
    name: "Miller Family Home",
    address: "987 Cedar Drive",
    city: "Pittsburgh",
    state: "PA",
    postal_code: "15212",
    lat: 40.4784,
    lng: -79.9768
  },
  {
    name: "Wilson Residence",
    address: "147 Willow Way",
    city: "Pittsburgh",
    state: "PA",
    postal_code: "15214",
    lat: 40.4884,
    lng: -79.9668
  },
  {
    name: "Taylor Family Home",
    address: "258 Spruce Street",
    city: "Pittsburgh",
    state: "PA",
    postal_code: "15216",
    lat: 40.3984,
    lng: -79.9568
  },
  {
    name: "Anderson Residence",
    address: "369 Ash Avenue",
    city: "Pittsburgh",
    state: "PA",
    postal_code: "15218",
    lat: 40.4184,
    lng: -79.9468
  },
  {
    name: "Downtown Pittsburgh Office Complex",
    address: "500 Grant Street",
    city: "Pittsburgh",
    state: "PA",
    postal_code: "15219",
    lat: 40.4384,
    lng: -79.9968
  }
];

async function createCustomerLocations() {
  try {
    console.log('🚀 Starting to create customer locations...');

    // Get the tenant ID
    const tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      throw new Error('No tenant found. Please ensure you have a tenant in the database.');
    }

    console.log(`📋 Using tenant: ${tenant.name} (${tenant.id})`);

    // Get all accounts (customers)
    const accounts = await prisma.account.findMany({
      where: { tenant_id: tenant.id },
      include: {
        locations: true
      }
    });

    if (accounts.length === 0) {
      throw new Error('No accounts found. Please ensure you have customers in the database.');
    }

    console.log(`👥 Found ${accounts.length} customers`);

    let locationsCreated = 0;

    // Create locations for each account
    for (const account of accounts) {
      // Skip if already has locations
      if (account.locations.length > 0) {
        console.log(`⚠️  Skipping ${account.name} - already has ${account.locations.length} location(s)`);
        continue;
      }

      // Find matching address data or use default
      let addressData = customerAddresses.find(addr => addr.name === account.name);
      if (!addressData) {
        // Use a default address for customers not in our list
        addressData = {
          name: account.name,
          address: `${Math.floor(Math.random() * 999) + 1} ${['Oak', 'Maple', 'Pine', 'Elm', 'Birch', 'Cedar', 'Willow', 'Spruce', 'Ash'][Math.floor(Math.random() * 9)]} Street`,
          city: "Pittsburgh",
          state: "PA",
          postal_code: `152${Math.floor(Math.random() * 20) + 10}`,
          lat: 40.4 + (Math.random() - 0.5) * 0.1,
          lng: -79.9 + (Math.random() - 0.5) * 0.1
        };
      }

      // Create location
      const location = await prisma.location.create({
        data: {
          id: uuidv4(),
          tenant_id: tenant.id,
          account_id: account.id,
          name: `${account.name} - Main Location`,
          address_line1: addressData.address,
          city: addressData.city,
          state: addressData.state,
          postal_code: addressData.postal_code,
          country: "US",
          latitude: addressData.lat,
          longitude: addressData.lng
        }
      });

      locationsCreated++;
      console.log(`✅ Created location for ${account.name}: ${addressData.address}, ${addressData.city}, ${addressData.state} ${addressData.postal_code}`);
    }

    console.log('\n🎉 Customer locations creation completed!');
    console.log(`📊 Summary:`);
    console.log(`   - Locations Created: ${locationsCreated}`);

  } catch (error) {
    console.error('❌ Error creating customer locations:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
if (require.main === module) {
  createCustomerLocations()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { createCustomerLocations };



