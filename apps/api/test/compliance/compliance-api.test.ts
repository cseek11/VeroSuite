import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { DatabaseService } from '../../src/common/services/database.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

/**
 * Integration tests for Compliance API endpoints
 * 
 * Run with: npm test -- compliance-api.test.ts
 * 
 * Prerequisites:
 * - DATABASE_URL environment variable set
 * - Database migrations run
 * - Rule definitions seeded
 */
describe('Compliance API (e2e)', () => {
  let app: INestApplication;
  let db: DatabaseService;
  let jwtService: JwtService;
  let configService: ConfigService;
  let authToken: string;
  let testTenantId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    
    db = moduleFixture.get<DatabaseService>(DatabaseService);
    jwtService = moduleFixture.get<JwtService>(JwtService);
    configService = moduleFixture.get<ConfigService>(ConfigService);

    await app.init();

    // Create test tenant and user for authentication
    testTenantId = 'test-tenant-' + Date.now();
    
    // Create test JWT token
    authToken = jwtService.sign({
      sub: 'test-user-id',
      email: 'test@example.com',
      tenantId: testTenantId,
      roles: ['user'],
    });
  });

  afterAll(async () => {
    // Cleanup test data
    if (db) {
      await db.complianceCheck.deleteMany({
        where: { tenant_id: testTenantId },
      });
      await db.$disconnect();
    }
    await app.close();
  });

  describe('GET /api/v1/compliance/rules', () => {
    it('should return all rule definitions', () => {
      return request(app.getHttpServer())
        .get('/api/v1/compliance/rules')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('total');
          expect(res.body.total).toBeGreaterThanOrEqual(25);
          expect(res.body.data).toBeInstanceOf(Array);
          expect(res.body.data[0]).toHaveProperty('id');
          expect(res.body.data[0]).toHaveProperty('name');
          expect(res.body.data[0]).toHaveProperty('tier');
        });
    });

    it('should require authentication', () => {
      return request(app.getHttpServer())
        .get('/api/v1/compliance/rules')
        .expect(401);
    });
  });

  describe('GET /api/v1/compliance/checks', () => {
    it('should return empty array initially', () => {
      return request(app.getHttpServer())
        .get('/api/v1/compliance/checks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('total');
          expect(res.body.data).toBeInstanceOf(Array);
        });
    });

    it('should filter by PR number', async () => {
      // Create test compliance check
      await db.complianceCheck.create({
        data: {
          tenant_id: testTenantId,
          pr_number: 999,
          commit_sha: 'test-commit-sha',
          rule_id: 'R01',
          status: 'VIOLATION',
          severity: 'BLOCK',
        },
      });

      return request(app.getHttpServer())
        .get('/api/v1/compliance/checks?prNumber=999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.length).toBeGreaterThan(0);
          expect(res.body.data[0].pr_number).toBe(999);
        });
    });

    it('should filter by rule ID', async () => {
      return request(app.getHttpServer())
        .get('/api/v1/compliance/checks?ruleId=R01')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          if (res.body.data.length > 0) {
            expect(res.body.data[0].rule_id).toBe('R01');
          }
        });
    });
  });

  describe('POST /api/v1/compliance/checks', () => {
    it('should create a compliance check', () => {
      const checkData = {
        pr_number: 123,
        commit_sha: 'abc123def456',
        rule_id: 'R01',
        status: 'VIOLATION',
        severity: 'BLOCK',
        file_path: 'apps/api/src/test.ts',
        line_number: 42,
        violation_message: 'Missing tenant_id filter',
      };

      return request(app.getHttpServer())
        .post('/api/v1/compliance/checks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(checkData)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.pr_number).toBe(123);
          expect(res.body.rule_id).toBe('R01');
          expect(res.body.status).toBe('VIOLATION');
          expect(res.body.severity).toBe('BLOCK');
          expect(res.body.tenant_id).toBe(testTenantId);
        });
    });

    it('should validate required fields', () => {
      return request(app.getHttpServer())
        .post('/api/v1/compliance/checks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);
    });

    it('should reject invalid rule ID', async () => {
      const checkData = {
        pr_number: 123,
        commit_sha: 'abc123',
        rule_id: 'INVALID_RULE',
        status: 'VIOLATION',
        severity: 'BLOCK',
      };

      return request(app.getHttpServer())
        .post('/api/v1/compliance/checks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(checkData)
        .expect(404); // Rule not found
    });
  });

  describe('GET /api/v1/compliance/pr/:prNumber/score', () => {
    it('should calculate compliance score', async () => {
      // Create test violations
      await db.complianceCheck.createMany({
        data: [
          {
            tenant_id: testTenantId,
            pr_number: 456,
            commit_sha: 'sha1',
            rule_id: 'R01',
            status: 'VIOLATION',
            severity: 'WARNING',
          },
          {
            tenant_id: testTenantId,
            pr_number: 456,
            commit_sha: 'sha1',
            rule_id: 'R02',
            status: 'VIOLATION',
            severity: 'WARNING',
          },
        ],
      });

      return request(app.getHttpServer())
        .get('/api/v1/compliance/pr/456/score')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('score');
          expect(res.body).toHaveProperty('block_count');
          expect(res.body).toHaveProperty('override_count');
          expect(res.body).toHaveProperty('warning_count');
          expect(res.body).toHaveProperty('weighted_violations');
          expect(res.body).toHaveProperty('can_merge');
          expect(res.body.pr_number).toBe(456);
          expect(res.body.warning_count).toBe(2);
          expect(res.body.score).toBe(98); // 100 - (2 * 1) = 98
        });
    });

    it('should handle PR with no violations', async () => {
      return request(app.getHttpServer())
        .get('/api/v1/compliance/pr/999/score')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.score).toBe(100);
          expect(res.body.can_merge).toBe(true);
        });
    });
  });

  describe('Tenant Isolation', () => {
    it('should only return checks for authenticated tenant', async () => {
      const otherTenantId = 'other-tenant-id';
      
      // Create check for other tenant
      await db.complianceCheck.create({
        data: {
          tenant_id: otherTenantId,
          pr_number: 888,
          commit_sha: 'other-sha',
          rule_id: 'R01',
          status: 'VIOLATION',
          severity: 'BLOCK',
        },
      });

      // Query as test tenant (should not see other tenant's check)
      return request(app.getHttpServer())
        .get('/api/v1/compliance/checks?prNumber=888')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          // Should not see other tenant's check
          const otherTenantCheck = res.body.data.find(
            (check: any) => check.tenant_id === otherTenantId
          );
          expect(otherTenantCheck).toBeUndefined();
        });
    });
  });
});



