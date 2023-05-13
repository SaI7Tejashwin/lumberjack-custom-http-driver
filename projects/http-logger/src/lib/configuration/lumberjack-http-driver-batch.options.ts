/**
 * Settings for batching the logs to reduce the HTTP POST overhead
 */

export interface LumberjackHttpDriverBatchOptions{
    /**
     * The size of the log batch.
     */
    readonly batchSize: number;
    
    /**
     * The timeout to debounce logs in milliseconds
     */
    readonly debounceTime: number;
}