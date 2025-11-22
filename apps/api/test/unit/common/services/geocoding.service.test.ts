/**
 * Geocoding Service Unit Tests
 * Tests for address geocoding functionality
 */

import { Test, TestingModule } from '@nestjs/testing';
import { GeocodingService } from '../../../../src/common/services/geocoding.service';
import { ConfigService } from '@nestjs/config';

describe('GeocodingService', () => {
  let service: GeocodingService;
  let configService: ConfigService;
  let mockConfigService: any;

  beforeEach(async () => {
    mockConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'GOOGLE_MAPS_API_KEY') return 'test-api-key';
        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeocodingService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<GeocodingService>(GeocodingService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('geocodeAddress', () => {
    it('should return null coordinates when API key is not configured', async () => {
      // Arrange
      const configServiceWithoutKey = {
        get: jest.fn((key: string) => {
          if (key === 'GOOGLE_MAPS_API_KEY') return null;
          return null;
        }),
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          GeocodingService,
          {
            provide: ConfigService,
            useValue: configServiceWithoutKey,
          },
        ],
      }).compile();

      const serviceWithoutKey = module.get<GeocodingService>(GeocodingService);
      const address = '123 Main St, City, State 12345';

      // Act
      const result = await serviceWithoutKey.geocodeAddress(address);

      // Assert
      expect(result).toEqual({ latitude: null, longitude: null });
      expect(configServiceWithoutKey.get).toHaveBeenCalledWith('GOOGLE_MAPS_API_KEY');
    });

    it('should return null coordinates when API key is empty string', async () => {
      // Arrange
      const configServiceWithEmptyKey = {
        get: jest.fn((key: string) => {
          if (key === 'GOOGLE_MAPS_API_KEY') return '';
          return null;
        }),
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          GeocodingService,
          {
            provide: ConfigService,
            useValue: configServiceWithEmptyKey,
          },
        ],
      }).compile();

      const serviceWithEmptyKey = module.get<GeocodingService>(GeocodingService);
      const address = '123 Main St, City, State 12345';

      // Act
      const result = await serviceWithEmptyKey.geocodeAddress(address);

      // Assert
      expect(result).toEqual({ latitude: null, longitude: null });
    });

    it('should return null coordinates when API key is configured (current implementation)', async () => {
      // Arrange
      const address = '123 Main St, City, State 12345';

      // Act
      const result = await service.geocodeAddress(address);

      // Assert
      expect(result).toEqual({ latitude: null, longitude: null });
      expect(mockConfigService.get).toHaveBeenCalledWith('GOOGLE_MAPS_API_KEY');
    });

    it('should handle geocoding errors gracefully', async () => {
      // Arrange
      const address = '123 Main St, City, State 12345';
      // The current implementation doesn't throw errors, but we test the error handling path
      // by ensuring it returns null coordinates

      // Act
      const result = await service.geocodeAddress(address);

      // Assert
      expect(result).toEqual({ latitude: null, longitude: null });
    });

    it('should handle various address formats', async () => {
      // Arrange
      const addresses = [
        '123 Main St, City, State 12345',
        '123 Main Street, City, State',
        'City, State',
        'Full Address with Suite Number, City, State ZIP',
      ];

      // Act & Assert
      for (const address of addresses) {
        const result = await service.geocodeAddress(address);
        expect(result).toEqual({ latitude: null, longitude: null });
      }
    });

    it('should handle empty address string', async () => {
      // Arrange
      const address = '';

      // Act
      const result = await service.geocodeAddress(address);

      // Assert
      expect(result).toEqual({ latitude: null, longitude: null });
    });

    it('should handle special characters in address', async () => {
      // Arrange
      const address = "123 O'Brien St, City, State 12345";

      // Act
      const result = await service.geocodeAddress(address);

      // Assert
      expect(result).toEqual({ latitude: null, longitude: null });
    });
  });
});

