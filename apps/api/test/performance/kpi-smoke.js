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
  const okLogin = check(loginRes, { 'login 2xx': (r) => r.status >= 200 && r.status < 300 });
  if (!okLogin) {
    sleep(1);
    return;
  }
  let token = '';
  try {
    token = JSON.parse(loginRes.body).access_token;
  } catch (e) {
    token = '';
  }
  if (!token) {
    sleep(1);
    return;
  }
  const headers = { Authorization: `Bearer ${token}` };

  const res = http.get(`${BASE_URL}/kpis/data/current`, { headers });
  check(res, {
    'kpi data 2xx': (r) => r.status >= 200 && r.status < 300,
    'kpi data p95 < 600ms': (r) => r.timings.duration < 600,
  });

  sleep(1);
}




