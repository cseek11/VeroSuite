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
  stages: [
    { duration: '2m', target: 10 },   // Ramp up to 10 users
    { duration: '5m', target: 10 },   // Stay at 10 users
    { duration: '2m', target: 50 },   // Ramp up to 50 users
    { duration: '5m', target: 50 },   // Stay at 50 users
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 0 },    // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'], // 95% of requests must complete below 200ms
    http_req_failed: ['rate<0.1'],    // Error rate must be below 10%
    error_rate: ['rate<0.05'],        // Custom error rate below 5%
  },
};

// Test data
const testData = new SharedArray('test_data', function () {
  return JSON.parse(open('./test-data.json'));
});

// Base URL
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Authentication token (should be obtained from login)
let authToken = '';

export function setup() {
  // Login and get authentication token
  const loginPayload = JSON.stringify({
    email: 'loadtest@verofield.com',
    password: 'LoadTest123!'
  });

  const loginResponse = http.post(`${BASE_URL}/auth/login`, loginPayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (loginResponse.status === 200) {
    const loginData = JSON.parse(loginResponse.body);
    authToken = loginData.access_token;
    console.log('Authentication successful');
  } else {
    console.error('Authentication failed:', loginResponse.status, loginResponse.body);
  }

  return { authToken };
}

export default function (data) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`,
  };

  // Test scenarios
  const scenarios = [
    testCustomerOperations,
    testWorkOrderOperations,
    testTechnicianOperations,
    testSearchOperations,
    testAnalyticsOperations,
  ];

  // Randomly select a scenario
  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  scenario(headers);

  sleep(1);
}

// Customer Operations Test
function testCustomerOperations(headers) {
  const customerData = {
    first_name: `LoadTest${Math.random().toString(36).substr(2, 9)}`,
    last_name: 'User',
    email: `loadtest${Math.random().toString(36).substr(2, 9)}@example.com`,
    phone: '+1-555-0000',
    address: '123 Load Test Street',
    city: 'Test City',
    state: 'TC',
    zip_code: '12345'
  };

  // Create customer
  const createResponse = http.post(`${BASE_URL}/api/customers`, JSON.stringify(customerData), {
    headers: headers,
  });

  const createSuccess = check(createResponse, {
    'customer creation status is 201': (r) => r.status === 201,
    'customer creation response time < 500ms': (r) => r.timings.duration < 500,
  });

  errorRate.add(!createSuccess);
  responseTime.add(createResponse.timings.duration);
  requestCount.add(1);

  if (createSuccess && createResponse.status === 201) {
    const customer = JSON.parse(createResponse.body);
    const customerId = customer.id;

    // Get customer
    const getResponse = http.get(`${BASE_URL}/api/customers/${customerId}`, {
      headers: headers,
    });

    const getSuccess = check(getResponse, {
      'customer retrieval status is 200': (r) => r.status === 200,
      'customer retrieval response time < 200ms': (r) => r.timings.duration < 200,
    });

    errorRate.add(!getSuccess);
    responseTime.add(getResponse.timings.duration);
    requestCount.add(1);

    // Update customer
    const updateData = {
      first_name: 'Updated',
      last_name: 'Customer'
    };

    const updateResponse = http.put(`${BASE_URL}/api/customers/${customerId}`, JSON.stringify(updateData), {
      headers: headers,
    });

    const updateSuccess = check(updateResponse, {
      'customer update status is 200': (r) => r.status === 200,
      'customer update response time < 300ms': (r) => r.timings.duration < 300,
    });

    errorRate.add(!updateSuccess);
    responseTime.add(updateResponse.timings.duration);
    requestCount.add(1);
  }
}

// Work Order Operations Test
function testWorkOrderOperations(headers) {
  // Get customers for work order creation
  const customersResponse = http.get(`${BASE_URL}/api/customers?limit=1`, {
    headers: headers,
  });

  if (customersResponse.status === 200) {
    const customers = JSON.parse(customersResponse.body);
    if (customers.customers && customers.customers.length > 0) {
      const customerId = customers.customers[0].id;

      const workOrderData = {
        customer_id: customerId,
        service_type: 'pest_control',
        priority: 'medium',
        scheduled_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        description: 'Load test work order'
      };

      // Create work order
      const createResponse = http.post(`${BASE_URL}/api/work-orders`, JSON.stringify(workOrderData), {
        headers: headers,
      });

      const createSuccess = check(createResponse, {
        'work order creation status is 201': (r) => r.status === 201,
        'work order creation response time < 500ms': (r) => r.timings.duration < 500,
      });

      errorRate.add(!createSuccess);
      responseTime.add(createResponse.timings.duration);
      requestCount.add(1);

      if (createSuccess && createResponse.status === 201) {
        const workOrder = JSON.parse(createResponse.body);
        const workOrderId = workOrder.id;

        // Get work order
        const getResponse = http.get(`${BASE_URL}/api/work-orders/${workOrderId}`, {
          headers: headers,
        });

        const getSuccess = check(getResponse, {
          'work order retrieval status is 200': (r) => r.status === 200,
          'work order retrieval response time < 200ms': (r) => r.timings.duration < 200,
        });

        errorRate.add(!getSuccess);
        responseTime.add(getResponse.timings.duration);
        requestCount.add(1);

        // Update work order status
        const statusUpdate = {
          status: 'in_progress'
        };

        const updateResponse = http.put(`${BASE_URL}/api/work-orders/${workOrderId}/status`, JSON.stringify(statusUpdate), {
          headers: headers,
        });

        const updateSuccess = check(updateResponse, {
          'work order update status is 200': (r) => r.status === 200,
          'work order update response time < 300ms': (r) => r.timings.duration < 300,
        });

        errorRate.add(!updateSuccess);
        responseTime.add(updateResponse.timings.duration);
        requestCount.add(1);
      }
    }
  }
}

// Technician Operations Test
function testTechnicianOperations(headers) {
  const technicianData = {
    first_name: `Tech${Math.random().toString(36).substr(2, 9)}`,
    last_name: 'Technician',
    email: `tech${Math.random().toString(36).substr(2, 9)}@example.com`,
    phone: '+1-555-0000',
    skills: ['pest_control', 'inspection'],
    availability: 'available'
  };

  // Create technician
  const createResponse = http.post(`${BASE_URL}/api/technicians`, JSON.stringify(technicianData), {
    headers: headers,
  });

  const createSuccess = check(createResponse, {
    'technician creation status is 201': (r) => r.status === 201,
    'technician creation response time < 500ms': (r) => r.timings.duration < 500,
  });

  errorRate.add(!createSuccess);
  responseTime.add(createResponse.timings.duration);
  requestCount.add(1);

  if (createSuccess && createResponse.status === 201) {
    const technician = JSON.parse(createResponse.body);
    const technicianId = technician.id;

    // Get technician
    const getResponse = http.get(`${BASE_URL}/api/technicians/${technicianId}`, {
      headers: headers,
    });

    const getSuccess = check(getResponse, {
      'technician retrieval status is 200': (r) => r.status === 200,
      'technician retrieval response time < 200ms': (r) => r.timings.duration < 200,
    });

    errorRate.add(!getSuccess);
    responseTime.add(getResponse.timings.duration);
    requestCount.add(1);

    // Update technician availability
    const availabilityUpdate = {
      availability: 'busy'
    };

    const updateResponse = http.put(`${BASE_URL}/api/technicians/${technicianId}/availability`, JSON.stringify(availabilityUpdate), {
      headers: headers,
    });

    const updateSuccess = check(updateResponse, {
      'technician update status is 200': (r) => r.status === 200,
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
  const customerSearchResponse = http.get(`${BASE_URL}/api/customers/search?q=${query}`, {
    headers: headers,
  });

  const customerSearchSuccess = check(customerSearchResponse, {
    'customer search status is 200': (r) => r.status === 200,
    'customer search response time < 300ms': (r) => r.timings.duration < 300,
  });

  errorRate.add(!customerSearchSuccess);
  responseTime.add(customerSearchResponse.timings.duration);
  requestCount.add(1);

  // Search work orders
  const workOrderSearchResponse = http.get(`${BASE_URL}/api/work-orders/search?q=${query}`, {
    headers: headers,
  });

  const workOrderSearchSuccess = check(workOrderSearchResponse, {
    'work order search status is 200': (r) => r.status === 200,
    'work order search response time < 300ms': (r) => r.timings.duration < 300,
  });

  errorRate.add(!workOrderSearchSuccess);
  responseTime.add(workOrderSearchResponse.timings.duration);
  requestCount.add(1);

  // Search technicians
  const technicianSearchResponse = http.get(`${BASE_URL}/api/technicians/search?q=${query}`, {
    headers: headers,
  });

  const technicianSearchSuccess = check(technicianSearchResponse, {
    'technician search status is 200': (r) => r.status === 200,
    'technician search response time < 300ms': (r) => r.timings.duration < 300,
  });

  errorRate.add(!technicianSearchSuccess);
  responseTime.add(technicianSearchResponse.timings.duration);
  requestCount.add(1);
}

// Analytics Operations Test
function testAnalyticsOperations(headers) {
  // Get dashboard analytics
  const dashboardResponse = http.get(`${BASE_URL}/api/analytics/dashboard`, {
    headers: headers,
  });

  const dashboardSuccess = check(dashboardResponse, {
    'dashboard analytics status is 200': (r) => r.status === 200,
    'dashboard analytics response time < 500ms': (r) => r.timings.duration < 500,
  });

  errorRate.add(!dashboardSuccess);
  responseTime.add(dashboardResponse.timings.duration);
  requestCount.add(1);

  // Get customer analytics
  const customerAnalyticsResponse = http.get(`${BASE_URL}/api/analytics/customers`, {
    headers: headers,
  });

  const customerAnalyticsSuccess = check(customerAnalyticsResponse, {
    'customer analytics status is 200': (r) => r.status === 200,
    'customer analytics response time < 500ms': (r) => r.timings.duration < 500,
  });

  errorRate.add(!customerAnalyticsSuccess);
  responseTime.add(customerAnalyticsResponse.timings.duration);
  requestCount.add(1);

  // Get work order analytics
  const workOrderAnalyticsResponse = http.get(`${BASE_URL}/api/analytics/work-orders`, {
    headers: headers,
  });

  const workOrderAnalyticsSuccess = check(workOrderAnalyticsResponse, {
    'work order analytics status is 200': (r) => r.status === 200,
    'work order analytics response time < 500ms': (r) => r.timings.duration < 500,
  });

  errorRate.add(!workOrderAnalyticsSuccess);
  responseTime.add(workOrderAnalyticsResponse.timings.duration);
  requestCount.add(1);
}

export function teardown(data) {
  console.log('Load test completed');
  console.log('Final error rate:', errorRate.values);
  console.log('Average response time:', responseTime.values);
  console.log('Total requests:', requestCount.values);
}






