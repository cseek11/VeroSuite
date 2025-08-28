const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

// Service types for pest control
const serviceTypes = [
  'General Pest Control',
  'Rodent Control',
  'Termite Treatment',
  'Bed Bug Treatment',
  'Mosquito Control',
  'Spider Control',
  'Ant Control',
  'Cockroach Treatment',
  'Flea Treatment',
  'Wasp Nest Removal'
];

// Job priorities
const priorities = ['low', 'medium', 'high', 'urgent'];

// Job statuses
const statuses = ['unassigned', 'scheduled', 'in_progress', 'completed'];

// Time slots for jobs
const timeSlots = [
  { start: '08:00', end: '10:00' },
  { start: '10:00', end: '12:00' },
  { start: '13:00', end: '15:00' },
  { start: '15:00', end: '17:00' },
  { start: '17:00', end: '19:00' }
];

async function createTestJobs() {
  try {
    console.log('🚀 Starting to create test jobs...');

    // Get the tenant ID (assuming we have one tenant)
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

    // Get or create a technician (user with technician role)
    let technician = await prisma.user.findFirst({
      where: {
        tenant_id: tenant.id,
        roles: { has: 'technician' }
      }
    });

    if (!technician) {
      console.log('👨‍🔧 No technician found, creating one...');
      technician = await prisma.user.create({
        data: {
          tenant_id: tenant.id,
          email: 'tech@veropest.com',
          password_hash: '$2b$10$dummy.hash.for.testing',
          first_name: 'John',
          last_name: 'Technician',
          phone: '(412) 555-0123',
          roles: ['technician'],
          status: 'active'
        }
      });
      console.log(`✅ Created technician: ${technician.first_name} ${technician.last_name}`);
    }

    // Generate dates for the next 14 days
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }

    let jobsCreated = 0;
    let workOrdersCreated = 0;

    // Create jobs for each account
    for (const account of accounts) {
      if (account.locations.length === 0) {
        console.log(`⚠️  Skipping ${account.name} - no locations`);
        continue;
      }

      const location = account.locations[0]; // Use first location

      // Create 2-4 jobs per customer over the next 14 days
      const numJobs = Math.floor(Math.random() * 3) + 2; // 2-4 jobs
      
      for (let i = 0; i < numJobs; i++) {
        // Random date from the next 14 days
        const randomDate = dates[Math.floor(Math.random() * dates.length)];
        const timeSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
        const serviceType = serviceTypes[Math.floor(Math.random() * serviceTypes.length)];
        const priority = priorities[Math.floor(Math.random() * priorities.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        // Create work order
        const workOrder = await prisma.workOrder.create({
          data: {
            id: uuidv4(),
            tenant_id: tenant.id,
            account_id: account.id,
            location_id: location.id,
            service_type: serviceType,
            description: `${serviceType} service for ${account.name}`,
            estimated_duration: Math.floor(Math.random() * 120) + 60, // 60-180 minutes
            service_price: parseFloat((Math.random() * 200 + 50).toFixed(2)), // $50-$250
            special_instructions: Math.random() > 0.7 ? 'Customer prefers morning appointments' : null,
            status: 'active'
          }
        });

        workOrdersCreated++;

        // Create job
        const job = await prisma.job.create({
          data: {
            id: uuidv4(),
            tenant_id: tenant.id,
            work_order_id: workOrder.id,
            account_id: account.id,
            location_id: location.id,
            technician_id: Math.random() > 0.3 ? technician.id : null, // 70% chance of assignment
            status: status,
            priority: priority,
            scheduled_date: randomDate,
            scheduled_start_time: timeSlot.start,
            scheduled_end_time: timeSlot.end,
            completion_notes: status === 'completed' ? 'Service completed successfully' : null
          }
        });

        jobsCreated++;

        console.log(`✅ Created job: ${serviceType} for ${account.name} on ${randomDate.toDateString()} at ${timeSlot.start}`);
      }
    }

    console.log('\n🎉 Test data creation completed!');
    console.log(`📊 Summary:`);
    console.log(`   - Work Orders Created: ${workOrdersCreated}`);
    console.log(`   - Jobs Created: ${jobsCreated}`);
    console.log(`   - Date Range: ${today.toDateString()} to ${new Date(today.getTime() + 13 * 24 * 60 * 60 * 1000).toDateString()}`);

  } catch (error) {
    console.error('❌ Error creating test jobs:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
if (require.main === module) {
  createTestJobs()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { createTestJobs };


