const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedWorkOrders() {
  try {
    console.log('🌱 Seeding work orders...');

    // Get existing tenant (assuming first tenant)
    const tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      console.log('❌ No tenant found. Please create a tenant first.');
      return;
    }

    // Get existing customers
    const customers = await prisma.account.findMany({
      where: { tenant_id: tenant.id },
      take: 5,
    });

    if (customers.length === 0) {
      console.log('❌ No customers found. Please create customers first.');
      return;
    }

    // Get existing technicians
    const technicians = await prisma.user.findMany({
      where: { 
        tenant_id: tenant.id,
        roles: { has: 'technician' }
      },
      take: 3,
    });

    if (technicians.length === 0) {
      console.log('❌ No technicians found. Please create technicians first.');
      return;
    }

    const workOrderData = [
      {
        customer_id: customers[0].id,
        assigned_to: technicians[0].id,
        status: 'pending',
        priority: 'high',
        scheduled_date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        description: 'Emergency pest control service needed for restaurant kitchen',
        notes: 'Customer reported seeing cockroaches in the kitchen area. Urgent attention required.',
      },
      {
        customer_id: customers[1].id,
        assigned_to: technicians[1].id,
        status: 'in-progress',
        priority: 'medium',
        scheduled_date: new Date(),
        description: 'Regular monthly pest control maintenance',
        notes: 'Standard monthly service. No issues reported.',
      },
      {
        customer_id: customers[2].id,
        status: 'pending',
        priority: 'low',
        scheduled_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
        description: 'Quarterly pest control inspection',
        notes: 'Routine quarterly inspection. Customer prefers morning appointments.',
      },
      {
        customer_id: customers[0].id,
        assigned_to: technicians[2].id,
        status: 'completed',
        priority: 'urgent',
        scheduled_date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        completion_date: new Date(Date.now() - 12 * 60 * 60 * 1000), // Yesterday afternoon
        description: 'Emergency rodent control service',
        notes: 'Successfully completed. Customer satisfied with service.',
      },
      {
        customer_id: customers[1].id,
        status: 'canceled',
        priority: 'medium',
        scheduled_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
        description: 'Pest control service for office building',
        notes: 'Customer requested cancellation due to scheduling conflict.',
      },
      {
        customer_id: customers[2].id,
        assigned_to: technicians[0].id,
        status: 'pending',
        priority: 'high',
        scheduled_date: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
        description: 'Wasp nest removal from residential property',
        notes: 'Customer reported large wasp nest near front door. Safety concern.',
      },
      {
        customer_id: customers[0].id,
        status: 'pending',
        priority: 'medium',
        scheduled_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        description: 'Annual termite inspection',
        notes: 'Routine annual termite inspection. Customer has wooden deck structure.',
      },
      {
        customer_id: customers[1].id,
        assigned_to: technicians[1].id,
        status: 'in-progress',
        priority: 'medium',
        scheduled_date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        description: 'Bed bug treatment for hotel room',
        notes: 'Treatment in progress. Using heat treatment method.',
      },
    ];

    const createdWorkOrders = [];

    for (const workOrder of workOrderData) {
      const created = await prisma.workOrder.create({
        data: {
          tenant_id: tenant.id,
          ...workOrder,
        },
        include: {
          account: {
            select: {
              name: true,
            },
          },
          assignedTechnician: {
            select: {
              first_name: true,
              last_name: true,
            },
          },
        },
      });

      createdWorkOrders.push(created);
      console.log(`✅ Created work order: ${created.description.substring(0, 50)}...`);
    }

    console.log(`\n🎉 Successfully created ${createdWorkOrders.length} work orders!`);
    console.log('\n📊 Summary:');
    console.log(`- Pending: ${createdWorkOrders.filter(wo => wo.status === 'pending').length}`);
    console.log(`- In Progress: ${createdWorkOrders.filter(wo => wo.status === 'in-progress').length}`);
    console.log(`- Completed: ${createdWorkOrders.filter(wo => wo.status === 'completed').length}`);
    console.log(`- Canceled: ${createdWorkOrders.filter(wo => wo.status === 'canceled').length}`);

  } catch (error) {
    console.error('❌ Error seeding work orders:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedWorkOrders();
