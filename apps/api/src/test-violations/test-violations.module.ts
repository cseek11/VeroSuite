import { Module } from '@nestjs/common';
import { TestViolationsController } from './test-violations.controller';
import { TestViolationsService } from './test-violations.service';

/**
 * TEST FILE - This module intentionally violates multiple rules to test the auto-enforcer
 * DO NOT USE IN PRODUCTION 
 */
@Module({
  controllers: [TestViolationsController],
  providers: [TestViolationsService],
  // VIOLATION: Module exports service but it's not needed elsewhere
  exports: [TestViolationsService],
})
export class TestViolationsModule {}



