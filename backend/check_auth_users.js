// Check what users exist in Supabase Auth
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkAuthUsers() {
  try {
    console.log('Checking Supabase Auth users...');
    
    // List all users in Supabase Auth
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('❌ Error listing auth users:', usersError);
      return;
    }
    
    console.log(`✅ Found ${users.users.length} users in Supabase Auth:`);
    users.users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email}`);
      console.log(`      ID: ${user.id}`);
      console.log(`      Created: ${user.created_at}`);
      console.log(`      Email verified: ${user.email_confirmed_at ? 'Yes' : 'No'}`);
      console.log(`      Metadata:`, user.user_metadata);
      console.log('');
    });
    
    // Try to get user by email
    const targetEmail = 'admin@veropestsolutions.com';
    console.log(`🔍 Looking for user: ${targetEmail}`);
    
    const targetUser = users.users.find(u => u.email === targetEmail);
    if (targetUser) {
      console.log('✅ Target user found!');
      console.log('User details:', {
        id: targetUser.id,
        email: targetUser.email,
        email_confirmed: !!targetUser.email_confirmed_at,
        user_metadata: targetUser.user_metadata,
        app_metadata: targetUser.app_metadata
      });
    } else {
      console.log('❌ Target user not found in Supabase Auth');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkAuthUsers();





