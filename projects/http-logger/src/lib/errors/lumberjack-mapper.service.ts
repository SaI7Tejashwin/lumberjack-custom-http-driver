import { HttpBackend } from "@angular/common/http";
import { Injectable, Optional } from "@angular/core";
import { Observable, of } from "rxjs";
import { CustomLumberjackHttpDriverInternalConfig } from "../configuration/custom-lumberjack-http-driver-internal.config";
import { ILoggerMapperService } from "./imapper.service";
import { LoggerLogPosition } from "./logger-log-position";

@Injectable()
export class LoggerMapperService implements ILoggerMapperService{
    constructor(
        @Optional() private httpBackend: HttpBackend
    ) {
        
    }

    public getLogPosition(config: CustomLumberjackHttpDriverInternalConfig): Observable<LoggerLogPosition>{
        const stackLine = this.getStackLine(config);

        // if we were not able to parse the stackLine, just return an empty Log Position
        if (!stackLine) {
          return of({ fileName: '', lineNumber: 0, columnNumber: 0 });
        }
    
        const logPosition = this.getLocalPosition(stackLine);

        return of(logPosition);
    }

    protected getStackLine(config: CustomLumberjackHttpDriverInternalConfig): string{
        const error = new Error();

        try{
            throw error;
        } catch(e){
            try{
               let defaultProxy = 4;
               const firstStackLine = error.stack!.split('\n')[0];
               if(!firstStackLine.includes('.js:')) {
                defaultProxy = defaultProxy + 1;
               } 

               return error.stack!.split('\n')[(defaultProxy + (config.proxiedSteps || 0))]
            } catch(e){
                return null!;
            }
        }
    }

    protected getLocalPosition(stackLine: string): LoggerLogPosition{

        const positionStartIndex = stackLine.lastIndexOf('\/');
        let positionEndIndex: number | undefined = stackLine.indexOf(')');
        if (positionEndIndex < 0) {
          positionEndIndex = undefined;
        }
    
        const position = stackLine.substring(positionStartIndex + 1, positionEndIndex);
        const dataArray = position.split(':');
        if (dataArray.length === 3) {
          return { fileName: dataArray[0], lineNumber: +dataArray[1], columnNumber: +dataArray[2] };
        }
        return { fileName: 'unknown', lineNumber: 0, columnNumber: 0 };
    }

    private getTranspileLocation(stackLine: string): string {
        let locationStartIndex = stackLine.indexOf('(');
        if (locationStartIndex < 0) {
          locationStartIndex = stackLine.lastIndexOf('@');
          if (locationStartIndex < 0) {
            locationStartIndex = stackLine.lastIndexOf(' ');
          }
        }
    
        let locationEndIndex: number | undefined = stackLine.indexOf(')');
        if (locationEndIndex < 0) {
          locationEndIndex = undefined;
        }
        console.log(stackLine.substring(locationStartIndex + 1, locationEndIndex));
        return stackLine.substring(locationStartIndex + 1, locationEndIndex);
    }
}