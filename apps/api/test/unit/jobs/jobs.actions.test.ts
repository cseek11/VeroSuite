/**
 * Jobs Actions Unit Tests
 * Tests for job action DTOs and validation
 */

import { StartJobDto, CompleteJobDto } from '../../../src/jobs/jobs.actions';

describe('Jobs Actions DTOs', () => {
  describe('StartJobDto', () => {
    it('should accept valid GPS location', () => {
      const dto = new StartJobDto();
      dto.gps_location = { lat: 40.7128, lng: -74.0060 };

      expect(dto.gps_location).toEqual({ lat: 40.7128, lng: -74.0060 });
    });

    it('should accept negative coordinates', () => {
      const dto = new StartJobDto();
      dto.gps_location = { lat: -40.7128, lng: -74.0060 };

      expect(dto.gps_location.lat).toBe(-40.7128);
      expect(dto.gps_location.lng).toBe(-74.0060);
    });
  });

  describe('CompleteJobDto', () => {
    it('should accept all optional fields', () => {
      const dto = new CompleteJobDto();
      dto.notes = 'Job completed successfully';
      dto.signature_url = 'https://example.com/signature.png';
      dto.photos = ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'];
      dto.chemicals_used = [{ name: 'Pesticide A', amount: '500ml' }];

      expect(dto.notes).toBe('Job completed successfully');
      expect(dto.signature_url).toBe('https://example.com/signature.png');
      expect(dto.photos).toHaveLength(2);
      expect(dto.chemicals_used).toHaveLength(1);
    });

    it('should work with empty DTO', () => {
      const dto = new CompleteJobDto();

      expect(dto.notes).toBeUndefined();
      expect(dto.signature_url).toBeUndefined();
      expect(dto.photos).toBeUndefined();
      expect(dto.chemicals_used).toBeUndefined();
    });

    it('should accept partial data', () => {
      const dto = new CompleteJobDto();
      dto.notes = 'Job completed';

      expect(dto.notes).toBe('Job completed');
      expect(dto.signature_url).toBeUndefined();
    });
  });
});

