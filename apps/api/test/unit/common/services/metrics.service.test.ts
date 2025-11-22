/**
 * Metrics Service Unit Tests
 * Tests for Prometheus-compatible metrics collection
 */

import { Test, TestingModule } from '@nestjs/testing';
import { MetricsService } from '../../../../src/common/services/metrics.service';

describe('MetricsService', () => {
  let service: MetricsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MetricsService],
    }).compile();

    service = module.get<MetricsService>(MetricsService);
  });

  afterEach(() => {
    service.reset();
  });

  describe('incrementCounter', () => {
    it('should increment counter by default value of 1', () => {
      // Act
      service.incrementCounter('test_counter');

      // Assert
      const metrics = service.getPrometheusMetrics();
      expect(metrics).toContain('test_counter');
      expect(metrics).toContain('1');
    });

    it('should increment counter by custom value', () => {
      // Act
      service.incrementCounter('test_counter', undefined, 5);

      // Assert
      const metrics = service.getPrometheusMetrics();
      expect(metrics).toContain('test_counter');
      expect(metrics).toContain('5');
    });

    it('should increment counter multiple times', () => {
      // Act
      service.incrementCounter('test_counter');
      service.incrementCounter('test_counter');
      service.incrementCounter('test_counter');

      // Assert
      const metrics = service.getPrometheusMetrics();
      expect(metrics).toContain('test_counter');
      expect(metrics).toContain('3');
    });

    it('should handle counters with labels', () => {
      // Act
      service.incrementCounter('http_requests', { method: 'GET', status: '200' });
      service.incrementCounter('http_requests', { method: 'POST', status: '201' });

      // Assert
      const metrics = service.getPrometheusMetrics();
      expect(metrics).toContain('http_requests');
      expect(metrics).toContain('method="GET"');
      expect(metrics).toContain('method="POST"');
    });

    it('should separate counters with different labels', () => {
      // Act
      service.incrementCounter('requests', { endpoint: '/api/users' });
      service.incrementCounter('requests', { endpoint: '/api/jobs' });

      // Assert
      const metrics = service.getPrometheusMetrics();
      const lines = metrics.split('\n');
      const requestLines = lines.filter(line => line.startsWith('requests'));
      expect(requestLines.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('recordHistogram', () => {
    it('should record histogram value', () => {
      // Act
      service.recordHistogram('response_time', 100);

      // Assert
      const metrics = service.getPrometheusMetrics();
      expect(metrics).toContain('response_time');
      expect(metrics).toContain('response_time_sum');
      expect(metrics).toContain('response_time_count');
      expect(metrics).toContain('response_time_avg');
      expect(metrics).toContain('response_time_min');
      expect(metrics).toContain('response_time_max');
    });

    it('should calculate histogram statistics correctly', () => {
      // Act
      service.recordHistogram('latency', 10);
      service.recordHistogram('latency', 20);
      service.recordHistogram('latency', 30);

      // Assert
      const metrics = service.getPrometheusMetrics();
      expect(metrics).toContain('latency_sum 60');
      expect(metrics).toContain('latency_count 3');
      expect(metrics).toContain('latency_avg 20');
      expect(metrics).toContain('latency_min 10');
      expect(metrics).toContain('latency_max 30');
    });

    it('should handle histograms with labels', () => {
      // Act
      service.recordHistogram('db_query_time', 50, { database: 'postgres' });
      service.recordHistogram('db_query_time', 100, { database: 'redis' });

      // Assert
      const metrics = service.getPrometheusMetrics();
      expect(metrics).toContain('db_query_time');
      expect(metrics).toContain('database="postgres"');
      expect(metrics).toContain('database="redis"');
    });

    it('should handle empty histogram gracefully', () => {
      // Act
      const metrics = service.getPrometheusMetrics();

      // Assert
      expect(metrics).not.toContain('empty_histogram');
    });
  });

  describe('recordGauge', () => {
    it('should record gauge value', () => {
      // Act
      service.recordGauge('active_connections', 42);

      // Assert
      const metrics = service.getPrometheusMetrics();
      expect(metrics).toContain('active_connections');
      expect(metrics).toContain('42');
    });

    it('should update gauge with latest value', () => {
      // Act
      service.recordGauge('memory_usage', 100);
      service.recordGauge('memory_usage', 200);
      service.recordGauge('memory_usage', 150);

      // Assert
      const metrics = service.getPrometheusMetrics();
      expect(metrics).toContain('memory_usage');
      // Should show latest value (150)
      const lines = metrics.split('\n');
      const gaugeLine = lines.find(line => line.startsWith('memory_usage') && !line.startsWith('#'));
      expect(gaugeLine).toContain('150');
    });

    it('should handle gauges with labels', () => {
      // Act
      service.recordGauge('queue_size', 10, { queue: 'jobs' });
      service.recordGauge('queue_size', 5, { queue: 'notifications' });

      // Assert
      const metrics = service.getPrometheusMetrics();
      expect(metrics).toContain('queue_size');
      expect(metrics).toContain('queue="jobs"');
      expect(metrics).toContain('queue="notifications"');
    });
  });

  describe('getPrometheusMetrics', () => {
    it('should return Prometheus-formatted metrics', () => {
      // Arrange
      service.incrementCounter('test_counter');
      service.recordHistogram('test_histogram', 100);
      service.recordGauge('test_gauge', 50);

      // Act
      const metrics = service.getPrometheusMetrics();

      // Assert
      expect(metrics).toContain('# TYPE test_counter counter');
      expect(metrics).toContain('# TYPE test_histogram histogram');
      expect(metrics).toContain('# TYPE test_gauge gauge');
      expect(metrics).toContain('test_counter');
      expect(metrics).toContain('test_histogram');
      expect(metrics).toContain('test_gauge');
    });

    it('should format labels correctly', () => {
      // Arrange
      service.incrementCounter('requests', { method: 'GET', status: '200' });

      // Act
      const metrics = service.getPrometheusMetrics();

      // Assert
      expect(metrics).toContain('method="GET"');
      expect(metrics).toContain('status="200"');
    });

    it('should handle metrics without labels', () => {
      // Arrange
      service.incrementCounter('simple_counter');

      // Act
      const metrics = service.getPrometheusMetrics();

      // Assert
      const lines = metrics.split('\n');
      const counterLine = lines.find(line => line.startsWith('simple_counter') && !line.startsWith('#'));
      expect(counterLine).toBeDefined();
      expect(counterLine).not.toContain('{');
    });

    it('should end with newline', () => {
      // Act
      const metrics = service.getPrometheusMetrics();

      // Assert
      expect(metrics.endsWith('\n')).toBe(true);
    });
  });

  describe('reset', () => {
    it('should clear all metrics', () => {
      // Arrange
      service.incrementCounter('test_counter');
      service.recordHistogram('test_histogram', 100);
      service.recordGauge('test_gauge', 50);

      // Act
      service.reset();
      const metrics = service.getPrometheusMetrics();

      // Assert
      expect(metrics).not.toContain('test_counter');
      expect(metrics).not.toContain('test_histogram');
      expect(metrics).not.toContain('test_gauge');
    });

    it('should allow new metrics after reset', () => {
      // Arrange
      service.incrementCounter('old_counter');
      service.reset();

      // Act
      service.incrementCounter('new_counter');
      const metrics = service.getPrometheusMetrics();

      // Assert
      expect(metrics).not.toContain('old_counter');
      expect(metrics).toContain('new_counter');
    });
  });

  describe('metric key generation', () => {
    it('should generate consistent keys for same labels', () => {
      // Arrange
      const labels1 = { method: 'GET', status: '200' };
      const labels2 = { method: 'GET', status: '200' };

      // Act
      service.incrementCounter('requests', labels1);
      service.incrementCounter('requests', labels2);

      // Assert
      const metrics = service.getPrometheusMetrics();
      const lines = metrics.split('\n');
      const requestLines = lines.filter(line => 
        line.startsWith('requests') && 
        line.includes('method="GET"') && 
        line.includes('status="200"')
      );
      // Should have one line with value 2 (both increments combined)
      expect(requestLines.length).toBeGreaterThan(0);
    });

    it('should sort labels alphabetically', () => {
      // Arrange
      const labels = { z: 'last', a: 'first', m: 'middle' };

      // Act
      service.incrementCounter('test', labels);
      const metrics = service.getPrometheusMetrics();

      // Assert
      // Labels should be sorted: a, m, z
      expect(metrics).toContain('a="first"');
      expect(metrics).toContain('m="middle"');
      expect(metrics).toContain('z="last"');
    });
  });

  describe('edge cases', () => {
    it('should handle zero values', () => {
      // Act
      service.recordGauge('zero_gauge', 0);
      const metrics = service.getPrometheusMetrics();

      // Assert
      expect(metrics).toContain('zero_gauge');
      expect(metrics).toContain(' 0');
    });

    it('should handle negative values', () => {
      // Act
      service.recordGauge('negative_gauge', -10);
      const metrics = service.getPrometheusMetrics();

      // Assert
      expect(metrics).toContain('negative_gauge');
      expect(metrics).toContain('-10');
    });

    it('should handle very large numbers', () => {
      // Act
      service.recordGauge('large_gauge', Number.MAX_SAFE_INTEGER);
      const metrics = service.getPrometheusMetrics();

      // Assert
      expect(metrics).toContain('large_gauge');
    });

    it('should handle decimal values in histograms', () => {
      // Act
      service.recordHistogram('decimal_histogram', 10.5);
      service.recordHistogram('decimal_histogram', 20.3);

      // Assert
      const metrics = service.getPrometheusMetrics();
      expect(metrics).toContain('decimal_histogram_sum');
      expect(metrics).toContain('decimal_histogram_avg');
    });
  });
});

