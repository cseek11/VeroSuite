#!/usr/bin/env python3
"""
VeroScore V3 - Phase 1 Setup Verification Script

Tests database connectivity, schema deployment, and configuration.
Run this after completing Phase 1 setup.

Usage:
    python .cursor/scripts/test_veroscore_setup.py
"""

import os
import sys
from pathlib import Path
from typing import Dict, List, Tuple
import yaml

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

try:
    from supabase import create_client, Client
except ImportError:
    print("❌ Missing supabase-py package. Install with: pip install supabase")
    sys.exit(1)


def test_environment_variables() -> Tuple[bool, List[str]]:
    """Test that required environment variables are set."""
    required_vars = [
        "SUPABASE_URL",
        "SUPABASE_SECRET_KEY",
    ]
    
    missing = []
    for var in required_vars:
        if not os.getenv(var):
            missing.append(var)
    
    if missing:
        return False, missing
    return True, []


def test_supabase_connection() -> Tuple[bool, str]:
    """Test Supabase database connection."""
    try:
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SECRET_KEY")
        
        supabase: Client = create_client(supabase_url, supabase_key)
        
        # Test query - try to count sessions (using schema-qualified table name)
        # Note: Supabase client may need schema prefix or table name only
        # Try both approaches
        try:
            result = supabase.table("sessions").select("id", count="exact").limit(0).execute()
        except (ValueError, AttributeError, KeyError) as e:
            # Fallback: query via raw SQL if schema prefix needed
            try:
                result = supabase.rpc("exec_sql", {"query": "SELECT COUNT(*) FROM veroscore.sessions"}).execute()
            except (ValueError, AttributeError, KeyError) as fallback_error:
                # Both approaches failed
                return False, f"Both query approaches failed: {str(e)}, fallback: {str(fallback_error)}"
        
        return True, "Connection successful"
    except Exception as e:
        return False, str(e)


def test_tables_exist(supabase: Client) -> Tuple[bool, List[str], List[str]]:
    """Test that all required tables exist."""
    required_tables = [
        "sessions",  # In veroscore schema
        "changes_queue",  # In veroscore schema
        "pr_scores",  # In veroscore schema
        "detection_results",  # In veroscore schema
        "idempotency_keys",  # In veroscore schema
        "system_metrics",  # In veroscore schema
        "audit_log",  # In veroscore schema
    ]
    
    existing = []
    missing = []
    
    for table in required_tables:
        try:
            # Try to query table (will fail if doesn't exist)
            supabase.table(table).select("id").limit(1).execute()
            existing.append(table)
        except Exception:
            missing.append(table)
    
    return len(missing) == 0, existing, missing


def test_views_exist(supabase: Client) -> Tuple[bool, List[str], List[str]]:
    """Test that all required views exist."""
    required_views = [
        "v_active_sessions",  # In veroscore schema
        "v_pr_score_summary",  # In veroscore schema
        "v_system_health",  # In veroscore schema
        "v_dashboard_summary",  # In veroscore schema
    ]
    
    existing = []
    missing = []
    
    for view in required_views:
        try:
            # Try to query view (will fail if doesn't exist)
            supabase.table(view).select("*").limit(1).execute()
            existing.append(view)
        except Exception:
            missing.append(view)
    
    return len(missing) == 0, existing, missing


def test_reward_score_columns(supabase: Client) -> Tuple[bool, List[str]]:
    """Test that Reward Score integration columns exist."""
    # Test sessions table (in veroscore schema)
    try:
        result = supabase.table("sessions").select("reward_score_eligible,last_reward_score,reward_scored_at").limit(1).execute()
        sessions_ok = True
    except Exception:
        sessions_ok = False
    
    # Test pr_scores table (in veroscore schema)
    try:
        result = supabase.table("pr_scores").select("reward_score,reward_score_timestamp").limit(1).execute()
        pr_scores_ok = True
    except Exception:
        pr_scores_ok = False
    
    issues = []
    if not sessions_ok:
        issues.append("veroscore.sessions missing Reward Score columns")
    if not pr_scores_ok:
        issues.append("veroscore.pr_scores missing Reward Score columns")
    
    return len(issues) == 0, issues


def test_configuration_file() -> Tuple[bool, str]:
    """Test that configuration file exists and is valid YAML."""
    config_path = project_root / ".cursor" / "config" / "auto_pr_config.yaml"
    
    if not config_path.exists():
        return False, f"Configuration file not found: {config_path}"
    
    try:
        with open(config_path, 'r') as f:
            config = yaml.safe_load(f)
        
        # Check required sections
        required_sections = ["veroscore", "thresholds", "exclusions", "author"]
        missing_sections = [s for s in required_sections if s not in config]
        
        if missing_sections:
            return False, f"Missing configuration sections: {', '.join(missing_sections)}"
        
        return True, "Configuration file valid"
    except yaml.YAMLError as e:
        return False, f"Invalid YAML: {e}"


