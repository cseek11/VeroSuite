/**
 * Manual mock for ioredis
 * Used when ioredis is not installed as a dependency
 */

const mockRedisClient = {
  get: jest.fn(),
  setex: jest.fn(),
  del: jest.fn(),
  keys: jest.fn(),
  flushdb: jest.fn(),
  quit: jest.fn(),
  on: jest.fn(),
  publish: jest.fn(),
  subscribe: jest.fn(),
  unsubscribe: jest.fn(),
};

const MockRedis = jest.fn().mockImplementation(() => mockRedisClient);

// Export as default for ES modules and CommonJS
module.exports = MockRedis;
module.exports.default = MockRedis;
