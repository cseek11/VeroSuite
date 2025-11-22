import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

// Mock Supabase client
const mockSupabaseClient = {
  auth: {
    signInWithPassword: jest.fn(),
  },
};

// Mock createClient
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockSupabaseClient),
}));

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    user_metadata: {
      tenant_id: 'tenant-123',
      roles: ['dispatcher'],
      first_name: 'Test',
      last_name: 'User',
    },
  };

  const mockJwtPayload = {
    sub: 'user-123',
    email: 'test@example.com',
    tenant_id: 'tenant-123',
    roles: ['dispatcher'],
    permissions: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return access token and user data on successful login', async () => {
      const mockToken = 'jwt-token-123';
      const mockAuthData = {
        user: mockUser,
        session: { access_token: 'supabase-token' },
      };

      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: mockAuthData,
        error: null,
      });

      jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);

      const result = await service.login('test@example.com', 'password123');

      expect(result).toEqual({
        access_token: mockToken,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          first_name: mockUser.user_metadata.first_name,
          last_name: mockUser.user_metadata.last_name,
          tenant_id: mockUser.user_metadata.tenant_id,
          roles: mockUser.user_metadata.roles,
        },
      });

      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(jwtService.sign).toHaveBeenCalledWith(mockJwtPayload);
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid credentials' },
      });

      await expect(service.login('test@example.com', 'wrongpassword')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when auth error occurs', async () => {
      mockSupabaseClient.auth.signInWithPassword.mockRejectedValue(new Error('Network error'));

      await expect(service.login('test@example.com', 'password123')).rejects.toThrow(UnauthorizedException);
    });
  });
});