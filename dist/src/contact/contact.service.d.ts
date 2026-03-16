import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateContactDto } from './dto/contact.dto.js';
import type { ContactMessage } from '@prisma/client';
import { AuditService } from '../audit/audit.service.js';
export declare class ContactService {
    private readonly prisma;
    private readonly audit;
    constructor(prisma: PrismaService, audit: AuditService);
    create(dto: CreateContactDto): Promise<{
        message: string;
    }>;
    findAll(): Promise<ContactMessage[]>;
    markAsRead(id: string, adminEmail: string): Promise<ContactMessage>;
    remove(id: string, adminEmail: string): Promise<ContactMessage>;
    countUnread(): Promise<number>;
}
