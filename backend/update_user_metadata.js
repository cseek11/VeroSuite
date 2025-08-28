// Update user metadata with correct tenant ID
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateUserMetadata() {
  try {
    console.log('Updating user metadata...');
    
    // First, let's find the user by email
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('❌ Error listing users:', listError);
      return;
    }
    
    const user = users.users.find(u => u.email === 'admin@veropestsolutions.com');
    
    if (!user) {
      console.error('❌ User not found');
      return;
    }
    
    console.log('Found user:', user.id);
    
    // Update user metadata
    const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: {
        first_name: 'Christopher',
        last_name: 'Seek',
        roles: ['admin'],
        tenant_id: 'fb39f15b-b382-4525-8404-1e32ca1486c9'
      }
    });
    
    if (error) {
      console.error('❌ Error updating user:', error);
      return;
    }
    
    console.log('✅ User metadata updated successfully!');
    console.log('Updated metadata:', data.user.user_metadata);
    
    console.log('\n🎉 You can now refresh the frontend and try logging in again!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

updateUserMetadata();






