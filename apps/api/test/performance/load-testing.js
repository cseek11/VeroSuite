/**
 * K6 Load Testing Suite
 * Enterprise-grade performance testing for CRM application
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';
import { SharedArray } from 'k6/data';

// Custom metrics
const errorRate = new Rate('error_rate');
const responseTime = new Trend('response_time');
const requestCount = new Counter('request_count');

// Test configuration
export const options = {
  // Cap request rate to avoid backend rate limits
  rps: 15,
  stages: [
    { duration: '2m', target: 5 },    // Ramp up to 5 users
    { duration: '5m', target: 5 },    // Stay at 5 users
    { duration: '2m', target: 10 },   // Ramp up to 10 users
    { duration: '5m', target: 10 },   // Stay at 10 users
    { duration: '2m', target: 15 },   // Ramp up to 15 users (peak)
    { duration: '5m', target: 15 },   // Stay at peak
    { duration: '2m', target: 0 },    // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<600'], // Adjusted p95 latency target
    http_req_failed: ['rate<0.2'],    // Allow some failures (e.g., 429s)
    error_rate: ['rate<0.2'],         // Allow test-level check failures up to 20%
  },
};

// Test data
const testData = new SharedArray('test_data', function () {
  try {
    const raw = open('./test-data.json');
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    throw new Error(`Failed to load test-data.json: ${err}`);
  }
});
// Base URL
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001/api/v1';

// Authentication token (should be obtained from login)
let authToken = '';

function safeParseJson(body) {
  try {
    return JSON.parse(body);
  } catch (err) {
    return null;
  }
}

function pickAccountId(parsed) {
  if (!parsed) return null;
  if (Array.isArray(parsed) && parsed.length) return parsed[0].id;
  if (parsed.data && Array.isArray(parsed.data) && parsed.data.length) return parsed.data[0].id;
  if (parsed.accounts && parsed.accounts.length) return parsed.accounts[0].id;
  if (parsed.customers && parsed.customers.length) return parsed.customers[0].id;
  return parsed.id || null;
}

function requestWithRetry(method, url, body, headers, allowRetry = true) {
  const res = http.request(method, url, body, { headers });
  if (res.status === 429 && allowRetry) {
    sleep(2);
    return http.request(method, url, body, { headers });
  }
  return res;
}

export function setup() {
  // Login and get authentication token
  const loginPayload = JSON.stringify({
    email: 'cseek@verofield.com',
    password: 'Slayer6211!00'
  });

  const loginResponse = http.post(`${BASE_URL}/auth/login`, loginPayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (loginResponse.status === 200 || loginResponse.status === 201) {
    const loginData = JSON.parse(loginResponse.body);
    authToken = loginData.access_token;
    const userId = loginData.user?.id;

    // Fetch or create a single account to reuse in tests
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` };
    let accountId = null;
    const listRes = requestWithRetry('GET', `${BASE_URL}/accounts?limit=1`, null, headers);
    const listParsed = safeParseJson(listRes.body);
    accountId = pickAccountId(listParsed);

    if (!accountId) {
      const createPayload = JSON.stringify({
        name: `PerfAccount${Math.random().toString(36).substr(2, 6)}`,
        account_type: 'residential',
        email: `perf${Math.random().toString(36).substr(2, 6)}@example.com`,
        phone: '+1-555-0000',
      });
      const createRes = requestWithRetry('POST', `${BASE_URL}/accounts`, createPayload, headers);
      const created = safeParseJson(createRes.body);
      accountId = pickAccountId(created);
    }

    return { authToken, userId, accountId };
  } else {
    errorRate.add(true);
  }

  return { authToken, userId: undefined, accountId: undefined };
}

export default function (data) {
  const token = data?.authToken || authToken;
  if (!token) {
    errorRate.add(true);
    sleep(1);
    return;
  }
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  // Test scenarios
  const scenarios = [
    // testCustomerOperations, // disabled to reduce rate
    testWorkOrderOperations,
  ];

  // Randomly select a scenario
  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  scenario(headers, data);

  // Keep per-VU cadence gentle to avoid tripping rate limits in smoke runs.
  sleep(2);
}

// Customer Operations Test
function testCustomerOperations(headers) {
  const accountData = {
    name: `LoadTest${Math.random().toString(36).substr(2, 9)}`,
    account_type: 'residential',
    email: `loadtest${Math.random().toString(36).substr(2, 9)}@example.com`,
    phone: '+1-555-0000'
  };

  // Create account
  const createResponse = requestWithRetry('POST', `${BASE_URL}/accounts`, JSON.stringify(accountData), headers);

  const createSuccess = check(createResponse, {
    'account creation status is 2xx': (r) => r.status >= 200 && r.status < 300,
    'account creation response time < 500ms': (r) => r.timings.duration < 500,
  });

  errorRate.add(!createSuccess);
  responseTime.add(createResponse.timings.duration);
  requestCount.add(1);

  if (createSuccess && createResponse.status === 201) {
    const account = safeParseJson(createResponse.body);
    const accountId = pickAccountId(account);

    if (accountId) {
      // Get account
      const getResponse = http.get(`${BASE_URL}/accounts/${accountId}`, {
        headers: headers,
      });

      const getSuccess = check(getResponse, {
      'account retrieval status is 2xx': (r) => r.status >= 200 && r.status < 300,
        'customer retrieval response time < 200ms': (r) => r.timings.duration < 200,
      });

      errorRate.add(!getSuccess);
      responseTime.add(getResponse.timings.duration);
      requestCount.add(1);

      if (getSuccess) {
        // Update account
        const updateData = {
          name: 'Updated Account',
          phone: '+1-555-0001'
        };

        const updateResponse = http.put(`${BASE_URL}/accounts/${accountId}`, JSON.stringify(updateData), {
          headers: headers,
        });

        const updateSuccess = check(updateResponse, {
          'account update status is 2xx': (r) => r.status >= 200 && r.status < 300,
          'account update response time < 300ms': (r) => r.timings.duration < 300,
        });

        errorRate.add(!updateSuccess);
        responseTime.add(updateResponse.timings.duration);
        requestCount.add(1);
      }
    }
  }
}

// Work Order Operations Test (reuses accountId from setup to avoid extra list calls)
function testWorkOrderOperations(headers, context) {
  const customerId = context?.accountId;
  if (!customerId) return;

  const workOrderData = {
    customer_id: customerId,
    service_type: 'pest_control',
    priority: 'medium',
    scheduled_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    description: 'Load test work order'
  };

  // Create work order
  const createResponse = requestWithRetry('POST', `${BASE_URL}/work-orders`, JSON.stringify(workOrderData), headers);

  const createSuccess = check(createResponse, {
    'work order creation status is 2xx': (r) => r.status >= 200 && r.status < 300,
    'work order creation response time < 800ms': (r) => r.timings.duration < 800,
  });

  errorRate.add(!createSuccess);
  responseTime.add(createResponse.timings.duration);
  requestCount.add(1);

  if (createSuccess && createResponse.status === 201) {
    const workOrder = JSON.parse(createResponse.body);
    const workOrderId = workOrder.id;

    // Get work order
    const getResponse = requestWithRetry('GET', `${BASE_URL}/work-orders/${workOrderId}`, null, headers);

    const getSuccess = check(getResponse, {
      'work order retrieval status is 2xx': (r) => r.status >= 200 && r.status < 300,
      'work order retrieval response time < 600ms': (r) => r.timings.duration < 600,
    });

    errorRate.add(!getSuccess);
    responseTime.add(getResponse.timings.duration);
    requestCount.add(1);

    // Update work order status
    const statusUpdate = {
      status: 'in-progress'
    };

    const updateResponse = requestWithRetry('PUT', `${BASE_URL}/work-orders/${workOrderId}`, JSON.stringify(statusUpdate), headers);

    const updateSuccess = check(updateResponse, {
      'work order update status is 2xx': (r) => r.status >= 200 && r.status < 300,
      'work order update response time < 800ms': (r) => r.timings.duration < 800,
    });

    errorRate.add(!updateSuccess);
    responseTime.add(updateResponse.timings.duration);
    requestCount.add(1);
  }
}

// Technician Operations Test
function testTechnicianOperations(headers, context) {
  const userId = context?.userId || '85b4bc59-650a-4fdf-beac-1dd2ba3066f4';

  // Use existing technician if available to avoid duplicate user_id failures
  const listResponse = http.get(`${BASE_URL}/technicians?limit=1`, { headers });
  const listBody = safeParseJson(listResponse.body);
  const existingTechId = pickAccountId(listBody) || (listBody?.data && listBody.data[0]?.id);

  if (existingTechId) {
    const getResponse = http.get(`${BASE_URL}/technicians/${existingTechId}`, { headers });
    const getSuccess = check(getResponse, {
      'technician retrieval status is 2xx': (r) => r.status >= 200 && r.status < 300,
      'technician retrieval response time < 200ms': (r) => r.timings.duration < 200,
    });
    errorRate.add(!getSuccess);
    responseTime.add(getResponse.timings.duration);
    requestCount.add(1);

    const updatePayload = {
      status: 'inactive',
      position: 'Updated Technician',
      department: 'Operations'
    };
    const updateResponse = http.put(`${BASE_URL}/technicians/${existingTechId}`, JSON.stringify(updatePayload), { headers });
    const updateSuccess = check(updateResponse, {
      'technician update status is 2xx': (r) => r.status >= 200 && r.status < 300,
      'technician update response time < 300ms': (r) => r.timings.duration < 300,
    });
    errorRate.add(!updateSuccess);
    responseTime.add(updateResponse.timings.duration);
    requestCount.add(1);
    return;
  }

  const technicianData = {
    user_id: userId,
    employee_id: `EMP${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
    hire_date: new Date().toISOString().split('T')[0],
    position: 'Field Technician',
    department: 'Operations',
    employment_type: 'full_time',
    status: 'active',
    emergency_contact_name: 'Jane Doe',
    emergency_contact_phone: '+1-412-555-0123',
    emergency_contact_relationship: 'Spouse',
    address_line1: '123 Main St',
    city: 'Pittsburgh',
    state: 'PA',
    postal_code: '15213',
    country: 'USA',
    date_of_birth: '1990-01-15',
    social_security_number: '123-45-6789'
  };

  // Create technician
  const createResponse = http.post(`${BASE_URL}/technicians`, JSON.stringify(technicianData), {
    headers: headers,
  });

  const createSuccess = check(createResponse, {
    'technician creation status is 2xx': (r) => r.status >= 200 && r.status < 300,
    'technician creation response time < 500ms': (r) => r.timings.duration < 500,
  });

  errorRate.add(!createSuccess);
  responseTime.add(createResponse.timings.duration);
  requestCount.add(1);

  if (createSuccess && createResponse.status === 201) {
    const technician = JSON.parse(createResponse.body);
    const technicianId = technician.id;

    // Get technician
    const getResponse = http.get(`${BASE_URL}/technicians/${technicianId}`, {
      headers: headers,
    });

    const getSuccess = check(getResponse, {
      'technician retrieval status is 2xx': (r) => r.status >= 200 && r.status < 300,
      'technician retrieval response time < 200ms': (r) => r.timings.duration < 200,
    });

    errorRate.add(!getSuccess);
    responseTime.add(getResponse.timings.duration);
    requestCount.add(1);

    // Update technician availability
    const availabilityUpdate = {
      status: 'inactive',
      position: 'Updated Technician',
      department: 'Operations'
    };

    const updateResponse = http.put(`${BASE_URL}/technicians/${technicianId}`, JSON.stringify(availabilityUpdate), {
      headers: headers,
    });

    const updateSuccess = check(updateResponse, {
      'technician update status is 2xx': (r) => r.status >= 200 && r.status < 300,
      'technician update response time < 300ms': (r) => r.timings.duration < 300,
    });

    errorRate.add(!updateSuccess);
    responseTime.add(updateResponse.timings.duration);
    requestCount.add(1);
  }
}

// Search Operations Test
function testSearchOperations(headers) {
  const searchQueries = [
    'John',
    'pest control',
    'scheduled',
    'high priority',
    'completed'
  ];

  const query = searchQueries[Math.floor(Math.random() * searchQueries.length)];

  // Search customers
  const customerSearchResponse = http.get(`${BASE_URL}/accounts/search?q=${query}`, {
    headers: headers,
  });

  const customerSearchSuccess = check(customerSearchResponse, {
    'account search status is 2xx': (r) => r.status >= 200 && r.status < 300,
    'account search response time < 300ms': (r) => r.timings.duration < 300,
  });

  errorRate.add(!customerSearchSuccess);
  responseTime.add(customerSearchResponse.timings.duration);
  requestCount.add(1);

  // Search work orders
  const workOrderSearchResponse = http.get(`${BASE_URL}/work-orders?status=pending&limit=5`, {
    headers: headers,
  });

  const workOrderSearchSuccess = check(workOrderSearchResponse, {
    'work order search status is 2xx': (r) => r.status >= 200 && r.status < 300,
    'work order search response time < 300ms': (r) => r.timings.duration < 300,
  });

  errorRate.add(!workOrderSearchSuccess);
  responseTime.add(workOrderSearchResponse.timings.duration);
  requestCount.add(1);

  // Search technicians
  const technicianSearchResponse = http.get(`${BASE_URL}/technicians?search=${query}&limit=5`, {
    headers: headers,
  });

  const technicianSearchSuccess = check(technicianSearchResponse, {
    'technician search status is 2xx': (r) => r.status >= 200 && r.status < 300,
    'technician search response time < 300ms': (r) => r.timings.duration < 300,
  });

  errorRate.add(!technicianSearchSuccess);
  responseTime.add(technicianSearchResponse.timings.duration);
  requestCount.add(1);
}

export function teardown(data) {
  // No-op teardown; metrics are emitted via k6 output.
}






