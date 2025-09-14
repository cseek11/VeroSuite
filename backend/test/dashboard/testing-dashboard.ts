/**
 * Enterprise Testing Dashboard
 * Real-time testing command center for mission-critical CRM application
 */

import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../src/prisma/prisma.service';

export interface TestMetrics {
  id: string;
  testSuite: string;
  testName: string;
  status: 'passed' | 'failed' | 'running' | 'pending';
  duration: number;
  timestamp: Date;
  errorMessage?: string;
  performance?: {
    responseTime: number;
    memoryUsage: number;
    cpuUsage: number;
  };
  coverage?: {
    lines: number;
    functions: number;
    branches: number;
    statements: number;
  };
}

export interface SecurityMetrics {
  id: string;
  vulnerabilityType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'detected' | 'fixed' | 'ignored';
  description: string;
  timestamp: Date;
  remediation?: string;
}

export interface PerformanceMetrics {
  id: string;
  endpoint: string;
  responseTime: number;
  throughput: number;
  errorRate: number;
  timestamp: Date;
  loadLevel: 'light' | 'medium' | 'heavy' | 'stress';
}

export interface SystemHealth {
  overallScore: number;
  status: 'excellent' | 'good' | 'acceptable' | 'poor';
  testCoverage: number;
  securityScore: number;
  performanceScore: number;
  reliabilityScore: number;
  lastUpdated: Date;
  trends: {
    testCoverage: number[];
    securityScore: number[];
    performanceScore: number[];
    reliabilityScore: number[];
  };
}

@Injectable()
export class TestingDashboardService implements OnModuleInit {
  private testMetrics: Map<string, TestMetrics> = new Map();
  private securityMetrics: Map<string, SecurityMetrics> = new Map();
  private performanceMetrics: Map<string, PerformanceMetrics> = new Map();
  private systemHealth: SystemHealth;

  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {
    this.initializeSystemHealth();
  }

  onModuleInit() {
    this.startRealTimeMonitoring();
  }

  private initializeSystemHealth() {
    this.systemHealth = {
      overallScore: 100,
      status: 'excellent',
      testCoverage: 0,
      securityScore: 100,
      performanceScore: 100,
      reliabilityScore: 100,
      lastUpdated: new Date(),
      trends: {
        testCoverage: [],
        securityScore: [],
        performanceScore: [],
        reliabilityScore: [],
      },
    };
  }

  // Test Metrics Management
  async recordTestResult(metrics: TestMetrics): Promise<void> {
    this.testMetrics.set(metrics.id, metrics);
    
    // Emit event for real-time updates
    this.eventEmitter.emit('test.result.recorded', metrics);
    
    // Update system health
    await this.updateSystemHealth();
    
    // Store in database for historical analysis
    await this.storeTestMetrics(metrics);
  }

