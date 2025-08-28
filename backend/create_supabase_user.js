// Create admin user in Supabase Auth
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createSupabaseUser() {
  try {
    console.log('Creating admin user in Supabase Auth...');
    
    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'admin@veropestsolutions.com',
      password: 'admin123',
      email_confirm: true,
      user_metadata: {
        first_name: 'Christopher',
        last_name: 'Seek',
        roles: ['admin'],
        tenant_id: 'fb39f15b-b382-4525-8404-1e32ca1486c9'
      }
    });
    
    if (error) {
      console.error('❌ Error creating user:', error);
      return;
    }
    
    console.log('✅ User created successfully in Supabase Auth!');
    console.log('User ID:', data.user.id);
    console.log('Email:', data.user.email);
    console.log('Metadata:', data.user.user_metadata);
    
    console.log('\n🎉 You can now login with:');
    console.log('Email: admin@veropestsolutions.com');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createSupabaseUser();







