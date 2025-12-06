#!/usr/bin/env python3
"""Analyze warnings from AGENT_STATUS.md"""

import re
from pathlib import Path

status_file = Path('.cursor/enforcement/AGENT_STATUS.md')
content = status_file.read_text(encoding='utf-8')

# Extract warnings
warnings = re.findall(r'\*\*(.*?\.mdc)\*\*: (.*?) \(`', content)

rule_counts = {}
for rule, msg in warnings:
    rule_counts[rule] = rule_counts.get(rule, 0) + 1

print('Warning Summary by Rule:')
print(f'Total Warnings: {len(warnings)}')
print('')
for rule, count in sorted(rule_counts.items(), key=lambda x: x[1], reverse=True):
    print(f'  {rule}: {count} warnings')

# Show sample messages for each rule
print('\nSample Warning Messages by Rule:')
print('=' * 80)
for rule in sorted(rule_counts.keys()):
    print(f'\n{rule}:')
    samples = [msg for r, msg in warnings if r == rule][:3]
    for i, msg in enumerate(samples, 1):
        print(f'  {i}. {msg}')



















