import type { Request } from 'express';
import { GalleryService } from './gallery.service.js';
import { CreateGalleryItemDto, UpdateGalleryItemDto } from './dto/gallery.dto.js';
import type { GalleryItem } from '@prisma/client';
export declare class GalleryController {
    private readonly galleryService;
    constructor(galleryService: GalleryService);
    findAll(): Promise<GalleryItem[]>;
    create(dto: CreateGalleryItemDto, req: Request): Promise<GalleryItem>;
    update(id: string, dto: UpdateGalleryItemDto, req: Request): Promise<GalleryItem>;
    remove(id: string, req: Request): Promise<GalleryItem>;
}
