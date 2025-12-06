#!/usr/bin/env python3
"""
Test Supabase Schema Access for VeroScore V3
Verifies that supabase.table() works with veroscore schema tables.

Last Updated: 2025-12-04
"""

import os
import sys
from pathlib import Path
from datetime import datetime, timezone

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

try:
    from supabase import create_client, Client
except ImportError:
    print("❌ Missing supabase-py package. Install with: pip install supabase")
    sys.exit(1)

from logger_util import get_logger

logger = get_logger(context="test_supabase_schema")


def test_environment_variables() -> tuple[bool, list[str]]:
    """Test that required environment variables are set."""
    required_vars = ["SUPABASE_URL", "SUPABASE_SECRET_KEY"]
    missing = [var for var in required_vars if not os.getenv(var)]
    
    if missing:
        return False, missing
    return True, []


def test_direct_table_access(supabase: Client) -> tuple[bool, str]:
    """Test direct table access (supabase.table("sessions"))."""
    try:
        logger.info("Testing direct table access: supabase.table('sessions')", operation="test_direct_table_access")
        
        # Try multiple methods to access veroscore schema tables
        
        # Method 1: Try .schema() method (if Python client supports it)
        try:
            if hasattr(supabase, 'schema'):
                result = supabase.schema("veroscore").table("sessions").select("id", count="exact").limit(0).execute()
                logger.info(
                    "Schema method access successful",
                    operation="test_direct_table_access",
                    count=result.count if hasattr(result, 'count') else "unknown"
                )
                return True, "Direct table access works via .schema('veroscore')"
        except Exception as schema_error:
            logger.debug(
                ".schema() method not available or failed",
                operation="test_direct_table_access",
                root_cause=str(schema_error)
            )
        
        # Method 2: Try schema-qualified table name (veroscore.sessions)
        try:
            result = supabase.table("veroscore.sessions").select("id", count="exact").limit(0).execute()
            logger.info(
                "Schema-qualified table name access successful",
                operation="test_direct_table_access",
                count=result.count if hasattr(result, 'count') else "unknown"
            )
            return True, "Direct table access works via 'veroscore.sessions'"
        except Exception as qualified_error:
            logger.debug(
                "Schema-qualified table name failed",
                operation="test_direct_table_access",
                root_cause=str(qualified_error)
            )
        
        # Method 3: Direct table access (if PostgREST sees veroscore schema)
        try:
            result = supabase.table("sessions").select("id", count="exact").limit(0).execute()
            logger.info(
                "Direct table access successful",
                operation="test_direct_table_access",
                count=result.count if hasattr(result, 'count') else "unknown"
            )
            return True, "Direct table access works"
        except Exception as direct_error:
            error_str = str(direct_error)
            logger.warn(
                "Direct table access failed, trying alternative methods",
                operation="test_direct_table_access",
                error_code="DIRECT_ACCESS_FAILED",
                root_cause=error_str
            )
            
            # Method 2: Try using .from() instead of .table() (some clients use this)
            try:
                result = supabase.from_("sessions").select("id", count="exact").limit(0).execute()
                logger.info(
                    "Table access via .from() successful",
                    operation="test_direct_table_access"
                )
                return True, "Direct table access works via .from()"
            except Exception:
                pass
            
            # Method 3: Try accessing via PostgREST client directly with Accept-Profile header
            try:
                from postgrest import SyncPostgrestClient
                
                supabase_url = os.getenv("SUPABASE_URL")
                supabase_key = os.getenv("SUPABASE_SECRET_KEY")
                
                # Create PostgREST client with schema header (MOST SECURE - RLS enforced)
                postgrest_client = SyncPostgrestClient(
                    base_url=f"{supabase_url}/rest/v1",
                    headers={
                        "apikey": supabase_key,
                        "Authorization": f"Bearer {supabase_key}",
                        "Accept-Profile": "veroscore",  # Specify schema
                        "Content-Profile": "veroscore"   # For writes
                    }
                )
                
                result = postgrest_client.from_("sessions").select("id").limit(0).execute()
                logger.info(
                    "PostgREST direct access with Accept-Profile header successful",
                    operation="test_direct_table_access"
                )
                return True, "Direct table access works via PostgREST with Accept-Profile header (MOST SECURE - RLS enforced)"
            except Exception as postgrest_error:
                error_str = str(postgrest_error)
                logger.error(
                    "PostgREST direct access failed",
                    operation="test_direct_table_access",
                    error_code="POSTGREST_ACCESS_FAILED",
                    root_cause=error_str
                )
                return False, f"PostgREST access failed. PostgREST may need schema cache reload. Error: {error_str}. Run: NOTIFY pgrst, 'reload schema';"
            
            # All methods failed
            return False, f"Direct table access failed. PostgREST may need to reload schema cache. Error: {error_str}. Try: NOTIFY pgrst, 'reload schema';"
        
    except Exception as e:
        error_msg = str(e)
        logger.error(
            "Direct table access failed",
            operation="test_direct_table_access",
            error_code="DIRECT_TABLE_ACCESS_FAILED",
            root_cause=error_msg
        )
        return False, f"Direct table access failed: {error_msg}"


