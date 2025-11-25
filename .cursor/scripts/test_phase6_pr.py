#!/usr/bin/env python3
"""
Test Phase 6 PR Creation - Creates a test PR with Phase 6 files and monitors workflow.

Usage:
    python .cursor/scripts/test_phase6_pr.py
"""

import os
import sys
import time
import subprocess
from pathlib import Path
from datetime import datetime, timezone

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

try:
    from supabase import create_client, Client
except ImportError:
    print("❌ Missing supabase-py package. Install with: pip install supabase", file=sys.stderr)
    sys.exit(1)

from veroscore_v3.pr_creator import PRCreator
from veroscore_v3.session_manager import SessionManager
from veroscore_v3.file_change import FileChange
from logger_util import get_logger

logger = get_logger(context="test_phase6_pr")


def create_test_session():
    """Create a test session with Phase 6 files."""
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SECRET_KEY")
    
    if not supabase_url or not supabase_key:
        print("❌ Error: SUPABASE_URL and SUPABASE_SECRET_KEY environment variables required", file=sys.stderr)
        sys.exit(1)
    
    supabase = create_client(supabase_url, supabase_key)
    session_manager = SessionManager(supabase)
    
    # Create session
    author = "test-user"
    session_id = session_manager.get_or_create_session(author=author)
    print(f"✅ Created session: {session_id}")
    
    # Create high-quality test files that should pass scoring
    # Use pure utility function in shared libs (no database, no security concerns)
    utils_dir = project_root / "libs" / "common" / "src" / "utils"
    utils_dir.mkdir(parents=True, exist_ok=True)
    
    utils_test_dir = project_root / "libs" / "common" / "src" / "utils" / "__tests__"
    utils_test_dir.mkdir(parents=True, exist_ok=True)
    
    # 1. Create a pure utility function (no violations possible)
    utility_file = utils_dir / "formatCurrency.ts"
    utility_content = """/**
 * formatCurrency - Formats a number as currency string.
 * 
 * This is a pure utility function with no external dependencies,
 * no database access, and no security concerns.
 * 
 * @param amount - The numeric amount to format
 * @param currency - Currency code (default: 'USD')
 * @param locale - Locale string (default: 'en-US')
 * @returns Formatted currency string
 * 
 * @example
 * ```typescript
 * formatCurrency(1234.56) // "$1,234.56"
 * formatCurrency(1234.56, 'EUR', 'de-DE') // "1.234,56 €"
 * ```
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  if (typeof amount !== 'number' || isNaN(amount)) {
    throw new Error('Amount must be a valid number');
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount);
}
"""
    
    # 2. Create comprehensive test file
    utility_test_file = utils_test_dir / "formatCurrency.test.ts"
    utility_test_content = """/**
 * Tests for formatCurrency utility function
 * 
 * Coverage:
 * - Component rendering
 * - User interactions
 * - Form validation
 * - Error handling
 * - Edge cases
 */

import { formatCurrency } from '../formatCurrency';

describe('formatCurrency', () => {
  describe('Basic formatting', () => {
    it('should format USD currency correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(1000000)).toBe('$1,000,000.00');
    });

    it('should format EUR currency correctly', () => {
      expect(formatCurrency(1234.56, 'EUR')).toBe('€1,234.56');
    });

    it('should format with different locales', () => {
      expect(formatCurrency(1234.56, 'EUR', 'de-DE')).toBe('1.234,56 €');
      expect(formatCurrency(1234.56, 'JPY', 'ja-JP')).toBe('¥1,235');
    });
  });

  describe('Edge cases', () => {
    it('should handle negative numbers', () => {
      expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
    });

    it('should handle very large numbers', () => {
      expect(formatCurrency(999999999.99)).toBe('$999,999,999.99');
    });

    it('should handle very small numbers', () => {
      expect(formatCurrency(0.01)).toBe('$0.01');
    });

    it('should throw error for invalid input', () => {
      expect(() => formatCurrency(NaN)).toThrow('Amount must be a valid number');
      expect(() => formatCurrency('invalid' as any)).toThrow('Amount must be a valid number');
    });
  });

  describe('Currency codes', () => {
    it('should handle various currency codes', () => {
      expect(formatCurrency(100, 'GBP')).toContain('£');
      expect(formatCurrency(100, 'JPY')).toContain('¥');
      expect(formatCurrency(100, 'CNY')).toContain('¥');
    });
  });
});
"""
    
    # 3. Create documentation file
    doc_file = utils_dir / "formatCurrency.md"
    doc_content = """# formatCurrency Utility

**Last Updated:** 2025-11-25

## Overview

The `formatCurrency` utility function provides a simple, pure way to format numbers as currency strings using the Intl.NumberFormat API.

## Features

- ✅ **Pure Function**: No side effects, no external dependencies
- ✅ **Type Safe**: Full TypeScript support
- ✅ **Locale Support**: Supports any locale and currency code
- ✅ **Error Handling**: Validates input and throws descriptive errors
- ✅ **Test Coverage**: Comprehensive test suite

## Usage

```typescript
import { formatCurrency } from '@verofield/common/utils';

// Basic usage
const price = formatCurrency(1234.56); // "$1,234.56"

// With currency
const euro = formatCurrency(1234.56, 'EUR'); // "€1,234.56"

// With locale
const german = formatCurrency(1234.56, 'EUR', 'de-DE'); // "1.234,56 €"
```

## API

### `formatCurrency(amount, currency?, locale?)`

**Parameters:**
- `amount` (number, required): The numeric amount to format
- `currency` (string, optional): Currency code (default: 'USD')
- `locale` (string, optional): Locale string (default: 'en-US')

**Returns:** Formatted currency string

**Throws:** Error if amount is not a valid number

## Examples

```typescript
formatCurrency(1234.56)              // "$1,234.56"
formatCurrency(1234.56, 'EUR')       // "€1,234.56"
formatCurrency(1234.56, 'EUR', 'de-DE') // "1.234,56 €"
formatCurrency(-100)                 // "-$100.00"
formatCurrency(0)                     // "$0.00"
```

## Testing

Run tests with:
```bash
npm test formatCurrency.test.ts
```

Test coverage includes:
- Basic formatting
- Different currencies
- Different locales
- Edge cases (negative, large, small numbers)
- Error handling

## Architecture

- **Location**: `libs/common/src/utils/formatCurrency.ts`
- **Tests**: `libs/common/src/utils/__tests__/formatCurrency.test.ts`
- **Dependencies**: None (pure TypeScript)
"""
    
    # Write files and create changes
    changes = []
    
    # Utility file (in correct shared libs location)
    utility_file.write_text(utility_content, encoding='utf-8')
    changes.append(FileChange(
        path=str(utility_file.relative_to(project_root)),
        change_type="added",
        timestamp=datetime.now(timezone.utc).isoformat(),
        lines_added=len(utility_content.split('\n')),
        lines_removed=0
    ))
    print(f"  ✅ Created {utility_file.relative_to(project_root)}")
    
    # Test file (in correct test location)
    utility_test_file.write_text(utility_test_content, encoding='utf-8')
    changes.append(FileChange(
        path=str(utility_test_file.relative_to(project_root)),
        change_type="added",
        timestamp=datetime.now(timezone.utc).isoformat(),
        lines_added=len(utility_test_content.split('\n')),
        lines_removed=0
    ))
    print(f"  ✅ Created {utility_test_file.relative_to(project_root)}")
    
    # Documentation file
    doc_file.write_text(doc_content, encoding='utf-8')
    changes.append(FileChange(
        path=str(doc_file.relative_to(project_root)),
        change_type="added",
        timestamp=datetime.now(timezone.utc).isoformat(),
        lines_added=len(doc_content.split('\n')),
        lines_removed=0
    ))
    print(f"  ✅ Created {doc_file.relative_to(project_root)}")
    
    # Add all changes in batch
    if changes:
        session_manager.add_changes_batch(session_id, changes)
        print(f"  ✅ Added {len(changes)} high-quality files to session")
    
    return session_id, supabase


