import { OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
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
export declare class TestingDashboardService implements OnModuleInit {
    private prisma;
    private eventEmitter;
    private testMetrics;
    private securityMetrics;
    private performanceMetrics;
    private systemHealth;
    constructor(prisma: PrismaService, eventEmitter: EventEmitter2);
    onModuleInit(): void;
    private initializeSystemHealth;
    recordTestResult(metrics: TestMetrics): Promise<void>;
    getTestMetrics(filters?: {
        testSuite?: string;
        status?: string;
        startDate?: Date;
        endDate?: Date;
    }): Promise<TestMetrics[]>;
    getTestCoverage(): Promise<{
        overall: number;
        byModule: Record<string, number>;
        trends: number[];
    }>;
    recordSecurityVulnerability(metrics: SecurityMetrics): Promise<void>;
    getSecurityMetrics(): Promise<{
        totalVulnerabilities: number;
        bySeverity: Record<string, number>;
        byType: Record<string, number>;
        recentVulnerabilities: SecurityMetrics[];
    }>;
    recordPerformanceMetrics(metrics: PerformanceMetrics): Promise<void>;
    getPerformanceMetrics(): Promise<{
        averageResponseTime: number;
        averageThroughput: number;
        averageErrorRate: number;
        byEndpoint: Record<string, PerformanceMetrics[]>;
        trends: {
            responseTime: number[];
            throughput: number[];
            errorRate: number[];
        };
    }>;
    getSystemHealth(): Promise<SystemHealth>;
    private updateSystemHealth;
    private calculateSecurityScore;
    private calculatePerformanceScore;
    private calculateReliabilityScore;
    private getHealthStatus;
    private startRealTimeMonitoring;
    private handleTestResult;
    private handleSecurityVulnerability;
    private handlePerformanceMetrics;
    generateHourlyReport(): Promise<void>;
    generateDailyReport(): Promise<void>;
    private storeTestMetrics;
    private storeSecurityMetrics;
    private storePerformanceMetrics;
    private storeHourlyReport;
    private storeDailyReport;
}
