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
const accountId = __ENV.ACCOUNT_ID || '0035054e-3035-4e15-a69c-1af08556f920';
const serviceTypeId = __ENV.SERVICE_TYPE_ID || '15d3f358-4418-4c90-8302-388c0afd3572';

function requestWithRetry(method, url, body, headers, allowRetry = true) {
  const res = http.request(method, url, body, { headers });
  if (res.status === 429 && allowRetry) {
    sleep(2);
    return http.request(method, url, body, { headers });
  }
  return res;
}

export default function () {
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
  if (!token) {
    sleep(1);
    return;
  }
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const invoicePayload = {
    account_id: accountId,
    issue_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [
      {
        service_type_id: serviceTypeId,
        description: 'Perf smoke invoice item',
        quantity: 1,
        unit_price: 149.99,
      },
    ],
  };

  const invRes = requestWithRetry('POST', `${BASE_URL}/billing/invoices`, JSON.stringify(invoicePayload), headers);
  check(invRes, {
    'invoice create 2xx': (r) => r.status >= 200 && r.status < 300,
    'invoice create rt < 800ms': (r) => r.timings.duration < 800,
  });

  sleep(1);
}