  async getTestMetrics(filters?: {
    testSuite?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<TestMetrics[]> {
    let metrics = Array.from(this.testMetrics.values());
    
    if (filters) {
      if (filters.testSuite) {
        metrics = metrics.filter(m => m.testSuite === filters.testSuite);
      }
      if (filters.status) {
        metrics = metrics.filter(m => m.status === filters.status);
      }
      if (filters.startDate) {
        metrics = metrics.filter(m => m.timestamp >= filters.startDate);
      }
      if (filters.endDate) {
        metrics = metrics.filter(m => m.timestamp <= filters.endDate);
      }
    }
    
    return metrics.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getTestCoverage(): Promise<{
    overall: number;
    byModule: Record<string, number>;
    trends: number[];
  }> {
    const metrics = Array.from(this.testMetrics.values());
    const recentMetrics = metrics.filter(m => 
      m.timestamp >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );
    
    const overall = recentMetrics.length > 0 
      ? recentMetrics.reduce((sum, m) => sum + (m.coverage?.lines || 0), 0) / recentMetrics.length
      : 0;
    
    const byModule: Record<string, number> = {};
    recentMetrics.forEach(m => {
      if (!byModule[m.testSuite]) {
        byModule[m.testSuite] = 0;
      }
      byModule[m.testSuite] += m.coverage?.lines || 0;
    });
    
    // Calculate trends (last 7 days)
    const trends: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dayMetrics = metrics.filter(m => 
        m.timestamp.toDateString() === date.toDateString()
      );
      const dayCoverage = dayMetrics.length > 0
        ? dayMetrics.reduce((sum, m) => sum + (m.coverage?.lines || 0), 0) / dayMetrics.length
        : 0;
      trends.push(dayCoverage);
    }
    
    return { overall, byModule, trends };
  }

  // Security Metrics Management
  async recordSecurityVulnerability(metrics: SecurityMetrics): Promise<void> {
    this.securityMetrics.set(metrics.id, metrics);
    
    // Emit event for real-time updates
    this.eventEmitter.emit('security.vulnerability.detected', metrics);
    
    // Update system health
    await this.updateSystemHealth();
    
    // Store in database
    await this.storeSecurityMetrics(metrics);
  }

  async getSecurityMetrics(): Promise<{
    totalVulnerabilities: number;
    bySeverity: Record<string, number>;
    byType: Record<string, number>;
    recentVulnerabilities: SecurityMetrics[];
  }> {
    const metrics = Array.from(this.securityMetrics.values());
    
    const bySeverity: Record<string, number> = {};
    const byType: Record<string, number> = {};
    
    metrics.forEach(m => {
      bySeverity[m.severity] = (bySeverity[m.severity] || 0) + 1;
      byType[m.vulnerabilityType] = (byType[m.vulnerabilityType] || 0) + 1;
    });
    
    const recentVulnerabilities = metrics
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);
    
    return {
      totalVulnerabilities: metrics.length,
      bySeverity,
      byType,
      recentVulnerabilities,
    };
  }

  // Performance Metrics Management
  async recordPerformanceMetrics(metrics: PerformanceMetrics): Promise<void> {
    this.performanceMetrics.set(metrics.id, metrics);
    
    // Emit event for real-time updates
    this.eventEmitter.emit('performance.metrics.recorded', metrics);
    
    // Update system health
    await this.updateSystemHealth();
    
    // Store in database
    await this.storePerformanceMetrics(metrics);
  }

  async getPerformanceMetrics(): Promise<{
    averageResponseTime: number;
    averageThroughput: number;
    averageErrorRate: number;
    byEndpoint: Record<string, PerformanceMetrics[]>;
    trends: {
      responseTime: number[];
      throughput: number[];
      errorRate: number[];
    };
  }> {
    const metrics = Array.from(this.performanceMetrics.values());
    const recentMetrics = metrics.filter(m => 
      m.timestamp >= new Date(Date.now() - 24 * 60 * 60 * 1000)
    );
    
    const averageResponseTime = recentMetrics.length > 0
      ? recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) / recentMetrics.length
      : 0;
    
    const averageThroughput = recentMetrics.length > 0
      ? recentMetrics.reduce((sum, m) => sum + m.throughput, 0) / recentMetrics.length
      : 0;
    
    const averageErrorRate = recentMetrics.length > 0
      ? recentMetrics.reduce((sum, m) => sum + m.errorRate, 0) / recentMetrics.length
      : 0;
    
    const byEndpoint: Record<string, PerformanceMetrics[]> = {};
    recentMetrics.forEach(m => {
      if (!byEndpoint[m.endpoint]) {
        byEndpoint[m.endpoint] = [];
      }
      byEndpoint[m.endpoint].push(m);
    });
    
    // Calculate trends (last 24 hours)
    const trends = {
      responseTime: [] as number[],
      throughput: [] as number[],
      errorRate: [] as number[],
    };
    
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(Date.now() - i * 60 * 60 * 1000);
      const hourMetrics = metrics.filter(m => 
        m.timestamp.getHours() === hour.getHours() &&
        m.timestamp.getDate() === hour.getDate()
      );
      
      trends.responseTime.push(
        hourMetrics.length > 0
          ? hourMetrics.reduce((sum, m) => sum + m.responseTime, 0) / hourMetrics.length
          : 0
      );
      trends.throughput.push(
        hourMetrics.length > 0
          ? hourMetrics.reduce((sum, m) => sum + m.throughput, 0) / hourMetrics.length
          : 0
      );
      trends.errorRate.push(
        hourMetrics.length > 0
          ? hourMetrics.reduce((sum, m) => sum + m.errorRate, 0) / hourMetrics.length
          : 0
      );
    }
    
