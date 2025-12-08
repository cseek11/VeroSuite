"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testExecutionService = exports.TestExecutionService = void 0;
var child_process_1 = require("child_process");
var events_1 = require("events");
var path = __importStar(require("path"));
var TestExecutionService = /** @class */ (function (_super) {
    __extends(TestExecutionService, _super);
    function TestExecutionService() {
        var _this = _super.call(this) || this;
        Object.defineProperty(_this, "processes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(_this, "testResults", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        return _this;
    }
    Object.defineProperty(TestExecutionService.prototype, "runTestCategory", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (categoryId_1) {
            return __awaiter(this, arguments, void 0, function (categoryId, workingDir) {
                var _this = this;
                if (workingDir === void 0) { workingDir = process.cwd(); }
                return __generator(this, function (_a) {
                    this.emit('testCategoryStarted', categoryId);
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var _a, _b;
                            // Use the test runner script
                            var scriptPath = path.join(workingDir, 'frontend', 'scripts', 'run-tests.js');
                            var process = (0, child_process_1.spawn)('node', [scriptPath, categoryId, workingDir], {
                                cwd: workingDir,
                                shell: true,
                                stdio: ['pipe', 'pipe', 'pipe'],
                            });
                            _this.processes.set(categoryId, process);
                            var output = '';
                            var errorOutput = '';
                            (_a = process.stdout) === null || _a === void 0 ? void 0 : _a.on('data', function (data) {
                                var text = data.toString();
                                output += text;
                                _this.emit('testOutput', categoryId, text);
                                _this.parseTestOutput(categoryId, text);
                            });
                            (_b = process.stderr) === null || _b === void 0 ? void 0 : _b.on('data', function (data) {
                                var text = data.toString();
                                errorOutput += text;
                                _this.emit('testError', categoryId, text);
                            });
                            process.on('close', function (code) {
                                _this.processes.delete(categoryId);
                                if (code === 0) {
                                    _this.emit('testCategoryCompleted', categoryId, output);
                                    resolve();
                                }
                                else {
                                    _this.emit('testCategoryFailed', categoryId, errorOutput);
                                    reject(new Error("Test category ".concat(categoryId, " failed with code ").concat(code)));
                                }
                            });
                            process.on('error', function (error) {
                                _this.processes.delete(categoryId);
                                _this.emit('testCategoryError', categoryId, error.message);
                                reject(error);
                            });
                        })];
                });
            });
        }
    });
    Object.defineProperty(TestExecutionService.prototype, "runAllTests", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, arguments, void 0, function (workingDir) {
                var categories, _i, categories_1, category, error_1;
                if (workingDir === void 0) { workingDir = process.cwd(); }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            categories = ['unit', 'integration', 'e2e', 'security', 'performance'];
                            this.emit('allTestsStarted');
                            _i = 0, categories_1 = categories;
                            _a.label = 1;
                        case 1:
                            if (!(_i < categories_1.length)) return [3 /*break*/, 7];
                            category = categories_1[_i];
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 5, , 6]);
                            return [4 /*yield*/, this.runTestCategory(category, workingDir)];
                        case 3:
                            _a.sent();
                            // Brief pause between categories
                            return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                        case 4:
                            // Brief pause between categories
                            _a.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            error_1 = _a.sent();
                            this.emit('testCategoryError', category, error_1);
                            return [3 /*break*/, 6];
                        case 6:
                            _i++;
                            return [3 /*break*/, 1];
                        case 7:
                            this.emit('allTestsCompleted');
                            return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(TestExecutionService.prototype, "parseTestOutput", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (categoryId, output) {
            // Parse Jest/Vitest output to extract test results
            var lines = output.split('\n');
            for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                var line = lines_1[_i];
                // Parse test results (this is a simplified parser)
                if (line.includes('PASS') || line.includes('✓')) {
                    var testName = this.extractTestName(line);
                    if (testName) {
                        this.updateTestResult(categoryId, testName, 'passed');
                    }
                }
                else if (line.includes('FAIL') || line.includes('✗')) {
                    var testName = this.extractTestName(line);
                    if (testName) {
                        this.updateTestResult(categoryId, testName, 'failed');
                    }
                }
                else if (line.includes('RUNS') || line.includes('●')) {
                    var testName = this.extractTestName(line);
                    if (testName) {
                        this.updateTestResult(categoryId, testName, 'running');
                    }
                }
            }
        }
    });
    Object.defineProperty(TestExecutionService.prototype, "extractTestName", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (line) {
            // Extract test name from output line
            var match = line.match(/(?:PASS|FAIL|RUNS|✓|✗|●)\s+(.+?)(?:\s|$)/);
            return match && match[1] ? match[1].trim() : null;
        }
    });
    Object.defineProperty(TestExecutionService.prototype, "updateTestResult", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (categoryId, testName, status) {
            var results = this.testResults.get(categoryId) || [];
            var test = results.find(function (t) { return t.name === testName; });
            if (!test) {
                test = {
                    id: "".concat(categoryId, "-").concat(testName),
                    name: testName,
                    status: 'pending',
                };
                results.push(test);
            }
            test.status = status;
            if (status === 'passed' || status === 'failed') {
                test.duration = Math.floor(Math.random() * 5000) + 1000; // Mock duration
            }
            this.testResults.set(categoryId, results);
            this.emit('testResultUpdated', categoryId, test);
        }
    });
    Object.defineProperty(TestExecutionService.prototype, "getTestResults", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (categoryId) {
            return this.testResults.get(categoryId) || [];
        }
    });
    Object.defineProperty(TestExecutionService.prototype, "stopTestCategory", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (categoryId) {
            var process = this.processes.get(categoryId);
            if (process) {
                process.kill();
                this.processes.delete(categoryId);
                this.emit('testCategoryStopped', categoryId);
            }
        }
    });
    Object.defineProperty(TestExecutionService.prototype, "stopAllTests", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            for (var _i = 0, _a = this.processes; _i < _a.length; _i++) {
                var _b = _a[_i], categoryId = _b[0], process_1 = _b[1];
                process_1.kill();
                this.emit('testCategoryStopped', categoryId);
            }
            this.processes.clear();
        }
    });
    Object.defineProperty(TestExecutionService.prototype, "isRunning", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (categoryId) {
            if (categoryId) {
                return this.processes.has(categoryId);
            }
            return this.processes.size > 0;
        }
    });
    return TestExecutionService;
}(events_1.EventEmitter));
exports.TestExecutionService = TestExecutionService;
exports.testExecutionService = new TestExecutionService();
