const jwt = require('jsonwebtoken');

// Simple script to decode and inspect JWT tokens
function decodeJWT(token) {
  try {
    // Decode without verification to see the payload
    const decoded = jwt.decode(token, { complete: true });
    console.log('=== JWT TOKEN DEBUG ===');
    console.log('Header:', JSON.stringify(decoded.header, null, 2));
    console.log('Payload:', JSON.stringify(decoded.payload, null, 2));
    console.log('=======================');
    return decoded.payload;
  } catch (error) {
    console.error('Error decoding JWT:', error.message);
    return null;
  }
}

// Usage: node debug-auth.js "your-jwt-token-here"
if (process.argv.length > 2) {
  const token = process.argv[2];
  console.log('Decoding JWT token...');
  decodeJWT(token);
} else {
  console.log('Usage: node debug-auth.js "your-jwt-token-here"');
  console.log('This script will decode and display the JWT payload to help debug tenant_id issues.');
}