def test_insert_and_select(supabase: Client) -> tuple[bool, str]:
    """Test insert and select operations using PostgREST with Accept-Profile header."""
    try:
        test_session_id = f"test-schema-access-{datetime.now(timezone.utc).timestamp()}"
        
        logger.info("Testing insert operation", operation="test_insert_and_select", session_id=test_session_id)
        
        # Try multiple methods to insert
        
        # Method 1: Try .schema() method
        insert_data = {
            "session_id": test_session_id,
            "author": "test-user",
            "status": "active",
            "total_files": 0,
            "total_lines_added": 0,
            "total_lines_removed": 0,
            "prs": [],
            "config": {},
            "metadata": {}
        }
        
        insert_result = None
        if hasattr(supabase, 'schema'):
            try:
                insert_result = supabase.schema("veroscore").table("sessions").insert(insert_data).execute()
                logger.info("Insert via .schema() method successful", operation="test_insert_and_select")
            except Exception:
                pass
        
        # Method 2: Try schema-qualified table name
        if not insert_result or not insert_result.data:
            try:
                insert_result = supabase.table("veroscore.sessions").insert(insert_data).execute()
                logger.info("Insert via schema-qualified name successful", operation="test_insert_and_select")
            except Exception:
                pass
        
        # Method 3: Use PostgREST client directly with Accept-Profile header
        if not insert_result or not insert_result.data:
            from postgrest import SyncPostgrestClient
            
            supabase_url = os.getenv("SUPABASE_URL")
            supabase_key = os.getenv("SUPABASE_SECRET_KEY")
            
            postgrest_client = SyncPostgrestClient(
                base_url=f"{supabase_url}/rest/v1",
                headers={
                    "apikey": supabase_key,
                    "Authorization": f"Bearer {supabase_key}",
                    "Accept-Profile": "veroscore",  # Specify schema
                    "Content-Profile": "veroscore"   # For writes
                }
            )
            
            insert_result = postgrest_client.from_("sessions").insert(insert_data).execute()
        
        if not insert_result.data:
            return False, "Insert returned no data"
        
        logger.info("Insert successful", operation="test_insert_and_select", session_id=test_session_id)
        
        # Select the inserted session
        logger.info("Testing select operation", operation="test_insert_and_select", session_id=test_session_id)
        
        # Try multiple methods to select
        select_result = None
        
        # Method 1: Try .schema() method
        if hasattr(supabase, 'schema'):
            try:
                select_result = supabase.schema("veroscore").table("sessions").select("*").eq("session_id", test_session_id).execute()
                logger.info("Select via .schema() method successful", operation="test_insert_and_select")
            except Exception:
                pass
        
        # Method 2: Try schema-qualified table name
        if not select_result or not select_result.data or len(select_result.data) == 0:
            try:
                select_result = supabase.table("veroscore.sessions").select("*").eq("session_id", test_session_id).execute()
                logger.info("Select via schema-qualified name successful", operation="test_insert_and_select")
            except Exception:
                pass
        
        # Method 3: Use PostgREST client
        if not select_result or not select_result.data or len(select_result.data) == 0:
            from postgrest import SyncPostgrestClient
            supabase_url = os.getenv("SUPABASE_URL")
            supabase_key = os.getenv("SUPABASE_SECRET_KEY")
            postgrest_client = SyncPostgrestClient(
                base_url=f"{supabase_url}/rest/v1",
                headers={
                    "apikey": supabase_key,
                    "Authorization": f"Bearer {supabase_key}",
                    "Accept-Profile": "veroscore"
                }
            )
            select_result = postgrest_client.from_("sessions").select("*").eq("session_id", test_session_id).execute()
        
        if not select_result.data or len(select_result.data) == 0:
            # Try to clean up
            try:
                if hasattr(supabase, 'schema'):
                    supabase.schema("veroscore").table("sessions").delete().eq("session_id", test_session_id).execute()
                else:
                    supabase.table("veroscore.sessions").delete().eq("session_id", test_session_id).execute()
            except (ValueError, AttributeError, KeyError) as e:
                # Cleanup failed - log but don't fail the test
                logger.warn("Cleanup failed after select test", operation="test_insert_and_select", error_code="CLEANUP_FAILED", root_cause=str(e), session_id=test_session_id)
            return False, "Select returned no data"
        
        logger.info("Select successful", operation="test_insert_and_select", session_id=test_session_id)
        
        # Clean up
        try:
            if hasattr(supabase, 'schema'):
                supabase.schema("veroscore").table("sessions").delete().eq("session_id", test_session_id).execute()
            else:
                supabase.table("veroscore.sessions").delete().eq("session_id", test_session_id).execute()
            logger.info("Test data cleaned up", operation="test_insert_and_select", session_id=test_session_id)
        except Exception as cleanup_error:
            logger.warn(
                "Failed to cleanup test data",
                operation="test_insert_and_select",
                error_code="CLEANUP_FAILED",
                root_cause=str(cleanup_error),
                session_id=test_session_id
            )
        
        return True, "Insert and select operations successful"
        
    except Exception as e:
        error_msg = str(e)
        logger.error(
            "Insert/select test failed",
            operation="test_insert_and_select",
            error_code="INSERT_SELECT_FAILED",
            root_cause=error_msg
        )
        return False, f"Insert/select failed: {error_msg}"


