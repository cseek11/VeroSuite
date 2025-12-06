# Swagger UI Authorization Guide

**Date:** 2025-12-05  
**Purpose:** Step-by-step guide for authorizing in Swagger UI

---

## 🔐 Authorization in Swagger UI

### Step 1: Click "Authorize" Button

1. Open: `http://localhost:3001/api/docs`
2. Look for the **"Authorize"** button (top right, green lock icon 🔒)
3. Click it

---

### Step 2: Enter Your Token

You'll see a dialog with:
- **bearer (http, Bearer)** - This is the authentication scheme

**Two Options:**

#### Option A: Login First (Recommended)

1. **Find the Login Endpoint:**
   - Look for **"Authentication"** or **"Auth"** section
   - Find: `POST /api/v1/auth/login`
   - Click **"Try it out"**

2. **Enter Credentials:**
   ```json
   {
     "email": "your-email@example.com",
     "password": "your-password"
   }
   ```

3. **Click "Execute"**

4. **Copy the Token:**
   - In the response, find `"access_token"`
   - Copy the entire token (it's a long string starting with `eyJ...`)

5. **Use Token in Authorization:**
   - Click **"Authorize"** button again
   - Paste the token in the **"Value"** field
   - Click **"Authorize"**
   - Click **"Close"**

#### Option B: Use Existing Token

If you already have a token:

1. Click **"Authorize"** button
2. In the **"bearer (http, Bearer)"** section:
   - Find the **"Value"** field
   - Paste your JWT token (starts with `eyJ...`)
   - Click **"Authorize"**
   - Click **"Close"**

---

### Step 3: Verify Authorization

After authorizing, you should see:
- 🔒 Lock icon changes to show you're authorized
- **"Authorize"** button may show a checkmark or different color

---

### Step 4: Test Compliance Endpoint

Now you can test the compliance endpoint:

1. Find: `POST /api/v1/compliance/checks` (in Compliance section)
2. Click **"Try it out"**
3. Enter test data:
   ```json
   {
     "pr_number": 999,
     "commit_sha": "test-123",
     "rule_id": "R01",
     "status": "VIOLATION",
     "severity": "WARNING",
     "violation_message": "Test violation"
   }
   ```
4. Click **"Execute"**

**Expected Response:**
```json
{
  "message": "Compliance check queued successfully",
  "queued": true
}
```

---

## 🐛 Troubleshooting

### Issue: "Unauthorized" Error

**Causes:**
- Token not entered
- Token expired
- Token invalid

**Fix:**
1. Click **"Authorize"** again
2. Get a fresh token (login again)
3. Paste new token
4. Click **"Authorize"**

### Issue: Can't Find Login Endpoint

**Look for:**
- **"Authentication"** section
- **"Auth"** section
- `POST /api/v1/auth/login`

**If not found:**
- Check if API server is running
- Refresh Swagger UI (Ctrl+F5)
- Check browser console for errors

### Issue: Token Field is Empty

**Fix:**
- Make sure you copied the entire token
- Token should start with `eyJ`
- No spaces before/after token
- Click **"Authorize"** after pasting

---

## 📝 Token Format

A valid JWT token looks like:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Characteristics:**
- Long string (usually 200+ characters)
- Three parts separated by dots (`.`)
- Starts with `eyJ`
- No spaces

---

## ✅ Quick Checklist

- [ ] Clicked "Authorize" button
- [ ] Logged in via `POST /api/v1/auth/login` (or have existing token)
- [ ] Copied `access_token` from response
- [ ] Pasted token in "Value" field
- [ ] Clicked "Authorize" and "Close"
- [ ] See lock icon indicating authorization
- [ ] Can now test protected endpoints

---

**Last Updated:** 2025-12-05  
**Status:** Authorization working correctly



