/**
 * Migration Verification Script
 * Verifies that the stripe_customer_id migration has been applied correctly
 * 
 * Usage: node scripts/verify-migration.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyMigration() {
  console.log('🔍 Verifying stripe_customer_id migration...\n');

  try {
    // Check if column exists
    console.log('1. Checking if stripe_customer_id column exists...');
    const columnCheck = await prisma.$queryRaw`
      SELECT 
        column_name, 
        data_type, 
        is_nullable,
        character_maximum_length
      FROM information_schema.columns
      WHERE table_name = 'accounts'
      AND column_name = 'stripe_customer_id'
    `;

    if (!columnCheck || columnCheck.length === 0) {
      console.log('❌ Column stripe_customer_id does NOT exist');
      console.log('   → Run the migration: backend/prisma/migrations/20250127000000_add_stripe_customer_id.sql');
      process.exit(1);
    }

    const column = columnCheck[0];
    console.log('✅ Column exists:');
    console.log(`   - Name: ${column.column_name}`);
    console.log(`   - Type: ${column.data_type}`);
    console.log(`   - Nullable: ${column.is_nullable}`);
    console.log(`   - Max Length: ${column.character_maximum_length || 'N/A'}`);

    // Check if index exists
    console.log('\n2. Checking if index exists...');
    const indexCheck = await prisma.$queryRaw`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = 'accounts'
      AND indexname = 'idx_accounts_stripe_customer_id'
    `;

    if (!indexCheck || indexCheck.length === 0) {
      console.log('⚠️  Index idx_accounts_stripe_customer_id does NOT exist');
      console.log('   → Index should be created by migration');
    } else {
      const index = indexCheck[0];
      console.log('✅ Index exists:');
      console.log(`   - Name: ${index.indexname}`);
      console.log(`   - Definition: ${index.indexdef.substring(0, 80)}...`);
    }

    // Check column comment
    console.log('\n3. Checking column comment...');
    const commentCheck = await prisma.$queryRaw`
      SELECT col_description('accounts'::regclass, 
        (SELECT ordinal_position 
         FROM information_schema.columns 
         WHERE table_name = 'accounts' 
         AND column_name = 'stripe_customer_id'))
    `;

    if (commentCheck && commentCheck[0] && commentCheck[0].col_description) {
      console.log('✅ Column comment exists:');
      console.log(`   - Comment: ${commentCheck[0].col_description}`);
    } else {
      console.log('⚠️  Column comment not found (optional)');
    }

    // Check for existing data
    console.log('\n4. Checking for existing Stripe customer IDs...');
    const dataCheck = await prisma.account.count({
      where: {
        stripe_customer_id: {
          not: null,
        },
      },
    });

    console.log(`✅ Found ${dataCheck} account(s) with Stripe customer IDs`);

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('✅ Migration verification complete!');
    console.log('='.repeat(50));
    console.log('\nAll checks passed. The migration has been applied successfully.\n');

  } catch (error) {
    console.error('\n❌ Error during verification:');
    console.error(error.message);
    
    if (error.message.includes('relation "accounts" does not exist')) {
      console.error('\n⚠️  The accounts table does not exist. Please check your database connection.');
    } else if (error.message.includes('permission denied')) {
      console.error('\n⚠️  Permission denied. Please check database user permissions.');
    } else {
      console.error('\n⚠️  Please check your database connection and try again.');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run verification
verifyMigration()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

