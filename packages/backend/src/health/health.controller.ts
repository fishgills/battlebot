import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Public } from 'auth/make-public';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}
  @Get()
  @HealthCheck()
  @Public()
  readiness() {
    return this.health.check([]);
    // return this.health.check([
    //   async () => this.db.pingCheck('database', { timeout: 300 }),
    // ]);
  }
}
