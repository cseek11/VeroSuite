import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  const tenantAId = '11111111-1111-1111-1111-111111111111';
  const tenantBId = '22222222-2222-2222-2222-222222222222';

  const [tenantA, tenantB] = await Promise.all([
    prisma.tenant.upsert({ where: { id: tenantAId }, update: {}, create: { id: tenantAId, name: 'Ace Pest Control', domain: 'acepest.local' } }),
    prisma.tenant.upsert({ where: { id: tenantBId }, update: {}, create: { id: tenantBId, name: 'Green Shield Pest', domain: 'greenshield.local' } }),
  ]);

  const password = await bcrypt.hash('password123', 10);

  await Promise.all([
    prisma.user.upsert({
      where: { email: 'dispatcher@acepest.com' },
      update: {},
      create: { tenant_id: tenantA.id, email: 'dispatcher@acepest.com', password_hash: password, first_name: 'Sarah', last_name: 'Thompson', roles: ['dispatcher'] },
    }),
    prisma.user.upsert({
      where: { email: 'dispatcher@greenshield.com' },
      update: {},
      create: { tenant_id: tenantB.id, email: 'dispatcher@greenshield.com', password_hash: password, first_name: 'Mike', last_name: 'Chen', roles: ['dispatcher'] },
    }),
  ]);

  const today = new Date(new Date().toISOString().split('T')[0]);

  async function seedTenantData(tenantId: string, baseName: string) {
    const account = await prisma.account.create({
      data: {
        tenant_id: tenantId,
        name: `${baseName} Customer`,
        account_type: 'commercial',
        phone: '(412) 555-0123',
        ar_balance: 0,
      },
    });

    const location = await prisma.location.create({
      data: {
        tenant_id: tenantId,
        account_id: account.id,
        name: 'HQ',
        address_line1: '123 Main St',
        city: 'Pittsburgh',
        state: 'PA',
        postal_code: '15222',
        latitude: 40.4406 as any,
        longitude: -79.9959 as any,
      },
    });

    const workOrder = await prisma.workOrder.create({
      data: {
        tenant_id: tenantId,
        account_id: account.id,
        location_id: location.id,
        service_type: 'Monthly Service',
        description: 'Interior and exterior pest control treatment',
        estimated_duration: 90,
        service_price: 185.0 as any,
        status: 'active',
      },
    });

    await prisma.job.create({
      data: {
        tenant_id: tenantId,
        work_order_id: workOrder.id,
        account_id: account.id,
        location_id: location.id,
        status: 'unassigned',
        priority: 'high',
        scheduled_date: today,
      },
    });
  }

  await seedTenantData(tenantA.id, 'AcePest');
  await seedTenantData(tenantB.id, 'GreenShield');

  console.log('Seed complete');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
