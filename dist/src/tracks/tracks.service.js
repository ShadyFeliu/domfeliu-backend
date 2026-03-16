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
let TracksService = class TracksService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async findAllPublished() {
        return await this.prisma.track.findMany({
            where: { isPublished: true },
            orderBy: { order: 'asc' },
        });
    }
    async findAll() {
        return await this.prisma.track.findMany({
            orderBy: { order: 'asc' },
        });
    }
    async findOne(id) {
        const track = await this.prisma.track.findUnique({
            where: { id },
        });
        if (!track) {
            throw new NotFoundException(`Track ${id} not found`);
        }
        return track;
    }
    async create(dto, adminEmail) {
        const track = await this.prisma.track.create({ data: dto });
        await this.audit.log({
            action: 'CREATE',
            entityType: 'TRACK',
            entityId: track.id,
            adminEmail,
            details: { title: track.title },
        });
        return track;
    }
    async update(id, dto, adminEmail) {
        try {
            const track = await this.prisma.track.update({
                where: { id },
                data: dto,
            });
            await this.audit.log({
                action: 'UPDATE',
                entityType: 'TRACK',
                entityId: track.id,
                adminEmail,
                details: dto,
            });
            return track;
        }
        catch {
            throw new NotFoundException(`Track ${id} not found`);
        }
    }
    async remove(id, adminEmail) {
        try {
            const trackToDelete = await this.findOne(id);
            const deletedTrack = await this.prisma.track.delete({ where: { id } });
            await this.audit.log({
                action: 'DELETE',
                entityType: 'TRACK',
                entityId: id,
                adminEmail,
                details: { title: trackToDelete.title },
            });
            if (deletedTrack.audioUrl && !deletedTrack.audioUrl.startsWith('http')) {
                try {
                    const filename = basename(deletedTrack.audioUrl);
                    const filePath = join(process.cwd(), 'uploads', filename);
                    await unlink(filePath);
                }
                catch (err) {
                    console.warn(`⚠️ Could not delete file for track ${id}:`, err);
                }
            }
            return deletedTrack;
        }
        catch (error) {
            if (error instanceof NotFoundException)
                throw error;
            throw new NotFoundException(`Track ${id} not found`);
        }
    }
};
TracksService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        AuditService])
], TracksService);
export { TracksService };
//# sourceMappingURL=tracks.service.js.map