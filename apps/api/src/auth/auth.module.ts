import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { randomUUID } from 'crypto';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthV2Controller } from './auth-v2.controller';
import { RolesGuard } from './roles.guard';
import { PermissionsGuard } from './permissions.guard';
import { DatabaseService } from '../common/services/database.service';
import { PermissionsService } from '../common/services/permissions.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const jwtSecret = configService.get<string>('JWT_SECRET');
        const traceId = randomUUID(); // Generate trace ID for module initialization
        if (!jwtSecret) {
          throw new Error(
            `JWT_SECRET environment variable is required [traceId: ${traceId}]`
          );
        }
        return {
          secret: jwtSecret,
          signOptions: { expiresIn: '24h' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, AuthV2Controller],
  providers: [AuthService, JwtStrategy, RolesGuard, PermissionsGuard, DatabaseService, PermissionsService],
  exports: [AuthService, JwtModule, RolesGuard, PermissionsGuard],
})
export class AuthModule {}
