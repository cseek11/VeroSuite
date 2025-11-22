import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting KPI Templates seeding...');

  // Use the existing tenant ID from the user's metadata
  const tenantId = 'fb39f15b-b382-4525-8404-1e32ca1486c9';
  
  // Check if tenant exists
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
  });

  if (!tenant) {
    console.log('❌ Tenant not found. Please run the main seed script first.');
    return;
  }

  console.log('✅ Using existing tenant:', tenant.name);

  // Import comprehensive KPI templates
  const { kpiTemplates: templateDefinitions } = await import('./kpi-templates-clean');
  
  console.log(`📊 Seeding ${templateDefinitions.length} KPI Templates...`);
  
  const kpiTemplates = await Promise.all(
    templateDefinitions.map(template => 
      prisma.kpiTemplate.create({
        data: {
          name: template.name,
          description: template.description,
          category: template.category,
          template_type: template.template_type,
          formula_expression: template.formula_expression,
          formula_fields: template.formula_fields,
          threshold_config: template.threshold_config,
          chart_config: template.chart_config,
          data_source_config: template.data_source_config,
          tags: template.tags,
          is_public: template.is_public,
          is_featured: template.is_featured,
          tenant_id: tenantId,
          status: 'published'
        }
      })
    )
  );

  console.log('✅ Created KPI templates:', kpiTemplates.length);
  console.log('🎉 KPI Templates seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during KPI templates seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
