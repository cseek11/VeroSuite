"""
Auto-fix hints and remediation suggestions for rule violations.

Provides centralized, consistent fix hints for common violation patterns.
This module ensures all violations have actionable guidance for developers.

Python Bible Chapter 11: Clean Architecture principles.
"""

from pathlib import Path
from typing import Optional


def secret_fix_hint(var_name: str) -> str:
    """
    Generate fix hint for hardcoded secret violations.
    
    Args:
        var_name: Name of the secret variable (e.g., "JWT_SECRET")
        
    Returns:
        Fix hint string with guidance
    """
    return (
        f"Move {var_name} into configuration.\n"
        f"Steps:\n"
        f"1. Add {var_name}=<value> to .env file (and .env.example for documentation)\n"
        f"2. Read via process.env.{var_name} or ConfigService.get('{var_name}')\n"
        f"3. Never commit secrets to version control\n"
        f"\nExample:\n"
        f"  // .env\n"
        f"  {var_name}=your-secret-value\n"
        f"\n  // In code\n"
        f"  const secret = process.env.{var_name};\n"
        f"  // or\n"
        f"  const secret = this.configService.get<string>('{var_name}');"
    )


def tenant_filter_fix_hint(model: str, op: str) -> str:
    """
    Generate fix hint for missing tenant filter in Prisma queries.
    
    Args:
        model: Prisma model name (e.g., "customer")
        op: Operation name (e.g., "findMany")
        
    Returns:
        Fix hint string with guidance
    """
    return (
        f"Add a tenant filter to the Prisma {model}.{op} call.\n"
        f"\nExample:\n"
        f"  await prisma.{model}.{op}({{\n"
        f"    where: {{ tenantId: currentUser.tenantId, /* other conditions */ }},\n"
        f"  }});\n"
        f"\nFor nested conditions:\n"
        f"  await prisma.{model}.{op}({{\n"
        f"    where: {{\n"
        f"      AND: [\n"
        f"        {{ tenantId: currentUser.tenantId }},\n"
        f"        {{ /* other conditions */ }}\n"
        f"      ]\n"
        f"    }},\n"
        f"  }});"
    )


def client_tenant_fix_hint() -> str:
    """
    Generate fix hint for client-provided tenantId violations.
    
    Returns:
        Fix hint string with guidance
    """
    return (
        "Tenant ID must be derived from authenticated identity, not client input.\n"
        "\nDo NOT use:\n"
        "  - req.body.tenantId\n"
        "  - req.query.tenantId\n"
        "  - req.params.tenantId\n"
        "\nInstead, use:\n"
        "  - currentUser.tenantId (from JWT/auth context)\n"
        "  - request.user.tenantId\n"
        "  - this.authService.getTenantId()\n"
        "\nExample:\n"
        "  const tenantId = currentUser.tenantId;\n"
        "  await prisma.customer.findMany({\n"
        "    where: { tenantId, /* other conditions */ }\n"
        "  });"
    )


def dto_missing_type_hint(controller_name: str, method_name: str, param_name: str) -> str:
    """
    Generate fix hint for missing DTO type on @Body() parameter.
    
    Args:
        controller_name: Name of the controller class
        method_name: Name of the method
        param_name: Name of the parameter
        
    Returns:
        Fix hint string with guidance
    """
    # Suggest a DTO name based on controller and method
    dto_name = f"{controller_name.replace('Controller', '')}{method_name.capitalize()}Dto"
    
    return (
        f"Create a DTO class for the @Body() parameter '{param_name}'.\n"
        f"\nSuggested DTO name: {dto_name}\n"
        f"\nExample:\n"
        f"  // {dto_name.lower()}.dto.ts\n"
        f"  import {{ IsString, IsEmail, IsOptional }} from 'class-validator';\n"
        f"\n"
        f"  export class {dto_name} {{\n"
        f"    @IsString()\n"
        f"    name: string;\n"
        f"\n"
        f"    @IsEmail()\n"
        f"    email: string;\n"
        f"  }}\n"
        f"\nThen use it:\n"
        f"  @Post()\n"
        f"  async {method_name}(@Body() dto: {dto_name}) {{ ... }}"
    )


def dto_missing_file_hint(dto_name: str, expected_path: Path) -> str:
    """
    Generate fix hint for DTO type used but file doesn't exist.
    
    Args:
        dto_name: Name of the DTO class
        expected_path: Expected path where the DTO file should be
        
    Returns:
        Fix hint string with guidance
    """
    return (
        f"DTO type '{dto_name}' is referenced but the file doesn't exist.\n"
        f"\nCreate the file at: {expected_path}\n"
        f"\nExample structure:\n"
        f"  // {expected_path.name}\n"
        f"  import {{ IsString, IsEmail }} from 'class-validator';\n"
        f"\n"
        f"  export class {dto_name} {{\n"
        f"    @IsString()\n"
        f"    field1: string;\n"
        f"\n"
        f"    @IsEmail()\n"
        f"    field2: string;\n"
        f"  }}"
    )


