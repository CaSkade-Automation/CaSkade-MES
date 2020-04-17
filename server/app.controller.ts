import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { LoggingInterceptor } from 'interceptors/logging.interceptor';

@Controller()
@UseInterceptors(LoggingInterceptor)
export class AppController {
  constructor() {}

  @Get()
  getHello(): string {
    return "asd";
  }
}
