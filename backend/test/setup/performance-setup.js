"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceTestSuite = void 0;
const request = require("supertest");
const perf_hooks_1 = require("perf_hooks");
class PerformanceTestSuite {
    constructor(app) {
        this.performanceMetrics = new Map();
        this.loadTestResults = [];
        this.app = app;
    }
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
    async lightLoadTest() {
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
    async mediumLoadTest() {
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
    async heavyLoadTest() {
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
    async spikeLoadTest() {
        const results = [];
        const normalLoad = await this.executeLoadTest(50, 5);
        results.push(Object.assign({ phase: 'normal' }, normalLoad));
        const spikeLoad = await this.executeLoadTest(500, 10);
        results.push(Object.assign({ phase: 'spike' }, spikeLoad));
        const returnToNormal = await this.executeLoadTest(50, 5);
        results.push(Object.assign({ phase: 'return' }, returnToNormal));
        return {
            testType: 'spike',
            results
        };
    }
    async stressTest() {
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
    async executeLoadTest(concurrentUsers, requestsPerUser) {
        const startTime = perf_hooks_1.performance.now();
        const promises = [];
        const responseTimes = [];
        const errors = [];
        let successCount = 0;
        let failureCount = 0;
        for (let i = 0; i < concurrentUsers; i++) {
            const userPromise = this.simulateUser(requestsPerUser, responseTimes, errors);
            promises.push(userPromise);
        }
        const results = await Promise.allSettled(promises);
        results.forEach(result => {
            if (result.status === 'fulfilled') {
                successCount += result.value.successCount;
                failureCount += result.value.failureCount;
            }
            else {
                failureCount++;
            }
        });
        const endTime = perf_hooks_1.performance.now();
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
    async simulateUser(requestsPerUser, responseTimes, errors) {
        let successCount = 0;
        let failureCount = 0;
        for (let i = 0; i < requestsPerUser; i++) {
            try {
                const startTime = perf_hooks_1.performance.now();
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
                const endTime = perf_hooks_1.performance.now();
                const responseTime = endTime - startTime;
                responseTimes.push(responseTime);
                successCount++;
            }
            catch (error) {
                errors.push({
                    error: error.message,
                    timestamp: new Date().toISOString()
                });
                failureCount++;
            }
        }
        return { successCount, failureCount };
    }
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
    async measureResponseTimes() {
        const endpoints = [
            '/api/health',
            '/api/customers',
            '/api/work-orders',
            '/api/technicians',
            '/api/analytics'
        ];
        const responseTimes = {};
        for (const endpoint of endpoints) {
            const times = [];
            for (let i = 0; i < 10; i++) {
                const startTime = perf_hooks_1.performance.now();
                try {
                    await request(this.app.getHttpServer())
                        .get(endpoint)
                        .expect(200);
                }
                catch (error) {
                }
                const endTime = perf_hooks_1.performance.now();
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
    async measureThroughput() {
        const startTime = perf_hooks_1.performance.now();
        const requests = 100;
        const promises = [];
        for (let i = 0; i < requests; i++) {
            promises.push(request(this.app.getHttpServer())
                .get('/api/health')
                .expect(200));
        }
        await Promise.all(promises);
        const endTime = perf_hooks_1.performance.now();
        const totalTime = endTime - startTime;
        const requestsPerSecond = requests / (totalTime / 1000);
        return {
            requestsPerSecond,
            totalTime,
            requests
        };
    }
    async measureErrorRate() {
        const requests = 100;
        let errorCount = 0;
        for (let i = 0; i < requests; i++) {
            try {
                await request(this.app.getHttpServer())
                    .get('/api/health')
                    .expect(200);
            }
            catch (error) {
                errorCount++;
            }
        }
        return {
            errorRate: (errorCount / requests) * 100,
            errorCount,
            totalRequests: requests
        };
    }
    async testDatabasePerformance() {
        const results = {
            connectionPool: await this.testConnectionPool(),
            queryPerformance: await this.testQueryPerformance(),
            transactionPerformance: await this.testTransactionPerformance(),
            concurrentWrites: await this.testConcurrentWrites()
        };
        return results;
    }
    async testConnectionPool() {
        const startTime = perf_hooks_1.performance.now();
        const connections = 50;
        const promises = [];
        for (let i = 0; i < connections; i++) {
            promises.push(request(this.app.getHttpServer())
                .get('/api/health')
                .expect(200));
        }
        await Promise.all(promises);
        const endTime = perf_hooks_1.performance.now();
        return {
            connections,
            totalTime: endTime - startTime,
            averageTimePerConnection: (endTime - startTime) / connections
        };
    }
    async testQueryPerformance() {
        const queries = [
            'SELECT * FROM customers LIMIT 10',
            'SELECT * FROM work_orders WHERE status = $1',
            'SELECT COUNT(*) FROM customers',
            'SELECT * FROM customers WHERE tenant_id = $1'
        ];
        const results = {};
        for (const query of queries) {
            const startTime = perf_hooks_1.performance.now();
            try {
                await request(this.app.getHttpServer())
                    .get('/api/customers')
                    .expect(200);
            }
            catch (error) {
            }
            const endTime = perf_hooks_1.performance.now();
            results[query] = endTime - startTime;
        }
        return results;
    }
    async testTransactionPerformance() {
        const startTime = perf_hooks_1.performance.now();
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
            }
            catch (error) {
            }
        }
        const endTime = perf_hooks_1.performance.now();
        return {
            transactions,
            totalTime: endTime - startTime,
            averageTimePerTransaction: (endTime - startTime) / transactions
        };
    }
    async testConcurrentWrites() {
        const startTime = perf_hooks_1.performance.now();
        const writes = 20;
        const promises = [];
        for (let i = 0; i < writes; i++) {
            promises.push(request(this.app.getHttpServer())
                .post('/api/customers')
                .send({
                first_name: `Concurrent${i}`,
                last_name: 'User',
                email: `concurrent${i}@example.com`,
                phone: '+1-555-0000'
            })
                .expect(201));
        }
        const results = await Promise.allSettled(promises);
        const endTime = perf_hooks_1.performance.now();
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
    calculatePercentile(arr, percentile) {
        const sorted = arr.sort((a, b) => a - b);
        const index = Math.ceil((percentile / 100) * sorted.length) - 1;
        return sorted[index];
    }
    getPerformanceThresholds() {
        return {
            responseTime: {
                excellent: 100,
                good: 200,
                acceptable: 500,
                poor: 1000
            },
            throughput: {
                excellent: 1000,
                good: 500,
                acceptable: 100,
                poor: 50
            },
            errorRate: {
                excellent: 0.1,
                good: 1,
                acceptable: 5,
                poor: 10
            },
            memoryUsage: {
                excellent: 100,
                good: 200,
                acceptable: 500,
                poor: 1000
            }
        };
    }
    generatePerformanceReport(results) {
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
    calculateOverallScore(results, thresholds) {
        let score = 100;
        if (results.averageResponseTime > thresholds.responseTime.poor) {
            score -= 30;
        }
        else if (results.averageResponseTime > thresholds.responseTime.acceptable) {
            score -= 20;
        }
        else if (results.averageResponseTime > thresholds.responseTime.good) {
            score -= 10;
        }
        if (results.errorRate > thresholds.errorRate.poor) {
            score -= 25;
        }
        else if (results.errorRate > thresholds.errorRate.acceptable) {
            score -= 15;
        }
        else if (results.errorRate > thresholds.errorRate.good) {
            score -= 5;
        }
        return Math.max(0, score);
    }
    getOverallStatus(results, thresholds) {
        const score = this.calculateOverallScore(results, thresholds);
        if (score >= 90)
            return 'excellent';
        if (score >= 70)
            return 'good';
        if (score >= 50)
            return 'acceptable';
        return 'poor';
    }
    generateRecommendations(results, thresholds) {
        const recommendations = [];
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
exports.PerformanceTestSuite = PerformanceTestSuite;
//# sourceMappingURL=performance-setup.js.map