def dto_no_validators_hint(dto_name: str, file_path: Path) -> str:
    """
    Generate fix hint for DTO file without class-validator decorators.
    
    Args:
        dto_name: Name of the DTO class
        file_path: Path to the DTO file
        
    Returns:
        Fix hint string with guidance
    """
    return (
        f"DTO class '{dto_name}' in {file_path.name} is missing class-validator decorators.\n"
        f"\nAdd validation decorators to all fields:\n"
        f"\nExample:\n"
        f"  import {{ IsString, IsEmail, IsOptional, MinLength }} from 'class-validator';\n"
        f"\n"
        f"  export class {dto_name} {{\n"
        f"    @IsString()\n"
        f"    @MinLength(1)\n"
        f"    name: string;\n"
        f"\n"
        f"    @IsEmail()\n"
        f"    email: string;\n"
        f"\n"
        f"    @IsOptional()\n"
        f"    @IsString()\n"
        f"    description?: string;\n"
        f"  }}"
    )


def console_log_fix_hint() -> str:
    """
    Generate fix hint for console.log violations.
    
    Returns:
        Fix hint string with guidance
    """
    return (
        "Replace console.log with structured logging.\n"
        "\nUse the centralized logger:\n"
        "  this.logger.log({ level: 'info', message: '...', context: '...' });\n"
        "\nOr if using NestJS Logger:\n"
        "  this.logger.log('Message', 'Context');\n"
        "  this.logger.error('Error message', 'Stack trace', 'Context');\n"
        "\nFor debug statements, either:\n"
        "  1. Use this.logger.debug(...) if debug logging is needed\n"
        "  2. Remove the statement entirely if it was temporary debugging"
    )


def prisma_in_controller_fix_hint(controller_name: str) -> str:
    """
    Generate fix hint for Prisma usage in controllers.
    
    Args:
        controller_name: Name of the controller class
        
    Returns:
        Fix hint string with guidance
    """
    service_name = controller_name.replace('Controller', 'Service')
    
    return (
        f"Move Prisma calls from {controller_name} to a service layer.\n"
        f"\nSteps:\n"
        f"1. Create or use {service_name}\n"
        f"2. Inject {service_name} into {controller_name}\n"
        f"3. Move Prisma logic to {service_name} methods\n"
        f"\nExample:\n"
        f"  // {service_name.lower()}.ts\n"
        f"  @Injectable()\n"
        f"  export class {service_name} {{\n"
        f"    constructor(private prisma: PrismaService) {{}}\n"
        f"\n"
        f"    async findAll(tenantId: string) {{\n"
        f"      return this.prisma.customer.findMany({{\n"
        f"        where: {{ tenantId }}\n"
        f"      }});\n"
        f"    }}\n"
        f"  }}\n"
        f"\n  // {controller_name.lower()}.ts\n"
        f"  @Controller('customers')\n"
        f"  export class {controller_name} {{\n"
        f"    constructor(private {service_name.lower()}: {service_name}) {{}}\n"
        f"\n"
        f"    @Get()\n"
        f"    async findAll() {{\n"
        f"      return this.{service_name.lower()}.findAll(currentUser.tenantId);\n"
        f"    }}\n"
        f"  }}"
    )


def pass_through_service_fix_hint(service_name: str) -> str:
    """
    Generate fix hint for pass-through services.
    
    Args:
        service_name: Name of the service class
        
    Returns:
        Fix hint string with guidance
    """
    return (
        f"Service '{service_name}' appears to be a thin pass-through wrapper.\n"
        f"\nOptions:\n"
        f"1. Add domain logic: Transform data, apply business rules, aggregate results\n"
        f"2. Consolidate: If the service only wraps Prisma, consider using Prisma directly in controllers\n"
        f"   (though this violates separation of concerns - prefer option 1)\n"
        f"3. Refactor: If this is intentional (e.g., repository pattern), document why\n"
        f"\nExample of adding domain logic:\n"
        f"  async findAll(tenantId: string) {{\n"
        f"    const customers = await this.prisma.customer.findMany({{\n"
        f"      where: {{ tenantId }}\n"
        f"    }});\n"
        f"    \n"
        f"    // Add business logic here\n"
        f"    return customers.map(c => ({{ ...c, computedField: this.compute(c) }}));\n"
        f"  }}"
    )


