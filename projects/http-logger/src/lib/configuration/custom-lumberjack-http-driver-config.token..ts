import { InjectionToken } from '@angular/core';

import {CustomLumberjackHttpDriverInternalConfig} from './custom-lumberjack-http-driver-internal.config'

export const lumberjackHttpDriverConfigToken: InjectionToken<CustomLumberjackHttpDriverInternalConfig> = new InjectionToken(
  '__LUMBERJACK_HTTP_DRIVER_CONFIG__'
);