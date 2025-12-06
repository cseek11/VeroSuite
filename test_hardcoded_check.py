#!/usr/bin/env python3
"""Test hardcoded check logic."""
file_path_str = '.ai/memory_bank/README.md'
normalized_path_for_check = str(file_path_str).replace("\\", "/").lower()
print(f'file_path_str: {file_path_str}')
print(f'normalized_path_for_check: {normalized_path_for_check}')
check1 = ".ai/memory_bank/" in normalized_path_for_check
check2 = ".ai/memory-bank/" in normalized_path_for_check
print(f'Check 1 (.ai/memory_bank/): {check1}')
print(f'Check 2 (.ai/memory-bank/): {check2}')
print(f'Should skip: {check1 or check2}')










