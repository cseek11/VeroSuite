import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Seed script for compliance rule definitions (R01-R25)
 * Run with: npx ts-node libs/common/prisma/seed-compliance-rules.ts
 */
async function main() {
  console.log('Seeding compliance rule definitions...');

  const rules = [
    // Tier 1 MAD (BLOCK) - 3 Rules
    {
      id: 'R01',
      name: 'Tenant Isolation',
      description: 'All database queries must include tenant_id filter',
      tier: 'BLOCK',
      category: 'Security',
      file_path: '.cursor/rules/03-security.mdc',
      opa_policy: 'security.rego',
    },
    {
      id: 'R02',
      name: 'RLS Enforcement',
      description: 'Row Level Security policies must be enabled and enforced',
      tier: 'BLOCK',
      category: 'Security',
      file_path: '.cursor/rules/03-security.mdc',
      opa_policy: 'security.rego',
    },
    {
      id: 'R03',
      name: 'Architecture Boundaries',
      description: 'Cannot create new microservices or top-level directories without approval',
      tier: 'BLOCK',
      category: 'Architecture',
      file_path: '.cursor/rules/04-architecture.mdc',
      opa_policy: 'architecture.rego',
    },
    // Tier 2 MAD (OVERRIDE) - 10 Rules
    {
      id: 'R04',
      name: 'Layer Synchronization',
      description: 'Schema, DTOs, types, and contracts must stay synchronized',
      tier: 'OVERRIDE',
      category: 'Data Integrity',
      file_path: '.cursor/rules/05-data.mdc',
      opa_policy: 'data-integrity.rego',
    },
    {
      id: 'R05',
      name: 'State Machine Enforcement',
      description: 'State transitions must follow documented state machines',
      tier: 'OVERRIDE',
      category: 'Data Integrity',
      file_path: '.cursor/rules/05-data.mdc',
      opa_policy: 'data-integrity.rego',
    },
    {
      id: 'R06',
      name: 'Breaking Change Documentation',
      description: 'Breaking changes require migration guide',
      tier: 'OVERRIDE',
      category: 'Data Integrity',
      file_path: '.cursor/rules/05-data.mdc',
      opa_policy: 'data-integrity.rego',
    },
    {
      id: 'R07',
      name: 'Error Handling',
      description: 'No silent failures, all errors must be logged and handled',
      tier: 'OVERRIDE',
      category: 'Error Resilience',
      file_path: '.cursor/rules/06-error-resilience.mdc',
      opa_policy: 'error-handling.rego',
    },
    {
      id: 'R08',
      name: 'Structured Logging',
      description: 'All logs must be structured with required fields',
      tier: 'OVERRIDE',
      category: 'Observability',
      file_path: '.cursor/rules/07-observability.mdc',
      opa_policy: 'observability.rego',
    },
    {
      id: 'R09',
      name: 'Trace Propagation',
      description: 'TraceId must propagate through all layers',
      tier: 'OVERRIDE',
      category: 'Observability',
      file_path: '.cursor/rules/07-observability.mdc',
      opa_policy: 'observability.rego',
    },
    {
      id: 'R10',
      name: 'Testing Coverage',
      description: 'All code changes must have appropriate test coverage (unit/regression/integration/E2E)',
      tier: 'OVERRIDE',
      category: 'Quality',
      file_path: '.cursor/rules/10-quality.mdc',
      opa_policy: 'quality.rego',
    },
    {
      id: 'R11',
      name: 'Backend Patterns',
      description: 'NestJS and Prisma patterns must be followed',
      tier: 'OVERRIDE',
      category: 'Backend',
      file_path: '.cursor/rules/08-backend.mdc',
      opa_policy: 'backend.rego',
    },
    {
      id: 'R12',
      name: 'Security Event Logging',
      description: 'Security events must be logged with audit trail',
      tier: 'OVERRIDE',
      category: 'Security',
      file_path: '.cursor/rules/03-security.mdc',
      opa_policy: 'security.rego',
    },
    {
      id: 'R13',
      name: 'Input Validation',
      description: 'All user input must be validated on backend',
      tier: 'OVERRIDE',
      category: 'Security',
      file_path: '.cursor/rules/03-security.mdc',
      opa_policy: 'security.rego',
    },
    // Tier 3 MAD (WARNING) - 12 Rules
    {
      id: 'R14',
      name: 'Tech Debt Logging',
      description: 'Tech debt must be logged in docs/tech-debt.md',
      tier: 'WARNING',
      category: 'Tech Debt',
      file_path: '.cursor/rules/12-tech-debt.mdc',
      opa_policy: 'tech-debt.rego',
    },
    {
      id: 'R15',
      name: 'TODO/FIXME Handling',
      description: 'TODO/FIXME must be addressed or logged',
      tier: 'WARNING',
      category: 'Tech Debt',
      file_path: '.cursor/rules/12-tech-debt.mdc',
      opa_policy: 'tech-debt.rego',
    },
    {
      id: 'R16',
      name: 'Testing Requirements',
      description: 'New code requires tests (unit/integration/E2E)',
      tier: 'WARNING',
      category: 'Quality',
      file_path: '.cursor/rules/10-quality.mdc',
      opa_policy: 'testing.rego',
    },
    {
      id: 'R17',
      name: 'Coverage Requirements',
      description: 'Maintain minimum test coverage thresholds',
      tier: 'WARNING',
      category: 'Quality',
      file_path: '.cursor/rules/10-quality.mdc',
      opa_policy: 'testing.rego',
    },
    {
      id: 'R18',
      name: 'Performance Budgets',
      description: 'Code must meet performance budgets (API response times, frontend metrics)',
      tier: 'WARNING',
      category: 'Quality',
      file_path: '.cursor/rules/10-quality.mdc',
      opa_policy: 'testing.rego',
    },
    {
      id: 'R19',
      name: 'Accessibility Requirements',
      description: 'UI components must meet WCAG accessibility standards',
      tier: 'WARNING',
      category: 'UX',
      file_path: '.cursor/rules/13-ux-consistency.mdc',
      opa_policy: 'ux-consistency.rego',
    },
    {
      id: 'R20',
      name: 'UX Consistency',
      description: 'UI must follow design system and UX patterns',
      tier: 'WARNING',
      category: 'UX',
      file_path: '.cursor/rules/13-ux-consistency.mdc',
      opa_policy: 'ux-consistency.rego',
    },
    {
      id: 'R21',
      name: 'File Organization',
      description: 'Files must be in correct monorepo locations',
      tier: 'WARNING',
      category: 'Architecture',
      file_path: '.cursor/rules/04-architecture.mdc',
      opa_policy: 'architecture.rego',
    },
    {
      id: 'R22',
      name: 'Refactor Integrity',
      description: 'Refactoring must include behavior-diffing tests, regression tests, and risk surface documentation',
      tier: 'WARNING',
      category: 'Architecture',
      file_path: '.cursor/rules/04-architecture.mdc',
      opa_policy: 'architecture.rego',
    },
    {
      id: 'R23',
      name: 'Naming Conventions',
      description: 'Follow naming conventions (PascalCase, camelCase, etc.)',
      tier: 'WARNING',
      category: 'Documentation',
      file_path: '.cursor/rules/02-core.mdc',
      opa_policy: 'documentation.rego',
    },
    {
      id: 'R24',
      name: 'Cross-Platform Compatibility',
      description: 'Ensure cross-platform compatibility for code shared between web and mobile',
      tier: 'WARNING',
      category: 'Frontend',
      file_path: '.cursor/rules/09-frontend.mdc',
      opa_policy: 'frontend.rego',
    },
    {
      id: 'R25',
      name: 'CI/CD Workflow Triggers',
      description: 'Workflows must have proper triggers configured',
      tier: 'WARNING',
      category: 'Operations',
      file_path: '.cursor/rules/11-operations.mdc',
      opa_policy: 'operations.rego',
    },
  ];

  for (const rule of rules) {
    await prisma.ruleDefinition.upsert({
      where: { id: rule.id },
      update: rule,
      create: rule,
    });
    console.log(`✓ Seeded rule ${rule.id}: ${rule.name}`);
  }

  console.log(`\n✅ Successfully seeded ${rules.length} compliance rules`);
}

main()
  .catch((e) => {
    console.error('Error seeding compliance rules:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });



