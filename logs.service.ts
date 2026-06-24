import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from '../entities/log.entity';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Log)
    private logRepository: Repository<Log>,
  ) {}

  async createLog(data: {
    userId: number;
    username: string;
    action: string;
    entity: string;
    entityId?: number;
    details?: any;
    ipAddress?: string;
    userAgent?: string;
  }) {
    const log = new Log();
    log.userId = data.userId;
    log.username = data.username;
    log.action = data.action;
    log.entity = data.entity;
    log.entityId = data.entityId || null;
    log.details = data.details ? JSON.stringify(data.details) : null;
    log.ipAddress = data.ipAddress || null;
    log.userAgent = data.userAgent || null;

    return await this.logRepository.save(log);
  }

  async getAllLogs(limit = 100, offset = 0) {
    return await this.logRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async getUserLogs(userId: number, limit = 50) {
    return await this.logRepository.find({
      where: { userId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getLogsByAction(action: string, limit = 50) {
    return await this.logRepository.find({
      where: { action },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
