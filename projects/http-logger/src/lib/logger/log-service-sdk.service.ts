import { Injectable } from "@angular/core";
import { LumberjackLevel, LumberjackLogLevel, LumberjackLogPayload, LumberjackService, LumberjackTimeService, ScopedLumberjackLogger } from "@ngworker/lumberjack";

export interface LogPayload extends LumberjackLogPayload{
    angularVersion: string;
    additionalData?: any;
}

/**
 * The keys to pass for standardized payload data
 */

export enum payloadKeys{
    Key1 = "Message from Key 1",
    Key2 = "Message from Key 2",
    Key3 = "Message from Key 3",
    Key4 = "Message from Key 4",
    Key5 = "Message from Key 5",
    Key6 = "Message from Key 6"
}

export enum Level{
    Critical,
    Debug,
    Error,
    Info,
    Trace,
    Warning
 }

export type LogPayloadMap<T extends string | symbol | number, UPayload extends LogPayload> = {
    [K in T]?: UPayload
}

export type LogLevelMap<T extends string | symbol | number, ULevel extends LumberjackLogLevel> = {
    [K in T]: ULevel
};

export const logLevel: LogLevelMap<Level, LumberjackLogLevel> = {
    [Level.Critical]: LumberjackLevel.Critical,
    [Level.Debug]: LumberjackLevel.Debug,
    [Level.Error]: LumberjackLevel.Error,
    [Level.Info]: LumberjackLevel.Info,
    [Level.Trace]: LumberjackLevel.Trace,
    [Level.Warning]: LumberjackLevel.Warning,
};


/**
 * Maps the payload keys to its respective payload data.
 */
export const logPayloadMap: LogPayloadMap<payloadKeys, LogPayload> = {
    [payloadKeys.Key1]: {angularVersion: "15.1"},
    [payloadKeys.Key2]: {angularVersion: "15.2"},
    [payloadKeys.Key3]: {angularVersion: "15.3"},
    [payloadKeys.Key4]: {angularVersion: "15.4", additionalData: "additional data"},
}

@Injectable({
    providedIn: 'root'
})
export class LogServiceSDK extends ScopedLumberjackLogger<LogPayload>{
    constructor(lumberjack: LumberjackService<LogPayload>, time: LumberjackTimeService) {
        super(lumberjack, time);
    }

    readonly scope = "VKYC-Logger";

    info = (message: payloadKeys) => this.createInfoLogger(message).withPayload(logPayloadMap[message]!).withScope(this.scope).build()();

    /**
     * The critical log helper function for the KLoggerService
     * 
     */
    critical = (message: payloadKeys) => this.createCriticalLogger(message).withPayload(logPayloadMap[message]!).withScope(this.scope).build()();
 
    /**
     * The debug log helper function for the KLoggerService 
     */
 
    debug = (message: payloadKeys) => this.createDebugLogger(message).withPayload(logPayloadMap[message]!).withScope(this.scope).build()();
 
   /**
    * The error log helper function for the KloggerServide
    */
    error = (message: payloadKeys) => this.createErrorLogger(message).withPayload(logPayloadMap[message]!).withScope(this.scope).build()();
 
    /**  
     * The trace log helper function for the KLoggerService
    */
    trace = (message: payloadKeys) => this.createTraceLogger(message).withPayload(logPayloadMap[message]!).withScope(this.scope).build()();
 
    /**
     * The warning log helper function for the KLoggerService
     */
    warn = (message: payloadKeys) => this.createWarningLogger(message).withPayload(logPayloadMap[message]!).withScope(this.scope).build()();
  
}