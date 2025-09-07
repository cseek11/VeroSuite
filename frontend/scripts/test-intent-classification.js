// ============================================================================
// TEST INTENT CLASSIFICATION SYSTEM
// ============================================================================
// Simple test script to verify intent classification is working

console.log('🧪 Testing Intent Classification System...\n');

// Test queries for different intents
const testQueries = [
  // Search queries
  "Find John Smith",
  "Lookup customer at 123 Maple Ave",
  "Show all termite jobs in August",
  
  // Create customer queries
  "Create a new account for John Doe at 123 Maple Ave",
  "New customer Lisa Nguyen, phone 555-1234",
  "Add customer Mike Johnson, email mike@email.com",
  
  // Schedule appointment queries
  "Schedule bed bug treatment for Lisa Nguyen at 7pm tomorrow",
  "Book roach treatment for John Smith",
  "Schedule termite inspection for 456 Oak St",
  
  // Update appointment queries
  "Reschedule today's appointment for Jake to Friday at 10am",
  "Change the appointment for Mike to 2pm tomorrow",
  "Move Lisa's appointment to next Monday",
  
  // Add note queries
  "Add note: Customer has pets, use only organic products",
  "Note for Emily: Prefers morning appointments",
  "Add note for John: Allergic to certain chemicals"
];

// Simple intent classification function for testing
function classifyIntentSimple(query) {
  const lowerQuery = query.toLowerCase();
  
  // Create customer intent
  if (lowerQuery.includes('create') || lowerQuery.includes('new') || lowerQuery.includes('add')) {
    if (lowerQuery.includes('customer') || lowerQuery.includes('account')) {
      return { intent: 'createCustomer', confidence: 0.9 };
    }
  }
  
  // Schedule appointment intent
  if (lowerQuery.includes('schedule') || lowerQuery.includes('book')) {
    if (lowerQuery.includes('appointment') || lowerQuery.includes('treatment') || lowerQuery.includes('service')) {
      return { intent: 'scheduleAppointment', confidence: 0.9 };
    }
  }
  
  // Update appointment intent
  if (lowerQuery.includes('reschedule') || lowerQuery.includes('change') || lowerQuery.includes('move')) {
    if (lowerQuery.includes('appointment')) {
      return { intent: 'updateAppointment', confidence: 0.9 };
    }
  }
  
  // Add note intent
  if (lowerQuery.includes('note') || lowerQuery.includes('add note')) {
    return { intent: 'addNote', confidence: 0.9 };
  }
  
  // Default to search
  return { intent: 'search', confidence: 0.7 };
}

// Test each query
testQueries.forEach((query, index) => {
  const result = classifyIntentSimple(query);
  console.log(`${index + 1}. "${query}"`);
  console.log(`   Intent: ${result.intent} (${(result.confidence * 100).toFixed(0)}% confidence)`);
  console.log('');
});

console.log('✅ Intent classification test completed!');
console.log('\n📝 Next steps:');
console.log('1. Start the frontend development server: npm run dev');
console.log('2. Navigate to /global-search-demo');
console.log('3. Test the full system with real queries');
console.log('4. Check browser console for detailed logs');


