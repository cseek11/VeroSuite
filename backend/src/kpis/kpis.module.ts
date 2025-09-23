import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KPIsController } from './kpis.controller';
import { KPIsService } from './kpis.service';
import { SupabaseService } from '../common/services/supabase.service';
import { RedisService } from '../common/services/redis.service';
import { CacheService } from '../common/services/cache.service';
import { WebSocketGateway } from '../websocket/websocket.gateway';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET is required');
        }
        return {
          secret,
          signOptions: {
            expiresIn: configService.get<string>('JWT_EXPIRES_IN', '24h'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [KPIsController],
  providers: [KPIsService, SupabaseService, RedisService, CacheService, WebSocketGateway],
  exports: [KPIsService],
})
export class KPIsModule {}
