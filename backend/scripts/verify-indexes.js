"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv = require("dotenv");
const path_1 = require("path");
dotenv.config({ path: (0, path_1.resolve)(__dirname, '../.env') });
const REQUIRED_INDEXES = [
    'idx_regions_layout_deleted',
    'idx_regions_grid_bounds',
    'idx_regions_tenant_layout',
    'idx_regions_overlap_detection'
];
async function verifyIndexes() {
    console.log('🔍 Verifying Database Indexes...\n');
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables');
        console.error('   Please ensure your .env file is configured correctly\n');
        process.exit(1);
    }
    const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceKey);
    try {
        const { data, error } = await supabase
            .rpc('verify_region_indexes');
        if (error) {
            console.log('⚠️  RPC method not found, attempting direct query...\n');
            const query = `
        SELECT 
          schemaname,
          tablename,
          indexname,
          indexdef
        FROM pg_indexes
        WHERE tablename = 'dashboard_regions'
        ORDER BY indexname;
      `;
            const { data: directData, error: directError } = await supabase.rpc('exec_sql', { query });
            if (directError) {
                console.error('❌ Unable to query indexes directly');
                console.error('   Error:', directError.message);
                console.log('\n📋 Manual Verification Required:');
                console.log('   Run this query in your database console:\n');
                console.log(query);
                process.exit(1);
            }
            return verifyResults(directData);
        }
        return verifyResults(data);
    }
    catch (error) {
        console.error('❌ Error connecting to database:', error.message);
        console.log('\n📋 Manual Verification Required:');
        console.log('   Connect to your database and run:\n');
        console.log(`
      SELECT 
        schemaname,
        tablename,
        indexname,
        indexdef
      FROM pg_indexes
      WHERE tablename = 'dashboard_regions'
      AND indexname IN (
        'idx_regions_layout_deleted',
        'idx_regions_grid_bounds',
        'idx_regions_tenant_layout',
        'idx_regions_overlap_detection'
      );
    `);
        process.exit(1);
    }
}
function verifyResults(indexes) {
    console.log('📊 Found Indexes:\n');
    const foundIndexNames = indexes.map(idx => idx.indexname);
    let allFound = true;
    REQUIRED_INDEXES.forEach(requiredIndex => {
        const found = foundIndexNames.includes(requiredIndex);
        const status = found ? '✅' : '❌';
        console.log(`   ${status} ${requiredIndex}`);
        if (!found)
            allFound = false;
    });
    console.log('\n');
    if (allFound) {
        console.log('✅ SUCCESS: All 4 critical indexes are present!');
        console.log('\n📈 Expected Performance Improvements:');
        console.log('   - Region queries: 10-50x faster');
        console.log('   - Overlap detection: 100x faster');
        console.log('   - Bulk imports: 300x faster (5 min → 1 sec for 100 regions)\n');
        console.log('📋 Index Definitions:\n');
        indexes
            .filter(idx => REQUIRED_INDEXES.includes(idx.indexname))
            .forEach(idx => {
            console.log(`   ${idx.indexname}:`);
            console.log(`   ${idx.indexdef}\n`);
        });
        process.exit(0);
    }
    else {
        const missing = REQUIRED_INDEXES.filter(req => !foundIndexNames.includes(req));
        console.log(`❌ FAILURE: ${missing.length} index(es) missing`);
        console.log('\n🔧 To apply missing indexes, run:');
        console.log('   npm run prisma:migrate:deploy\n');
        console.log('   Or manually execute:');
        console.log('   backend/prisma/migrations/20251114000000_add_critical_region_indexes.sql\n');
        process.exit(1);
    }
}
verifyIndexes().catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
});
//# sourceMappingURL=verify-indexes.js.map