# Backend Patterns Policy Tests (R11)

package verofield.backend

import future.keywords.if

# ============================================================================
# Test Case 1: Happy Path - Thin Controller with Proper Service
# ============================================================================

test_thin_controller_passes if {
    input := {
        "files": [{
            "path": "apps/api/src/users/users.controller.ts",
            "content": `
                @Controller('users')
                @UseGuards(JwtAuthGuard)
                export class UsersController {
                    constructor(private readonly usersService: UsersService) {}
                    
                    @Post()
                    async create(@Body() createUserDto: CreateUserDto, @Request() req: any) {
                        return this.usersService.create(createUserDto, req.user.tenantId);
                    }
                }
            `
        }],
        "pr_description": "Add user creation endpoint"
    }
    
    count(deny) == 0
}

# ============================================================================
# Test Case 2: Happy Path - Service with Business Logic
# ============================================================================

test_service_with_business_logic_passes if {
    input := {
        "files": [{
            "path": "apps/api/src/users/users.service.ts",
            "content": `
                @Injectable()
                export class UsersService {
                    async create(data: CreateUserDto, tenantId: string) {
                        // Validation
                        if (await this.userExists(data.email, tenantId)) {
                            throw new ConflictException('User already exists');
                        }
                        
                        // Transaction
                        return await this.prisma.$transaction(async (tx) => {
                            const user = await tx.user.create({
                                data: { ...data, tenant_id: tenantId }
                            });
                            await this.audit.log('USER_CREATED', user.id, tenantId);
                            return user;
                        });
                    }
                }
            `
        }],
        "pr_description": "Add user service"
    }
    
    count(deny) == 0
}

# ============================================================================
# Test Case 3: Happy Path - DTO with Validation
# ============================================================================

test_dto_with_validation_passes if {
    input := {
        "files": [{
            "path": "apps/api/src/users/dto/create-user.dto.ts",
            "content": `
                export class CreateUserDto {
                    @ApiProperty()
                    @IsEmail()
                    email!: string;
                    
                    @ApiProperty()
                    @IsString()
                    @Length(1, 100)
                    firstName!: string;
                }
            `
        }],
        "pr_description": "Add user DTO"
    }
    
    count(deny) == 0
}

# ============================================================================
# Test Case 4: Violation - Business Logic in Controller
# ============================================================================

test_business_logic_in_controller_fails if {
    input := {
        "files": [{
            "path": "apps/api/src/users/users.controller.ts",
            "content": `
                @Controller('users')
                export class UsersController {
                    @Post()
                    async create(@Body() data: any, @Request() req: any) {
                        // Business logic in controller - VIOLATION
                        const user = await this.prisma.user.findFirst({
                            where: { email: data.email }
                        });
                        if (user) throw new Error('User exists');
                        return await this.prisma.user.create({ data });
                    }
                }
            `
        }],
        "pr_description": "Add user endpoint"
    }
    
    count(deny) > 0
}

# ============================================================================
# Test Case 5: Violation - Missing DTO
# ============================================================================

test_missing_dto_fails if {
    input := {
        "files": [{
            "path": "apps/api/src/users/users.controller.ts",
            "content": `
                @Controller('users')
                export class UsersController {
                    @Post()
                    async create(@Body() data: any, @Request() req: any) {
                        return this.usersService.create(data, req.user.tenantId);
                    }
                }
            `
        }],
        "pr_description": "Add user endpoint"
    }
    
    count(deny) > 0
}

# ============================================================================
# Test Case 6: Violation - Tenant-Scoped Query Without Tenant Filter
# ============================================================================

test_missing_tenant_filter_fails if {
    input := {
        "files": [{
            "path": "apps/api/src/users/users.service.ts",
            "content": `
                @Injectable()
                export class UsersService {
                    async findAll() {
                        // Missing tenant_id filter - VIOLATION
                        return await this.prisma.user.findMany();
                    }
                }
            `
        }],
        "pr_description": "Add user service"
    }
    
    count(deny) > 0
}

# ============================================================================
# Test Case 7: Violation - Multi-Step Operation Without Transaction
# ============================================================================

