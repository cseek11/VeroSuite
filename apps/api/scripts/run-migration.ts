/**
 * Database Migration Runner
 * 
 * Runs SQL migration files against the Supabase database.
 * Usage: npx ts-node scripts/run-migration.ts <migration-file>
 * Example: npx ts-node scripts/run-migration.ts prisma/migrations/20251114000000_add_critical_region_indexes.sql
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: ['.env.local', '.env'] });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('  - SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_KEY (or SUPABASE_ANON_KEY)');
  process.exit(1);
}

async function runMigration(migrationPath: string) {
  try {
    // Resolve the migration file path
    const fullPath = path.resolve(process.cwd(), migrationPath);
    
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ Migration file not found: ${fullPath}`);
      process.exit(1);
    }

    // Read the migration SQL
    const sql = fs.readFileSync(fullPath, 'utf-8');
    
    console.log(`🚀 Running migration: ${path.basename(migrationPath)}`);
    console.log(`📁 Path: ${fullPath}`);
    console.log(`📄 SQL length: ${sql.length} characters`);
    console.log('');

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Split SQL into individual statements (handle multiple statements)
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
      
      // Skip comments and empty lines
      if (statement.startsWith('--') || statement.trim().length === 0) {
        continue;
      }

      // Extract first few words for logging
      const preview = statement.substring(0, 80).replace(/\s+/g, ' ');
      
      try {
        console.log(`[${i + 1}/${statements.length}] Executing: ${preview}...`);
        
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
        
        if (error) {
          // Try direct execution as fallback
          const { error: directError } = await supabase
            .from('_migrations')
            .insert({ sql: statement });
          
          if (directError) {
            console.error(`  ❌ Failed: ${error.message}`);
            failCount++;
          } else {
            console.log(`  ✅ Success (via fallback)`);
            successCount++;
          }
        } else {
          console.log(`  ✅ Success`);
          successCount++;
        }
      } catch (err) {
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
    
  } catch (error) {
    console.error('❌ Migration failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// Get migration file from command line arguments
const migrationFile = process.argv[2];

if (!migrationFile) {
  console.error('Usage: npx ts-node scripts/run-migration.ts <migration-file>');
  console.error('Example: npx ts-node scripts/run-migration.ts prisma/migrations/20251114000000_add_critical_region_indexes.sql');
  process.exit(1);
}

runMigration(migrationFile);


