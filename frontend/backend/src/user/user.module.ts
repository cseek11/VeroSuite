import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DatabaseService } from '../common/services/database.service';

@Module({ providers: [UserService, DatabaseService], exports: [UserService] })
export class UserModule {}
