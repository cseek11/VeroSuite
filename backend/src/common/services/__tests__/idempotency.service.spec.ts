import { IdempotencyService, IdempotencyResult } from '../idempotency.service';
import { CacheService } from '../cache.service';
import { SupabaseService } from '../supabase.service';

describe('IdempotencyService', () => {
  let service: IdempotencyService;
  let cacheService: jest.Mocked<CacheService>;
  let supabaseService: jest.Mocked<SupabaseService>;

  beforeEach(() => {
    cacheService = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
    } as any;

    supabaseService = {
      getClient: jest.fn().mockReturnValue({
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn(),
        insert: jest.fn(),
        delete: jest.fn(),
      }),
    } as any;

    service = new IdempotencyService(cacheService, supabaseService);
  });

  it('should return null when no key is provided', async () => {
    const result = await service.checkKey('', 'user-1', 'tenant-1');
    expect(result).toBeNull();
    expect(cacheService.get).not.toHaveBeenCalled();
  });

  it('should return cached result when found in cache', async () => {
    const cached: IdempotencyResult = {
      isDuplicate: true,
      idempotencyKey: 'key-1',
      cachedResponse: { ok: true },
    };
    cacheService.get.mockResolvedValue(cached);

    const result = await service.checkKey('key-1', 'user-1', 'tenant-1');

    expect(cacheService.get).toHaveBeenCalled();
    expect(result).toEqual(cached);
  });

  it('should store key in cache and database on storeKey', async () => {
    const client = supabaseService.getClient();
    (client.from as jest.Mock).mockReturnValue({
      insert: jest.fn().mockResolvedValue({ error: null }),
    });

    await service.storeKey('key-2', 'user-1', 'tenant-1', { ok: true }, 201);

    expect(cacheService.set).toHaveBeenCalledWith(
      expect.stringContaining('idempotency:'),
      expect.objectContaining({
        isDuplicate: false,
        idempotencyKey: 'key-2',
      }),
      expect.any(Number),
    );
    expect(client.from).toHaveBeenCalledWith('idempotency_keys');
  });

  it('should generate deterministic keys from method, path, and user', () => {
    const key1 = IdempotencyService.generateKey('POST', '/api/v2/dashboard', 'user-1', {
      foo: 'bar',
    });
    const key2 = IdempotencyService.generateKey('POST', '/api/v2/dashboard', 'user-1', {
      foo: 'bar',
    });
    const key3 = IdempotencyService.generateKey('POST', '/api/v2/dashboard', 'user-2', {
      foo: 'bar',
    });

    expect(key1).toEqual(key2);
    expect(key1).not.toEqual(key3);
  });
});