def multi_step_no_transaction_fix_hint() -> str:
    """
    Generate fix hint for multi-step Prisma operations without transaction.
    
    Returns:
        Fix hint string with guidance
    """
    return (
        "Wrap multi-step Prisma operations in a transaction.\n"
        "\nUse prisma.$transaction() to ensure atomicity:\n"
        "\nExample:\n"
        "  await this.prisma.$transaction(async (tx) => {\n"
        "    const customer = await tx.customer.create({ data: {...} });\n"
        "    await tx.order.create({ data: { customerId: customer.id, ...} });\n"
        "    await tx.auditLog.create({ data: { action: 'created', ...} });\n"
        "    return customer;\n"
        "  });\n"
        "\nThis ensures all operations succeed or all are rolled back."
    )


def business_logic_in_controller_fix_hint(controller_name: str, module_name: Optional[str] = None) -> str:
    """
    Generate fix hint for business logic in controllers.
    
    Args:
        controller_name: Name of the controller class
        module_name: Optional module name for service suggestion
        
    Returns:
        Fix hint string with guidance
    """
    if module_name:
        service_name = f"{module_name}Service"
    else:
        service_name = controller_name.replace('Controller', 'Service')
    
    return (
        f"Move business logic from {controller_name} to a service.\n"
        f"\nControllers should only:\n"
        f"  - Receive requests\n"
        f"  - Validate input (via DTOs)\n"
        f"  - Call service methods\n"
        f"  - Return responses\n"
        f"\nBusiness logic (loops, conditionals, calculations) belongs in {service_name}.\n"
        f"\nExample:\n"
        f"  // {service_name.lower()}.ts\n"
        f"  async processOrders(orders: Order[]) {{\n"
        f"    // Move business logic here\n"
        f"    return orders.map(order => this.calculateTotal(order));\n"
        f"  }}\n"
        f"\n  // {controller_name.lower()}.ts\n"
        f"  @Post('process')\n"
        f"  async process(@Body() dto: ProcessOrdersDto) {{\n"
        f"    return this.{service_name.lower()}.processOrders(dto.orders);\n"
        f"  }}"
    )


def no_dto_directory_hint(module_root: Path) -> str:
    """
    Generate fix hint for missing dto/ directory.
    
    Args:
        module_root: Path to the module root directory
        
    Returns:
        Fix hint string with guidance
    """
    dto_dir = module_root / 'dto'
    
    return (
        f"Module at {module_root} is missing a 'dto/' directory.\n"
        f"\nCreate the directory: {dto_dir}\n"
        f"\nThen place DTO classes there:\n"
        f"  {dto_dir}/create-customer.dto.ts\n"
        f"  {dto_dir}/update-customer.dto.ts\n"
        f"  etc.\n"
        f"\nThis keeps DTOs organized and makes them easy to find."
    )


def heavy_body_no_dto_hint() -> str:
    """
    Generate fix hint for heavy @Body() usage without DTOs.
    
    Returns:
        Fix hint string with guidance
    """
    return (
        "Extract shared DTOs for repeated payload shapes.\n"
        "\nWhen you have 3+ @Body() parameters, create a DTO:\n"
        "\nExample:\n"
        "  // create-customer.dto.ts\n"
        "  export class CreateCustomerDto {\n"
        "    @IsString()\n"
        "    name: string;\n"
        "\n"
        "    @IsEmail()\n"
        "    email: string;\n"
        "\n"
        "    @IsString()\n"
        "    phone: string;\n"
        "  }\n"
        "\nThen use it:\n"
        "  @Post()\n"
        "  async create(@Body() dto: CreateCustomerDto) { ... }"
    )


def mutating_no_auth_guard_hint() -> str:
    """
    Generate fix hint for mutating methods without auth guards.
    
    Returns:
        Fix hint string with guidance
    """
    return (
        "Add authentication guards to mutating endpoints.\n"
        "\nUse @UseGuards() decorator:\n"
        "\nExample:\n"
        "  import { UseGuards } from '@nestjs/common';\n"
        "  import { JwtAuthGuard } from '@verofield/common/auth';\n"
        "\n"
        "  @Post()\n"
        "  @UseGuards(JwtAuthGuard)\n"
        "  async create(@Body() dto: CreateDto) { ... }\n"
        "\nFor multi-tenant apps, also add TenantGuard:\n"
        "  @UseGuards(JwtAuthGuard, TenantGuard)\n"
        "  async create(@Body() dto: CreateDto) { ... }"
    )



