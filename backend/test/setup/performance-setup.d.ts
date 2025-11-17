import { INestApplication } from '@nestjs/common';
export declare class PerformanceTestSuite {
    private app;
    private performanceMetrics;
    private loadTestResults;
    constructor(app: INestApplication);
    runLoadTests(): Promise<{
        lightLoad: {
            testType: string;
            concurrentUsers: number;
            requestsPerUser: number;
            totalRequests: number;
            results: {
                totalTime: number;
                requestsPerSecond: number;
                successCount: number;
                failureCount: number;
                averageResponseTime: number;
                minResponseTime: number;
                maxResponseTime: number;
                p95ResponseTime: number;
                p99ResponseTime: number;
                errorRate: number;
                errors: any[];
            };
        };
        mediumLoad: {
            testType: string;
            concurrentUsers: number;
            requestsPerUser: number;
            totalRequests: number;
            results: {
                totalTime: number;
                requestsPerSecond: number;
                successCount: number;
                failureCount: number;
                averageResponseTime: number;
                minResponseTime: number;
                maxResponseTime: number;
                p95ResponseTime: number;
                p99ResponseTime: number;
                errorRate: number;
                errors: any[];
            };
        };
        heavyLoad: {
            testType: string;
            concurrentUsers: number;
            requestsPerUser: number;
            totalRequests: number;
            results: {
                totalTime: number;
                requestsPerSecond: number;
                successCount: number;
                failureCount: number;
                averageResponseTime: number;
                minResponseTime: number;
                maxResponseTime: number;
                p95ResponseTime: number;
                p99ResponseTime: number;
                errorRate: number;
                errors: any[];
            };
        };
        spikeLoad: {
            testType: string;
            results: {
                totalTime: number;
                requestsPerSecond: number;
                successCount: number;
                failureCount: number;
                averageResponseTime: number;
                minResponseTime: number;
                maxResponseTime: number;
                p95ResponseTime: number;
                p99ResponseTime: number;
                errorRate: number;
                errors: any[];
                phase: string;
            }[];
        };
        stressTest: {
            testType: string;
            concurrentUsers: number;
            requestsPerUser: number;
            totalRequests: number;
            results: {
                totalTime: number;
                requestsPerSecond: number;
                successCount: number;
                failureCount: number;
                averageResponseTime: number;
                minResponseTime: number;
                maxResponseTime: number;
                p95ResponseTime: number;
                p99ResponseTime: number;
                errorRate: number;
                errors: any[];
            };
        };
    }>;
    private lightLoadTest;
    private mediumLoadTest;
    private heavyLoadTest;
    private spikeLoadTest;
    private stressTest;
    private executeLoadTest;
    private simulateUser;
    monitorPerformance(): Promise<{
        memoryUsage: NodeJS.MemoryUsage;
        cpuUsage: NodeJS.CpuUsage;
        uptime: number;
        responseTimes: any;
        throughput: {
            requestsPerSecond: number;
            totalTime: number;
            requests: number;
        };
        errorRate: {
            errorRate: number;
            errorCount: number;
            totalRequests: number;
        };
    }>;
    private measureResponseTimes;
    private measureThroughput;
    private measureErrorRate;
    testDatabasePerformance(): Promise<{
        connectionPool: {
            connections: number;
            totalTime: number;
            averageTimePerConnection: number;
        };
        queryPerformance: any;
        transactionPerformance: {
            transactions: number;
            totalTime: number;
            averageTimePerTransaction: number;
        };
        concurrentWrites: {
            writes: number;
            successCount: number;
            failureCount: number;
            totalTime: number;
            averageTimePerWrite: number;
        };
    }>;
    private testConnectionPool;
    private testQueryPerformance;
    private testTransactionPerformance;
    private testConcurrentWrites;
    monitorResources(): Promise<{
        memory: {
            rss: number;
            heapTotal: number;
            heapUsed: number;
            external: number;
            arrayBuffers: number;
        };
        cpu: {
            user: number;
            system: number;
        };
        uptime: number;
        timestamp: string;
    }>;
    private calculatePercentile;
    getPerformanceThresholds(): {
        responseTime: {
            excellent: number;
            good: number;
            acceptable: number;
            poor: number;
        };
        throughput: {
            excellent: number;
            good: number;
            acceptable: number;
            poor: number;
        };
        errorRate: {
            excellent: number;
            good: number;
            acceptable: number;
            poor: number;
        };
        memoryUsage: {
            excellent: number;
            good: number;
            acceptable: number;
            poor: number;
        };
    };
    generatePerformanceReport(results: any): {
        summary: {
            overallScore: number;
            status: string;
        };
        metrics: any;
        thresholds: {
            responseTime: {
                excellent: number;
                good: number;
                acceptable: number;
                poor: number;
            };
            throughput: {
                excellent: number;
                good: number;
                acceptable: number;
                poor: number;
            };
            errorRate: {
                excellent: number;
                good: number;
                acceptable: number;
                poor: number;
            };
            memoryUsage: {
                excellent: number;
                good: number;
                acceptable: number;
                poor: number;
            };
        };
        recommendations: string[];
        timestamp: string;
    };
    private calculateOverallScore;
    private getOverallStatus;
    private generateRecommendations;
}
export { PerformanceTestSuite };
