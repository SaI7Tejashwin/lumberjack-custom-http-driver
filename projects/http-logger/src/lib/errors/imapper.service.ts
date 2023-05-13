import { Observable } from "rxjs";
import { CustomLumberjackHttpDriverInternalConfig } from "../configuration/custom-lumberjack-http-driver-internal.config";
import { LoggerLogPosition } from "./logger-log-position";


export const TOKEN_LOGGER_MAPPER_SERVICE = 'TOKEN_LOGGER_MAPPER_SERVICE';

export interface ILoggerMapperService {

    getLogPosition(config: CustomLumberjackHttpDriverInternalConfig): Observable<LoggerLogPosition>;
}