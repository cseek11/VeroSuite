/**
 * Template Migration Script
 * Migrates templates from localStorage to backend
 * 
 * Usage: Call this function once when the app loads to migrate existing templates
 */

import { enhancedApi } from '@/lib/enhanced-api';
import { logger } from '@/utils/logger';

const STORAGE_KEY = 'dashboard_templates';
const MIGRATION_FLAG = 'dashboard_templates_migrated';

export interface LocalStorageTemplate {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  regions: any[];
  created_at: string;
  updated_at: string;
  is_system?: boolean;
}

/**
 * Check if migration has already been completed
 */
export function isMigrationComplete(): boolean {
  return localStorage.getItem(MIGRATION_FLAG) === 'true';
}

/**
 * Mark migration as complete
 */
function markMigrationComplete(): void {
  localStorage.setItem(MIGRATION_FLAG, 'true');
}

/**
 * Get templates from localStorage
 */
function getLocalStorageTemplates(): LocalStorageTemplate[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }
    return JSON.parse(stored);
  } catch (error) {
    logger.error('Failed to parse localStorage templates', { error }, 'migrate-templates');
    return [];
  }
}

/**
 * Migrate templates from localStorage to backend
 */
export async function migrateTemplates(): Promise<{ migrated: number; failed: number; skipped: number }> {
  // Check if already migrated
  if (isMigrationComplete()) {
    logger.debug('Templates already migrated', {}, 'migrate-templates');
    return { migrated: 0, failed: 0, skipped: 0 };
  }

  const templates = getLocalStorageTemplates();
  if (templates.length === 0) {
    logger.debug('No templates to migrate', {}, 'migrate-templates');
    markMigrationComplete();
    return { migrated: 0, failed: 0, skipped: 0 };
  }

  let migrated = 0;
  let failed = 0;
  let skipped = 0;

  logger.info(`Starting template migration: ${templates.length} templates found`, {}, 'migrate-templates');

  for (const template of templates) {
    try {
      // Skip system templates (they should be created by the backend)
      if (template.is_system) {
        skipped++;
        logger.debug(`Skipping system template: ${template.name}`, {}, 'migrate-templates');
        continue;
      }

      // Check if template already exists in backend (by name)
      const existingTemplates = await enhancedApi.dashboardLayouts.templates.list();
      const exists = existingTemplates.some(t => t.name === template.name);

      if (exists) {
        skipped++;
        logger.debug(`Template already exists: ${template.name}`, {}, 'migrate-templates');
        continue;
      }

      // Create template in backend
      const templateData: any = {
        name: template.name,
        regions: template.regions || [],
        is_public: false
      };
      if (template.description) templateData.description = template.description;
      if (template.thumbnail) templateData.thumbnail = template.thumbnail;
      
      await enhancedApi.dashboardLayouts.templates.create(templateData);

      migrated++;
      logger.debug(`Migrated template: ${template.name}`, {}, 'migrate-templates');
    } catch (error) {
      failed++;
      logger.error(`Failed to migrate template: ${template.name}`, { error, templateId: template.id }, 'migrate-templates');
    }
  }

  // Mark migration as complete if at least some templates were processed
  if (migrated > 0 || (templates.length > 0 && failed === 0)) {
    markMigrationComplete();
    
    // Optionally clear localStorage templates after successful migration
    // Uncomment the line below if you want to remove templates from localStorage after migration
    // localStorage.removeItem(STORAGE_KEY);
  }

  logger.info(`Template migration complete: ${migrated} migrated, ${failed} failed, ${skipped} skipped`, {}, 'migrate-templates');

  return { migrated, failed, skipped };
}

/**
 * Initialize migration on app load
 * Call this from your app initialization code
 */
export async function initTemplateMigration(): Promise<void> {
  if (typeof window === 'undefined') {
    return;
  }

  // Only run migration in browser
  try {
    await migrateTemplates();
  } catch (error) {
    logger.error('Template migration initialization failed', { error }, 'migrate-templates');
  }
}

