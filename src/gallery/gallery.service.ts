import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type {
  CreateGalleryItemDto,
  UpdateGalleryItemDto,
} from './dto/gallery.dto.js';
import type { GalleryItem } from '@prisma/client';
import { unlink } from 'fs/promises';
import { join, basename } from 'path';

import { AuditService } from '../audit/audit.service.js';

@Injectable()
export class GalleryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async findAll(): Promise<GalleryItem[]> {
    return await this.prisma.galleryItem.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string): Promise<GalleryItem> {
    const item: GalleryItem | null = await this.prisma.galleryItem.findUnique({
      where: { id },
    });
    if (!item) {
      throw new NotFoundException(`Gallery item ${id} not found`);
    }
    return item;
  }

  async create(
    dto: CreateGalleryItemDto,
    adminEmail: string,
  ): Promise<GalleryItem> {
    const item = await this.prisma.galleryItem.create({ data: dto });
    await this.audit.log({
      action: 'CREATE',
      entityType: 'GALLERY',
      entityId: item.id,
      adminEmail,
      details: { caption: item.caption, type: item.type },
    });
    return item;
  }

  async update(
    id: string,
    dto: UpdateGalleryItemDto,
    adminEmail: string,
  ): Promise<GalleryItem> {
    try {
      const item = await this.prisma.galleryItem.update({
        where: { id },
        data: dto,
      });
      await this.audit.log({
        action: 'UPDATE',
        entityType: 'GALLERY',
        entityId: item.id,
        adminEmail,
        details: dto,
      });
      return item;
    } catch {
      throw new NotFoundException(`Gallery item ${id} not found`);
    }
  }

  async remove(id: string, adminEmail: string): Promise<GalleryItem> {
    try {
      const itemToDelete = await this.findOne(id);
      const deletedItem = await this.prisma.galleryItem.delete({
        where: { id },
      });

      await this.audit.log({
        action: 'DELETE',
        entityType: 'GALLERY',
        entityId: id,
        adminEmail,
        details: { caption: itemToDelete.caption },
      });

      if (deletedItem.url && !deletedItem.url.startsWith('http')) {
        try {
          const filename = basename(deletedItem.url);
          const filePath = join(process.cwd(), 'uploads', filename);
          await unlink(filePath);
          console.log(`✅ Deleted file: ${filePath}`);
        } catch (err) {
          console.warn(`⚠️ Could not delete file for gallery item ${id}:`, err);
        }
      }

      return deletedItem;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new NotFoundException(`Gallery item ${id} not found`);
    }
  }
}
