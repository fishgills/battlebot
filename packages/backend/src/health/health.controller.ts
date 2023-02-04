import { Controller, Get } from '@nestjs/common';

import { Public } from 'auth/make-public';

@Controller('health')
export class HealthController {
  @Get()
  // @HealthCheck()
  @Public()
  readiness() {
    return 'hi';
  }
}
