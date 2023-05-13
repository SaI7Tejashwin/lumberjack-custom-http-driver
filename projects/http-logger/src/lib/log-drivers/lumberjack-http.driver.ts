import { HttpClient } from '@angular/common/http';
import { inject, Injectable, NgZone, OnDestroy } from '@angular/core';
import { catchError, Observable, Subscription, take, tap } from 'rxjs';

import { LumberjackLevel, LumberjackLog, LumberjackLogDriver, LumberjackLogDriverLog, LumberjackLogLevel, LumberjackLogPayload } from '@ngworker/lumberjack';

import { lumberjackHttpDriverConfigToken } from '../configuration/custom-lumberjack-http-driver-config.token.';
import { BatchLog, LumberjackHttpLog } from '../logs/lumberjack-http.log';
import { retryWithDelay } from '../operators/relay-with-delay.operator';
import { ParseSourceFile } from '@angular/compiler';
/**
 * The HTTP driver transports logs to the configured web API log store using the
 * POST HTTP verb.
 *
 * It sends the formatted log and the log including the optional log payload.
 */
@Injectable()
export class LumberjackHttpDriver<TPayload extends LumberjackLogPayload | void = void> implements LumberjackLogDriver<TPayload>, OnDestroy
{
  static readonly driverIdentifier = 'LumberjackHttpDriver';

  private readonly http = inject(HttpClient);
  private readonly ngZone = inject(NgZone);
  private readonly subscriptions = new Subscription();

  /**
   * The setTimeout object to be created to push the lingering batches (< batchSize) to the remote server
   */
  private timeoutRef: any;
  //create a "timeOut" object
  //on destroy -> clearTimeout()
  logBuffer: LumberjackHttpLog<TPayload>[] = []; 

  readonly config = inject(lumberjackHttpDriverConfigToken);

  // ngOnInit(): void{
  //   const batchTimeout = setTimeout(this.sendLog, 3000);
  // }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    clearTimeout(this.timeoutRef);
  }

  /**
   * Send critical log to the log store.
   *
   * @param param0 The log and its text representation.
   */
  logCritical({ formattedLog, log }: LumberjackLogDriverLog<TPayload>): void {
    this.sendLog(formattedLog, log);
  }

  /**
   * Send debug log to the log store.
   *
   * @param param0 The log and its text representation.
   */
  logDebug({ formattedLog, log }: LumberjackLogDriverLog<TPayload>): void {
    this.sendLog(formattedLog, log);
  }

  /**
   * Send error log to the log store.
   *
   * @param param0 The log and its text representation.
   */
  logError({ formattedLog, log }: LumberjackLogDriverLog<TPayload>): void {
    this.sendLog(formattedLog, log);
  }

  /**
   * Send info log to the log store.
   *
   * @param param0 The log and its text representation.
   */
  logInfo({ formattedLog, log }: LumberjackLogDriverLog<TPayload>): void {
    this.sendLog(formattedLog, log);
  }

  /**
   * Send trace log to the log store.
   *
   * @param param0 The log and its text representation.
   */
  logTrace({ formattedLog, log }: LumberjackLogDriverLog<TPayload>): void {
    this.sendLog(formattedLog, log);
  }

  /**
   * Send warning log to the log store.
   *
   * @param param0 The log and its text representation.
   */
  logWarning({ formattedLog, log }: LumberjackLogDriverLog<TPayload>): void {
    this.sendLog(formattedLog, log);
  }

  /**
   * Send log to the log store.
   *
   * This is done outside of the `NgZone` as there's no need this to trigger
   * change detection.
   *
   * Failed HTTP requests are retried according to the configured retry options.
   *
   * @param formattedLog The log's text representation.
   * @param log The log.
   */
  private sendLog(formattedLog: string, log: LumberjackLog<TPayload>): void {
    const { origin, retryOptions, storeUrl, batchOptions, highPriority} = this.config;
    const httpLog: LumberjackHttpLog<TPayload> = { formattedLog, origin, log };

    //console.log(httpLog.log.level);
    
    if(highPriority?.includes(httpLog.log.level)){
      //logic to push the log directly to the POST HTTP verb.
      this.sendRequest(storeUrl, httpLog, retryOptions.maxRetries, retryOptions.delayMs);
    }
    else 
    {
      this.logBuffer.push(httpLog);
    }
  
    if (this.logBuffer.length >= batchOptions.batchSize){
      let tempBuffer: LumberjackHttpLog<TPayload>[] = this.logBuffer; 
      this.logBuffer = [];
      const batchLog: BatchLog<TPayload> = {logBatch: tempBuffer};
      this.sendRequest(storeUrl, batchLog, retryOptions.maxRetries, retryOptions.delayMs); 
    }

    //if(this.timeoutRef == null)
    //only proceed if debounce timeout ref is null or undefied, in other case setTimeout could be in progress ? 
    //using filter and timeout in pipe() -> more clutter
    this.timeoutRef = setTimeout(() => {
      if(this.logBuffer.length > 0){
        let _tempBuffer: LumberjackHttpLog<TPayload>[] = this.logBuffer;
        this.logBuffer = [];
        const _emitBatch: BatchLog<TPayload> = {logBatch: _tempBuffer};
        this.sendRequest(storeUrl, _emitBatch, retryOptions.maxRetries, retryOptions.delayMs);
      }
    }, batchOptions.debounceTime);



  }

  private sendRequest(serverUrl: string, requestData: any, maxRetries: number, delayMs: number): void{
    this.ngZone.runOutsideAngular(() => {
      this.subscriptions.add(
        this.http
          .post<void>(serverUrl, requestData)
          .pipe(
            retryWithDelay(maxRetries, delayMs)
            )
          // HTTP requests complete after
          // eslint-disable-next-line rxjs-angular/prefer-composition
          .subscribe(() => {
            // No-op
            
          })
      );
    });
  }
}