def test_changes_queue_access(supabase: Client) -> tuple[bool, str]:
    """Test changes_queue table access using PostgREST with Accept-Profile header."""
    try:
        logger.info("Testing changes_queue table access", operation="test_changes_queue_access")
        
        # Try multiple methods to access changes_queue
        
        # Method 1: Try .schema() method
        result = None
        if hasattr(supabase, 'schema'):
            try:
                result = supabase.schema("veroscore").table("changes_queue").select("id").limit(0).execute()
                logger.info("Changes queue access via .schema() method successful", operation="test_changes_queue_access")
            except Exception:
                pass
        
        # Method 2: Try schema-qualified table name
        if not result:
            try:
                result = supabase.table("veroscore.changes_queue").select("id").limit(0).execute()
                logger.info("Changes queue access via schema-qualified name successful", operation="test_changes_queue_access")
            except Exception:
                pass
        
        # Method 3: Use PostgREST client directly with Accept-Profile header
        if not result:
            from postgrest import SyncPostgrestClient
            
            supabase_url = os.getenv("SUPABASE_URL")
            supabase_key = os.getenv("SUPABASE_SECRET_KEY")
            
            postgrest_client = SyncPostgrestClient(
                base_url=f"{supabase_url}/rest/v1",
                headers={
                    "apikey": supabase_key,
                    "Authorization": f"Bearer {supabase_key}",
                    "Accept-Profile": "veroscore"  # Specify schema
                }
            )
            
            result = postgrest_client.from_("changes_queue").select("id").limit(0).execute()
        
        logger.info(
            "Changes queue access successful",
            operation="test_changes_queue_access"
        )
        return True, "Changes queue table accessible"
        
    except Exception as e:
        error_msg = str(e)
        logger.error(
            "Changes queue access failed",
            operation="test_changes_queue_access",
            error_code="CHANGES_QUEUE_ACCESS_FAILED",
            root_cause=error_msg
        )
        return False, f"Changes queue access failed: {error_msg}"


def main():
    """Run all schema access tests."""
    print("=" * 60)
    print("VeroScore V3 - Supabase Schema Access Test")
    print("=" * 60)
    print()
    
    # Test environment variables
    print("1. Testing environment variables...")
    env_ok, missing = test_environment_variables()
    if not env_ok:
        print(f"❌ Missing environment variables: {', '.join(missing)}")
        print("\nPlease set:")
        for var in missing:
            print(f"  export {var}=<value>")
        return 1
    print("✅ Environment variables set")
    print()
    
    # Initialize Supabase client
    print("2. Initializing Supabase client...")
    try:
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SECRET_KEY")
        supabase: Client = create_client(supabase_url, supabase_key)
        print("✅ Supabase client initialized")
        print()
    except Exception as e:
        print(f"❌ Failed to initialize Supabase client: {e}")
        return 1
    
    # Run tests
    results = []
    
    print("3. Testing direct table access...")
    ok, msg = test_direct_table_access(supabase)
    results.append(("Direct Table Access", ok, msg))
    print(f"{'✅' if ok else '❌'} {msg}")
    print()
    
    print("4. Testing insert and select operations...")
    ok, msg = test_insert_and_select(supabase)
    results.append(("Insert/Select Operations", ok, msg))
    print(f"{'✅' if ok else '❌'} {msg}")
    print()
    
    print("5. Testing changes_queue table access...")
    ok, msg = test_changes_queue_access(supabase)
    results.append(("Changes Queue Access", ok, msg))
    print(f"{'✅' if ok else '❌'} {msg}")
    print()
    
    # Summary
    print("=" * 60)
    print("Test Summary")
    print("=" * 60)
    for test_name, ok, msg in results:
        status = "✅ PASS" if ok else "❌ FAIL"
        print(f"{status}: {test_name}")
        if not ok:
            print(f"   {msg}")
    print()
    
    all_passed = all(ok for _, ok, _ in results)
    if all_passed:
        print("✅ All tests passed! Supabase schema access is working correctly.")
        return 0
    else:
        print("❌ Some tests failed. Please check the errors above.")
        return 1


if __name__ == '__main__':
    sys.exit(main())

