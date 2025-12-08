"use strict";
// ============================================================================
// INTENT CLASSIFICATION SERVICE
// ============================================================================
// Natural language intent detection and entity extraction for Global Smart Search
// 
// This service classifies user input into actionable intents and extracts entities
// for the pest control CRM domain
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.intentClassificationService = void 0;
var logger_1 = require("@/utils/logger");
// ============================================================================
// INTENT CLASSIFICATION SERVICE
// ============================================================================
var IntentClassificationService = /** @class */ (function () {
    function IntentClassificationService() {
        // Intent patterns with regex and keywords
        Object.defineProperty(this, "intentPatterns", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                search: {
                    patterns: [
                        /find\s+(.+)/i,
                        /lookup\s+(.+)/i,
                        /search\s+for\s+(.+)/i,
                        /show\s+(.+)/i,
                        /list\s+(.+)/i,
                        /get\s+(.+)/i,
                        /who\s+is\s+(.+)/i,
                        /where\s+is\s+(.+)/i
                    ],
                    keywords: ['find', 'lookup', 'search', 'show', 'list', 'get', 'who', 'where'],
                    examples: [
                        'Find John Smith',
                        'Lookup customer at 123 Maple Ave',
                        'Show all termite jobs in August',
                        'Search for customers with bed bugs'
                    ],
                    confidence: 0.8
                },
                createCustomer: {
                    patterns: [
                        /create\s+(?:a\s+)?(?:new\s+)?(?:customer\s+)?account\s+for\s+(.+)/i,
                        /add\s+(?:a\s+)?(?:new\s+)?customer\s+(.+)/i,
                        /new\s+customer\s+(.+)/i,
                        /register\s+(?:a\s+)?(?:new\s+)?customer\s+(.+)/i,
                        /create\s+(?:a\s+)?(?:new\s+)?account\s+(.+)/i
                    ],
                    keywords: ['create', 'add', 'new', 'register', 'account', 'customer'],
                    examples: [
                        'Create a new account for John Doe at 123 Maple Ave',
                        'Add new customer Lisa Nguyen',
                        'Register customer Emily White with phone 555-1234'
                    ],
                    confidence: 0.9
                },
                deleteCustomer: {
                    patterns: [
                        /delete\s+(?:the\s+)?(?:customer\s+)?account\s+(?:for\s+)?(.+)/i,
                        /remove\s+(?:the\s+)?(?:customer\s+)?account\s+(?:for\s+)?(.+)/i,
                        /delete\s+(?:customer\s+)?(.+)/i,
                        /remove\s+(?:customer\s+)?(.+)/i,
                        /cancel\s+(?:the\s+)?(?:customer\s+)?account\s+(?:for\s+)?(.+)/i,
                        /close\s+(?:the\s+)?(?:customer\s+)?account\s+(?:for\s+)?(.+)/i
                    ],
                    keywords: ['delete', 'remove', 'cancel', 'close', 'account', 'customer'],
                    examples: [
                        'Delete the customer account for John Doe',
                        'Remove customer Lisa Nguyen',
                        'Cancel account for Emily White',
                        'Close customer account for Mike Johnson'
                    ],
                    confidence: 0.9
                },
                scheduleAppointment: {
                    patterns: [
                        /schedule\s+(.+?)\s+(?:for|at)\s+(.+)/i,
                        /book\s+(.+?)\s+(?:for|at)\s+(.+)/i,
                        /appointment\s+(?:for|at)\s+(.+)/i,
                        /schedule\s+(.+)/i,
                        /book\s+(.+)/i,
                        /set\s+up\s+(.+)/i
                    ],
                    keywords: ['schedule', 'book', 'appointment', 'set up', 'arrange'],
                    examples: [
                        'Schedule bed bug treatment for Lisa Nguyen at 7pm tomorrow',
                        'Book roach treatment for John Smith',
                        'Schedule appointment for Emily White next Friday'
                    ],
                    confidence: 0.85
                },
                updateAppointment: {
                    patterns: [
                        /reschedule\s+(.+)/i,
                        /change\s+(?:appointment|schedule)\s+(.+)/i,
                        /move\s+(?:appointment|schedule)\s+(.+)/i,
                        /update\s+(?:appointment|schedule)\s+(.+)/i,
                        /modify\s+(?:appointment|schedule)\s+(.+)/i
                    ],
                    keywords: ['reschedule', 'change', 'move', 'update', 'modify'],
                    examples: [
                        'Reschedule today\'s appointment for Jake to Friday at 10am',
                        'Change appointment for Mike to next week',
                        'Move Lisa\'s appointment to tomorrow'
                    ],
                    confidence: 0.9
                },
                cancelAppointment: {
                    patterns: [
                        /cancel\s+(?:appointment|schedule|job)\s+(.+)/i,
                        /cancel\s+(.+)/i,
                        /remove\s+(?:appointment|schedule)\s+(.+)/i,
                        /delete\s+(?:appointment|schedule)\s+(.+)/i
                    ],
                    keywords: ['cancel', 'remove', 'delete'],
                    examples: [
                        'Cancel Mike\'s job scheduled for Wednesday',
                        'Cancel appointment for John Smith',
                        'Remove today\'s appointment for Lisa'
                    ],
                    confidence: 0.9
                },
                addNote: {
                    patterns: [
                        /add\s+note\s*:?\s*(.+)/i,
                        /note\s*:?\s*(.+)/i,
                        /comment\s*:?\s*(.+)/i,
                        /remark\s*:?\s*(.+)/i,
                        /add\s+comment\s*:?\s*(.+)/i
                    ],
                    keywords: ['note', 'comment', 'remark', 'add note'],
                    examples: [
                        'Add note: Customer has pets, use only organic products',
                        'Note: Customer prefers morning appointments',
                        'Comment: Customer has allergies to certain chemicals'
                    ],
                    confidence: 0.8
                },
                markInvoicePaid: {
                    patterns: [
                        /mark\s+invoice\s+(\w+)\s+as\s+paid/i,
                        /invoice\s+(\w+)\s+paid/i,
                        /payment\s+received\s+for\s+invoice\s+(\w+)/i,
                        /paid\s+invoice\s+(\w+)/i
                    ],
                    keywords: ['mark', 'invoice', 'paid', 'payment'],
                    examples: [
                        'Mark invoice 10023 as paid',
                        'Invoice 10023 paid',
                        'Payment received for invoice 10023'
                    ],
                    confidence: 0.9
                },
                assignTechnician: {
                    patterns: [
                        /assign\s+technician\s+(\w+)\s+to\s+(.+)/i,
                        /assign\s+(\w+)\s+to\s+(.+)/i,
                        /give\s+(.+)\s+to\s+technician\s+(\w+)/i,
                        /technician\s+(\w+)\s+for\s+(.+)/i
                    ],
                    keywords: ['assign', 'technician', 'give', 'to'],
                    examples: [
                        'Assign technician Alex to appointment #2093',
                        'Assign Alex to John Smith\'s job',
                        'Give bed bug treatment to technician Sam'
                    ],
                    confidence: 0.85
                },
                sendReminder: {
                    patterns: [
                        /send\s+reminder\s+to\s+(.+)/i,
                        /remind\s+(.+)/i,
                        /reminder\s+for\s+(.+)/i,
                        /notify\s+(.+)/i
                    ],
                    keywords: ['send', 'reminder', 'remind', 'notify'],
                    examples: [
                        'Send reminder to Emily White',
                        'Remind John Smith about his appointment',
                        'Send reminder to Lisa Nguyen'
                    ],
                    confidence: 0.8
                },
                createServicePlan: {
                    patterns: [
                        /create\s+(?:quarterly|monthly|weekly|recurring)\s+service\s+plan\s+(.+)/i,
                        /set\s+up\s+(?:quarterly|monthly|weekly|recurring)\s+service\s+(.+)/i,
                        /(?:quarterly|monthly|weekly|recurring)\s+service\s+(.+)/i
                    ],
                    keywords: ['create', 'set up', 'quarterly', 'monthly', 'weekly', 'recurring', 'service plan'],
                    examples: [
                        'Create quarterly service plan for Sam at 456 Oak St starting next Monday',
                        'Set up monthly service for John Smith',
                        'Quarterly service plan for Emily White'
                    ],
                    confidence: 0.85
                },
                showReports: {
                    patterns: [
                        /show\s+(?:reports|analytics|stats|statistics)/i,
                        /generate\s+(?:report|analytics)/i,
                        /view\s+(?:reports|analytics|stats)/i,
                        /display\s+(?:reports|analytics)/i
                    ],
                    keywords: ['show', 'generate', 'view', 'display', 'reports', 'analytics', 'stats'],
                    examples: [
                        'Show reports',
                        'Generate analytics',
                        'View statistics',
                        'Display performance metrics'
                    ],
                    confidence: 0.8
                },
                help: {
                    patterns: [
                        /help/i,
                        /what\s+can\s+i\s+do/i,
                        /how\s+do\s+i/i,
                        /examples/i,
                        /commands/i
                    ],
                    keywords: ['help', 'what', 'how', 'examples', 'commands'],
                    examples: [
                        'Help',
                        'What can I do?',
                        'How do I create a customer?',
                        'Show me examples'
                    ],
                    confidence: 0.9
                },
                // Phase 1: High Priority Commands
                updateCustomer: {
                    patterns: [
                        /update\s+customer\s+(.+)/i,
                        /edit\s+customer\s+(.+)/i,
                        /modify\s+customer\s+(.+)/i,
                        /change\s+customer\s+(.+)/i,
                        /update\s+(.+?)\s+(?:phone|email|address|name)\s+to\s+(.+)/i,
                        /edit\s+(.+?)\s+(?:phone|email|address|name)\s+to\s+(.+)/i,
                        /modify\s+(.+?)\s+(?:phone|email|address|name)\s+to\s+(.+)/i,
                        /change\s+(.+?)\s+(?:phone|email|address|name)\s+to\s+(.+)/i,
                        /set\s+(.+?)\s+(?:phone|email|address|name)\s+to\s+(.+)/i,
                        /(.+?)\s+(?:phone|email|address|name)\s+(?:is|to|should be|will be)\s+(.+)/i,
                        /(.+?)\s+(?:has|gets|now has)\s+(?:phone|email|address|name)\s+(.+)/i
                    ],
                    keywords: ['update', 'edit', 'modify', 'change', 'set', 'customer', 'phone', 'email', 'address', 'name', 'to', 'is', 'has'],
                    examples: [
                        'Update customer John Smith phone to 555-1234',
                        'Edit customer Lisa Nguyen email to lisa@email.com',
                        'Modify customer Mike Johnson address to 123 New St',
                        'Change customer Emily White name to Emily Brown',
                        'Set John Smith phone to (555) 123-4567',
                        'John Smith phone is 555-1234',
                        'Lisa Nguyen email should be lisa@company.com'
                    ],
                    confidence: 0.9
                },
                viewCustomerDetails: {
                    patterns: [
                        /view\s+customer\s+(.+)/i,
                        /show\s+customer\s+(.+)/i,
                        /display\s+customer\s+(.+)/i,
                        /customer\s+details\s+(.+)/i,
                        /profile\s+(.+)/i
                    ],
                    keywords: ['view', 'show', 'display', 'customer', 'details', 'profile'],
                    examples: [
                        'View customer John Smith',
                        'Show customer Lisa Nguyen details',
                        'Display customer Mike Johnson profile'
                    ],
                    confidence: 0.9
                },
                customerHistory: {
                    patterns: [
                        /customer\s+history\s+(.+)/i,
                        /service\s+history\s+(.+)/i,
                        /history\s+(.+)/i,
                        /past\s+services\s+(.+)/i,
                        /work\s+history\s+(.+)/i
                    ],
                    keywords: ['customer', 'history', 'service', 'past', 'work'],
                    examples: [
                        'Customer history John Smith',
                        'Service history Lisa Nguyen',
                        'Past services Mike Johnson'
                    ],
                    confidence: 0.9
                },
                startJob: {
                    patterns: [
                        /start\s+job\s+(.+)/i,
                        /begin\s+job\s+(.+)/i,
                        /start\s+work\s+(.+)/i,
                        /begin\s+work\s+(.+)/i
                    ],
                    keywords: ['start', 'begin', 'job', 'work'],
                    examples: [
                        'Start job for John Smith',
                        'Begin work for Lisa Nguyen',
                        'Start job Mike Johnson'
                    ],
                    confidence: 0.9
                },
                completeJob: {
                    patterns: [
                        /complete\s+job\s+(.+)/i,
                        /finish\s+job\s+(.+)/i,
                        /done\s+job\s+(.+)/i,
                        /complete\s+work\s+(.+)/i,
                        /finish\s+work\s+(.+)/i
                    ],
                    keywords: ['complete', 'finish', 'done', 'job', 'work'],
                    examples: [
                        'Complete job for John Smith',
                        'Finish work for Lisa Nguyen',
                        'Done job Mike Johnson'
                    ],
                    confidence: 0.9
                },
                pauseJob: {
                    patterns: [
                        /pause\s+job\s+(.+)/i,
                        /stop\s+job\s+(.+)/i,
                        /hold\s+job\s+(.+)/i,
                        /pause\s+work\s+(.+)/i
                    ],
                    keywords: ['pause', 'stop', 'hold', 'job', 'work'],
                    examples: [
                        'Pause job for John Smith',
                        'Stop work for Lisa Nguyen',
                        'Hold job Mike Johnson'
                    ],
                    confidence: 0.9
                },
                resumeJob: {
                    patterns: [
                        /resume\s+job\s+(.+)/i,
                        /continue\s+job\s+(.+)/i,
                        /restart\s+job\s+(.+)/i,
                        /resume\s+work\s+(.+)/i
                    ],
                    keywords: ['resume', 'continue', 'restart', 'job', 'work'],
                    examples: [
                        'Resume job for John Smith',
                        'Continue work for Lisa Nguyen',
                        'Restart job Mike Johnson'
                    ],
                    confidence: 0.9
                },
                jobStatus: {
                    patterns: [
                        /job\s+status\s+(.+)/i,
                        /status\s+(.+)/i,
                        /check\s+job\s+(.+)/i,
                        /job\s+progress\s+(.+)/i
                    ],
                    keywords: ['job', 'status', 'check', 'progress'],
                    examples: [
                        'Job status John Smith',
                        'Status Lisa Nguyen',
                        'Check job Mike Johnson'
                    ],
                    confidence: 0.9
                },
                createInvoice: {
                    patterns: [
                        /create\s+invoice\s+(.+)/i,
                        /generate\s+invoice\s+(.+)/i,
                        /new\s+invoice\s+(.+)/i,
                        /bill\s+(.+)/i
                    ],
                    keywords: ['create', 'generate', 'new', 'invoice', 'bill'],
                    examples: [
                        'Create invoice for John Smith $150',
                        'Generate invoice Lisa Nguyen $200',
                        'Bill Mike Johnson $100'
                    ],
                    confidence: 0.9
                },
                recordPayment: {
                    patterns: [
                        /record\s+payment\s+(.+)/i,
                        /payment\s+received\s+(.+)/i,
                        /received\s+payment\s+(.+)/i,
                        /log\s+payment\s+(.+)/i
                    ],
                    keywords: ['record', 'payment', 'received', 'log'],
                    examples: [
                        'Record payment $150 from John Smith',
                        'Payment received $200 from Lisa Nguyen',
                        'Received payment $100 from Mike Johnson'
                    ],
                    confidence: 0.9
                },
                sendInvoice: {
                    patterns: [
                        /send\s+invoice\s+(.+)/i,
                        /email\s+invoice\s+(.+)/i,
                        /mail\s+invoice\s+(.+)/i,
                        /deliver\s+invoice\s+(.+)/i
                    ],
                    keywords: ['send', 'email', 'mail', 'deliver', 'invoice'],
                    examples: [
                        'Send invoice to John Smith',
                        'Email invoice Lisa Nguyen',
                        'Mail invoice Mike Johnson'
                    ],
                    confidence: 0.9
                },
                paymentHistory: {
                    patterns: [
                        /payment\s+history\s+(.+)/i,
                        /payments\s+(.+)/i,
                        /payment\s+record\s+(.+)/i,
                        /billing\s+history\s+(.+)/i
                    ],
                    keywords: ['payment', 'history', 'payments', 'record', 'billing'],
                    examples: [
                        'Payment history John Smith',
                        'Payments Lisa Nguyen',
                        'Billing history Mike Johnson'
                    ],
                    confidence: 0.9
                },
                outstandingInvoices: {
                    patterns: [
                        /outstanding\s+invoices/i,
                        /unpaid\s+invoices/i,
                        /pending\s+invoices/i,
                        /overdue\s+invoices/i,
                        /show\s+outstanding/i
                    ],
                    keywords: ['outstanding', 'unpaid', 'pending', 'overdue', 'invoices'],
                    examples: [
                        'Outstanding invoices',
                        'Unpaid invoices',
                        'Show outstanding',
                        'Pending invoices'
                    ],
                    confidence: 0.9
                },
                advancedSearch: {
                    patterns: [
                        /search\s+(.+)/i,
                        /find\s+(.+)/i,
                        /lookup\s+(.+)/i,
                        /query\s+(.+)/i
                    ],
                    keywords: ['search', 'find', 'lookup', 'query'],
                    examples: [
                        'Search customers with bed bugs',
                        'Find all termite jobs',
                        'Lookup invoices from last month'
                    ],
                    confidence: 0.8
                }
            }
        });
        // Entity extraction patterns
        Object.defineProperty(this, "entityPatterns", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                customerName: [
                    /(?:for|to|with)\s+([a-z]+\s+[a-z]+)/,
                    /([a-z]+\s+[a-z]+)(?:\s+at|\s+with|\s+for)/,
                    /customer\s+([a-z]+\s+[a-z]+)/,
                    /(?:add\s+new\s+customer|create\s+new\s+customer|new\s+customer)\s+([a-z]+\s+[a-z]+)/
                ],
                address: [
                    // Comma-separated format: "134 Thompson Ave, Donora, PA, 15033"
                    /(\d+\s+[A-Za-z\s]+(?:st|ave|rd|blvd|dr|ln|way|pl|street|avenue|road|boulevard|drive|lane|place|court|circle|terrace|trail|parkway|highway|apt|apartment|unit|suite|#))\s*,/i,
                    // Traditional formats
                    /at\s+(\d+\s+[A-Za-z\s]+(?:st|ave|rd|blvd|dr|ln|way|pl|street|avenue|road|boulevard|drive|lane|place))/i,
                    /(\d+\s+[A-Za-z\s]+(?:st|ave|rd|blvd|dr|ln|way|pl|street|avenue|road|boulevard|drive|lane|place))/i,
                    /address\s+(\d+\s+[A-Za-z\s]+)/i,
                    /at\s+(\d+\s+[A-Za-z\s]+)/i,
                    /(\d+\s+[A-Za-z\s]+(?:st|ave|rd|blvd|dr|ln|way|pl|street|avenue|road|boulevard|drive|lane|place|court|circle|terrace|trail|parkway|highway))/i,
                    /(\d+\s+[A-Za-z\s]+(?:st|ave|rd|blvd|dr|ln|way|pl|street|avenue|road|boulevard|drive|lane|place|court|circle|terrace|trail|parkway|highway|apt|apartment|unit|suite|#))/i
                ],
                city: [
                    // Comma-separated format: "134 Thompson Ave, Donora, PA, 15033"
                    /(?:at\s+)?\d+\s+[A-Za-z\s]+(?:st|ave|rd|blvd|dr|ln|way|pl|street|avenue|road|boulevard|drive|lane|place|court|circle|terrace|trail|parkway|highway|apt|apartment|unit|suite|#)\s*,\s*([A-Za-z\s]+?)\s*,/i,
                    // Traditional formats
                    /in\s+([A-Za-z\s]+?)(?:\s+[A-Z]{2}|\s+\d{5}|\s+phone|\s+email|\s*$)/i,
                    /city\s+([A-Za-z\s]+?)(?:\s+[A-Z]{2}|\s+\d{5}|\s+phone|\s+email|\s*$)/i,
                    /(?:at\s+\d+\s+[A-Za-z\s]+(?:st|ave|rd|blvd|dr|ln|way|pl|street|avenue|road|boulevard|drive|lane|place|court|circle|terrace|trail|parkway|highway|apt|apartment|unit|suite|#)\s+in\s+)([A-Za-z\s]+?)(?:\s+[A-Z]{2}|\s+\d{5}|\s+phone|\s+email|\s*$)/i,
                    /(?:address\s+\d+\s+[A-Za-z\s]+\s+in\s+)([A-Za-z\s]+?)(?:\s+[A-Z]{2}|\s+\d{5}|\s+phone|\s+email|\s*$)/i
                ],
                state: [
                    // Comma-separated format: "134 Thompson Ave, Donora, PA, 15033"
                    /(?:at\s+)?\d+\s+[A-Za-z\s]+(?:st|ave|rd|blvd|dr|ln|way|pl|street|avenue|road|boulevard|drive|lane|place|court|circle|terrace|trail|parkway|highway|apt|apartment|unit|suite|#)\s*,\s*[A-Za-z\s]+\s*,\s*([A-Z]{2})\s*,/i,
                    // Traditional formats
                    /([A-Z]{2})(?:\s+\d{5}|\s*$)/i,
                    /state\s+([A-Z]{2})/i
                ],
                zipCode: [
                    // Comma-separated format: "134 Thompson Ave, Donora, PA, 15033"
                    /(?:at\s+)?\d+\s+[A-Za-z\s]+(?:st|ave|rd|blvd|dr|ln|way|pl|street|avenue|road|boulevard|drive|lane|place|court|circle|terrace|trail|parkway|highway|apt|apartment|unit|suite|#)\s*,\s*[A-Za-z\s]+\s*,\s*[A-Z]{2}\s*,\s*(\d{5}(?:-\d{4})?)/i,
                    // Traditional formats
                    /(\d{5}(?:-\d{4})?)/i,
                    /zip\s+(\d{5}(?:-\d{4})?)/i,
                    /postal\s+code\s+(\d{5}(?:-\d{4})?)/i
                ],
                phone: [
                    /(?:phone|call|contact)\s+(\d{3}[-.]?\d{3}[-.]?\d{4})/,
                    /(?:phone|call|contact)\s+(\(\d{3}\)\s?\d{3}[-.]?\d{4})/,
                    /(?:phone|call|contact)\s+(\d{3}\s\d{3}\s\d{4})/,
                    /(\d{3}[-.]?\d{3}[-.]?\d{4})/,
                    /(\(\d{3}\)\s?\d{3}[-.]?\d{4})/,
                    /(\d{3}\s\d{3}\s\d{4})/,
                    /(\d{10})/,
                    /(\d{3}\s?\d{3}\s?\d{4})/
                ],
                email: [
                    /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/
                ],
                pestType: [
                    /(?:roaches?|cockroaches?|bed\s+bugs?|termites?|ants?|rodents?|mice|rats?|spiders?|wasps?|bees?)/i
                ],
                serviceType: [
                    /(?:treatment|inspection|spray|bait|trap|extermination|removal|control)/i
                ],
                date: [
                    /(?:tomorrow|today|yesterday|monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i,
                    /(\d{1,2}\/\d{1,2}\/\d{2,4})/,
                    /(\d{4}-\d{2}-\d{2})/
                ],
                time: [
                    /(\d{1,2}:\d{2}\s*(?:am|pm)?)/i,
                    /(\d{1,2}\s*(?:am|pm))/i
                ],
                technician: [
                    /(?:technician|tech)\s+([A-Z][a-z]+)/,
                    /([A-Z][a-z]+)(?:\s+for|\s+to)/
                ],
                invoiceId: [
                    /(?:invoice|inv)\s*#?(\w+)/,
                    /#(\w+)/
                ],
                amount: [
                    /\$(\d+(?:\.\d{2})?)/,
                    /(\d+(?:\.\d{2})?)\s*dollars?/
                ],
                priority: [
                    /(?:urgent|high|medium|low)\s+priority/i,
                    /priority\s+(urgent|high|medium|low)/i
                ]
            }
        });
    }
    /**
     * Classify user input into an intent with confidence score
     */
    Object.defineProperty(IntentClassificationService.prototype, "classifyIntent", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (query) {
            var normalizedQuery = this.normalizeQuery(query);
            var bestMatch = null;
            // Test against all intent patterns
            for (var _i = 0, _a = Object.entries(this.intentPatterns); _i < _a.length; _i++) {
                var _b = _a[_i], intent = _b[0], config = _b[1];
                var intentType = intent;
                // Check patterns
                for (var _c = 0, _d = config.patterns; _c < _d.length; _c++) {
                    var pattern = _d[_c];
                    var match = normalizedQuery.match(pattern);
                    if (match) {
                        var confidence = config.confidence * this.calculatePatternConfidence(match, normalizedQuery);
                        if (!bestMatch || confidence > bestMatch.confidence) {
                            bestMatch = {
                                intent: intentType,
                                confidence: confidence,
                                match: match[0]
                            };
                        }
                    }
                }
                // Check keywords
                var keywordMatches = config.keywords.filter(function (keyword) {
                    return normalizedQuery.includes(keyword.toLowerCase());
                });
                if (keywordMatches.length > 0) {
                    var confidence = config.confidence * 0.7 * (keywordMatches.length / config.keywords.length);
                    if (!bestMatch || confidence > bestMatch.confidence) {
                        bestMatch = {
                            intent: intentType,
                            confidence: confidence,
                            match: keywordMatches[0] || ''
                        };
                    }
                }
            }
            // Default to search if no clear intent found
            if (!bestMatch || bestMatch.confidence < 0.3) {
                bestMatch = {
                    intent: 'search',
                    confidence: 0.5,
                    match: query
                };
            }
            // Extract entities
            var entities = this.extractEntities(normalizedQuery);
            // Generate action data if applicable
            var actionData = this.generateActionData(bestMatch.intent, entities, normalizedQuery);
            var result = {
                intent: bestMatch.intent,
                confidence: bestMatch.confidence,
                entities: entities,
                originalQuery: query,
                processedQuery: normalizedQuery,
                actionData: actionData || {}
            };
            // Debug logging
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('Intent Classification Result', {
                    query: query,
                    normalizedQuery: normalizedQuery,
                    intent: result.intent,
                    confidence: result.confidence,
                    entities: result.entities,
                    actionData: result.actionData
                });
            }
            return result;
        }
    });
    /**
     * Format text with proper capitalization
     */
    Object.defineProperty(IntentClassificationService.prototype, "formatText", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (text) {
            if (!text)
                return text;
            // Handle special cases
            var specialWords = ['and', 'or', 'the', 'of', 'in', 'at', 'to', 'for', 'with', 'by'];
            return text
                .toLowerCase()
                .split(' ')
                .map(function (word, index) {
                // Always capitalize first word
                if (index === 0) {
                    return word.charAt(0).toUpperCase() + word.slice(1);
                }
                // Capitalize special words only if they're not the first word
                if (specialWords.includes(word)) {
                    return word;
                }
                // Capitalize all other words
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
                .join(' ');
        }
    });
    /**
     * Extract entities from the query
     */
    Object.defineProperty(IntentClassificationService.prototype, "extractEntities", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (query) {
            var entities = {};
            // Extract customer name
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('Extracting entities from query', { query: query }, 'intent-classification');
                logger_1.logger.debug('Starting entity extraction', {}, 'intent-classification');
            }
            // First try to extract customer name from update patterns
            var updatePatterns = [
                /update\s+customer\s+([^,]+?)(?:\s+(?:phone|email|address|name)|$)/i,
                /edit\s+customer\s+([^,]+?)(?:\s+(?:phone|email|address|name)|$)/i,
                /modify\s+customer\s+([^,]+?)(?:\s+(?:phone|email|address|name)|$)/i,
                /change\s+customer\s+([^,]+?)(?:\s+(?:phone|email|address|name)|$)/i,
                /set\s+([^,]+?)\s+(?:phone|email|address|name)/i,
                /([^,]+?)\s+(?:phone|email|address|name)\s+(?:is|to|should be|will be)/i,
                /([^,]+?)\s+(?:has|gets|now has)\s+(?:phone|email|address|name)/i
            ];
            for (var _i = 0, updatePatterns_1 = updatePatterns; _i < updatePatterns_1.length; _i++) {
                var pattern = updatePatterns_1[_i];
                var match = query.match(pattern);
                if (process.env.NODE_ENV === 'development') {
                    logger_1.logger.debug('Testing update pattern', { pattern: pattern.toString(), match: match }, 'intent-classification');
                }
                if (match && match[1]) {
                    entities.customerName = this.formatText(match[1].trim());
                    if (process.env.NODE_ENV === 'development') {
                        logger_1.logger.debug('Found customer name from update pattern', { original: match[1], formatted: entities.customerName }, 'intent-classification');
                    }
                    break;
                }
            }
            // If no customer name found from update patterns, try regular patterns
            if (!entities.customerName) {
                for (var _a = 0, _b = this.entityPatterns.customerName; _a < _b.length; _a++) {
                    var pattern = _b[_a];
                    var match = query.match(pattern);
                    if (process.env.NODE_ENV === 'development') {
                        logger_1.logger.debug('Testing regular pattern', { pattern: pattern.toString(), match: match }, 'intent-classification');
                    }
                    if (match && match[1]) {
                        entities.customerName = this.formatText(match[1]);
                        if (process.env.NODE_ENV === 'development') {
                            logger_1.logger.debug('Found customer name', { original: match[1], formatted: entities.customerName }, 'intent-classification');
                        }
                        break;
                    }
                }
            }
            // Try to parse space-separated address format first: "134 Thompson Ave Donora PA 15033"
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('Testing space-separated address pattern', {}, 'intent-classification');
            }
            var spaceAddressMatch = query.match(/(\d+\s+[a-z\s]+(?:st|ave|rd|blvd|dr|ln|way|pl|street|avenue|road|boulevard|drive|lane|place|court|circle|terrace|trail|parkway|highway|apt|apartment|unit|suite|#))\s+([a-z]+)\s+([a-z]{2})\s+(\d{5}(?:-\d{4})?)/i);
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('Space address match result', { match: spaceAddressMatch }, 'intent-classification');
            }
            if (spaceAddressMatch && spaceAddressMatch[1] && spaceAddressMatch[2] && spaceAddressMatch[3] && spaceAddressMatch[4]) {
                entities.address = this.formatText(spaceAddressMatch[1].trim());
                entities.city = this.formatText(spaceAddressMatch[2].trim());
                entities.state = spaceAddressMatch[3].trim().toUpperCase();
                entities.zipCode = spaceAddressMatch[4].trim();
                if (process.env.NODE_ENV === 'development') {
                    logger_1.logger.debug('Found space-separated address', {
                        address: entities.address,
                        city: entities.city,
                        state: entities.state,
                        zipCode: entities.zipCode
                    }, 'intent-classification');
                }
            }
            else {
                // Fall back to individual pattern matching
                // Extract address
                for (var _c = 0, _d = this.entityPatterns.address; _c < _d.length; _c++) {
                    var pattern = _d[_c];
                    var match = query.match(pattern);
                    if (match && match[1]) {
                        entities.address = this.formatText(match[1]);
                        if (process.env.NODE_ENV === 'development') {
                            logger_1.logger.debug('Found address', { original: match[1], formatted: entities.address }, 'intent-classification');
                        }
                        break;
                    }
                }
                // Extract city
                if (process.env.NODE_ENV === 'development') {
                    logger_1.logger.debug('Testing city patterns on query', { query: query }, 'intent-classification');
                }
                for (var _e = 0, _f = this.entityPatterns.city; _e < _f.length; _e++) {
                    var pattern = _f[_e];
                    var match = query.match(pattern);
                    if (process.env.NODE_ENV === 'development') {
                        logger_1.logger.debug('Testing city pattern', { pattern: pattern.toString(), match: match }, 'intent-classification');
                    }
                    if (match && match[1]) {
                        entities.city = this.formatText(match[1].trim());
                        if (process.env.NODE_ENV === 'development') {
                            logger_1.logger.debug('Found city', { original: match[1], formatted: entities.city }, 'intent-classification');
                        }
                        break;
                    }
                }
                // Extract state (only if not in a phone/email context)
                if (!query.includes('phone') && !query.includes('email')) {
                    for (var _g = 0, _h = this.entityPatterns.state; _g < _h.length; _g++) {
                        var pattern = _h[_g];
                        var match = query.match(pattern);
                        if (match && match[1]) {
                            entities.state = match[1].trim().toUpperCase();
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Found state', { state: match[1] }, 'intent-classification');
                            }
                            break;
                        }
                    }
                }
                // Extract zip code (only if not in a phone/email context)
                if (!query.includes('phone') && !query.includes('email')) {
                    for (var _j = 0, _k = this.entityPatterns.zipCode; _j < _k.length; _j++) {
                        var pattern = _k[_j];
                        var match = query.match(pattern);
                        if (match && match[1]) {
                            entities.zipCode = match[1].trim();
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Found zip code', { zipCode: match[1] }, 'intent-classification');
                            }
                            break;
                        }
                    }
                }
            }
            // Extract phone
            for (var _l = 0, _m = this.entityPatterns.phone; _l < _m.length; _l++) {
                var pattern = _m[_l];
                var match = query.match(pattern);
                if (match && match[1]) {
                    entities.phone = match[1];
                    if (process.env.NODE_ENV === 'development') {
                        logger_1.logger.debug('Found phone', { phone: match[1] }, 'intent-classification');
                    }
                    break;
                }
            }
            // Extract email
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('Testing email patterns on query', { query: query }, 'intent-classification');
            }
            for (var _o = 0, _p = this.entityPatterns.email; _o < _p.length; _o++) {
                var pattern = _p[_o];
                var match = query.match(pattern);
                if (process.env.NODE_ENV === 'development') {
                    logger_1.logger.debug('Testing email pattern', { pattern: pattern.toString(), match: match }, 'intent-classification');
                }
                if (match && match[1]) {
                    entities.email = match[1];
                    if (process.env.NODE_ENV === 'development') {
                        logger_1.logger.debug('Found email', { email: match[1] }, 'intent-classification');
                    }
                    break;
                }
            }
            // Extract pest type
            for (var _q = 0, _r = this.entityPatterns.pestType; _q < _r.length; _q++) {
                var pattern = _r[_q];
                var match = query.match(pattern);
                if (match && match[1]) {
                    entities.pestType = match[1].toLowerCase();
                    break;
                }
            }
            // Extract service type
            for (var _s = 0, _t = this.entityPatterns.serviceType; _s < _t.length; _s++) {
                var pattern = _t[_s];
                var match = query.match(pattern);
                if (match && match[1]) {
                    entities.serviceType = match[1].toLowerCase();
                    break;
                }
            }
            // Extract date
            for (var _u = 0, _v = this.entityPatterns.date; _u < _v.length; _u++) {
                var pattern = _v[_u];
                var match = query.match(pattern);
                if (match && match[1]) {
                    entities.date = match[1];
                    break;
                }
            }
            // Extract time
            for (var _w = 0, _x = this.entityPatterns.time; _w < _x.length; _w++) {
                var pattern = _x[_w];
                var match = query.match(pattern);
                if (match && match[1]) {
                    entities.time = match[1];
                    break;
                }
            }
            // Extract technician
            for (var _y = 0, _z = this.entityPatterns.technician; _y < _z.length; _y++) {
                var pattern = _z[_y];
                var match = query.match(pattern);
                if (match && match[1]) {
                    entities.technician = match[1];
                    break;
                }
            }
            // Extract invoice ID
            for (var _0 = 0, _1 = this.entityPatterns.invoiceId; _0 < _1.length; _0++) {
                var pattern = _1[_0];
                var match = query.match(pattern);
                if (match && match[1]) {
                    entities.invoiceId = match[1];
                    break;
                }
            }
            // Extract amount
            for (var _2 = 0, _3 = this.entityPatterns.amount; _2 < _3.length; _2++) {
                var pattern = _3[_2];
                var match = query.match(pattern);
                if (match && match[1]) {
                    entities.amount = match[1];
                    break;
                }
            }
            // Extract priority
            for (var _4 = 0, _5 = this.entityPatterns.priority; _4 < _5.length; _4++) {
                var pattern = _5[_4];
                var match = query.match(pattern);
                if (match && match[1]) {
                    entities.priority = match[1].toLowerCase();
                    break;
                }
            }
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('Final extracted entities', { entities: entities }, 'intent-classification');
                logger_1.logger.debug('Final city value', { city: entities.city }, 'intent-classification');
            }
            return entities;
        }
    });
    /**
     * Generate action data based on intent and entities
     */
    Object.defineProperty(IntentClassificationService.prototype, "generateActionData", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (intent, entities, query) {
            switch (intent) {
                case 'createCustomer':
                    return {
                        customerData: __assign(__assign(__assign(__assign(__assign(__assign(__assign({ name: entities.customerName || '' }, (entities.address && { address: entities.address })), (entities.city && { city: entities.city })), (entities.state && { state: entities.state })), (entities.zipCode && { zipCode: entities.zipCode })), (entities.phone && { phone: entities.phone })), (entities.email && { email: entities.email })), (entities.notes && { notes: entities.notes }))
                    };
                case 'updateCustomer':
                    return {
                        customerData: __assign(__assign(__assign(__assign(__assign(__assign(__assign({ name: entities.customerName || '' }, (entities.phone && { phone: entities.phone })), (entities.email && { email: entities.email })), (entities.address && { address: entities.address })), (entities.city && { city: entities.city })), (entities.state && { state: entities.state })), (entities.zipCode && { zipCode: entities.zipCode })), (entities.notes && { notes: entities.notes }))
                    };
                case 'scheduleAppointment':
                    return {
                        appointmentData: __assign(__assign(__assign(__assign(__assign({}, (entities.customerName && { customerName: entities.customerName })), { serviceType: entities.serviceType || entities.pestType || 'general treatment', date: entities.date || 'tomorrow' }), (entities.time && { time: entities.time })), (entities.technician && { technician: entities.technician })), (entities.notes && { notes: entities.notes }))
                    };
                case 'updateAppointment':
                    return {
                        appointmentData: __assign(__assign(__assign(__assign(__assign({}, (entities.customerName && { customerName: entities.customerName })), { serviceType: entities.serviceType || entities.pestType || 'general treatment', date: entities.date || 'tomorrow' }), (entities.time && { time: entities.time })), (entities.technician && { technician: entities.technician })), (entities.notes && { notes: entities.notes }))
                    };
                case 'addNote':
                    return {
                        noteData: __assign(__assign(__assign({}, (entities.customerName && { customerName: entities.customerName })), { note: entities.notes || query }), (entities.priority && { priority: entities.priority }))
                    };
                case 'markInvoicePaid':
                    return {
                        invoiceData: {
                            invoiceId: entities.invoiceId || '',
                            status: 'paid'
                        }
                    };
                default:
                    return undefined;
            }
        }
    });
    /**
     * Normalize query for better matching
     */
    Object.defineProperty(IntentClassificationService.prototype, "normalizeQuery", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (query) {
            return query
                .toLowerCase()
                .trim()
                .replace(/\s+/g, ' ')
                .replace(/[^\w\s@.-]/g, '');
        }
    });
    /**
     * Calculate confidence based on pattern match quality
     */
    Object.defineProperty(IntentClassificationService.prototype, "calculatePatternConfidence", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (match, query) {
            var matchLength = match[0].length;
            var queryLength = query.length;
            return Math.min(1.0, matchLength / queryLength + 0.3);
        }
    });
    /**
     * Get all supported intents
     */
    Object.defineProperty(IntentClassificationService.prototype, "getSupportedIntents", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return Object.keys(this.intentPatterns);
        }
    });
    /**
     * Get examples for all intents
     */
    Object.defineProperty(IntentClassificationService.prototype, "getIntentExamples", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            var examples = {};
            for (var _i = 0, _a = Object.entries(this.intentPatterns); _i < _a.length; _i++) {
                var _b = _a[_i], intent = _b[0], config = _b[1];
                examples[intent] = config.examples;
            }
            return examples;
        }
    });
    /**
     * Get examples for a specific intent
     */
    Object.defineProperty(IntentClassificationService.prototype, "getIntentExamplesFor", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (intent) {
            var _a;
            return ((_a = this.intentPatterns[intent]) === null || _a === void 0 ? void 0 : _a.examples) || [];
        }
    });
    /**
     * Validate if an intent result is actionable
     */
    Object.defineProperty(IntentClassificationService.prototype, "validateIntentResult", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (result) {
            var _a, _b;
            var errors = [];
            switch (result.intent) {
                case 'createCustomer':
                    if (!result.entities.customerName) {
                        errors.push('Customer name is required');
                    }
                    break;
                case 'scheduleAppointment':
                    if (!result.entities.customerName && !result.entities.customerId) {
                        errors.push('Customer name or ID is required');
                    }
                    if (!result.entities.serviceType && !result.entities.pestType) {
                        errors.push('Service type or pest type is required');
                    }
                    break;
                case 'updateAppointment':
                    if (!result.entities.customerName && !result.entities.customerId) {
                        errors.push('Customer name or ID is required');
                    }
                    break;
                case 'addNote':
                    if (!result.entities.customerName && !result.entities.customerId) {
                        errors.push('Customer name or ID is required');
                    }
                    if (!result.entities.notes && !((_b = (_a = result.actionData) === null || _a === void 0 ? void 0 : _a.noteData) === null || _b === void 0 ? void 0 : _b.note)) {
                        errors.push('Note content is required');
                    }
                    break;
                case 'markInvoicePaid':
                    if (!result.entities.invoiceId) {
                        errors.push('Invoice ID is required');
                    }
                    break;
                case 'assignTechnician':
                    if (!result.entities.technician) {
                        errors.push('Technician name is required');
                    }
                    if (!result.entities.customerName && !result.entities.customerId) {
                        errors.push('Customer name or ID is required');
                    }
                    break;
            }
            return {
                isValid: errors.length === 0,
                errors: errors
            };
        }
    });
    return IntentClassificationService;
}());
// Export singleton instance
exports.intentClassificationService = new IntentClassificationService();
// Export types (already exported above)
