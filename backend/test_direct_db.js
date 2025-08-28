// Test direct database connection using Prisma
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testDirectDatabase() {
  try {
    console.log('Testing direct database connection...');
    
    // Test 1: Connect to database
    console.log('1. Connecting to database...');
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Test 2: Count accounts
    console.log('2. Counting accounts...');
    const accountCount = await prisma.account.count();
    console.log(`✅ Found ${accountCount} accounts in database`);
    
    // Test 3: Get first few accounts
    console.log('3. Fetching first 3 accounts...');
    const accounts = await prisma.account.findMany({
      take: 3,
      select: {
        id: true,
        name: true,
        account_type: true,
        city: true,
        state: true,
        tenant_id: true
      }
    });
    
    console.log('✅ Successfully fetched accounts:');
    accounts.forEach((account, index) => {
      console.log(`   ${index + 1}. ${account.name} (${account.account_type}) - ${account.city}, ${account.state} - Tenant: ${account.tenant_id}`);
    });
    
    // Test 4: Check tenant table
    console.log('4. Checking tenant table...');
    const tenants = await prisma.tenant.findMany({
      take: 3,
      select: {
        id: true,
        name: true,
        status: true
      }
    });
    
    console.log('✅ Successfully fetched tenants:');
    tenants.forEach((tenant, index) => {
      console.log(`   ${index + 1}. ${tenant.name} (${tenant.status}) - ID: ${tenant.id}`);
    });
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDirectDatabase();






