import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { 
  LumberjackLevel,
  LumberjackModule,
  LumberjackService,
  LumberjackTimeService
 } from '@ngworker/lumberjack';
 import { HttpClientModule } from '@angular/common/http';
 import {LumberjackConsoleDriverModule} from '@ngworker/lumberjack/console-driver';
 import { CustomLogHttpDriverModule, LogServiceSDK } from 'http-logger';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    LumberjackModule.forRoot(),
    LumberjackConsoleDriverModule.forRoot({
      levels: [LumberjackLevel.Warning]
    }),

    CustomLogHttpDriverModule.withOptions({
      levels: [LumberjackLevel.Critical, LumberjackLevel.Debug, LumberjackLevel.Error, LumberjackLevel.Info],
      origin: "vkyc-http-logger",
      storeUrl: 'http://127.0.0.1:5000/todo/api/v1.0/tasks',
      //flask endpoint : http://127.0.0.1:5000/todo/api/v1.0/tasks
      retryOptions: { maxRetries: 5, delayMs: 250},
      batchOptions: {batchSize: 6, debounceTime: 3000},
      highPriority: [LumberjackLevel.Debug, LumberjackLevel.Error]
    })
  ],
  providers: [
    LumberjackService,
    LumberjackTimeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
