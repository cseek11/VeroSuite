/**
 * K6 Stress Testing Suite
 * Extreme load testing to identify breaking points and system limits
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('error_rate');
const responseTime = new Trend('response_time');
const requestCount = new Counter('request_count');
const timeoutRate = new Rate('timeout_rate');

// Stress test configuration
export const options = {
  stages: [
    { duration: '1m', target: 100 },   // Ramp up to 100 users
    { duration: '2m', target: 100 },   // Stay at 100 users
    { duration: '1m', target: 500 },   // Ramp up to 500 users
    { duration: '3m', target: 500 },   // Stay at 500 users
    { duration: '1m', target: 1000 },  // Ramp up to 1000 users
    { duration: '5m', target: 1000 },  // Stay at 1000 users
    { duration: '1m', target: 2000 },  // Ramp up to 2000 users
    { duration: '3m', target: 2000 },  // Stay at 2000 users
    { duration: '2m', target: 0 },     // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% of requests must complete below 1000ms
    http_req_failed: ['rate<0.3'],     // Error rate must be below 30%
    error_rate: ['rate<0.2'],          // Custom error rate below 20%
    timeout_rate: ['rate<0.1'],        // Timeout rate below 10%
  },
};

// Base URL
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Authentication token
let authToken = '';

export function setup() {
  // Login and get authentication token
  const loginPayload = JSON.stringify({
    email: 'stresstest@verosuite.com',
    password: 'StressTest123!'
  });

  const loginResponse = http.post(`${BASE_URL}/auth/login`, loginPayload, {
    headers: { 'Content-Type': 'application/json' },
    timeout: '30s',
  });

  if (loginResponse.status === 200) {
    const loginData = JSON.parse(loginResponse.body);
    authToken = loginData.access_token;
    console.log('Authentication successful for stress test');
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

  // Stress test scenarios
  const scenarios = [
    stressTestCustomerOperations,
    stressTestWorkOrderOperations,
    stressTestSearchOperations,
    stressTestAnalyticsOperations,
    stressTestConcurrentOperations,
  ];

  // Randomly select a scenario
  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  scenario(headers);

  sleep(0.5); // Reduced sleep time for higher stress
}

// Stress Test Customer Operations
function stressTestCustomerOperations(headers) {
  const customerData = {
    first_name: `StressTest${Math.random().toString(36).substr(2, 9)}`,
    last_name: 'User',
    email: `stresstest${Math.random().toString(36).substr(2, 9)}@example.com`,
    phone: '+1-555-0000',
    address: '123 Stress Test Street',
    city: 'Stress City',
    state: 'SC',
    zip_code: '12345'
  };

  // Create customer with timeout
  const createResponse = http.post(`${BASE_URL}/api/customers`, JSON.stringify(customerData), {
    headers: headers,
    timeout: '10s',
  });

  const createSuccess = check(createResponse, {
    'customer creation status is 201': (r) => r.status === 201,
    'customer creation response time < 2000ms': (r) => r.timings.duration < 2000,
    'customer creation no timeout': (r) => r.timings.duration < 10000,
  });

  errorRate.add(!createSuccess);
  responseTime.add(createResponse.timings.duration);
  requestCount.add(1);
  timeoutRate.add(createResponse.timings.duration >= 10000);

  if (createSuccess && createResponse.status === 201) {
    const customer = JSON.parse(createResponse.body);
    const customerId = customer.id;

    // Concurrent operations on the same customer
    const operations = [
      () => http.get(`${BASE_URL}/api/customers/${customerId}`, { headers: headers, timeout: '5s' }),
      () => http.put(`${BASE_URL}/api/customers/${customerId}`, JSON.stringify({ first_name: 'Updated' }), { headers: headers, timeout: '5s' }),
      () => http.get(`${BASE_URL}/api/customers/${customerId}/work-orders`, { headers: headers, timeout: '5s' }),
    ];

    // Execute operations concurrently
    const responses = operations.map(op => op());
    
    responses.forEach(response => {
      const success = check(response, {
        'concurrent operation status is 200': (r) => r.status === 200,
        'concurrent operation response time < 1000ms': (r) => r.timings.duration < 1000,
      });

      errorRate.add(!success);
      responseTime.add(response.timings.duration);
      requestCount.add(1);
    });
  }
}

// Stress Test Work Order Operations
function stressTestWorkOrderOperations(headers) {
  // Get customers for work order creation
  const customersResponse = http.get(`${BASE_URL}/api/customers?limit=5`, {
    headers: headers,
    timeout: '10s',
  });

  if (customersResponse.status === 200) {
    const customers = JSON.parse(customersResponse.body);
    if (customers.customers && customers.customers.length > 0) {
      const customerId = customers.customers[0].id;

      // Create multiple work orders concurrently
      const workOrderPromises = [];
      for (let i = 0; i < 5; i++) {
        const workOrderData = {
          customer_id: customerId,
          service_type: 'pest_control',
          priority: 'high',
          scheduled_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          description: `Stress test work order ${i}`
        };

        workOrderPromises.push(
          http.post(`${BASE_URL}/api/work-orders`, JSON.stringify(workOrderData), {
            headers: headers,
            timeout: '10s',
          })
        );
      }

      // Execute all work order creations concurrently
      workOrderPromises.forEach(promise => {
        const response = promise;
        const success = check(response, {
          'work order creation status is 201': (r) => r.status === 201,
          'work order creation response time < 2000ms': (r) => r.timings.duration < 2000,
        });

        errorRate.add(!success);
        responseTime.add(response.timings.duration);
        requestCount.add(1);
      });
    }
  }
}

// Stress Test Search Operations
function stressTestSearchOperations(headers) {
  const searchQueries = [
    'John', 'pest', 'control', 'scheduled', 'high', 'priority', 'completed',
    'inspection', 'treatment', 'customer', 'technician', 'work', 'order'
  ];

  // Perform multiple searches concurrently
  const searchPromises = [];
  for (let i = 0; i < 10; i++) {
    const query = searchQueries[Math.floor(Math.random() * searchQueries.length)];
    
    searchPromises.push(
      http.get(`${BASE_URL}/api/customers/search?q=${query}`, {
        headers: headers,
        timeout: '5s',
      })
    );
  }

  // Execute all searches concurrently
  searchPromises.forEach(promise => {
    const response = promise;
    const success = check(response, {
      'search operation status is 200': (r) => r.status === 200,
      'search operation response time < 1000ms': (r) => r.timings.duration < 1000,
    });

    errorRate.add(!success);
    responseTime.add(response.timings.duration);
    requestCount.add(1);
  });
}

// Stress Test Analytics Operations
function stressTestAnalyticsOperations(headers) {
  // Perform multiple analytics queries concurrently
  const analyticsPromises = [
    http.get(`${BASE_URL}/api/analytics/dashboard`, { headers: headers, timeout: '10s' }),
    http.get(`${BASE_URL}/api/analytics/customers`, { headers: headers, timeout: '10s' }),
    http.get(`${BASE_URL}/api/analytics/work-orders`, { headers: headers, timeout: '10s' }),
    http.get(`${BASE_URL}/api/analytics/technicians`, { headers: headers, timeout: '10s' }),
    http.get(`${BASE_URL}/api/analytics/revenue`, { headers: headers, timeout: '10s' }),
  ];

  // Execute all analytics queries concurrently
  analyticsPromises.forEach(promise => {
    const response = promise;
    const success = check(response, {
      'analytics operation status is 200': (r) => r.status === 200,
      'analytics operation response time < 2000ms': (r) => r.timings.duration < 2000,
    });

    errorRate.add(!success);
    responseTime.add(response.timings.duration);
    requestCount.add(1);
  });
}

// Stress Test Concurrent Operations
function stressTestConcurrentOperations(headers) {
  // Perform multiple different operations concurrently
  const operations = [
    // Customer operations
    () => http.get(`${BASE_URL}/api/customers?limit=10`, { headers: headers, timeout: '5s' }),
    () => http.get(`${BASE_URL}/api/customers?limit=20`, { headers: headers, timeout: '5s' }),
    
    // Work order operations
    () => http.get(`${BASE_URL}/api/work-orders?limit=10`, { headers: headers, timeout: '5s' }),
    () => http.get(`${BASE_URL}/api/work-orders?limit=20`, { headers: headers, timeout: '5s' }),
    
    // Technician operations
    () => http.get(`${BASE_URL}/api/technicians?limit=10`, { headers: headers, timeout: '5s' }),
    () => http.get(`${BASE_URL}/api/technicians?limit=20`, { headers: headers, timeout: '5s' }),
    
    // Search operations
    () => http.get(`${BASE_URL}/api/customers/search?q=test`, { headers: headers, timeout: '5s' }),
    () => http.get(`${BASE_URL}/api/work-orders/search?q=test`, { headers: headers, timeout: '5s' }),
    
    // Analytics operations
    () => http.get(`${BASE_URL}/api/analytics/dashboard`, { headers: headers, timeout: '10s' }),
  ];

  // Execute all operations concurrently
  const responses = operations.map(op => op());
  
  responses.forEach(response => {
    const success = check(response, {
      'concurrent operation status is 200': (r) => r.status === 200,
      'concurrent operation response time < 2000ms': (r) => r.timings.duration < 2000,
    });

    errorRate.add(!success);
    responseTime.add(response.timings.duration);
    requestCount.add(1);
  });
}

export function teardown(data) {
  console.log('Stress test completed');
  console.log('Final error rate:', errorRate.values);
  console.log('Average response time:', responseTime.values);
  console.log('Total requests:', requestCount.values);
  console.log('Timeout rate:', timeoutRate.values);
}






