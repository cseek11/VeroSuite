import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../common/services/database.service';

@Injectable()
export class UserService {
  constructor(private db: DatabaseService) {}

  async findByEmail(email: string) {
    return this.db.user.findFirst({ where: { email } });
  }
}
