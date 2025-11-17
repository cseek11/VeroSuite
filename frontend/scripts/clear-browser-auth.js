// ============================================================================
// CLEAR BROWSER AUTHENTICATION CACHE
// ============================================================================
// Run this script in the browser console to clear all authentication data

console.log('🧹 Clearing browser authentication cache...\n');

try {
  // Step 1: Clear all localStorage
  console.log('1️⃣ Clearing localStorage...');
  localStorage.clear();
  console.log('✅ localStorage cleared');

  // Step 2: Clear all sessionStorage
  console.log('\n2️⃣ Clearing sessionStorage...');
  sessionStorage.clear();
  console.log('✅ sessionStorage cleared');

  // Step 3: Clear specific auth keys
  console.log('\n3️⃣ Clearing specific auth keys...');
  const authKeys = [
    'verofield_auth',
    'user',
    'jwt',
    'supabase.auth.token',
    'sb-iehzwglvmbtrlhdgofew-auth-token',
    'sb-iehzwglvmbtrlhdgofew-auth-token-code-verifier'
  ];
  
  authKeys.forEach(key => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      console.log(`   ✅ Removed: ${key}`);
    }
    if (sessionStorage.getItem(key)) {
      sessionStorage.removeItem(key);
      console.log(`   ✅ Removed: ${key}`);
    }
  });

  // Step 4: Clear cookies (if any)
  console.log('\n4️⃣ Clearing cookies...');
  document.cookie.split(";").forEach(function(c) { 
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
  });
  console.log('✅ Cookies cleared');

  // Step 5: Force page reload
  console.log('\n5️⃣ Reloading page...');
  console.log('✅ Authentication cache cleared! Page will reload in 2 seconds...');
  
  setTimeout(() => {
    window.location.reload();
  }, 2000);

} catch (error) {
  console.error('❌ Error clearing auth cache:', error);
  console.log('\n📋 Manual steps:');
  console.log('1. Open DevTools (F12)');
  console.log('2. Go to Application tab');
  console.log('3. Clear all storage under Storage section');
  console.log('4. Refresh the page');
}





































