import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthV2Controller } from './auth-v2.controller';
import { RolesGuard } from './roles.guard';
import { PermissionsGuard } from './permissions.guard';
import { DatabaseService } from '../common/services/database.service';
import { PermissionsService } from '../common/services/permissions.service';

// Validate JWT secret is provided
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController, AuthV2Controller],
  providers: [AuthService, JwtStrategy, RolesGuard, PermissionsGuard, DatabaseService, PermissionsService],
  exports: [AuthService, JwtModule, RolesGuard, PermissionsGuard],
})
export class AuthModule {}
