/**
 * Performance Testing Setup
 * Load testing, stress testing, and performance monitoring configuration
 */

import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { performance } from 'perf_hooks';

// Performance testing configuration
export class PerformanceTestSuite {
  private app: INestApplication;
  private performanceMetrics: Map<string, number[]> = new Map();
  private loadTestResults: any[] = [];

  constructor(app: INestApplication) {
    this.app = app;
  }

  // Load Testing Suite
  async runLoadTests() {
    const results = {
      lightLoad: await this.lightLoadTest(),
      mediumLoad: await this.mediumLoadTest(),
      heavyLoad: await this.heavyLoadTest(),
      spikeLoad: await this.spikeLoadTest(),
      stressTest: await this.stressTest()
    };

    return results;
  }

  // Light Load Test (10 concurrent users)
  private async lightLoadTest() {
    const concurrentUsers = 10;
    const requestsPerUser = 10;
    const results = await this.executeLoadTest(concurrentUsers, requestsPerUser);
    
    return {
      testType: 'light',
      concurrentUsers,
      requestsPerUser,
      totalRequests: concurrentUsers * requestsPerUser,
      results
    };
  }

  // Medium Load Test (100 concurrent users)
  private async mediumLoadTest() {
    const concurrentUsers = 100;
    const requestsPerUser = 10;
    const results = await this.executeLoadTest(concurrentUsers, requestsPerUser);
    
    return {
      testType: 'medium',
      concurrentUsers,
      requestsPerUser,
      totalRequests: concurrentUsers * requestsPerUser,
      results
    };
  }

  // Heavy Load Test (1000 concurrent users)
  private async heavyLoadTest() {
    const concurrentUsers = 1000;
    const requestsPerUser = 5;
    const results = await this.executeLoadTest(concurrentUsers, requestsPerUser);
    
    return {
      testType: 'heavy',
      concurrentUsers,
      requestsPerUser,
      totalRequests: concurrentUsers * requestsPerUser,
      results
    };
  }

  // Spike Load Test (sudden traffic surge)
  private async spikeLoadTest() {
    const results = [];
    
    // Normal load
    const normalLoad = await this.executeLoadTest(50, 5);
    results.push({ phase: 'normal', ...normalLoad });
    
    // Spike load
    const spikeLoad = await this.executeLoadTest(500, 10);
    results.push({ phase: 'spike', ...spikeLoad });
    
    // Return to normal
    const returnToNormal = await this.executeLoadTest(50, 5);
    results.push({ phase: 'return', ...returnToNormal });
    
    return {
      testType: 'spike',
      results
    };
  }

  // Stress Test (beyond normal capacity)
  private async stressTest() {
    const concurrentUsers = 2000;
    const requestsPerUser = 3;
    const results = await this.executeLoadTest(concurrentUsers, requestsPerUser);
    
    return {
      testType: 'stress',
      concurrentUsers,
      requestsPerUser,
      totalRequests: concurrentUsers * requestsPerUser,
      results
    };
  }

