import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserDto } from './dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users for the current tenant' })
  @ApiResponse({ status: 200, description: 'List of users retrieved successfully' })
  async getUsers(@Request() req: any) {
    const tenantId = req.tenantId;
    return this.userService.getUsers(tenantId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  async createUser(@Request() req: any, @Body() createUserDto: CreateUserDto) {
    const tenantId = req.tenantId;
    return this.userService.createUser(tenantId, createUserDto);
  }

  @Post('sync')
  @ApiOperation({ summary: 'Sync authenticated users to local database' })
  @ApiResponse({ status: 200, description: 'Users synced successfully' })
  async syncUsers(@Request() req: any) {
    const tenantId = req.tenantId;
    return this.userService.syncAuthUsersToDatabase(tenantId);
  }
}
