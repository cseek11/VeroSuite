import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,
  duration: '30s',
  rps: 1,
  thresholds: {
    http_req_failed: ['rate<0.2'],
    http_req_duration: ['p(95)<800'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001/api/v1';
const email = __ENV.AUTH_EMAIL || 'cseek@verofield.com';
const password = __ENV.AUTH_PASSWORD || 'Slayer6211!00';
const accountId = __ENV.ACCOUNT_ID || 'f3a934d2-e6df-4fe6-a2de-f3ec245d5ffc'; // same tenant as provided location
const locationId = __ENV.LOCATION_ID || '3448f60e-6c50-4157-bf97-fff5954964b8';

function requestWithRetry(method, url, body, headers, allowRetry = true) {
  const res = http.request(method, url, body, { headers });
  if (res.status === 429 && allowRetry) {
    sleep(2);
    return http.request(method, url, body, { headers });
  }
  return res;
}

export function setup() {
  const loginRes = requestWithRetry(
    'POST',
    `${BASE_URL}/auth/login`,
    JSON.stringify({ email, password }),
    { 'Content-Type': 'application/json' },
    true
  );
  let token = '';
  if (loginRes.status >= 200 && loginRes.status < 300) {
    try {
      token = JSON.parse(loginRes.body).access_token;
    } catch (e) {
      token = '';
    }
  }
  return { token };
}

export default function (data) {
  const token = data?.token;
  if (!token) {
    sleep(1);
    return;
  }
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  // Create work order to attach job
  const workOrderPayload = {
    customer_id: accountId,
    service_type: 'pest_control',
    priority: 'medium',
    scheduled_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    description: 'Perf smoke work order',
  };
  const woRes = requestWithRetry('POST', `${BASE_URL}/work-orders`, JSON.stringify(workOrderPayload), headers);
  const okWO = check(woRes, { 'work order create 2xx': (r) => r.status >= 200 && r.status < 300 });
  if (!okWO) {
    sleep(1);
    return;
  }
  let workOrderId = '';
  try {
    workOrderId = JSON.parse(woRes.body).id;
  } catch (e) {
    workOrderId = '';
  }
  if (!workOrderId) {
    sleep(1);
    return;
  }

  // Create job
  const jobPayload = {
    work_order_id: workOrderId,
    account_id: accountId,
    location_id: locationId,
    scheduled_date: new Date().toISOString().split('T')[0],
    priority: 'medium',
    job_number: `JOB-${Math.random().toString(36).substr(2, 5)}`,
  };
  const jobRes = requestWithRetry('POST', `${BASE_URL}/jobs`, JSON.stringify(jobPayload), headers);
  const okJob = check(jobRes, { 'job create 2xx': (r) => r.status >= 200 && r.status < 300 });
  if (!okJob) {
    sleep(1);
    return;
  }

  let jobId = '';
  try {
    jobId = JSON.parse(jobRes.body).id;
  } catch (e) {
    jobId = '';
  }

  if (jobId) {
    const getRes = requestWithRetry('GET', `${BASE_URL}/jobs/${jobId}`, null, headers);
    check(getRes, { 'job get 2xx': (r) => r.status >= 200 && r.status < 300 });
  }

  sleep(1);
}

