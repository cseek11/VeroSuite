"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kpiTemplates = void 0;
exports.kpiTemplates = [
    {
        name: 'New Leads Generated',
        description: 'Track daily, weekly, or monthly new leads generated from various sources',
        category: 'financial',
        template_type: 'system',
        formula_expression: 'COUNT(leads)',
        formula_fields: [
            {
                field_name: 'leads',
                field_type: 'number',
                table_name: 'leads',
                column_name: 'id',
                aggregation_type: 'count',
                display_name: 'New Leads',
                description: 'Number of new leads generated'
            }
        ],
        threshold_config: {
            green: 50,
            yellow: 25,
            red: 10,
            unit: 'leads'
        },
        chart_config: {
            type: 'line',
            colorScheme: ['#3b82f6']
        },
        data_source_config: {
            table: 'leads',
            timeRange: 'daily'
        },
        tags: ['sales', 'leads', 'pipeline', 'growth'],
        is_public: true,
        is_featured: true
    },
    {
        name: 'Lead-to-Customer Conversion Rate',
        description: 'Percentage of leads that convert to paying customers',
        category: 'financial',
        template_type: 'system',
        formula_expression: '(COUNT(converted_leads) / COUNT(total_leads)) * 100',
        formula_fields: [
            {
                field_name: 'converted_leads',
                field_type: 'number',
                table_name: 'leads',
                column_name: 'status',
                aggregation_type: 'count',
                display_name: 'Converted Leads',
                description: 'Leads that became customers'
            },
            {
                field_name: 'total_leads',
                field_type: 'number',
                table_name: 'leads',
                column_name: 'id',
                aggregation_type: 'count',
                display_name: 'Total Leads',
                description: 'All leads generated'
            }
        ],
        threshold_config: {
            green: 25,
            yellow: 15,
            red: 5,
            unit: '%'
        },
        chart_config: {
            type: 'gauge',
            colorScheme: ['#ef4444', '#f59e0b', '#10b981']
        },
        data_source_config: {
            table: 'leads',
            timeRange: 'monthly'
        },
        tags: ['sales', 'conversion', 'pipeline', 'efficiency'],
        is_public: true,
        is_featured: true
    },
    {
        name: 'Quote/Estimate Acceptance Rate',
        description: 'Percentage of quotes/estimates that are accepted by customers',
        category: 'financial',
        template_type: 'system',
        formula_expression: '(COUNT(accepted_quotes) / COUNT(total_quotes)) * 100',
        formula_fields: [
            {
                field_name: 'accepted_quotes',
                field_type: 'number',
                table_name: 'quotes',
                column_name: 'status',
                aggregation_type: 'count',
                display_name: 'Accepted Quotes',
                description: 'Quotes that were accepted'
            },
            {
                field_name: 'total_quotes',
                field_type: 'number',
                table_name: 'quotes',
                column_name: 'id',
                aggregation_type: 'count',
                display_name: 'Total Quotes',
                description: 'All quotes generated'
            }
        ],
        threshold_config: {
            green: 40,
            yellow: 25,
            red: 15,
            unit: '%'
        },
        chart_config: {
            type: 'gauge',
            colorScheme: ['#ef4444', '#f59e0b', '#10b981']
        },
        data_source_config: {
            table: 'quotes',
            timeRange: 'monthly'
        },
        tags: ['sales', 'quotes', 'estimates', 'acceptance'],
        is_public: true,
        is_featured: false
    },
    {
        name: 'Average Deal Size',
        description: 'Average value of closed deals and contracts',
        category: 'financial',
        template_type: 'system',
        formula_expression: 'AVG(deal_value)',
        formula_fields: [
            {
                field_name: 'deal_value',
                field_type: 'number',
                table_name: 'contracts',
                column_name: 'contract_value',
                aggregation_type: 'avg',
                display_name: 'Deal Value',
                description: 'Value of individual deals'
            }
        ],
        threshold_config: {
            green: 5000,
            yellow: 3000,
            red: 1500,
            unit: '$'
        },
        chart_config: {
            type: 'bar',
            colorScheme: ['#8b5cf6']
        },
        data_source_config: {
            table: 'contracts',
            timeRange: 'monthly'
        },
        tags: ['sales', 'deals', 'value', 'contracts'],
        is_public: true,
        is_featured: true
    },
    {
        name: 'Sales Pipeline Value',
        description: 'Total value of open opportunities by stage',
        category: 'financial',
        template_type: 'system',
        formula_expression: 'SUM(opportunity_value)',
        formula_fields: [
            {
                field_name: 'opportunity_value',
                field_type: 'number',
                table_name: 'opportunities',
                column_name: 'value',
                aggregation_type: 'sum',
                display_name: 'Opportunity Value',
                description: 'Value of open opportunities'
            }
        ],
        threshold_config: {
            green: 100000,
            yellow: 50000,
            red: 25000,
            unit: '$'
        },
        chart_config: {
            type: 'funnel',
            colorScheme: ['#f59e0b', '#10b981', '#3b82f6', '#ef4444']
        },
        data_source_config: {
            table: 'opportunities',
            timeRange: 'monthly'
        },
        tags: ['sales', 'pipeline', 'opportunities', 'value'],
        is_public: true,
        is_featured: true
    },
    {
        name: 'Sales Cycle Length',
        description: 'Average time from lead generation to deal closure',
        category: 'financial',
        template_type: 'system',
        formula_expression: 'AVG(DATEDIFF(closed_date, created_date))',
        formula_fields: [
            {
                field_name: 'cycle_length',
                field_type: 'number',
                table_name: 'deals',
                column_name: 'days_to_close',
                aggregation_type: 'avg',
                display_name: 'Cycle Length',
                description: 'Days from lead to close'
            }
        ],
        threshold_config: {
            green: 30,
            yellow: 60,
            red: 90,
            unit: 'days'
        },
        chart_config: {
            type: 'line',
            colorScheme: ['#ef4444']
        },
        data_source_config: {
            table: 'deals',
            timeRange: 'monthly'
        },
        tags: ['sales', 'cycle', 'efficiency', 'time'],
        is_public: true,
        is_featured: false
    },
    {
        name: 'Jobs Scheduled vs Jobs Completed',
        description: 'Ratio of scheduled jobs to completed jobs',
        category: 'operational',
        template_type: 'system',
        formula_expression: '(COUNT(completed_jobs) / COUNT(scheduled_jobs)) * 100',
        formula_fields: [
            {
                field_name: 'completed_jobs',
                field_type: 'number',
                table_name: 'jobs',
                column_name: 'status',
                aggregation_type: 'count',
                display_name: 'Completed Jobs',
                description: 'Jobs marked as completed'
            },
            {
                field_name: 'scheduled_jobs',
                field_type: 'number',
                table_name: 'jobs',
                column_name: 'id',
                aggregation_type: 'count',
                display_name: 'Scheduled Jobs',
                description: 'All scheduled jobs'
            }
        ],
        threshold_config: {
            green: 95,
            yellow: 85,
            red: 75,
            unit: '%'
        },
        chart_config: {
            type: 'gauge',
            colorScheme: ['#ef4444', '#f59e0b', '#10b981']
        },
        data_source_config: {
            table: 'jobs',
            timeRange: 'weekly'
        },
        tags: ['operations', 'jobs', 'completion', 'efficiency'],
        is_public: true,
        is_featured: true
    },
    {
        name: 'First-Time Fix Rate',
        description: 'Percentage of jobs completed successfully on the first visit',
        category: 'operational',
        template_type: 'system',
        formula_expression: '(COUNT(first_time_fixes) / COUNT(total_jobs)) * 100',
        formula_fields: [
            {
                field_name: 'first_time_fixes',
                field_type: 'number',
                table_name: 'jobs',
                column_name: 'first_visit_complete',
                aggregation_type: 'count',
                display_name: 'First-Time Fixes',
                description: 'Jobs completed on first visit'
            },
            {
                field_name: 'total_jobs',
                field_type: 'number',
                table_name: 'jobs',
                column_name: 'id',
                aggregation_type: 'count',
                display_name: 'Total Jobs',
                description: 'All jobs attempted'
            }
        ],
        threshold_config: {
            green: 85,
            yellow: 70,
            red: 55,
            unit: '%'
        },
        chart_config: {
            type: 'gauge',
            colorScheme: ['#ef4444', '#f59e0b', '#10b981']
        },
        data_source_config: {
            table: 'jobs',
            timeRange: 'monthly'
        },
        tags: ['operations', 'efficiency', 'first-time', 'fix-rate'],
        is_public: true,
        is_featured: true
    },
    {
        name: 'Technician Utilization Rate',
        description: 'Percentage of available hours that technicians are billable',
        category: 'operational',
        template_type: 'system',
        formula_expression: '(SUM(billable_hours) / SUM(total_available_hours)) * 100',
        formula_fields: [
            {
                field_name: 'billable_hours',
                field_type: 'number',
                table_name: 'technician_hours',
                column_name: 'billable_hours',
                aggregation_type: 'sum',
                display_name: 'Billable Hours',
                description: 'Hours spent on billable work'
            },
            {
                field_name: 'total_available_hours',
                field_type: 'number',
                table_name: 'technician_hours',
                column_name: 'available_hours',
                aggregation_type: 'sum',
                display_name: 'Available Hours',
                description: 'Total available working hours'
            }
        ],
        threshold_config: {
            green: 80,
            yellow: 65,
            red: 50,
            unit: '%'
        },
        chart_config: {
            type: 'gauge',
            colorScheme: ['#ef4444', '#f59e0b', '#10b981']
        },
        data_source_config: {
            table: 'technician_hours',
            timeRange: 'weekly'
        },
        tags: ['operations', 'utilization', 'technicians', 'efficiency'],
        is_public: true,
        is_featured: true
    },
    {
        name: 'Job Completion Time',
        description: 'Average duration to complete jobs',
        category: 'operational',
        template_type: 'system',
        formula_expression: 'AVG(job_duration)',
        formula_fields: [
            {
                field_name: 'job_duration',
                field_type: 'number',
                table_name: 'jobs',
                column_name: 'duration_minutes',
                aggregation_type: 'avg',
                display_name: 'Job Duration',
                description: 'Time to complete jobs in minutes'
            }
        ],
        threshold_config: {
            green: 60,
            yellow: 120,
            red: 180,
            unit: 'minutes'
        },
        chart_config: {
            type: 'line',
            colorScheme: ['#ef4444']
        },
        data_source_config: {
            table: 'jobs',
            timeRange: 'weekly'
        },
        tags: ['operations', 'duration', 'efficiency', 'time'],
        is_public: true,
        is_featured: false
    },
    {
        name: 'On-Time Arrival %',
        description: 'Percentage of technicians arriving on time to scheduled appointments',
        category: 'operational',
        template_type: 'system',
        formula_expression: '(COUNT(on_time_arrivals) / COUNT(total_appointments)) * 100',
        formula_fields: [
            {
                field_name: 'on_time_arrivals',
                field_type: 'number',
                table_name: 'appointments',
                column_name: 'on_time',
                aggregation_type: 'count',
                display_name: 'On-Time Arrivals',
                description: 'Appointments where technician arrived on time'
            },
            {
                field_name: 'total_appointments',
                field_type: 'number',
                table_name: 'appointments',
                column_name: 'id',
                aggregation_type: 'count',
                display_name: 'Total Appointments',
                description: 'All scheduled appointments'
            }
        ],
        threshold_config: {
            green: 95,
            yellow: 85,
            red: 75,
            unit: '%'
        },
        chart_config: {
            type: 'gauge',
            colorScheme: ['#ef4444', '#f59e0b', '#10b981']
        },
        data_source_config: {
            table: 'appointments',
            timeRange: 'weekly'
        },
        tags: ['operations', 'punctuality', 'customer-service', 'reliability'],
        is_public: true,
        is_featured: true
    },
    {
        name: 'Work Order Backlog',
        description: 'Number of jobs waiting to be scheduled or completed',
        category: 'operational',
        template_type: 'system',
        formula_expression: 'COUNT(backlog_jobs)',
        formula_fields: [
            {
                field_name: 'backlog_jobs',
                field_type: 'number',
                table_name: 'work_orders',
                column_name: 'id',
                aggregation_type: 'count',
                display_name: 'Backlog Jobs',
                description: 'Jobs waiting to be scheduled or completed'
            }
        ],
        threshold_config: {
            green: 10,
            yellow: 25,
            red: 50,
            unit: 'jobs'
        },
        chart_config: {
            type: 'bar',
            colorScheme: ['#ef4444']
        },
        data_source_config: {
            table: 'work_orders',
            timeRange: 'daily'
        },
        tags: ['operations', 'backlog', 'capacity', 'planning'],
        is_public: true,
        is_featured: false
    },
    {
        name: 'Repeat Service Calls',
        description: 'Percentage of jobs that require repeat visits',
        category: 'operational',
        template_type: 'system',
        formula_expression: '(COUNT(repeat_calls) / COUNT(total_jobs)) * 100',
        formula_fields: [
            {
                field_name: 'repeat_calls',
                field_type: 'number',
                table_name: 'jobs',
                column_name: 'is_repeat_visit',
                aggregation_type: 'count',
                display_name: 'Repeat Calls',
                description: 'Jobs requiring multiple visits'
            },
            {
                field_name: 'total_jobs',
                field_type: 'number',
                table_name: 'jobs',
                column_name: 'id',
                aggregation_type: 'count',
                display_name: 'Total Jobs',
                description: 'All jobs completed'
            }
        ],
        threshold_config: {
            green: 5,
            yellow: 15,
            red: 25,
            unit: '%'
        },
        chart_config: {
            type: 'gauge',
            colorScheme: ['#10b981', '#f59e0b', '#ef4444']
        },
        data_source_config: {
            table: 'jobs',
            timeRange: 'monthly'
        },
        tags: ['operations', 'efficiency', 'quality', 'repeat-calls'],
        is_public: true,
        is_featured: true
    },
    {
        name: 'Customer Retention Rate',
        description: 'Percentage of customers retained over a specific period',
        category: 'customer',
        template_type: 'system',
        formula_expression: '((COUNT(retained_customers) / COUNT(total_customers)) * 100)',
        formula_fields: [
            {
                field_name: 'retained_customers',
                field_type: 'number',
                table_name: 'customers',
                column_name: 'is_active',
                aggregation_type: 'count',
                display_name: 'Retained Customers',
                description: 'Customers who remained active'
            },
            {
                field_name: 'total_customers',
                field_type: 'number',
                table_name: 'customers',
                column_name: 'id',
                aggregation_type: 'count',
                display_name: 'Total Customers',
                description: 'All customers at period start'
            }
        ],
        threshold_config: {
            green: 90,
            yellow: 80,
            red: 70,
            unit: '%'
        },
        chart_config: {
            type: 'gauge',
            colorScheme: ['#ef4444', '#f59e0b', '#10b981']
        },
        data_source_config: {
            table: 'customers',
            timeRange: 'annually'
        },
        tags: ['customer', 'retention', 'loyalty', 'success'],
        is_public: true,
        is_featured: true
    },
    {
        name: 'Churn Rate',
        description: 'Percentage of customers lost over a specific period',
        category: 'customer',
        template_type: 'system',
        formula_expression: '(COUNT(churned_customers) / COUNT(total_customers)) * 100',
        formula_fields: [
            {
                field_name: 'churned_customers',
                field_type: 'number',
                table_name: 'customers',
                column_name: 'churn_date',
                aggregation_type: 'count',
                display_name: 'Churned Customers',
                description: 'Customers who left during period'
            },
            {
                field_name: 'total_customers',
                field_type: 'number',
                table_name: 'customers',
                column_name: 'id',
                aggregation_type: 'count',
                display_name: 'Total Customers',
                description: 'All customers at period start'
            }
        ],
        threshold_config: {
            green: 5,
            yellow: 10,
            red: 20,
            unit: '%'
        },
        chart_config: {
            type: 'gauge',
            colorScheme: ['#10b981', '#f59e0b', '#ef4444']
        },
        data_source_config: {
            table: 'customers',
            timeRange: 'monthly'
        },
        tags: ['customer', 'churn', 'retention', 'loss'],
        is_public: true,
        is_featured: true
    },
    {
        name: 'Customer Lifetime Value (CLV)',
        description: 'Average revenue generated per customer over their lifetime',
        category: 'customer',
        template_type: 'system',
        formula_expression: 'AVG(customer_revenue)',
        formula_fields: [
            {
                field_name: 'customer_revenue',
                field_type: 'number',
                table_name: 'customer_revenue',
                column_name: 'total_revenue',
                aggregation_type: 'avg',
                display_name: 'Customer Revenue',
                description: 'Total revenue per customer'
            }
        ],
        threshold_config: {
            green: 10000,
            yellow: 5000,
            red: 2000,
            unit: '$'
        },
        chart_config: {
            type: 'bar',
            colorScheme: ['#8b5cf6']
        },
        data_source_config: {
            table: 'customer_revenue',
            timeRange: 'monthly'
        },
        tags: ['customer', 'value', 'revenue', 'lifetime'],
        is_public: true,
        is_featured: true
    },
    {
        name: 'Net Promoter Score (NPS)',
        description: 'Customer satisfaction metric based on likelihood to recommend',
        category: 'customer',
        template_type: 'system',
        formula_expression: '((COUNT(promoters) - COUNT(detractors)) / COUNT(total_responses)) * 100',
        formula_fields: [
            {
                field_name: 'promoters',
                field_type: 'number',
                table_name: 'nps_surveys',
                column_name: 'score',
                aggregation_type: 'count',
                display_name: 'Promoters',
                description: 'Customers rating 9-10'
            },
            {
                field_name: 'detractors',
                field_type: 'number',
                table_name: 'nps_surveys',
                column_name: 'score',
                aggregation_type: 'count',
                display_name: 'Detractors',
                description: 'Customers rating 0-6'
            },
            {
                field_name: 'total_responses',
                field_type: 'number',
                table_name: 'nps_surveys',
                column_name: 'id',
                aggregation_type: 'count',
                display_name: 'Total Responses',
                description: 'All survey responses'
            }
        ],
        threshold_config: {
            green: 50,
            yellow: 0,
            red: -50,
            unit: 'NPS'
        },
        chart_config: {
            type: 'gauge',
            colorScheme: ['#ef4444', '#f59e0b', '#10b981']
        },
        data_source_config: {
            table: 'nps_surveys',
            timeRange: 'monthly'
        },
        tags: ['customer', 'satisfaction', 'nps', 'recommendation'],
        is_public: true,
        is_featured: true
    },
    {
        name: 'Revenue per Job',
        description: 'Average revenue generated per completed job',
        category: 'financial',
        template_type: 'system',
        formula_expression: 'AVG(job_revenue)',
        formula_fields: [
            {
                field_name: 'job_revenue',
                field_type: 'number',
                table_name: 'jobs',
                column_name: 'revenue',
                aggregation_type: 'avg',
                display_name: 'Job Revenue',
                description: 'Revenue per individual job'
            }
        ],
        threshold_config: {
            green: 500,
            yellow: 300,
            red: 150,
            unit: '$'
        },
        chart_config: {
            type: 'bar',
            colorScheme: ['#8b5cf6']
        },
        data_source_config: {
            table: 'jobs',
            timeRange: 'monthly'
        },
        tags: ['financial', 'revenue', 'jobs', 'efficiency'],
        is_public: true,
        is_featured: true
    },
    {
        name: 'Recurring Revenue %',
        description: 'Percentage of total revenue from recurring contracts and subscriptions',
        category: 'financial',
        template_type: 'system',
        formula_expression: '(SUM(recurring_revenue) / SUM(total_revenue)) * 100',
        formula_fields: [
            {
                field_name: 'recurring_revenue',
                field_type: 'number',
                table_name: 'recurring_contracts',
                column_name: 'monthly_revenue',
                aggregation_type: 'sum',
                display_name: 'Recurring Revenue',
                description: 'Revenue from recurring sources'
            },
            {
                field_name: 'total_revenue',
                field_type: 'number',
                table_name: 'invoices',
                column_name: 'total_amount',
                aggregation_type: 'sum',
                display_name: 'Total Revenue',
                description: 'All revenue generated'
            }
        ],
        threshold_config: {
            green: 60,
            yellow: 40,
            red: 20,
            unit: '%'
        },
        chart_config: {
            type: 'gauge',
            colorScheme: ['#ef4444', '#f59e0b', '#10b981']
        },
        data_source_config: {
            table: 'recurring_contracts',
            timeRange: 'monthly'
        },
        tags: ['financial', 'recurring', 'predictable', 'revenue'],
        is_public: true,
        is_featured: true
    },
    {
        name: 'Gross Margin per Service',
        description: 'Profit margin after direct costs for each service type',
        category: 'financial',
        template_type: 'system',
        formula_expression: '((SUM(service_revenue) - SUM(service_costs)) / SUM(service_revenue)) * 100',
        formula_fields: [
            {
                field_name: 'service_revenue',
                field_type: 'number',
                table_name: 'service_revenue',
                column_name: 'revenue',
                aggregation_type: 'sum',
                display_name: 'Service Revenue',
                description: 'Revenue from specific service'
            },
            {
                field_name: 'service_costs',
                field_type: 'number',
                table_name: 'service_costs',
                column_name: 'direct_costs',
                aggregation_type: 'sum',
                display_name: 'Service Costs',
                description: 'Direct costs for service'
            }
        ],
        threshold_config: {
            green: 40,
            yellow: 25,
            red: 15,
            unit: '%'
        },
        chart_config: {
            type: 'bar',
            colorScheme: ['#8b5cf6']
        },
        data_source_config: {
            table: 'service_revenue',
            timeRange: 'monthly'
        },
        tags: ['financial', 'margin', 'profitability', 'services'],
        is_public: true,
        is_featured: true
    },
    {
        name: 'New Customers Acquired',
        description: 'Number of new customers acquired in a specific time period',
        category: 'financial',
        template_type: 'system',
        formula_expression: 'COUNT(new_customers)',
        formula_fields: [
            {
                field_name: 'new_customers',
                field_type: 'number',
                table_name: 'customers',
                column_name: 'id',
                aggregation_type: 'count',
                display_name: 'New Customers',
                description: 'Customers acquired in period'
            }
        ],
        threshold_config: {
            green: 50,
            yellow: 25,
            red: 10,
            unit: 'customers'
        },
        chart_config: {
            type: 'line',
            colorScheme: ['#3b82f6']
        },
        data_source_config: {
            table: 'customers',
            timeRange: 'monthly'
        },
        tags: ['growth', 'customers', 'acquisition', 'expansion'],
        is_public: true,
        is_featured: true
    },
    {
        name: 'Customer Growth %',
        description: 'Percentage growth in customer base over time',
        category: 'financial',
        template_type: 'system',
        formula_expression: '((COUNT(current_customers) - COUNT(previous_customers)) / COUNT(previous_customers)) * 100',
        formula_fields: [
            {
                field_name: 'current_customers',
                field_type: 'number',
                table_name: 'customers',
                column_name: 'id',
                aggregation_type: 'count',
                display_name: 'Current Customers',
                description: 'Customers at end of period'
            },
            {
                field_name: 'previous_customers',
                field_type: 'number',
                table_name: 'customers',
                column_name: 'id',
                aggregation_type: 'count',
                display_name: 'Previous Customers',
                description: 'Customers at start of period'
            }
        ],
        threshold_config: {
            green: 20,
            yellow: 5,
            red: -5,
            unit: '%'
        },
        chart_config: {
            type: 'line',
            colorScheme: ['#3b82f6']
        },
        data_source_config: {
            table: 'customers',
            timeRange: 'monthly'
        },
        tags: ['growth', 'customers', 'expansion', 'percentage'],
        is_public: true,
        is_featured: true
    }
];
//# sourceMappingURL=kpi-templates-clean.js.map