test_missing_transaction_fails if {
    input := {
        "files": [{
            "path": "apps/api/src/users/users.service.ts",
            "content": `
                @Injectable()
                export class UsersService {
                    async create(data: CreateUserDto, tenantId: string) {
                        // Multi-step without transaction - VIOLATION
                        const user = await this.prisma.user.create({
                            data: { ...data, tenant_id: tenantId }
                        });
                        await this.prisma.auditLog.create({
                            data: { action: 'USER_CREATED', entity_id: user.id }
                        });
                        return user;
                    }
                }
            `
        }],
        "pr_description": "Add user service"
    }
    
    count(deny) > 0
}

# ============================================================================
# Test Case 8: Violation - DTO with 'any' Type
# ============================================================================

test_dto_with_any_type_fails if {
    input := {
        "files": [{
            "path": "apps/api/src/users/dto/create-user.dto.ts",
            "content": `
                export class CreateUserDto {
                    email: any;  // VIOLATION
                    firstName: any;  // VIOLATION
                }
            `
        }],
        "pr_description": "Add user DTO"
    }
    
    count(deny) > 0
}

# ============================================================================
# Test Case 9: Warning - Service Pass-Through
# ============================================================================

test_service_passthrough_warns if {
    input := {
        "files": [{
            "path": "apps/api/src/users/users.service.ts",
            "content": `
                @Injectable()
                export class UsersService {
                    async findById(id: string, tenantId: string) {
                        return this.prisma.user.findUnique({
                            where: { id, tenant_id: tenantId }
                        });
                    }
                }
            `
        }],
        "pr_description": "Add user service"
    }
    
    count(warn) > 0
}

# ============================================================================
# Test Case 10: Override - With Marker
# ============================================================================

test_override_with_marker_passes if {
    input := {
        "files": [{
            "path": "apps/api/src/users/users.controller.ts",
            "content": `
                @Controller('users')
                export class UsersController {
                    @Post()
                    async create(@Body() data: any, @Request() req: any) {
                        // Temporary: Migrating to DTOs
                        // @override:backend-patterns
                        return this.usersService.create(data, req.user.tenantId);
                    }
                }
            `
        }],
        "pr_description": "Add user endpoint\n\n@override:backend-patterns\nJustification: Temporary migration, DTOs will be added in next PR"
    }
    
    count(deny) == 0
}

# ============================================================================
# Test Case 11: Edge Case - Repository Pattern (Pass-Through Allowed)
# ============================================================================

test_repository_pattern_passes if {
    input := {
        "files": [{
            "path": "apps/api/src/users/users.repository.ts",
            "content": `
                @Injectable()
                export class UsersRepository {
                    // Repository pattern - simple CRUD allowed
                    async findById(id: string, tenantId: string) {
                        return this.prisma.user.findUnique({
                            where: { id, tenant_id: tenantId }
                        });
                    }
                }
            `
        }],
        "pr_description": "Add user repository"
    }
    
    count(deny) == 0
}

# ============================================================================
# Test Case 12: Edge Case - Complex Service with Multiple Dependencies
# ============================================================================

test_complex_service_passes if {
    input := {
        "files": [{
            "path": "apps/api/src/work-orders/work-orders.service.ts",
            "content": `
                @Injectable()
                export class WorkOrdersService {
                    constructor(
                        private readonly prisma: DatabaseService,
                        private readonly audit: AuditService,
                        private readonly logger: StructuredLoggerService
                    ) {}
                    
                    async create(data: CreateWorkOrderDto, tenantId: string, userId: string) {
                        // Validation
                        const customer = await this.prisma.account.findFirst({
                            where: { id: data.customer_id, tenant_id: tenantId }
                        });
                        if (!customer) {
                            throw new NotFoundException('Customer not found');
                        }
                        
                        // Transaction
                        return await this.prisma.$transaction(async (tx) => {
                            const workOrder = await tx.workOrder.create({
                                data: { ...data, tenant_id: tenantId }
                            });
                            
                            await tx.auditLog.create({
                                data: {
                                    action: 'WORK_ORDER_CREATED',
                                    entity_id: workOrder.id,
                                    tenant_id: tenantId,
                                    user_id: userId
                                }
                            });
                            
                            this.logger.info('Work order created', {
                                workOrderId: workOrder.id,
                                tenantId
                            });
                            
                            return workOrder;
                        });
                    }
                }
            `
        }],
        "pr_description": "Add work order service"
    }
    
    count(deny) == 0
}

# ============================================================================
# Metadata
# ============================================================================

test_metadata if {
    metadata.rule_id == "R11"
    metadata.tier == 2
    metadata.enforcement == "OVERRIDE"
}



