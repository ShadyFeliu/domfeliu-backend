import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateTrackDto, UpdateTrackDto } from './dto/track.dto.js';
import type { Track } from '@prisma/client';
import { unlink } from 'fs/promises';
import { join, basename } from 'path';

import { AuditService } from '../audit/audit.service.js';

@Injectable()
export class TracksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async findAllPublished(): Promise<Track[]> {
    return await this.prisma.track.findMany({
      where: { isPublished: true },
      orderBy: { order: 'asc' },
    });
  }

  async findAll(): Promise<Track[]> {
    return await this.prisma.track.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string): Promise<Track> {
    const track: Track | null = await this.prisma.track.findUnique({
      where: { id },
    });
    if (!track) {
      throw new NotFoundException(`Track ${id} not found`);
    }
    return track;
  }

  async create(dto: CreateTrackDto, adminEmail: string): Promise<Track> {
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

  async update(
    id: string,
    dto: UpdateTrackDto,
    adminEmail: string,
  ): Promise<Track> {
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
    } catch {
      throw new NotFoundException(`Track ${id} not found`);
    }
  }

  async remove(id: string, adminEmail: string): Promise<Track> {
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
        } catch (err) {
          console.warn(`⚠️ Could not delete file for track ${id}:`, err);
        }
      }

      return deletedTrack;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new NotFoundException(`Track ${id} not found`);
    }
  }
}