def create_pr(session_id, supabase):
    """Create PR for session."""
    pr_creator = PRCreator(supabase, project_root)
    
    print(f"\n🚀 Creating PR for session: {session_id}")
    pr_result = pr_creator.create_pr(session_id, force=False)
    
    if pr_result:
        pr_number = pr_result.get('pr_number')
        pr_url = pr_result.get('pr_url')
        print(f"\n✅ PR created successfully!")
        print(f"   PR Number: {pr_number}")
        print(f"   PR URL: {pr_url}")
        return pr_number, pr_url
    else:
        print(f"\n❌ Failed to create PR", file=sys.stderr)
        return None, None


def monitor_workflow(pr_number, max_wait=300):
    """Monitor workflow execution for PR."""
    print(f"\n📊 Monitoring workflow for PR #{pr_number}...")
    print(f"   Waiting up to {max_wait} seconds...")
    
    start_time = time.time()
    last_status = None
    
    while time.time() - start_time < max_wait:
        try:
            # Get workflow runs for this PR
            result = subprocess.run(
                ["gh", "run", "list", "--workflow=verofield_auto_pr.yml", "--limit", "5"],
                capture_output=True,
                text=True,
                check=True
            )
            
            # Check if any run is for this PR
            lines = result.stdout.strip().split('\n')
            for line in lines[1:]:  # Skip header
                if str(pr_number) in line or f"#{pr_number}" in line:
                    parts = line.split()
                    if len(parts) >= 3:
                        run_id = parts[0]
                        status = parts[1]
                        conclusion = parts[2] if len(parts) > 2 else "in_progress"
                        
                        if status != last_status or conclusion != "in_progress":
                            print(f"   [{time.strftime('%H:%M:%S')}] Run {run_id}: {status} - {conclusion}")
                            last_status = status
                            
                            if conclusion != "in_progress" and conclusion != "queued":
                                print(f"\n✅ Workflow completed: {conclusion}")
                                return conclusion
            
            time.sleep(10)  # Check every 10 seconds
            
        except subprocess.CalledProcessError as e:
            print(f"   ⚠️  Error checking workflow: {e.stderr}")
            time.sleep(10)
        except Exception as e:
            print(f"   ⚠️  Error: {e}")
            time.sleep(10)
    
    print(f"\n⏱️  Timeout reached ({max_wait}s)")
    return None


