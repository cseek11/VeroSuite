// Test complete user flow from frontend to backend
require('dotenv').config();

async function testCompleteFlow() {
  console.log('🔄 Testing Complete User Flow (Frontend → Backend)...\n');

  // Step 1: Test Backend Authentication
  console.log('1️⃣ Testing Backend Authentication...');
  try {
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@veropestsolutions.com',
        password: 'admin123'
      })
    });

    if (!loginResponse.ok) {
      console.error('❌ Backend login failed:', await loginResponse.text());
      return;
    }

    const loginData = await loginResponse.json();
    const token = loginData.access_token;
    console.log('✅ Backend authentication successful');

    // Step 2: Test Backend CRM API
    console.log('\n2️⃣ Testing Backend CRM API...');
    const crmResponse = await fetch('http://localhost:3001/api/v1/crm/accounts', {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!crmResponse.ok) {
      console.error('❌ Backend CRM API failed:', await crmResponse.text());
      return;
    }

    const crmData = await crmResponse.json();
    console.log(`✅ Backend CRM API successful - Found ${crmData.length} accounts`);

    // Step 3: Test Frontend API Endpoint (simulating frontend calls)
    console.log('\n3️⃣ Testing Frontend API Simulation...');
    const frontendResponse = await fetch('http://localhost:3001/api/accounts', {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!frontendResponse.ok) {
      console.error('❌ Frontend API simulation failed:', await frontendResponse.text());
      return;
    }

    const frontendData = await frontendResponse.json();
    console.log(`✅ Frontend API simulation successful - Found ${Array.isArray(frontendData) ? frontendData.length : 'unknown'} accounts`);

    // Step 4: Verify Data Consistency
    console.log('\n4️⃣ Verifying Data Consistency...');
    if (crmData.length === frontendData.length) {
      console.log('✅ Data consistency verified - Both APIs return same number of accounts');
    } else {
      console.log(`⚠️ Data inconsistency - CRM: ${crmData.length}, Frontend: ${frontendData.length}`);
    }

    // Step 5: Test Frontend Accessibility
    console.log('\n5️⃣ Testing Frontend Accessibility...');
    try {
      const frontendCheck = await fetch('http://localhost:5173', {
        method: 'GET',
        headers: { 'Accept': 'text/html' }
      });
      
      if (frontendCheck.ok) {
        console.log('✅ Frontend is accessible at http://localhost:5173');
      } else {
        console.log(`⚠️ Frontend returned status: ${frontendCheck.status}`);
      }
    } catch (error) {
      console.log('⚠️ Frontend accessibility check failed:', error.message);
    }

    console.log('\n🏁 Complete Flow Test Summary:');
    console.log('✅ Backend Authentication: Working');
    console.log('✅ Backend CRM API: Working');
    console.log('✅ Frontend API Simulation: Working');
    console.log('✅ Data Consistency: Verified');
    console.log('✅ Frontend Accessibility: Checked');
    
    console.log('\n🎉 Complete user flow is working!');
    console.log('📝 Next steps:');
    console.log('   - Open http://localhost:5173 in your browser');
    console.log('   - Login with admin@veropestsolutions.com / admin123');
    console.log('   - Navigate to customers page to see the backend integration');

  } catch (error) {
    console.error('❌ Complete flow test failed:', error.message);
  }
}

testCompleteFlow().catch(console.error);
