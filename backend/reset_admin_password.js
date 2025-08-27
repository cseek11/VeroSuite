// Reset admin user password
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function resetAdminPassword() {
  try {
    console.log('Resetting admin user password...');
    
    // Find the admin user
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('❌ Error listing users:', usersError);
      return;
    }
    
    const adminUser = users.users.find(u => u.email === 'admin@veropestsolutions.com');
    
    if (!adminUser) {
      console.error('❌ Admin user not found');
      return;
    }
    
    console.log('Found admin user:', adminUser.id);
    
    // Reset password
    const { data, error } = await supabase.auth.admin.updateUserById(adminUser.id, {
      password: 'admin123'
    });
    
    if (error) {
      console.error('❌ Error resetting password:', error);
      return;
    }
    
    console.log('✅ Password reset successfully!');
    console.log('You can now login with:');
    console.log('Email: admin@veropestsolutions.com');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

resetAdminPassword();




