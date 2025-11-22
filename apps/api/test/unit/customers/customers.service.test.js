"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const customers_service_1 = require("../../../src/customers/customers.service");
const prisma_service_1 = require("../../../src/prisma/prisma.service");
const enterprise_setup_1 = require("../../setup/enterprise-setup");
describe('CustomersService', () => {
    let service;
    let prismaService;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                customers_service_1.CustomersService,
                {
                    provide: prisma_service_1.PrismaService,
                    useValue: {
                        customer: {
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                            create: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn(),
                            count: jest.fn()
                        },
                        workOrder: {
                            findMany: jest.fn()
                        }
                    }
                }
            ]
        }).compile();
        service = module.get(customers_service_1.CustomersService);
        prismaService = module.get(prisma_service_1.PrismaService);
    });
    describe('Customer Creation', () => {
        it('should create customer with valid data', async () => {
            const customerData = enterprise_setup_1.MockFactory.createCustomer();
            const mockCustomer = Object.assign(Object.assign({}, customerData), { id: 'new-customer-id' });
            jest.spyOn(prismaService.customer, 'create').mockResolvedValue(mockCustomer);
            const result = await service.createCustomer(customerData);
            expect(result).toEqual(mockCustomer);
            expect(prismaService.customer.create).toHaveBeenCalledWith({
                data: customerData
            });
        });
        it('should validate required fields', async () => {
            const invalidData = {
                first_name: '',
                last_name: '',
                email: 'invalid-email',
                phone: '123'
            };
            await expect(service.createCustomer(invalidData))
                .rejects.toThrow('Validation failed');
        });
        it('should prevent duplicate email addresses', async () => {
            const customerData = enterprise_setup_1.MockFactory.createCustomer();
            jest.spyOn(prismaService.customer, 'findUnique').mockResolvedValue(customerData);
            await expect(service.createCustomer(customerData))
                .rejects.toThrow('Customer with this email already exists');
        });
        it('should enforce tenant isolation', async () => {
            const customerData = enterprise_setup_1.MockFactory.createCustomer({ tenant_id: 'tenant-1' });
            jest.spyOn(prismaService.customer, 'create').mockResolvedValue(customerData);
            const result = await service.createCustomer(customerData, 'tenant-1');
            expect(result.tenant_id).toBe('tenant-1');
            expect(prismaService.customer.create).toHaveBeenCalledWith({
                data: Object.assign(Object.assign({}, customerData), { tenant_id: 'tenant-1' })
            });
        });
    });
    describe('Customer Retrieval', () => {
        it('should retrieve customer by ID', async () => {
            const mockCustomer = enterprise_setup_1.MockFactory.createCustomer();
            jest.spyOn(prismaService.customer, 'findUnique').mockResolvedValue(mockCustomer);
            const result = await service.getCustomerById('customer-123');
            expect(result).toEqual(mockCustomer);
            expect(prismaService.customer.findUnique).toHaveBeenCalledWith({
                where: { id: 'customer-123' }
            });
        });
        it('should retrieve customers with pagination', async () => {
            const mockCustomers = [
                enterprise_setup_1.MockFactory.createCustomer({ id: 'customer-1' }),
                enterprise_setup_1.MockFactory.createCustomer({ id: 'customer-2' }),
                enterprise_setup_1.MockFactory.createCustomer({ id: 'customer-3' })
            ];
            jest.spyOn(prismaService.customer, 'findMany').mockResolvedValue(mockCustomers);
            jest.spyOn(prismaService.customer, 'count').mockResolvedValue(3);
            const result = await service.getCustomers({ page: 1, limit: 10 });
            expect(result.customers).toEqual(mockCustomers);
            expect(result.total).toBe(3);
            expect(result.page).toBe(1);
            expect(result.limit).toBe(10);
        });
        it('should search customers by criteria', async () => {
            const searchCriteria = {
                name: 'John',
                email: 'john@example.com',
                phone: '555-1234'
            };
            const mockCustomers = [enterprise_setup_1.MockFactory.createCustomer()];
            jest.spyOn(prismaService.customer, 'findMany').mockResolvedValue(mockCustomers);
            const result = await service.searchCustomers(searchCriteria);
            expect(result).toEqual(mockCustomers);
            expect(prismaService.customer.findMany).toHaveBeenCalledWith({
                where: {
                    OR: [
                        { first_name: { contains: 'John' } },
                        { last_name: { contains: 'John' } },
                        { email: { contains: 'john@example.com' } },
                        { phone: { contains: '555-1234' } }
                    ]
                }
            });
        });
        it('should handle empty search results', async () => {
            jest.spyOn(prismaService.customer, 'findMany').mockResolvedValue([]);
            const result = await service.searchCustomers({ name: 'nonexistent' });
            expect(result).toEqual([]);
        });
    });
    describe('Customer Updates', () => {
        it('should update customer with valid data', async () => {
            const customerId = 'customer-123';
            const updateData = {
                first_name: 'Updated',
                last_name: 'Name',
                email: 'updated@example.com'
            };
            const mockUpdatedCustomer = enterprise_setup_1.MockFactory.createCustomer(updateData);
            jest.spyOn(prismaService.customer, 'update').mockResolvedValue(mockUpdatedCustomer);
            const result = await service.updateCustomer(customerId, updateData);
            expect(result).toEqual(mockUpdatedCustomer);
            expect(prismaService.customer.update).toHaveBeenCalledWith({
                where: { id: customerId },
                data: updateData
            });
        });
        it('should validate update data', async () => {
            const invalidUpdateData = {
                email: 'invalid-email-format',
                phone: '123'
            };
            await expect(service.updateCustomer('customer-123', invalidUpdateData))
                .rejects.toThrow('Validation failed');
        });
        it('should prevent updating non-existent customer', async () => {
            jest.spyOn(prismaService.customer, 'findUnique').mockResolvedValue(null);
            await expect(service.updateCustomer('nonexistent-id', { first_name: 'Updated' }))
                .rejects.toThrow('Customer not found');
        });
        it('should maintain tenant isolation during updates', async () => {
            const customerId = 'customer-123';
            const updateData = { first_name: 'Updated' };
            jest.spyOn(prismaService.customer, 'findUnique').mockResolvedValue(enterprise_setup_1.MockFactory.createCustomer({ tenant_id: 'tenant-1' }));
            jest.spyOn(prismaService.customer, 'update').mockResolvedValue(enterprise_setup_1.MockFactory.createCustomer(Object.assign(Object.assign({}, updateData), { tenant_id: 'tenant-1' })));
            const result = await service.updateCustomer(customerId, updateData, 'tenant-1');
            expect(result.tenant_id).toBe('tenant-1');
        });
    });
    describe('Customer Deletion', () => {
        it('should delete customer successfully', async () => {
            const customerId = 'customer-123';
            jest.spyOn(prismaService.customer, 'findUnique').mockResolvedValue(enterprise_setup_1.MockFactory.createCustomer());
            jest.spyOn(prismaService.customer, 'delete').mockResolvedValue(enterprise_setup_1.MockFactory.createCustomer());
            const result = await service.deleteCustomer(customerId);
            expect(result).toBe(true);
            expect(prismaService.customer.delete).toHaveBeenCalledWith({
                where: { id: customerId }
            });
        });
        it('should prevent deleting customer with active work orders', async () => {
            const customerId = 'customer-123';
            jest.spyOn(prismaService.customer, 'findUnique').mockResolvedValue(enterprise_setup_1.MockFactory.createCustomer());
            jest.spyOn(prismaService.workOrder, 'findMany').mockResolvedValue([
                { id: 'work-order-1', status: 'in_progress' }
            ]);
            await expect(service.deleteCustomer(customerId))
                .rejects.toThrow('Cannot delete customer with active work orders');
        });
        it('should prevent deleting non-existent customer', async () => {
            jest.spyOn(prismaService.customer, 'findUnique').mockResolvedValue(null);
            await expect(service.deleteCustomer('nonexistent-id'))
                .rejects.toThrow('Customer not found');
        });
        it('should enforce tenant isolation during deletion', async () => {
            const customerId = 'customer-123';
            jest.spyOn(prismaService.customer, 'findUnique').mockResolvedValue(enterprise_setup_1.MockFactory.createCustomer({ tenant_id: 'tenant-1' }));
            jest.spyOn(prismaService.workOrder, 'findMany').mockResolvedValue([]);
            jest.spyOn(prismaService.customer, 'delete').mockResolvedValue(enterprise_setup_1.MockFactory.createCustomer());
            const result = await service.deleteCustomer(customerId, 'tenant-1');
            expect(result).toBe(true);
        });
    });
    describe('Data Validation', () => {
        it('should validate email format', async () => {
            const invalidEmails = [
                'invalid-email',
                '@example.com',
                'test@',
                'test..test@example.com'
            ];
            for (const email of invalidEmails) {
                await expect(service.validateEmail(email))
                    .rejects.toThrow('Invalid email format');
            }
        });
        it('should validate phone number format', async () => {
            const invalidPhones = [
                '123',
                'abc-def-ghij',
                '+1-555-',
                '555-123-4567-890'
            ];
            for (const phone of invalidPhones) {
                await expect(service.validatePhone(phone))
                    .rejects.toThrow('Invalid phone number format');
            }
        });
        it('should validate required fields', async () => {
            const incompleteData = {
                first_name: 'John',
            };
            await expect(service.validateCustomerData(incompleteData))
                .rejects.toThrow('Missing required fields');
        });
        it('should sanitize input data', async () => {
            const maliciousData = {
                first_name: '<script>alert("XSS")</script>',
                last_name: 'DROP TABLE customers; --',
                email: 'test@example.com',
                phone: '+1-555-1234'
            };
            const sanitizedData = await service.sanitizeCustomerData(maliciousData);
            expect(sanitizedData.first_name).not.toContain('<script>');
            expect(sanitizedData.last_name).not.toContain('DROP TABLE');
        });
    });
    describe('Security Tests', () => {
        it('should prevent SQL injection in search', async () => {
            const maliciousPayloads = enterprise_setup_1.SecurityTestUtils.generateMaliciousPayloads();
            for (const payload of maliciousPayloads.sqlInjection) {
                jest.spyOn(prismaService.customer, 'findMany').mockResolvedValue([]);
                await service.searchCustomers({ name: payload });
                expect(prismaService.customer.findMany).toHaveBeenCalledWith({
                    where: {
                        OR: [
                            { first_name: { contains: payload } },
                            { last_name: { contains: payload } }
                        ]
                    }
                });
            }
        });
        it('should prevent XSS attacks in customer data', async () => {
            const xssPayloads = enterprise_setup_1.SecurityTestUtils.generateMaliciousPayloads().xssPayloads;
            for (const payload of xssPayloads) {
                const customerData = enterprise_setup_1.MockFactory.createCustomer({
                    first_name: payload,
                    last_name: 'Test'
                });
                const sanitizedData = await service.sanitizeCustomerData(customerData);
                expect(sanitizedData.first_name).not.toContain('<script>');
                expect(sanitizedData.first_name).not.toContain('javascript:');
            }
        });
        it('should enforce data access permissions', async () => {
            const customerId = 'customer-123';
            const userTenantId = 'tenant-1';
            jest.spyOn(prismaService.customer, 'findUnique').mockResolvedValue(enterprise_setup_1.MockFactory.createCustomer({ tenant_id: 'tenant-2' }));
            await expect(service.getCustomerById(customerId, userTenantId))
                .rejects.toThrow('Access denied: Invalid tenant');
        });
        it('should prevent data leakage between tenants', async () => {
            const tenant1Customers = [
                enterprise_setup_1.MockFactory.createCustomer({ tenant_id: 'tenant-1', id: 'customer-1' }),
                enterprise_setup_1.MockFactory.createCustomer({ tenant_id: 'tenant-1', id: 'customer-2' })
            ];
            jest.spyOn(prismaService.customer, 'findMany').mockResolvedValue(tenant1Customers);
            const result = await service.getCustomers({}, 'tenant-1');
            expect(result.customers.every(customer => customer.tenant_id === 'tenant-1')).toBe(true);
        });
    });
    describe('Performance Tests', () => {
        it('should retrieve customers within performance threshold', async () => {
            const mockCustomers = Array.from({ length: 100 }, (_, i) => enterprise_setup_1.MockFactory.createCustomer({ id: `customer-${i}` }));
            jest.spyOn(prismaService.customer, 'findMany').mockResolvedValue(mockCustomers);
            jest.spyOn(prismaService.customer, 'count').mockResolvedValue(100);
            const startTime = performance.now();
            const result = await service.getCustomers({ page: 1, limit: 100 });
            const endTime = performance.now();
            expect(result.customers).toHaveLength(100);
            expect(endTime - startTime).toBeLessThan(200);
        });
        it('should handle large dataset searches efficiently', async () => {
            const mockCustomers = Array.from({ length: 1000 }, (_, i) => enterprise_setup_1.MockFactory.createCustomer({ id: `customer-${i}` }));
            jest.spyOn(prismaService.customer, 'findMany').mockResolvedValue(mockCustomers.slice(0, 10));
            const startTime = performance.now();
            const result = await service.searchCustomers({ name: 'John' });
            const endTime = performance.now();
            expect(result).toHaveLength(10);
            expect(endTime - startTime).toBeLessThan(500);
        });
        it('should handle concurrent customer operations', async () => {
            const mockCustomer = enterprise_setup_1.MockFactory.createCustomer();
            jest.spyOn(prismaService.customer, 'create').mockResolvedValue(mockCustomer);
            jest.spyOn(prismaService.customer, 'findUnique').mockResolvedValue(mockCustomer);
            const concurrentOperations = 10;
            const promises = [];
            for (let i = 0; i < concurrentOperations; i++) {
                promises.push(service.createCustomer(Object.assign(Object.assign({}, mockCustomer), { email: `user${i}@example.com` })));
            }
            const results = await Promise.all(promises);
            expect(results).toHaveLength(concurrentOperations);
        });
    });
    describe('Error Handling', () => {
        it('should handle database connection errors', async () => {
            jest.spyOn(prismaService.customer, 'findMany').mockRejectedValue(new Error('Connection timeout'));
            await expect(service.getCustomers())
                .rejects.toThrow('Connection timeout');
        });
        it('should handle validation errors gracefully', async () => {
            const invalidData = {
                first_name: '',
                email: 'invalid-email'
            };
            await expect(service.createCustomer(invalidData))
                .rejects.toThrow('Validation failed');
        });
        it('should handle constraint violations', async () => {
            jest.spyOn(prismaService.customer, 'create').mockRejectedValue(new Error('Unique constraint violation'));
            await expect(service.createCustomer(enterprise_setup_1.MockFactory.createCustomer()))
                .rejects.toThrow('Unique constraint violation');
        });
    });
    describe('Business Logic', () => {
        it('should calculate customer lifetime value', async () => {
            const customerId = 'customer-123';
            const mockWorkOrders = [
                { id: 'wo-1', total_amount: 100, status: 'completed' },
                { id: 'wo-2', total_amount: 150, status: 'completed' },
                { id: 'wo-3', total_amount: 200, status: 'completed' }
            ];
            jest.spyOn(prismaService.workOrder, 'findMany').mockResolvedValue(mockWorkOrders);
            const lifetimeValue = await service.calculateCustomerLifetimeValue(customerId);
            expect(lifetimeValue).toBe(450);
        });
        it('should identify high-value customers', async () => {
            const mockCustomers = [
                enterprise_setup_1.MockFactory.createCustomer({ id: 'customer-1' }),
                enterprise_setup_1.MockFactory.createCustomer({ id: 'customer-2' }),
                enterprise_setup_1.MockFactory.createCustomer({ id: 'customer-3' })
            ];
            jest.spyOn(prismaService.customer, 'findMany').mockResolvedValue(mockCustomers);
            jest.spyOn(service, 'calculateCustomerLifetimeValue')
                .mockResolvedValueOnce(1000)
                .mockResolvedValueOnce(500)
                .mockResolvedValueOnce(2000);
            const highValueCustomers = await service.getHighValueCustomers(1000);
            expect(highValueCustomers).toHaveLength(2);
        });
        it('should track customer activity', async () => {
            const customerId = 'customer-123';
            const activityData = {
                action: 'login',
                timestamp: new Date(),
                ip_address: '192.168.1.1'
            };
            const result = await service.trackCustomerActivity(customerId, activityData);
            expect(result).toBeDefined();
            expect(result.customer_id).toBe(customerId);
            expect(result.action).toBe('login');
        });
    });
});
//# sourceMappingURL=customers.service.test.js.map