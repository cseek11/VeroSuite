const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function createQuickTestJobs() {
  try {
    console.log('🚀 Creating quick test jobs...');

    // Get the tenant
    const tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      throw new Error('No tenant found');
    }

    console.log(`📋 Using tenant: ${tenant.name}`);

    // Get all accounts
    const accounts = await prisma.account.findMany({
      where: { tenant_id: tenant.id }
    });

    console.log(`👥 Found ${accounts.length} customers`);

    // Create a technician if needed
    let technician = await prisma.user.findFirst({
      where: {
        tenant_id: tenant.id,
        roles: { has: 'technician' }
      }
    });

    if (!technician) {
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
    }

    let jobsCreated = 0;

    // Create jobs for first 5 customers (to keep it simple)
    for (let i = 0; i < Math.min(5, accounts.length); i++) {
      const account = accounts[i];
      
      // Create a location for this customer
      const location = await prisma.location.create({
        data: {
          id: uuidv4(),
          tenant_id: tenant.id,
          account_id: account.id,
          name: `${account.name} - Main Location`,
          address_line1: '123 Main St',
          city: 'Pittsburgh',
          state: 'PA',
          postal_code: '15201',
          country: 'US'
        }
      });

      // Create 2-3 jobs for this customer
      const numJobs = Math.floor(Math.random() * 2) + 2;
      
      for (let j = 0; j < numJobs; j++) {
        // Random date in next 14 days
        const randomDays = Math.floor(Math.random() * 14);
        const jobDate = new Date();
        jobDate.setDate(jobDate.getDate() + randomDays);
        
        // Random time slot
        const timeSlots = ['08:00', '10:00', '13:00', '15:00', '17:00'];
        const startTime = timeSlots[Math.floor(Math.random() * timeSlots.length)];
        
        // Create work order
        const workOrder = await prisma.workOrder.create({
          data: {
            id: uuidv4(),
            tenant_id: tenant.id,
            account_id: account.id,
            location_id: location.id,
            service_type: 'General Pest Control',
            description: `Pest control service for ${account.name}`,
            estimated_duration: 90,
            service_price: 150.00,
            status: 'active'
          }
        });

        // Create job
        await prisma.job.create({
          data: {
            id: uuidv4(),
            tenant_id: tenant.id,
            work_order_id: workOrder.id,
            account_id: account.id,
            location_id: location.id,
            technician_id: technician.id,
            status: 'scheduled',
            priority: 'medium',
            scheduled_date: jobDate,
            scheduled_start_time: startTime,
            scheduled_end_time: '10:00'
          }
        });

        jobsCreated++;
        console.log(`✅ Created job for ${account.name} on ${jobDate.toDateString()} at ${startTime}`);
      }
    }

    console.log(`\n🎉 Created ${jobsCreated} test jobs!`);

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
if (require.main === module) {
  createQuickTestJobs()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { createQuickTestJobs };

