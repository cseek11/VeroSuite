"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestingDashboardService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../../src/prisma/prisma.service");
let TestingDashboardService = class TestingDashboardService {
    constructor(prisma, eventEmitter) {
        this.prisma = prisma;
        this.eventEmitter = eventEmitter;
        this.testMetrics = new Map();
        this.securityMetrics = new Map();
        this.performanceMetrics = new Map();
        this.initializeSystemHealth();
    }
    onModuleInit() {
        this.startRealTimeMonitoring();
    }
    initializeSystemHealth() {
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
    async recordTestResult(metrics) {
        this.testMetrics.set(metrics.id, metrics);
        this.eventEmitter.emit('test.result.recorded', metrics);
        await this.updateSystemHealth();
        await this.storeTestMetrics(metrics);
    }
    async getTestMetrics(filters) {
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
    async getTestCoverage() {
        const metrics = Array.from(this.testMetrics.values());
        const recentMetrics = metrics.filter(m => m.timestamp >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
        const overall = recentMetrics.length > 0
            ? recentMetrics.reduce((sum, m) => { var _a; return sum + (((_a = m.coverage) === null || _a === void 0 ? void 0 : _a.lines) || 0); }, 0) / recentMetrics.length
            : 0;
        const byModule = {};
        recentMetrics.forEach(m => {
            var _a;
            if (!byModule[m.testSuite]) {
                byModule[m.testSuite] = 0;
            }
            byModule[m.testSuite] += ((_a = m.coverage) === null || _a === void 0 ? void 0 : _a.lines) || 0;
        });
        const trends = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
            const dayMetrics = metrics.filter(m => m.timestamp.toDateString() === date.toDateString());
            const dayCoverage = dayMetrics.length > 0
                ? dayMetrics.reduce((sum, m) => { var _a; return sum + (((_a = m.coverage) === null || _a === void 0 ? void 0 : _a.lines) || 0); }, 0) / dayMetrics.length
                : 0;
            trends.push(dayCoverage);
        }
        return { overall, byModule, trends };
    }
    async recordSecurityVulnerability(metrics) {
        this.securityMetrics.set(metrics.id, metrics);
        this.eventEmitter.emit('security.vulnerability.detected', metrics);
        await this.updateSystemHealth();
        await this.storeSecurityMetrics(metrics);
    }
    async getSecurityMetrics() {
        const metrics = Array.from(this.securityMetrics.values());
        const bySeverity = {};
        const byType = {};
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
    async recordPerformanceMetrics(metrics) {
        this.performanceMetrics.set(metrics.id, metrics);
        this.eventEmitter.emit('performance.metrics.recorded', metrics);
        await this.updateSystemHealth();
        await this.storePerformanceMetrics(metrics);
    }
    async getPerformanceMetrics() {
        const metrics = Array.from(this.performanceMetrics.values());
        const recentMetrics = metrics.filter(m => m.timestamp >= new Date(Date.now() - 24 * 60 * 60 * 1000));
        const averageResponseTime = recentMetrics.length > 0
            ? recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) / recentMetrics.length
            : 0;
        const averageThroughput = recentMetrics.length > 0
            ? recentMetrics.reduce((sum, m) => sum + m.throughput, 0) / recentMetrics.length
            : 0;
        const averageErrorRate = recentMetrics.length > 0
            ? recentMetrics.reduce((sum, m) => sum + m.errorRate, 0) / recentMetrics.length
            : 0;
        const byEndpoint = {};
        recentMetrics.forEach(m => {
            if (!byEndpoint[m.endpoint]) {
                byEndpoint[m.endpoint] = [];
            }
            byEndpoint[m.endpoint].push(m);
        });
        const trends = {
            responseTime: [],
            throughput: [],
            errorRate: [],
        };
        for (let i = 23; i >= 0; i--) {
            const hour = new Date(Date.now() - i * 60 * 60 * 1000);
            const hourMetrics = metrics.filter(m => m.timestamp.getHours() === hour.getHours() &&
                m.timestamp.getDate() === hour.getDate());
            trends.responseTime.push(hourMetrics.length > 0
                ? hourMetrics.reduce((sum, m) => sum + m.responseTime, 0) / hourMetrics.length
                : 0);
            trends.throughput.push(hourMetrics.length > 0
                ? hourMetrics.reduce((sum, m) => sum + m.throughput, 0) / hourMetrics.length
                : 0);
            trends.errorRate.push(hourMetrics.length > 0
                ? hourMetrics.reduce((sum, m) => sum + m.errorRate, 0) / hourMetrics.length
                : 0);
        }
        return {
            averageResponseTime,
            averageThroughput,
            averageErrorRate,
            byEndpoint,
            trends,
        };
    }
    async getSystemHealth() {
        return this.systemHealth;
    }
    async updateSystemHealth() {
        const testCoverage = await this.getTestCoverage();
        const securityMetrics = await this.getSecurityMetrics();
        const performanceMetrics = await this.getPerformanceMetrics();
        const testCoverageScore = testCoverage.overall;
        const securityScore = this.calculateSecurityScore(securityMetrics);
        const performanceScore = this.calculatePerformanceScore(performanceMetrics);
        const reliabilityScore = this.calculateReliabilityScore();
        this.systemHealth.testCoverage = testCoverageScore;
        this.systemHealth.securityScore = securityScore;
        this.systemHealth.performanceScore = performanceScore;
        this.systemHealth.reliabilityScore = reliabilityScore;
        this.systemHealth.overallScore = (testCoverageScore + securityScore + performanceScore + reliabilityScore) / 4;
        this.systemHealth.status = this.getHealthStatus(this.systemHealth.overallScore);
        this.systemHealth.lastUpdated = new Date();
        this.systemHealth.trends.testCoverage.push(testCoverageScore);
        this.systemHealth.trends.securityScore.push(securityScore);
        this.systemHealth.trends.performanceScore.push(performanceScore);
        this.systemHealth.trends.reliabilityScore.push(reliabilityScore);
        Object.keys(this.systemHealth.trends).forEach(key => {
            if (this.systemHealth.trends[key].length > 30) {
                this.systemHealth.trends[key] = this.systemHealth.trends[key].slice(-30);
            }
        });
        this.eventEmitter.emit('system.health.updated', this.systemHealth);
    }
    calculateSecurityScore(securityMetrics) {
        const criticalVulns = securityMetrics.bySeverity.critical || 0;
        const highVulns = securityMetrics.bySeverity.high || 0;
        const mediumVulns = securityMetrics.bySeverity.medium || 0;
        const lowVulns = securityMetrics.bySeverity.low || 0;
        let score = 100;
        score -= criticalVulns * 20;
        score -= highVulns * 10;
        score -= mediumVulns * 5;
        score -= lowVulns * 1;
        return Math.max(0, score);
    }
    calculatePerformanceScore(performanceMetrics) {
        const responseTime = performanceMetrics.averageResponseTime;
        const errorRate = performanceMetrics.averageErrorRate;
        let score = 100;
        if (responseTime > 1000)
            score -= 30;
        else if (responseTime > 500)
            score -= 20;
        else if (responseTime > 200)
            score -= 10;
        if (errorRate > 10)
            score -= 40;
        else if (errorRate > 5)
            score -= 20;
        else if (errorRate > 1)
            score -= 10;
        return Math.max(0, score);
    }
    calculateReliabilityScore() {
        const recentTests = Array.from(this.testMetrics.values()).filter(m => m.timestamp >= new Date(Date.now() - 24 * 60 * 60 * 1000));
        if (recentTests.length === 0)
            return 100;
        const passedTests = recentTests.filter(m => m.status === 'passed').length;
        const reliability = (passedTests / recentTests.length) * 100;
        return reliability;
    }
    getHealthStatus(score) {
        if (score >= 90)
            return 'excellent';
        if (score >= 70)
            return 'good';
        if (score >= 50)
            return 'acceptable';
        return 'poor';
    }
    startRealTimeMonitoring() {
        this.eventEmitter.on('test.result.recorded', (metrics) => {
            this.handleTestResult(metrics);
        });
        this.eventEmitter.on('security.vulnerability.detected', (metrics) => {
            this.handleSecurityVulnerability(metrics);
        });
        this.eventEmitter.on('performance.metrics.recorded', (metrics) => {
            this.handlePerformanceMetrics(metrics);
        });
    }
    handleTestResult(metrics) {
        console.log(`Test ${metrics.testName} ${metrics.status} in ${metrics.duration}ms`);
        if (metrics.status === 'failed') {
            this.eventEmitter.emit('alert.test.failure', metrics);
        }
        if (metrics.performance && metrics.performance.responseTime > 1000) {
            this.eventEmitter.emit('alert.performance.issue', metrics);
        }
    }
    handleSecurityVulnerability(metrics) {
        console.log(`Security vulnerability detected: ${metrics.vulnerabilityType} (${metrics.severity})`);
        if (metrics.severity === 'critical' || metrics.severity === 'high') {
            this.eventEmitter.emit('alert.security.vulnerability', metrics);
        }
    }
    handlePerformanceMetrics(metrics) {
        console.log(`Performance: ${metrics.endpoint} - ${metrics.responseTime}ms, ${metrics.throughput} req/s`);
        if (metrics.responseTime > 2000 || metrics.errorRate > 5) {
            this.eventEmitter.emit('alert.performance.issue', metrics);
        }
    }
    async generateHourlyReport() {
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
        await this.storeHourlyReport(report);
        this.eventEmitter.emit('report.hourly.generated', report);
    }
    async generateDailyReport() {
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
        await this.storeDailyReport(report);
        this.eventEmitter.emit('report.daily.generated', report);
    }
    async storeTestMetrics(metrics) {
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
    async storeSecurityMetrics(metrics) {
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
    async storePerformanceMetrics(metrics) {
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
    async storeHourlyReport(report) {
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
    async storeDailyReport(report) {
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
};
exports.TestingDashboardService = TestingDashboardService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestingDashboardService.prototype, "generateHourlyReport", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestingDashboardService.prototype, "generateDailyReport", null);
exports.TestingDashboardService = TestingDashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, event_emitter_1.EventEmitter2])
], TestingDashboardService);
//# sourceMappingURL=testing-dashboard.js.map