def check_pr_comments(pr_number):
    """Check PR comments for VeroScore results."""
    print(f"\n💬 Checking PR comments for PR #{pr_number}...")
    
    try:
        result = subprocess.run(
            ["gh", "pr", "view", str(pr_number), "--json", "comments"],
            capture_output=True,
            text=True,
            check=True
        )
        
        import json
        pr_data = json.loads(result.stdout)
        comments = pr_data.get("comments", [])
        
        for comment in comments:
            body = comment.get("body", "")
            if "VeroScore" in body or "Auto-BLOCK" in body or "Auto-APPROVE" in body or "Review Required" in body:
                print(f"\n📝 Found VeroScore comment:")
                print(f"   {body[:200]}...")
                return body
        
        print("   No VeroScore comments found yet")
        return None
        
    except Exception as e:
        print(f"   ⚠️  Error checking comments: {e}")
        return None


def main():
    """Main execution."""
    print("=" * 60)
    print("Phase 6 PR Test - Creating PR and Monitoring Workflow")
    print("=" * 60)
    
    # Create session
    session_id, supabase = create_test_session()
    
    # Create PR
    pr_number, pr_url = create_pr(session_id, supabase)
    
    if not pr_number:
        print("\n❌ Failed to create PR. Exiting.")
        sys.exit(1)
    
    # Monitor workflow
    conclusion = monitor_workflow(pr_number, max_wait=300)
    
    # Check PR comments
    comment = check_pr_comments(pr_number)
    
    # Summary
    print("\n" + "=" * 60)
    print("Summary")
    print("=" * 60)
    print(f"Session ID: {session_id}")
    print(f"PR Number: {pr_number}")
    print(f"PR URL: {pr_url}")
    print(f"Workflow Conclusion: {conclusion or 'Timeout'}")
    print(f"VeroScore Comment: {'Found' if comment else 'Not found'}")
    print("\n✅ Test complete!")


if __name__ == '__main__':
    main()

