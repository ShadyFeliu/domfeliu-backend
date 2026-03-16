import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateEventDto, UpdateEventDto } from './dto/event.dto.js';
import type { Event } from '@prisma/client';
import { AuditService } from '../audit/audit.service.js';
export declare class EventsService {
    private readonly prisma;
    private readonly audit;
    constructor(prisma: PrismaService, audit: AuditService);
    findAllPublished(): Promise<Event[]>;
    findAll(): Promise<Event[]>;
    findOne(id: string): Promise<Event>;
    create(dto: CreateEventDto, adminEmail: string): Promise<Event>;
    update(id: string, dto: UpdateEventDto, adminEmail: string): Promise<Event>;
    remove(id: string, adminEmail: string): Promise<Event>;
}
