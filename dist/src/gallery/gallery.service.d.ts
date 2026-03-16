import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateGalleryItemDto, UpdateGalleryItemDto } from './dto/gallery.dto.js';
import type { GalleryItem } from '@prisma/client';
import { AuditService } from '../audit/audit.service.js';
export declare class GalleryService {
    private readonly prisma;
    private readonly audit;
    constructor(prisma: PrismaService, audit: AuditService);
    findAll(): Promise<GalleryItem[]>;
    findOne(id: string): Promise<GalleryItem>;
    create(dto: CreateGalleryItemDto, adminEmail: string): Promise<GalleryItem>;
    update(id: string, dto: UpdateGalleryItemDto, adminEmail: string): Promise<GalleryItem>;
    remove(id: string, adminEmail: string): Promise<GalleryItem>;
}
