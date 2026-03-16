import { AuditService } from './audit.service.js';
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    getLogs(): Promise<{
        id: string;
        createdAt: Date;
        action: string;
        entityType: string;
        entityId: string | null;
        adminEmail: string;
        details: import("@prisma/client/runtime/client").JsonValue | null;
    }[]>;
}
