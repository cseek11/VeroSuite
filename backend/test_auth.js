// Test admin user authentication
const axios = require('axios');

async function testAdminLogin() {
  try {
    console.log('Testing admin user login...');
    
    // Test 1: Try to login with admin credentials
    console.log('1. Attempting login...');
    
    const loginData = {
      email: 'admin@veropestsolutions.com', // Update this with your admin email
      password: 'admin123' // Update this with your admin password
    };
    
    const response = await axios.post('http://localhost:3001/auth/login', loginData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Login successful!');
    console.log('Response:', response.data);
    
    // Test 2: Check if we can access protected routes
    console.log('2. Testing protected route access...');
    
    const token = response.data.access_token;
    const accountsResponse = await axios.get('http://localhost:3001/v1/crm/accounts', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Protected route access successful!');
    console.log('Accounts found:', accountsResponse.data.length);
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status
    });
    
    if (error.response?.status === 401) {
      console.log('🔍 Authentication failed. Please check:');
      console.log('   - Email address is correct');
      console.log('   - Password is correct');
      console.log('   - User exists in the database');
      console.log('   - User has proper roles assigned');
    }
  }
}

testAdminLogin();
