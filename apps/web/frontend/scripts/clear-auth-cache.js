// ============================================================================
// CLEAR AUTHENTICATION CACHE
// ============================================================================
// Clear all authentication cache and force fresh login

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHp3Z2x2bWJ0cmxoZGdvZmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzIxNDUsImV4cCI6MjA3MTE0ODE0NX0.WOa5cSZhiBbbIdzQJAqJG9hZZiWQNcMoUpXL3rRLQp8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function clearAuthCache() {
  console.log('🧹 Clearing authentication cache...\n');
  
  try {
    // Step 1: Get current user info
    console.log('1️⃣ Getting current user info...');
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.log('❌ User error:', userError.message);
    } else if (user) {
      console.log('✅ Current user:');
      console.log('   Email:', user.email);
      console.log('   User ID:', user.id);
      console.log('   User metadata:', user.user_metadata);
      console.log('   App metadata:', user.app_metadata);
      console.log('   Tenant ID:', user.user_metadata?.tenant_id || user.app_metadata?.tenant_id);
    } else {
      console.log('ℹ️  No user currently logged in');
    }
    
    // Step 2: Sign out to clear session
    console.log('\n2️⃣ Signing out to clear session...');
    const { error: signOutError } = await supabase.auth.signOut();
    
    if (signOutError) {
      console.log('❌ Sign out error:', signOutError.message);
    } else {
      console.log('✅ Successfully signed out');
    }
    
    // Step 3: Clear local storage (browser only)
    console.log('\n3️⃣ Clearing local storage...');
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem('verofield_auth');
      localStorage.removeItem('user');
      localStorage.removeItem('jwt');
      localStorage.clear();
      console.log('✅ Local storage cleared');
    } else {
      console.log('ℹ️  Not in browser environment, skipping local storage');
      console.log('📋 To clear browser storage, run this in browser console:');
      console.log('   localStorage.clear();');
      console.log('   sessionStorage.clear();');
    }
    
    // Step 4: Verify user is logged out
    console.log('\n4️⃣ Verifying logout...');
    const { data: { user: userAfterLogout }, error: verifyError } = await supabase.auth.getUser();
    
    if (verifyError) {
      console.log('❌ Verify error:', verifyError.message);
    } else if (userAfterLogout) {
      console.log('⚠️  User still logged in after sign out');
    } else {
      console.log('✅ User successfully logged out');
    }
    
    console.log('\n🎉 Authentication cache cleared!');
    console.log('\n📋 Next steps:');
    console.log('1. Refresh your browser page');
    console.log('2. Login again with the correct user');
    console.log('3. Check that the tenant ID matches: 7193113e-ece2-4f7b-ae8c-176df4367e28');
    
  } catch (error) {
    console.error('❌ Script failed:', error);
  }
}

// Run the script
clearAuthCache();


