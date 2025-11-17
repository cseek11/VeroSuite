# Technicians Dropdown Debugging Guide

## Quick Debugging Steps

### 1. Check Browser Console

Open the browser console (F12) and look for:

**Expected Logs** (if working):
```
[WorkOrderForm] Starting technician load
[enhanced-api] Fetching technicians { url: "...", baseUrl: "..." }
[enhanced-api] Technicians API response { response: {...}, ... }
[WorkOrderForm] Technician API response received { techniciansCount: X }
[WorkOrderForm] Technicians transformed { count: X }
```

**Error Logs** (if failing):
```
[WorkOrderForm] Error loading technicians { error: "...", errorMessage: "...", errorStatus: 404 }
[enhanced-api] Error fetching technicians { error: "...", message: "...", status: 404 }
```

### 2. Check Network Tab

1. Open DevTools → Network tab
2. Filter by "technicians"
3. Look for the request to `/api/v2/technicians`
4. Check:
   - **Status Code**: Should be 200 (not 404, 401, 500)
   - **Request URL**: Should be `http://localhost:3001/api/v2/technicians` (or your base URL)
   - **Request Headers**: Should include `Authorization: Bearer <token>`
   - **Response**: Should be JSON with `{ data: [...], meta: {...} }`

### 3. Common Issues and Fixes

#### Issue 1: 404 Not Found
**Error**: `Cannot GET /api/v2/technicians` or `404 Not Found`

**Possible Causes**:
- Backend server not running
- Wrong base URL in environment variable
- Missing version prefix (should be `/v2/technicians`)

**Fix**:
1. Check `VITE_API_BASE_URL` in `.env` file
2. Verify backend is running on port 3001
3. Check backend route exists: `GET /api/v2/technicians`

#### Issue 2: 401 Unauthorized
**Error**: `401 Unauthorized` or authentication errors

**Possible Causes**:
- Token expired or invalid
- Missing authentication token
- Token not being sent in headers

**Fix**:
1. Check if user is logged in
2. Check `localStorage.getItem('verofield_auth')` in console
3. Try logging out and logging back in
4. Check token in request headers (Network tab)

#### Issue 3: Empty Response
**Error**: No error, but dropdown is empty

**Possible Causes**:
- Response format mismatch
- No technicians in database
- Data transformation failing

**Fix**:
1. Check Network tab → Response tab
2. Verify response has `{ data: [...] }` format
3. Check if `data` array is empty (no technicians in DB)
4. Check console logs for transformation errors

#### Issue 4: CORS Error
**Error**: `CORS policy` or `Access-Control-Allow-Origin`

**Possible Causes**:
- Backend CORS not configured
- Wrong origin in CORS settings

**Fix**:
1. Check backend CORS configuration
2. Verify frontend URL is in allowed origins

### 4. Manual Testing in Console

Run these in the browser console to debug:

```javascript
// 1. Check if API is accessible
fetch('http://localhost:3001/api/v2/technicians', {
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('verofield_auth')).token}`,
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(data => console.log('Technicians:', data))
.catch(err => console.error('Error:', err));

// 2. Check authentication token
const auth = localStorage.getItem('verofield_auth');
console.log('Auth data:', auth ? JSON.parse(auth) : 'No auth found');

// 3. Check environment variable
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);
```

### 5. Check Backend Logs

Look for errors in backend console:
- Route not found errors
- Authentication errors
- Database query errors
- Service errors

### 6. Verify Backend Route

Test the backend route directly:

```bash
# Using curl
curl -X GET http://localhost:3001/api/v2/technicians \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json"

# Should return: { "data": [...], "meta": {...} }
```

## Expected Response Format

The backend should return:
```json
{
  "data": [
    {
      "id": "uuid",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "phone": "123-456-7890",
      "status": "ACTIVE"
    }
  ],
  "meta": {
    "version": "2.0",
    "count": 1,
    "timestamp": "2025-01-16T..."
  }
}
```

## Debugging Checklist

- [ ] Backend server is running
- [ ] Frontend can reach backend (check Network tab)
- [ ] Authentication token exists and is valid
- [ ] Request URL is correct (`/api/v2/technicians`)
- [ ] Response status is 200 (not 404, 401, 500)
- [ ] Response has `data` array
- [ ] `data` array is not empty
- [ ] Console shows no errors
- [ ] Data transformation is working (check logs)

## Next Steps

If still not working after checking all above:

1. **Share the console logs** - Copy all console errors
2. **Share the Network request** - Screenshot of the failed request
3. **Share the response** - What the API actually returns
4. **Check backend logs** - Any errors on the server side

