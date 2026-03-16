import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { PrismaClient } from '@prisma/client';

export interface AuditLogParams {
  action: string;
  entityType: string;
  entityId?: string;
  adminEmail: string;
  details?: Record<string, any>;
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(params: AuditLogParams) {
    return await (this.prisma as PrismaClient).auditLog.create({
      data: {
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        adminEmail: params.adminEmail,
        details: params.details || {},
      },
    });
  }

  async findAll() {
    return await (this.prisma as PrismaClient).auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}