def test_insert_and_query(supabase: Client) -> Tuple[bool, str]:
    """Test inserting and querying test data."""
    test_session_id = "test-verification-20251124"
    
    try:
        # Insert test session (in veroscore schema)
        insert_result = supabase.table("sessions").insert({
            "session_id": test_session_id,
            "author": "test-user",
            "branch_name": "test-branch",
            "status": "active",
            "reward_score_eligible": False
        }).execute()
        
        # Query it back
        query_result = supabase.table("sessions").select("*").eq("session_id", test_session_id).execute()
        
        if not query_result.data:
            return False, "Could not query inserted session"
        
        # Cleanup
        supabase.table("sessions").delete().eq("session_id", test_session_id).execute()
        
        return True, "Insert and query successful"
    except Exception as e:
        # Try to cleanup on error
        try:
            supabase.table("sessions").delete().eq("session_id", test_session_id).execute()
        except (ValueError, AttributeError, KeyError) as cleanup_error:
            # Cleanup failed - log but don't fail the test
            pass
        return False, str(e)


def main():
    """Run all verification tests."""
    print("=" * 60)
    print("VeroScore V3 - Phase 1 Setup Verification")
    print("=" * 60)
    print()
    
    all_passed = True
    results = []
    
    # Test 1: Environment Variables
    print("1. Testing environment variables...")
    env_ok, missing = test_environment_variables()
    if env_ok:
        print("   ✅ All required environment variables set")
        results.append(("Environment Variables", True, ""))
    else:
        print(f"   ❌ Missing environment variables: {', '.join(missing)}")
        print(f"   💡 Set these in your .env file or environment")
        results.append(("Environment Variables", False, f"Missing: {', '.join(missing)}"))
        all_passed = False
    
    if not env_ok:
        print()
        print("⚠️  Cannot continue without environment variables. Please set them and try again.")
        sys.exit(1)
    
    # Test 2: Supabase Connection
    print()
    print("2. Testing Supabase connection...")
    conn_ok, conn_msg = test_supabase_connection()
    if conn_ok:
        print(f"   ✅ {conn_msg}")
        results.append(("Supabase Connection", True, ""))
    else:
        print(f"   ❌ Connection failed: {conn_msg}")
        results.append(("Supabase Connection", False, conn_msg))
        all_passed = False
        print()
        print("⚠️  Cannot continue without database connection. Please check your configuration.")
        sys.exit(1)
    
    # Create client for remaining tests
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SECRET_KEY")
    supabase: Client = create_client(supabase_url, supabase_key)
    
    # Test 3: Tables Exist
    print()
    print("3. Testing database tables...")
    tables_ok, existing, missing = test_tables_exist(supabase)
    if tables_ok:
        print(f"   ✅ All {len(existing)} required tables exist")
        results.append(("Database Tables", True, f"{len(existing)} tables"))
    else:
        print(f"   ❌ Missing tables: {', '.join(missing)}")
        print(f"   ✅ Existing tables: {', '.join(existing)}")
        results.append(("Database Tables", False, f"Missing: {', '.join(missing)}"))
        all_passed = False
    
    # Test 4: Views Exist
    print()
    print("4. Testing database views...")
    views_ok, existing, missing = test_views_exist(supabase)
    if views_ok:
        print(f"   ✅ All {len(existing)} required views exist")
        results.append(("Database Views", True, f"{len(existing)} views"))
    else:
        print(f"   ❌ Missing views: {', '.join(missing)}")
        print(f"   ✅ Existing views: {', '.join(existing)}")
        results.append(("Database Views", False, f"Missing: {', '.join(missing)}"))
        all_passed = False
    
    # Test 5: Reward Score Columns
    print()
    print("5. Testing Reward Score integration columns...")
    reward_ok, issues = test_reward_score_columns(supabase)
    if reward_ok:
        print("   ✅ Reward Score integration columns exist")
        results.append(("Reward Score Integration", True, ""))
    else:
        print(f"   ❌ Issues: {', '.join(issues)}")
        results.append(("Reward Score Integration", False, ', '.join(issues)))
        all_passed = False
    
    # Test 6: Configuration File
    print()
    print("6. Testing configuration file...")
    config_ok, config_msg = test_configuration_file()
    if config_ok:
        print(f"   ✅ {config_msg}")
        results.append(("Configuration File", True, ""))
    else:
        print(f"   ❌ {config_msg}")
        results.append(("Configuration File", False, config_msg))
        all_passed = False
    
    # Test 7: Insert and Query
    print()
    print("7. Testing insert and query operations...")
    insert_ok, insert_msg = test_insert_and_query(supabase)
    if insert_ok:
        print(f"   ✅ {insert_msg}")
        results.append(("Insert/Query Operations", True, ""))
    else:
        print(f"   ❌ {insert_msg}")
        results.append(("Insert/Query Operations", False, insert_msg))
        all_passed = False
    
    # Summary
    print()
    print("=" * 60)
    print("Verification Summary")
    print("=" * 60)
    
    for test_name, passed, details in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} - {test_name}")
        if details:
            print(f"      {details}")
    
    print()
    if all_passed:
        print("🎉 All tests passed! Phase 1 setup is complete.")
        print()
        print("Next steps:")
        print("  1. Review Phase 1 deliverables")
        print("  2. Get stakeholder approval")
        print("  3. Begin Phase 2: File Watcher Implementation")
        return 0
    else:
        print("⚠️  Some tests failed. Please fix the issues above before proceeding.")
        return 1


if __name__ == "__main__":
    sys.exit(main())

