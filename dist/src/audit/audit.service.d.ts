import { PrismaService } from '../prisma/prisma.service.js';
export interface AuditLogParams {
    action: string;
    entityType: string;
    entityId?: string;
    adminEmail: string;
    details?: Record<string, any>;
}
export declare class AuditService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    log(params: AuditLogParams): Promise<{
        id: string;
        createdAt: Date;
        action: string;
        entityType: string;
        entityId: string | null;
        adminEmail: string;
        details: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        action: string;
        entityType: string;
        entityId: string | null;
        adminEmail: string;
        details: import("@prisma/client/runtime/client").JsonValue | null;
    }[]>;
}
