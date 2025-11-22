#!/usr/bin/env ts-node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const BASE_URL = process.argv[2] || 'http://localhost:3001';
async function makeRequest(url) {
    const startTime = Date.now();
    return new Promise((resolve) => {
        const request = http.get(url, (response) => {
            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            });
            response.on('end', () => {
                const responseTime = Date.now() - startTime;
                const statusCode = response.statusCode || 0;
                try {
                    const jsonData = JSON.parse(data);
                    resolve({
                        endpoint: url,
                        status: statusCode >= 200 && statusCode < 300 ? 'pass' : 'fail',
                        statusCode,
                        responseTime,
                        data: jsonData
                    });
                }
                catch (_a) {
                    resolve({
                        endpoint: url,
                        status: statusCode >= 200 && statusCode < 300 ? 'pass' : 'fail',
                        statusCode,
                        responseTime,
                        data: data
                    });
                }
            });
        });
        request.on('error', (error) => {
            resolve({
                endpoint: url,
                status: 'fail',
                error: error.message,
                responseTime: Date.now() - startTime
            });
        });
        request.setTimeout(5000, () => {
            request.destroy();
            resolve({
                endpoint: url,
                status: 'fail',
                error: 'Request timeout',
                responseTime: Date.now() - startTime
            });
        });
    });
}
async function testHealthChecks() {
    var _a, _b;
    console.log('🔍 Testing Health Check Endpoints');
    console.log(`📍 Base URL: ${BASE_URL}`);
    console.log('');
    const endpoints = [
        { path: '/', name: 'Basic Health Check' },
        { path: '/api/health', name: 'Detailed Health Check' },
        { path: '/api/health/live', name: 'Liveness Probe' },
        { path: '/api/health/ready', name: 'Readiness Probe' },
    ];
    const results = [];
    for (const endpoint of endpoints) {
        const url = `${BASE_URL}${endpoint.path}`;
        console.log(`Testing: ${endpoint.name} (${endpoint.path})`);
        const result = await makeRequest(url);
        results.push(result);
        if (result.status === 'pass') {
            console.log(`  ✅ Status: ${result.statusCode} | Time: ${result.responseTime}ms`);
            if ((_a = result.data) === null || _a === void 0 ? void 0 : _a.status) {
                console.log(`  📊 Status: ${result.data.status}`);
            }
            if ((_b = result.data) === null || _b === void 0 ? void 0 : _b.checks) {
                console.log(`  🔍 Component Checks:`);
                Object.keys(result.data.checks).forEach(key => {
                    const check = result.data.checks[key];
                    const icon = check.status === 'up' ? '✅' : '❌';
                    console.log(`    ${icon} ${key}: ${check.status} (${check.responseTime}ms)`);
                });
            }
        }
        else {
            console.log(`  ❌ Failed: ${result.error || `Status ${result.statusCode}`}`);
        }
        console.log('');
    }
    console.log('='.repeat(50));
    const passed = results.filter(r => r.status === 'pass').length;
    const failed = results.filter(r => r.status === 'fail').length;
    console.log(`✅ Passed: ${passed}/${results.length}`);
    console.log(`❌ Failed: ${failed}/${results.length}`);
    if (failed > 0) {
        console.log('');
        console.log('Failed endpoints:');
        results
            .filter(r => r.status === 'fail')
            .forEach(r => {
            console.log(`  - ${r.endpoint}: ${r.error || `Status ${r.statusCode}`}`);
        });
        process.exit(1);
    }
    else {
        console.log('');
        console.log('✅ All health checks passed!');
        process.exit(0);
    }
}
testHealthChecks().catch(error => {
    console.error('Error running health checks:', error);
    process.exit(1);
});
//# sourceMappingURL=test-health-checks.js.map