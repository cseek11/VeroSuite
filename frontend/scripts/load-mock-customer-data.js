// ============================================================================
// LOAD MOCK CUSTOMER DATA
// ============================================================================
// Script to populate the database with mock customer data for testing

const fs = require('fs');
const path = require('path');

console.log('🚀 Loading Mock Customer Data...\n');

// Read the SQL file
const sqlFilePath = path.join(__dirname, '..', '..', 'frontend', 'scripts', 'mock-customer-data.sql');

try {
    if (!fs.existsSync(sqlFilePath)) {
        console.error('❌ SQL file not found:', sqlFilePath);
        process.exit(1);
    }

    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    console.log('✅ SQL file loaded successfully');
    console.log(`📄 File size: ${(sqlContent.length / 1024).toFixed(2)} KB`);
    
    // Split the SQL into individual statements
    const statements = sqlContent
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`🔍 Found ${statements.length} SQL statements`);
    
    console.log('\n📋 SQL Statements Preview:');
    statements.slice(0, 3).forEach((stmt, index) => {
        const preview = stmt.substring(0, 100) + (stmt.length > 100 ? '...' : '');
        console.log(`${index + 1}. ${preview}`);
    });
    
    if (statements.length > 3) {
        console.log(`   ... and ${statements.length - 3} more statements`);
    }
    
    console.log('\n📝 Next Steps:');
    console.log('1. Copy the SQL content from: frontend/scripts/mock-customer-data.sql');
    console.log('2. Run it in your Supabase SQL editor or database client');
    console.log('3. Or use the Supabase CLI: supabase db reset --db-url <your-db-url>');
    console.log('4. Or run it directly in your database management tool');
    
    console.log('\n🔧 Alternative: Run via Supabase Dashboard');
    console.log('1. Go to your Supabase project dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the SQL content');
    console.log('4. Click "Run" to execute');
    
    console.log('\n⚠️  Note: This script only reads the SQL file.');
    console.log('   You need to execute the SQL in your database manually.');
    
} catch (error) {
    console.error('❌ Error reading SQL file:', error.message);
    process.exit(1);
}

console.log('\n✅ Script completed successfully!');




