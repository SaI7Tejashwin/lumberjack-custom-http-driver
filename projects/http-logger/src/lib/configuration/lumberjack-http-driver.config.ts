import { CustomLumberjackHttpDriverInternalConfig } from './custom-lumberjack-http-driver-internal.config';

/**
 * Settings used by the HTTP driver.
 */
export type LumberjackHttpDriverConfig = Omit<CustomLumberjackHttpDriverInternalConfig, 'identifier'> & Partial<Pick<CustomLumberjackHttpDriverInternalConfig, 'identifier'>>;