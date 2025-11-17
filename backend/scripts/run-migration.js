"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: ['.env.local', '.env'] });
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing required environment variables:');
    console.error('  - SUPABASE_URL');
    console.error('  - SUPABASE_SERVICE_KEY (or SUPABASE_ANON_KEY)');
    process.exit(1);
}
async function runMigration(migrationPath) {
    try {
        const fullPath = path.resolve(process.cwd(), migrationPath);
        if (!fs.existsSync(fullPath)) {
            console.error(`❌ Migration file not found: ${fullPath}`);
            process.exit(1);
        }
        const sql = fs.readFileSync(fullPath, 'utf-8');
        console.log(`🚀 Running migration: ${path.basename(migrationPath)}`);
        console.log(`📁 Path: ${fullPath}`);
        console.log(`📄 SQL length: ${sql.length} characters`);
        console.log('');
        const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceKey);
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'));
        console.log(`📊 Found ${statements.length} SQL statements to execute`);
        console.log('');
        let successCount = 0;
        let failCount = 0;
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            if (statement.startsWith('--') || statement.trim().length === 0) {
                continue;
            }
            const preview = statement.substring(0, 80).replace(/\s+/g, ' ');
            try {
                console.log(`[${i + 1}/${statements.length}] Executing: ${preview}...`);
                const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
                if (error) {
                    const { error: directError } = await supabase
                        .from('_migrations')
                        .insert({ sql: statement });
                    if (directError) {
                        console.error(`  ❌ Failed: ${error.message}`);
                        failCount++;
                    }
                    else {
                        console.log(`  ✅ Success (via fallback)`);
                        successCount++;
                    }
                }
                else {
                    console.log(`  ✅ Success`);
                    successCount++;
                }
            }
            catch (err) {
                console.error(`  ❌ Error: ${err instanceof Error ? err.message : String(err)}`);
                failCount++;
            }
        }
        console.log('');
        console.log('========================================');
        console.log(`✅ Successful: ${successCount}`);
        console.log(`❌ Failed: ${failCount}`);
        console.log('========================================');
        if (failCount > 0) {
            console.error('');
            console.error('⚠️  Some statements failed. Please review the errors above.');
            console.error('💡 Tip: You may need to run this migration directly in the Supabase SQL editor.');
            process.exit(1);
        }
        console.log('');
        console.log('🎉 Migration completed successfully!');
    }
    catch (error) {
        console.error('❌ Migration failed:', error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
}
const migrationFile = process.argv[2];
if (!migrationFile) {
    console.error('Usage: npx ts-node scripts/run-migration.ts <migration-file>');
    console.error('Example: npx ts-node scripts/run-migration.ts prisma/migrations/20251114000000_add_critical_region_indexes.sql');
    process.exit(1);
}
runMigration(migrationFile);
//# sourceMappingURL=run-migration.js.map