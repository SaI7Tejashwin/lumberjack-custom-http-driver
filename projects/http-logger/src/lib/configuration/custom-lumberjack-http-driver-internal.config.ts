import { LumberjackConfigLevels, LumberjackLogDriverConfig } from '@ngworker/lumberjack';
import { LumberjackHttpDriverBatchOptions } from './lumberjack-http-driver-batch.options';

import { LumberjackHttpDriverRetryOptions } from './lumberjack-http-driver-retry.options';
/**
 * Settings used by the HTTP driver.
 */
export interface CustomLumberjackHttpDriverInternalConfig extends LumberjackLogDriverConfig {
  /**
   * The identifier of the application that emitted the log.
   *
   * This is used by the log store to organize logs.
   */
  readonly origin: string;
  /**
   * Settings for retrying failed HTTP requests.
   */
  readonly retryOptions: LumberjackHttpDriverRetryOptions;
  /**
   * The URL of the log store endpoint.
   *
   * NOTE! The endpoint matching this url MUST support the POST HTTP verb.
   */
  readonly storeUrl: string;

  /**
   * Settings for batching the Logs.
   */
  readonly batchOptions: LumberjackHttpDriverBatchOptions;

  /**
   * Number of calls that will be ignored when trying to get line of stacktrace
   */
  proxiedSteps?: number;

    /**
   * (Optional) Configures logs with high priority that send the logs directly via the POST HTTP verb.
   * @params LumberjackLevel
   */
  readonly highPriority?: LumberjackConfigLevels | any[];

}