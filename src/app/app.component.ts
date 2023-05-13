import { Component, OnInit, inject } from '@angular/core';
import { LogServiceSDK } from 'http-logger';
import { payloadKeys } from 'http-logger';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'lumberjack_custom_http_driver';

  private readonly logger = inject(LogServiceSDK);

  ngOnInit(): void{
    this.logger.warn(payloadKeys.Key3);
    this.logger.critical(payloadKeys.Key4);
    this.logger.critical(payloadKeys.Key5);
    this.logger.trace(payloadKeys.Key4);
  }
}
