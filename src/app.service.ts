import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service.js';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getStatus(): Promise<{
    status: string;
    database: string;
    version: string;
    environment: string;
    uptime: number;
  }> {
    let dbStatus = 'Disconnected';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbStatus = 'Online';
    } catch (error) {
      console.error('Database connection failed', error);
    }

    return {
      status: 'ok',
      database: dbStatus,
      version: '2.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
    };
  }
}
