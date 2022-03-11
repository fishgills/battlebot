import { Inject } from '@nestjs/common';

import { LOGGER } from './logger.module';
export const Logger = () => Inject(LOGGER);