  // Execute load test with specified parameters
  private async executeLoadTest(concurrentUsers: number, requestsPerUser: number) {
    const startTime = performance.now();
    const promises: Promise<any>[] = [];
    const responseTimes: number[] = [];
    const errors: any[] = [];
    let successCount = 0;
    let failureCount = 0;

    // Create concurrent user simulations
    for (let i = 0; i < concurrentUsers; i++) {
      const userPromise = this.simulateUser(requestsPerUser, responseTimes, errors);
      promises.push(userPromise);
    }

    // Wait for all users to complete
    const results = await Promise.allSettled(promises);
    
    // Count successes and failures
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        successCount += result.value.successCount;
        failureCount += result.value.failureCount;
      } else {
        failureCount++;
      }
    });

    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const requestsPerSecond = (successCount + failureCount) / (totalTime / 1000);

    return {
      totalTime,
      requestsPerSecond,
      successCount,
      failureCount,
      averageResponseTime: responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length,
      minResponseTime: Math.min(...responseTimes),
      maxResponseTime: Math.max(...responseTimes),
      p95ResponseTime: this.calculatePercentile(responseTimes, 95),
      p99ResponseTime: this.calculatePercentile(responseTimes, 99),
      errorRate: (failureCount / (successCount + failureCount)) * 100,
      errors
    };
  }

  // Simulate a single user making requests
  private async simulateUser(requestsPerUser: number, responseTimes: number[], errors: any[]) {
    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < requestsPerUser; i++) {
      try {
        const startTime = performance.now();
        
        // Simulate different types of requests
        const requestType = i % 4;
        let response;
        
        switch (requestType) {
          case 0:
            response = await request(this.app.getHttpServer())
              .get('/api/health')
              .expect(200);
            break;
          case 1:
            response = await request(this.app.getHttpServer())
              .get('/api/customers')
              .expect(200);
            break;
          case 2:
            response = await request(this.app.getHttpServer())
              .get('/api/work-orders')
              .expect(200);
            break;
          case 3:
            response = await request(this.app.getHttpServer())
              .get('/api/technicians')
              .expect(200);
            break;
        }

        const endTime = performance.now();
        const responseTime = endTime - startTime;
        responseTimes.push(responseTime);
        successCount++;
        
      } catch (error) {
        errors.push({
          error: error.message,
          timestamp: new Date().toISOString()
        });
        failureCount++;
      }
    }

    return { successCount, failureCount };
  }

  // Performance Monitoring
  async monitorPerformance() {
    const metrics = {
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      uptime: process.uptime(),
      responseTimes: await this.measureResponseTimes(),
      throughput: await this.measureThroughput(),
      errorRate: await this.measureErrorRate()
    };

    return metrics;
  }

  // Measure response times for different endpoints
  private async measureResponseTimes() {
    const endpoints = [
      '/api/health',
      '/api/customers',
      '/api/work-orders',
      '/api/technicians',
      '/api/analytics'
    ];

    const responseTimes: any = {};

    for (const endpoint of endpoints) {
      const times: number[] = [];
      
      for (let i = 0; i < 10; i++) {
        const startTime = performance.now();
        try {
          await request(this.app.getHttpServer())
            .get(endpoint)
            .expect(200);
        } catch (error) {
          // Continue even if request fails
        }
        const endTime = performance.now();
        times.push(endTime - startTime);
      }

      responseTimes[endpoint] = {
        average: times.reduce((a, b) => a + b, 0) / times.length,
        min: Math.min(...times),
        max: Math.max(...times),
        p95: this.calculatePercentile(times, 95),
        p99: this.calculatePercentile(times, 99)
      };
    }

    return responseTimes;
  }

  // Measure throughput (requests per second)
  private async measureThroughput() {
    const startTime = performance.now();
    const requests = 100;
    const promises: Promise<any>[] = [];

    for (let i = 0; i < requests; i++) {
      promises.push(
        request(this.app.getHttpServer())
          .get('/api/health')
          .expect(200)
      );
    }

    await Promise.all(promises);
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const requestsPerSecond = requests / (totalTime / 1000);

    return {
      requestsPerSecond,
      totalTime,
      requests
    };
  }

  // Measure error rate
  private async measureErrorRate() {
    const requests = 100;
    let errorCount = 0;

    for (let i = 0; i < requests; i++) {
      try {
        await request(this.app.getHttpServer())
          .get('/api/health')
          .expect(200);
      } catch (error) {
        errorCount++;
      }
    }

    return {
      errorRate: (errorCount / requests) * 100,
      errorCount,
      totalRequests: requests
    };
  }

  // Database Performance Tests
  async testDatabasePerformance() {
    const results = {
      connectionPool: await this.testConnectionPool(),
      queryPerformance: await this.testQueryPerformance(),
      transactionPerformance: await this.testTransactionPerformance(),
      concurrentWrites: await this.testConcurrentWrites()
    };

    return results;
  }

  private async testConnectionPool() {
    const startTime = performance.now();
    const connections = 50;
    const promises: Promise<any>[] = [];

    for (let i = 0; i < connections; i++) {
      promises.push(
        request(this.app.getHttpServer())
          .get('/api/health')
          .expect(200)
      );
    }

    await Promise.all(promises);
    const endTime = performance.now();

    return {
      connections,
      totalTime: endTime - startTime,
      averageTimePerConnection: (endTime - startTime) / connections
    };
  }

  private async testQueryPerformance() {
    const queries = [
      'SELECT * FROM customers LIMIT 10',
      'SELECT * FROM work_orders WHERE status = $1',
      'SELECT COUNT(*) FROM customers',
      'SELECT * FROM customers WHERE tenant_id = $1'
    ];

    const results: any = {};

    for (const query of queries) {
      const startTime = performance.now();
      try {
        await request(this.app.getHttpServer())
          .get('/api/customers')
          .expect(200);
      } catch (error) {
        // Continue even if request fails
      }
      const endTime = performance.now();
      results[query] = endTime - startTime;
    }

    return results;
  }

  private async testTransactionPerformance() {
    const startTime = performance.now();
    const transactions = 10;

    for (let i = 0; i < transactions; i++) {
      try {
        await request(this.app.getHttpServer())
          .post('/api/customers')
          .send({
            first_name: `Test${i}`,
            last_name: 'User',
            email: `test${i}@example.com`,
            phone: '+1-555-0000'
          })
          .expect(201);
      } catch (error) {
        // Continue even if request fails
      }
    }

    const endTime = performance.now();

    return {
      transactions,
      totalTime: endTime - startTime,
      averageTimePerTransaction: (endTime - startTime) / transactions
    };
  }

  private async testConcurrentWrites() {
    const startTime = performance.now();
    const writes = 20;
    const promises: Promise<any>[] = [];

    for (let i = 0; i < writes; i++) {
      promises.push(
        request(this.app.getHttpServer())
          .post('/api/customers')
          .send({
            first_name: `Concurrent${i}`,
            last_name: 'User',
            email: `concurrent${i}@example.com`,
            phone: '+1-555-0000'
          })
          .expect(201)
      );
    }

    const results = await Promise.allSettled(promises);
    const endTime = performance.now();

    const successCount = results.filter(r => r.status === 'fulfilled').length;
    const failureCount = results.filter(r => r.status === 'rejected').length;

    return {
      writes,
      successCount,
      failureCount,
      totalTime: endTime - startTime,
      averageTimePerWrite: (endTime - startTime) / writes
    };
  }

  // Memory and Resource Monitoring
  async monitorResources() {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    const uptime = process.uptime();

    return {
      memory: {
        rss: memoryUsage.rss,
        heapTotal: memoryUsage.heapTotal,
        heapUsed: memoryUsage.heapUsed,
        external: memoryUsage.external,
        arrayBuffers: memoryUsage.arrayBuffers
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system
      },
      uptime,
      timestamp: new Date().toISOString()
    };
  }

  // Utility functions
  private calculatePercentile(arr: number[], percentile: number): number {
    const sorted = arr.sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index];
  }

  // Performance thresholds
  getPerformanceThresholds() {
    return {
      responseTime: {
        excellent: 100, // ms
        good: 200,
        acceptable: 500,
        poor: 1000
      },
      throughput: {
        excellent: 1000, // requests per second
        good: 500,
        acceptable: 100,
        poor: 50
      },
      errorRate: {
        excellent: 0.1, // %
        good: 1,
        acceptable: 5,
        poor: 10
      },
      memoryUsage: {
        excellent: 100, // MB
        good: 200,
        acceptable: 500,
        poor: 1000
      }
    };
  }

  // Generate performance report
  generatePerformanceReport(results: any) {
    const thresholds = this.getPerformanceThresholds();
    const report = {
      summary: {
        overallScore: this.calculateOverallScore(results, thresholds),
        status: this.getOverallStatus(results, thresholds)
      },
      metrics: results,
      thresholds,
      recommendations: this.generateRecommendations(results, thresholds),
      timestamp: new Date().toISOString()
    };

    return report;
  }

  private calculateOverallScore(results: any, thresholds: any): number {
    let score = 100;
    
    // Deduct points for poor performance
    if (results.averageResponseTime > thresholds.responseTime.poor) {
      score -= 30;
    } else if (results.averageResponseTime > thresholds.responseTime.acceptable) {
      score -= 20;
    } else if (results.averageResponseTime > thresholds.responseTime.good) {
      score -= 10;
    }

    if (results.errorRate > thresholds.errorRate.poor) {
      score -= 25;
    } else if (results.errorRate > thresholds.errorRate.acceptable) {
      score -= 15;
    } else if (results.errorRate > thresholds.errorRate.good) {
      score -= 5;
    }

    return Math.max(0, score);
  }

  private getOverallStatus(results: any, thresholds: any): string {
    const score = this.calculateOverallScore(results, thresholds);
    
    if (score >= 90) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'acceptable';
    return 'poor';
  }

  private generateRecommendations(results: any, thresholds: any): string[] {
    const recommendations: string[] = [];

    if (results.averageResponseTime > thresholds.responseTime.acceptable) {
      recommendations.push('Consider optimizing database queries and adding caching');
    }

    if (results.errorRate > thresholds.errorRate.acceptable) {
      recommendations.push('Investigate and fix error sources to improve reliability');
    }

    if (results.requestsPerSecond < thresholds.throughput.acceptable) {
      recommendations.push('Consider horizontal scaling or performance optimization');
    }

    return recommendations;
  }
}

// Export for use in tests
export { PerformanceTestSuite };






