import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { LogsService } from './logs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('api/logs')
@UseGuards(JwtAuthGuard, AdminGuard)
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  async getAllLogs(@Query('limit') limit = 100, @Query('offset') offset = 0) {
    return await this.logsService.getAllLogs(limit, offset);
  }
}
