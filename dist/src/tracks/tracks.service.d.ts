import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateTrackDto, UpdateTrackDto } from './dto/track.dto.js';
import type { Track } from '@prisma/client';
import { AuditService } from '../audit/audit.service.js';
export declare class TracksService {
    private readonly prisma;
    private readonly audit;
    constructor(prisma: PrismaService, audit: AuditService);
    findAllPublished(): Promise<Track[]>;
    findAll(): Promise<Track[]>;
    findOne(id: string): Promise<Track>;
    create(dto: CreateTrackDto, adminEmail: string): Promise<Track>;
    update(id: string, dto: UpdateTrackDto, adminEmail: string): Promise<Track>;
    remove(id: string, adminEmail: string): Promise<Track>;
}
