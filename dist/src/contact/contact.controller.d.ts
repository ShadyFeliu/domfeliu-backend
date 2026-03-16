import type { Request } from 'express';
import { ContactService } from './contact.service.js';
import { CreateContactDto } from './dto/contact.dto.js';
import type { ContactMessage } from '@prisma/client';
export declare class ContactController {
    private readonly contactService;
    constructor(contactService: ContactService);
    create(dto: CreateContactDto): Promise<{
        message: string;
    }>;
    findAll(): Promise<ContactMessage[]>;
    countUnread(): Promise<{
        count: number;
    }>;
    markAsRead(id: string, req: Request): Promise<ContactMessage>;
    remove(id: string, req: Request): Promise<ContactMessage>;
}
