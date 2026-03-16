var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { unlink } from 'fs/promises';
import { join, basename } from 'path';
import { AuditService } from '../audit/audit.service.js';
let GalleryService = class GalleryService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async findAll() {
        return await this.prisma.galleryItem.findMany({
            orderBy: { order: 'asc' },
        });
    }
    async findOne(id) {
        const item = await this.prisma.galleryItem.findUnique({
            where: { id },
        });
        if (!item) {
            throw new NotFoundException(`Gallery item ${id} not found`);
        }
        return item;
    }
    async create(dto, adminEmail) {
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
    async update(id, dto, adminEmail) {
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
        }
        catch {
            throw new NotFoundException(`Gallery item ${id} not found`);
        }
    }
    async remove(id, adminEmail) {
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
                }
                catch (err) {
                    console.warn(`⚠️ Could not delete file for gallery item ${id}:`, err);
                }
            }
            return deletedItem;
        }
        catch (error) {
            if (error instanceof NotFoundException)
                throw error;
            throw new NotFoundException(`Gallery item ${id} not found`);
        }
    }
};
GalleryService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        AuditService])
], GalleryService);
export { GalleryService };
//# sourceMappingURL=gallery.service.js.map