    return {
      averageResponseTime,
      averageThroughput,
      averageErrorRate,
      byEndpoint,
      trends,
    };
  }

  // System Health Management
  async getSystemHealth(): Promise<SystemHealth> {
    return this.systemHealth;
  }

  private async updateSystemHealth(): Promise<void> {
    const testCoverage = await this.getTestCoverage();
    const securityMetrics = await this.getSecurityMetrics();
    const performanceMetrics = await this.getPerformanceMetrics();
    
    // Calculate scores
    const testCoverageScore = testCoverage.overall;
    const securityScore = this.calculateSecurityScore(securityMetrics);
    const performanceScore = this.calculatePerformanceScore(performanceMetrics);
    const reliabilityScore = this.calculateReliabilityScore();
    
    // Update system health
    this.systemHealth.testCoverage = testCoverageScore;
    this.systemHealth.securityScore = securityScore;
    this.systemHealth.performanceScore = performanceScore;
    this.systemHealth.reliabilityScore = reliabilityScore;
    this.systemHealth.overallScore = (
      testCoverageScore + securityScore + performanceScore + reliabilityScore
    ) / 4;
    this.systemHealth.status = this.getHealthStatus(this.systemHealth.overallScore);
    this.systemHealth.lastUpdated = new Date();
    
    // Update trends
    this.systemHealth.trends.testCoverage.push(testCoverageScore);
    this.systemHealth.trends.securityScore.push(securityScore);
    this.systemHealth.trends.performanceScore.push(performanceScore);
    this.systemHealth.trends.reliabilityScore.push(reliabilityScore);
    
    // Keep only last 30 data points
    Object.keys(this.systemHealth.trends).forEach(key => {
      if (this.systemHealth.trends[key].length > 30) {
        this.systemHealth.trends[key] = this.systemHealth.trends[key].slice(-30);
      }
    });
    
    // Emit event
    this.eventEmitter.emit('system.health.updated', this.systemHealth);
  }

  private calculateSecurityScore(securityMetrics: any): number {
    const criticalVulns = securityMetrics.bySeverity.critical || 0;
    const highVulns = securityMetrics.bySeverity.high || 0;
    const mediumVulns = securityMetrics.bySeverity.medium || 0;
    const lowVulns = securityMetrics.bySeverity.low || 0;
    
    // Penalize based on vulnerability severity
    let score = 100;
    score -= criticalVulns * 20;
    score -= highVulns * 10;
    score -= mediumVulns * 5;
    score -= lowVulns * 1;
    
    return Math.max(0, score);
  }

  private calculatePerformanceScore(performanceMetrics: any): number {
    const responseTime = performanceMetrics.averageResponseTime;
    const errorRate = performanceMetrics.averageErrorRate;
    
    let score = 100;
    
    // Penalize slow response times
    if (responseTime > 1000) score -= 30;
    else if (responseTime > 500) score -= 20;
    else if (responseTime > 200) score -= 10;
    
    // Penalize high error rates
    if (errorRate > 10) score -= 40;
    else if (errorRate > 5) score -= 20;
    else if (errorRate > 1) score -= 10;
    
    return Math.max(0, score);
  }

  private calculateReliabilityScore(): number {
    const recentTests = Array.from(this.testMetrics.values()).filter(m => 
      m.timestamp >= new Date(Date.now() - 24 * 60 * 60 * 1000)
    );
    
    if (recentTests.length === 0) return 100;
    
    const passedTests = recentTests.filter(m => m.status === 'passed').length;
    const reliability = (passedTests / recentTests.length) * 100;
    
    return reliability;
  }

  private getHealthStatus(score: number): 'excellent' | 'good' | 'acceptable' | 'poor' {
    if (score >= 90) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'acceptable';
    return 'poor';
  }

  // Real-time Monitoring
  private startRealTimeMonitoring(): void {
    // Monitor test execution
    this.eventEmitter.on('test.result.recorded', (metrics: TestMetrics) => {
      this.handleTestResult(metrics);
    });
    
    // Monitor security vulnerabilities
    this.eventEmitter.on('security.vulnerability.detected', (metrics: SecurityMetrics) => {
      this.handleSecurityVulnerability(metrics);
    });
    
    // Monitor performance metrics
    this.eventEmitter.on('performance.metrics.recorded', (metrics: PerformanceMetrics) => {
      this.handlePerformanceMetrics(metrics);
    });
  }

  private handleTestResult(metrics: TestMetrics): void {
    // Log test result
    console.log(`Test ${metrics.testName} ${metrics.status} in ${metrics.duration}ms`);
    
    // Alert on test failures
    if (metrics.status === 'failed') {
      this.eventEmitter.emit('alert.test.failure', metrics);
    }
    
    // Alert on performance issues
    if (metrics.performance && metrics.performance.responseTime > 1000) {
      this.eventEmitter.emit('alert.performance.issue', metrics);
    }
  }

  private handleSecurityVulnerability(metrics: SecurityMetrics): void {
    // Log security vulnerability
    console.log(`Security vulnerability detected: ${metrics.vulnerabilityType} (${metrics.severity})`);
    
    // Alert on critical vulnerabilities
    if (metrics.severity === 'critical' || metrics.severity === 'high') {
      this.eventEmitter.emit('alert.security.vulnerability', metrics);
    }
  }

  private handlePerformanceMetrics(metrics: PerformanceMetrics): void {
    // Log performance metrics
    console.log(`Performance: ${metrics.endpoint} - ${metrics.responseTime}ms, ${metrics.throughput} req/s`);
    
    // Alert on performance issues
    if (metrics.responseTime > 2000 || metrics.errorRate > 5) {
      this.eventEmitter.emit('alert.performance.issue', metrics);
    }
  }

  // Scheduled Tasks
  @Cron(CronExpression.EVERY_HOUR)
  async generateHourlyReport(): Promise<void> {
    const systemHealth = await this.getSystemHealth();
    const testCoverage = await this.getTestCoverage();
    const securityMetrics = await this.getSecurityMetrics();
    const performanceMetrics = await this.getPerformanceMetrics();
    
    const report = {
      timestamp: new Date(),
      systemHealth,
      testCoverage,
      securityMetrics,
      performanceMetrics,
    };
    
    // Store report
    await this.storeHourlyReport(report);
    
    // Emit event
    this.eventEmitter.emit('report.hourly.generated', report);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async generateDailyReport(): Promise<void> {
    const systemHealth = await this.getSystemHealth();
    const testCoverage = await this.getTestCoverage();
    const securityMetrics = await this.getSecurityMetrics();
    const performanceMetrics = await this.getPerformanceMetrics();
    
    const report = {
      timestamp: new Date(),
      systemHealth,
      testCoverage,
      securityMetrics,
      performanceMetrics,
    };
    
    // Store report
    await this.storeDailyReport(report);
    
    // Emit event
    this.eventEmitter.emit('report.daily.generated', report);
  }

  // Database Storage
  private async storeTestMetrics(metrics: TestMetrics): Promise<void> {
    // Store in database
    await this.prisma.testMetrics.create({
      data: {
        id: metrics.id,
        testSuite: metrics.testSuite,
        testName: metrics.testName,
        status: metrics.status,
        duration: metrics.duration,
        timestamp: metrics.timestamp,
        errorMessage: metrics.errorMessage,
        performance: metrics.performance,
        coverage: metrics.coverage,
      },
    });
  }

  private async storeSecurityMetrics(metrics: SecurityMetrics): Promise<void> {
    await this.prisma.securityMetrics.create({
      data: {
        id: metrics.id,
        vulnerabilityType: metrics.vulnerabilityType,
        severity: metrics.severity,
        status: metrics.status,
        description: metrics.description,
        timestamp: metrics.timestamp,
        remediation: metrics.remediation,
      },
    });
  }

  private async storePerformanceMetrics(metrics: PerformanceMetrics): Promise<void> {
    await this.prisma.performanceMetrics.create({
      data: {
        id: metrics.id,
        endpoint: metrics.endpoint,
        responseTime: metrics.responseTime,
        throughput: metrics.throughput,
        errorRate: metrics.errorRate,
        timestamp: metrics.timestamp,
        loadLevel: metrics.loadLevel,
      },
    });
  }

  private async storeHourlyReport(report: any): Promise<void> {
    await this.prisma.hourlyReport.create({
      data: {
        timestamp: report.timestamp,
        systemHealth: report.systemHealth,
        testCoverage: report.testCoverage,
        securityMetrics: report.securityMetrics,
        performanceMetrics: report.performanceMetrics,
      },
    });
  }

  private async storeDailyReport(report: any): Promise<void> {
    await this.prisma.dailyReport.create({
      data: {
        timestamp: report.timestamp,
        systemHealth: report.systemHealth,
        testCoverage: report.testCoverage,
        securityMetrics: report.securityMetrics,
        performanceMetrics: report.performanceMetrics,
      },
    });
  }
}






