import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,
  duration: '30s',
  rps: 3,
  thresholds: {
    http_req_failed: ['rate<0.2'],
    http_req_duration: ['p(95)<600'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001/api/v1';
const email = __ENV.AUTH_EMAIL || 'cseek@verofield.com';
const password = __ENV.AUTH_PASSWORD || 'Slayer6211!00';

export default function () {
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({ email, password }), {
    headers: { 'Content-Type': 'application/json' },
  });

  const okLogin = check(loginRes, {
    'login status 2xx': (r) => r.status >= 200 && r.status < 300,
  });

  let token = '';
  if (okLogin) {
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

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const accountPayload = {
    name: `PerfAcct-${Math.random().toString(36).substr(2, 6)}`,
    account_type: 'residential',
    email: `perf${Math.random().toString(36).substr(2, 6)}@example.com`,
    phone: '+1-555-0000',
  };

  const accountRes = http.post(`${BASE_URL}/accounts`, JSON.stringify(accountPayload), { headers });

  check(accountRes, {
    'account create 2xx': (r) => r.status >= 200 && r.status < 300,
    'account create rt < 800ms': (r) => r.timings.duration < 800,
  });

  sleep(1);
}

