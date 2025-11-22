/**
 * K6 Load Testing Suite for Dashboard Regions
 * Tests performance with > 100 regions
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';
import { SharedArray } from 'k6/data';

// Custom metrics
const errorRate = new Rate('error_rate');
const responseTime = new Trend('response_time');
const requestCount = new Counter('request_count');
const regionOperationTime = new Trend('region_operation_time');
const layoutLoadTime = new Trend('layout_load_time');

// Test configuration - focused on region operations
export const options = {
  stages: [
    { duration: '1m', target: 5 },    // Ramp up to 5 users
    { duration: '3m', target: 5 },    // Stay at 5 users
    { duration: '2m', target: 20 },   // Ramp up to 20 users
    { duration: '5m', target: 20 },   // Stay at 20 users
    { duration: '2m', target: 50 },   // Ramp up to 50 users
    { duration: '5m', target: 50 },   // Stay at 50 users
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'], // 95% < 500ms, 99% < 1s
    http_req_failed: ['rate<0.05'],                 // Error rate < 5%
    error_rate: ['rate<0.03'],                      // Custom error rate < 3%
    layout_load_time: ['p(95)<1000'],                // Layout load < 1s
    region_operation_time: ['p(95)<300'],            // Region ops < 300ms
  },
};

// Base URL
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const API_VERSION = __ENV.API_VERSION || 'v2';

// Test data
const regionTypes = ['scheduling', 'analytics', 'work-orders', 'customers', 'technicians'];
let authToken = '';
let layoutId = '';
let createdRegionIds = [];

export function setup() {
  // Login and get authentication token
  const loginPayload = JSON.stringify({
    email: __ENV.TEST_EMAIL || 'loadtest@verofield.com',
    password: __ENV.TEST_PASSWORD || 'LoadTest123!'
  });

  const loginResponse = http.post(`${BASE_URL}/auth/login`, loginPayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (loginResponse.status === 200) {
    const loginData = JSON.parse(loginResponse.body);
    authToken = loginData.access_token || loginData.token;
    console.log('Authentication successful');
  } else {
    console.error('Authentication failed:', loginResponse.status, loginResponse.body);
    // Use mock token for testing
    authToken = 'mock-token';
  }

  // Get or create default layout
  const layoutResponse = http.get(`${BASE_URL}/api/${API_VERSION}/dashboard/layouts/default`, {
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (layoutResponse.status === 200) {
    const layoutData = JSON.parse(layoutResponse.body);
    layoutId = layoutData.data?.id || layoutData.id;
    console.log('Layout ID:', layoutId);
  } else {
    // Create layout if doesn't exist
    const createLayoutResponse = http.post(`${BASE_URL}/api/${API_VERSION}/dashboard/layouts`, JSON.stringify({
      name: 'Load Test Layout',
      is_default: true
    }), {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (createLayoutResponse.status === 201) {
      const layoutData = JSON.parse(createLayoutResponse.body);
      layoutId = layoutData.data?.id || layoutData.id;
    }
  }

  // Pre-create 100+ regions for load testing
  console.log('Pre-creating regions for load test...');
  const regionsToCreate = parseInt(__ENV.REGION_COUNT || '100');
  
  for (let i = 0; i < regionsToCreate; i++) {
    const regionType = regionTypes[i % regionTypes.length];
    const gridRow = Math.floor(i / 12);
    const gridCol = i % 12;
    
    const createResponse = http.post(
      `${BASE_URL}/api/${API_VERSION}/dashboard/layouts/${layoutId}/regions`,
      JSON.stringify({
        region_type: regionType,
        grid_row: gridRow,
        grid_col: gridCol,
        row_span: 1,
        col_span: 1
      }),
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (createResponse.status === 201) {
      const regionData = JSON.parse(createResponse.body);
      const regionId = regionData.data?.id || regionData.id;
      createdRegionIds.push(regionId);
    }

    if (i % 10 === 0) {
      console.log(`Created ${i + 1}/${regionsToCreate} regions`);
    }
  }

  console.log(`Setup complete. Created ${createdRegionIds.length} regions`);

  return { authToken, layoutId, regionIds: createdRegionIds };
}

export default function (data) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${data.authToken}`,
  };

  // Randomly select a test scenario
  const scenarios = [
    testLoadLayoutWithManyRegions,
    testCreateRegion,
    testUpdateRegion,
    testListRegions,
    testDeleteRegion,
    testBatchOperations,
  ];

  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  scenario(data, headers);

  sleep(1);
}

// Test loading layout with many regions
function testLoadLayoutWithManyRegions(data, headers) {
  const startTime = Date.now();
  
  const response = http.get(
    `${BASE_URL}/api/${API_VERSION}/dashboard/layouts/${data.layoutId}/regions`,
    { headers }
  );

  const duration = Date.now() - startTime;
  layoutLoadTime.add(duration);

  const success = check(response, {
    'layout load status is 200': (r) => r.status === 200,
    'layout load response time < 2000ms': (r) => r.timings.duration < 2000,
    'layout contains regions': (r) => {
      try {
        const body = JSON.parse(r.body);
        const regions = body.data || body;
        return Array.isArray(regions) && regions.length > 0;
      } catch {
        return false;
      }
    },
  });

  errorRate.add(!success);
  responseTime.add(response.timings.duration);
  requestCount.add(1);
}

// Test creating a region
function testCreateRegion(data, headers) {
  const startTime = Date.now();
  
  const regionType = regionTypes[Math.floor(Math.random() * regionTypes.length)];
  const gridRow = Math.floor(Math.random() * 20);
  const gridCol = Math.floor(Math.random() * 12);

  const createPayload = JSON.stringify({
    region_type: regionType,
    grid_row: gridRow,
    grid_col: gridCol,
    row_span: 1 + Math.floor(Math.random() * 3),
    col_span: 1 + Math.floor(Math.random() * 3)
  });

  const response = http.post(
    `${BASE_URL}/api/${API_VERSION}/dashboard/layouts/${data.layoutId}/regions`,
    createPayload,
    { headers }
  );

  const duration = Date.now() - startTime;
  regionOperationTime.add(duration);

  const success = check(response, {
    'region creation status is 201': (r) => r.status === 201,
    'region creation response time < 500ms': (r) => r.timings.duration < 500,
  });

  errorRate.add(!success);
  responseTime.add(response.timings.duration);
  requestCount.add(1);
}

// Test updating a region
function testUpdateRegion(data, headers) {
  if (data.regionIds.length === 0) {
    return;
  }

  const startTime = Date.now();
  
  const regionId = data.regionIds[Math.floor(Math.random() * data.regionIds.length)];
  
  // Get current region to get version
  const getResponse = http.get(
    `${BASE_URL}/api/${API_VERSION}/dashboard/layouts/${data.layoutId}/regions/${regionId}`,
    { headers }
  );

  if (getResponse.status !== 200) {
    return;
  }

  let version = 1;
  try {
    const regionData = JSON.parse(getResponse.body);
    version = regionData.data?.version || regionData.version || 1;
  } catch {
    // Use default version
  }

  const updatePayload = JSON.stringify({
    grid_row: Math.floor(Math.random() * 20),
    grid_col: Math.floor(Math.random() * 12),
    version: version
  });

  const response = http.put(
    `${BASE_URL}/api/${API_VERSION}/dashboard/layouts/${data.layoutId}/regions/${regionId}`,
    updatePayload,
    { headers }
  );

  const duration = Date.now() - startTime;
  regionOperationTime.add(duration);

  const success = check(response, {
    'region update status is 200': (r) => r.status === 200,
    'region update response time < 300ms': (r) => r.timings.duration < 300,
  });

  errorRate.add(!success);
  responseTime.add(response.timings.duration);
  requestCount.add(1);
}

// Test listing regions
function testListRegions(data, headers) {
  const startTime = Date.now();
  
  const response = http.get(
    `${BASE_URL}/api/${API_VERSION}/dashboard/layouts/${data.layoutId}/regions`,
    { headers }
  );

  const duration = Date.now() - startTime;
  layoutLoadTime.add(duration);

  const success = check(response, {
    'list regions status is 200': (r) => r.status === 200,
    'list regions response time < 1000ms': (r) => r.timings.duration < 1000,
    'response contains array': (r) => {
      try {
        const body = JSON.parse(r.body);
        return Array.isArray(body.data || body);
      } catch {
        return false;
      }
    },
  });

  errorRate.add(!success);
  responseTime.add(response.timings.duration);
  requestCount.add(1);
}

// Test deleting a region
function testDeleteRegion(data, headers) {
  if (data.regionIds.length === 0) {
    return;
  }

  const startTime = Date.now();
  
  const regionId = data.regionIds[Math.floor(Math.random() * data.regionIds.length)];

  const response = http.del(
    `${BASE_URL}/api/${API_VERSION}/dashboard/layouts/${data.layoutId}/regions/${regionId}`,
    null,
    { headers }
  );

  const duration = Date.now() - startTime;
  regionOperationTime.add(duration);

  const success = check(response, {
    'region deletion status is 200': (r) => r.status === 200,
    'region deletion response time < 300ms': (r) => r.timings.duration < 300,
  });

  errorRate.add(!success);
  responseTime.add(response.timings.duration);
  requestCount.add(1);

  // Remove from array if successful
  if (success && response.status === 200) {
    const index = data.regionIds.indexOf(regionId);
    if (index > -1) {
      data.regionIds.splice(index, 1);
    }
  }
}

// Test batch operations (if available)
function testBatchOperations(data, headers) {
  if (data.regionIds.length < 5) {
    return;
  }

  const startTime = Date.now();
  
  // Create batch update payload
  const updates = data.regionIds.slice(0, 5).map((regionId, index) => ({
    id: regionId,
    data: {
      grid_row: Math.floor(Math.random() * 20),
      grid_col: Math.floor(Math.random() * 12),
      version: 1 // Would need to fetch actual versions in real scenario
    }
  }));

  const batchPayload = JSON.stringify({
    update: updates
  });

  // Note: Adjust endpoint if batch endpoint is different
  const response = http.post(
    `${BASE_URL}/api/${API_VERSION}/dashboard/layouts/${data.layoutId}/regions/batch`,
    batchPayload,
    { headers }
  );

  const duration = Date.now() - startTime;
  regionOperationTime.add(duration);

  // Batch endpoint might not exist, so check is optional
  const success = check(response, {
    'batch operation status is 200 or 404': (r) => r.status === 200 || r.status === 404,
  });

  if (response.status !== 404) {
    errorRate.add(!success);
    responseTime.add(response.timings.duration);
    requestCount.add(1);
  }
}

export function teardown(data) {
  console.log('Load test completed');
  console.log('Final error rate:', errorRate.values);
  console.log('Average response time:', responseTime.values);
  console.log('Total requests:', requestCount.values);
  console.log('Layout load time (p95):', layoutLoadTime.values);
  console.log('Region operation time (p95):', regionOperationTime.values);
}


