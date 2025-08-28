// Check users in the database
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('Checking users in database...');
    
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        roles: true,
        status: true,
        tenant_id: true,
        created_at: true
      }
    });
    
    console.log(`✅ Found ${users.length} users in database:`);
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.first_name} ${user.last_name} (${user.email})`);
      console.log(`      Roles: [${user.roles.join(', ')}]`);
      console.log(`      Status: ${user.status}`);
      console.log(`      Tenant ID: ${user.tenant_id}`);
      console.log(`      Created: ${user.created_at}`);
      console.log('');
    });
    
    // Check if there are any admin users
    const adminUsers = users.filter(user => user.roles.includes('admin'));
    console.log(`🔍 Found ${adminUsers.length} admin users:`);
    adminUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email} - Roles: [${user.roles.join(', ')}]`);
    });
    
  } catch (error) {
    console.error('❌ Error checking users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();






