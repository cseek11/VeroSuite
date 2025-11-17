import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { AppModule } from '../../src/app.module';
import { TEST_PASSWORD, TEST_USERS } from '../global-setup';

let authService: AuthService;
let moduleRef: TestingModule;

// Token cache to avoid repeated login calls
const tokenCache = new Map<string, { token: string, expiresAt: number }>();

/**
 * Initialize auth service for testing
 * Call this in test suite's beforeAll
 */
export async function initTestAuth() {
  if (!moduleRef) {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    
    authService = moduleRef.get<AuthService>(AuthService);
  }
}

/**
 * Get authentication token for test user
 * Uses real AuthService to test JWT generation
 * AuthService.login() signature: login(email: string, password: string)
 */
export async function getTestAuthToken(email: string): Promise<string> {
  // Check cache first (tokens valid for 50 minutes)
  const cached = tokenCache.get(email);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.token;
  }
  
  // Ensure auth service is initialized
  if (!authService) {
    await initTestAuth();
  }
  
  // Login with test credentials
  // AuthService.login() takes (email: string, password: string)
  const result = await authService.login(email, TEST_PASSWORD);
  
  // Cache token (expires in 50 minutes)
  tokenCache.set(email, {
    token: result.access_token,
    expiresAt: Date.now() + (50 * 60 * 1000)
  });
  
  return result.access_token;
}

/**
 * Convenience functions for common test users
 */
export async function getAdminToken(): Promise<string> {
  return getTestAuthToken(TEST_USERS.ADMIN);
}

export async function getDispatcherToken(): Promise<string> {
  return getTestAuthToken(TEST_USERS.DISPATCHER);
}

export async function getTechnicianToken(): Promise<string> {
  return getTestAuthToken(TEST_USERS.TECHNICIAN);
}

export async function getTenant2Token(): Promise<string> {
  return getTestAuthToken(TEST_USERS.TENANT2);
}

/**
 * Clean up auth module (call in afterAll if needed)
 */
export async function cleanupTestAuth() {
  if (moduleRef) {
    await moduleRef.close();
    moduleRef = null;
    authService = null;
  }
  tokenCache.clear();
}

