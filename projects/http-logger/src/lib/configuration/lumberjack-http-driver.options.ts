import { LumberjackLogDriverConfig } from '@ngworker/lumberjack';

import { CustomLumberjackHttpDriverInternalConfig } from './custom-lumberjack-http-driver-internal.config';

/**
 * Settings exclusive to the HTTP driver.
 */
export type LumberjackHttpDriverOptions = Omit<CustomLumberjackHttpDriverInternalConfig, keyof LumberjackLogDriverConfig> & Partial<LumberjackLogDriverConfig>;