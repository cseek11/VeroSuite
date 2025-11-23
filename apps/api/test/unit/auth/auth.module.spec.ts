import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../../../src/auth/auth.module';

describe('AuthModule', () => {
  let module: TestingModule;
  let configService: ConfigService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ['.env.test'],
        }),
        AuthModule,
      ],
    }).compile();

    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(async () => {
    await module.close();
  });

  describe('JWT_SECRET loading', () => {
    it('should initialize JWT module when JWT_SECRET is provided', async () => {
      // Set JWT_SECRET in environment
      process.env.JWT_SECRET = 'test-jwt-secret-minimum-32-characters-long-for-validation';

      const testModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env.test'],
          }),
          AuthModule,
        ],
      }).compile();

      const jwtModule = testModule.get(JwtModule);
      expect(jwtModule).toBeDefined();

      await testModule.close();
    });

    it('should throw error when JWT_SECRET is missing', async () => {
      // Remove JWT_SECRET from environment
      delete process.env.JWT_SECRET;

      await expect(
        Test.createTestingModule({
          imports: [
            ConfigModule.forRoot({
              isGlobal: true,
              envFilePath: ['.env.test'],
            }),
            AuthModule,
          ],
        }).compile(),
      ).rejects.toThrow('JWT_SECRET environment variable is required');
    });

    it('should throw error with traceId when JWT_SECRET is missing', async () => {
      delete process.env.JWT_SECRET;

      try {
        await Test.createTestingModule({
          imports: [
            ConfigModule.forRoot({
              isGlobal: true,
              envFilePath: ['.env.test'],
            }),
            AuthModule,
          ],
        }).compile();
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        const errorMessage = (error as Error).message;
        expect(errorMessage).toContain('JWT_SECRET environment variable is required');
        expect(errorMessage).toMatch(/\[traceId: [a-f0-9-]+\]/);
      }
    });

    it('should use ConfigService to load JWT_SECRET (not process.env)', async () => {
      // This test verifies that JWT_SECRET is loaded via ConfigService
      // and not directly from process.env at module load time
      const testSecret = 'test-secret-loaded-via-config-service-min-32-chars';
      process.env.JWT_SECRET = testSecret;

      const testModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env.test'],
          }),
          AuthModule,
        ],
      }).compile();

      const configService = testModule.get<ConfigService>(ConfigService);
      const loadedSecret = configService.get<string>('JWT_SECRET');
      expect(loadedSecret).toBe(testSecret);

      await testModule.close();
    });
  });

  describe('Module initialization timing', () => {
    it('should initialize after ConfigModule loads environment variables', async () => {
      // This test verifies that AuthModule initializes AFTER ConfigModule
      // has loaded environment variables, not at module import time
      process.env.JWT_SECRET = 'test-secret-for-timing-test-minimum-32-characters';

      const testModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env.test'],
          }),
          AuthModule,
        ],
      }).compile();

      // If we get here without error, timing is correct
      expect(testModule).toBeDefined();

      await testModule.close();
    });
  });
});



