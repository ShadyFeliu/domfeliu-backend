import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateEventDto, UpdateEventDto } from './dto/event.dto.js';
import type { Event } from '@prisma/client';

import { AuditService } from '../audit/audit.service.js';

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async findAllPublished(): Promise<Event[]> {
    return await this.prisma.event.findMany({
      where: { isPublished: true, date: { gte: new Date() } },
      orderBy: { date: 'asc' },
    });
  }

  async findAll(): Promise<Event[]> {
    return await this.prisma.event.findMany({
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string): Promise<Event> {
    const event: Event | null = await this.prisma.event.findUnique({
      where: { id },
    });
    if (!event) {
      throw new NotFoundException(`Event ${id} not found`);
    }
    return event;
  }

  async create(dto: CreateEventDto, adminEmail: string): Promise<Event> {
    const event = await this.prisma.event.create({
      data: { ...dto, date: new Date(dto.date) },
    });
    await this.audit.log({
      action: 'CREATE',
      entityType: 'EVENT',
      entityId: event.id,
      adminEmail,
      details: { title: event.title },
    });
    return event;
  }

  async update(
    id: string,
    dto: UpdateEventDto,
    adminEmail: string,
  ): Promise<Event> {
    try {
      const event = await this.prisma.event.update({
        where: { id },
        data: {
          ...dto,
          ...(dto.date ? { date: new Date(dto.date) } : {}),
        },
      });
      await this.audit.log({
        action: 'UPDATE',
        entityType: 'EVENT',
        entityId: event.id,
        adminEmail,
        details: dto,
      });
      return event;
    } catch {
      throw new NotFoundException(`Event ${id} not found`);
    }
  }

  async remove(id: string, adminEmail: string): Promise<Event> {
    try {
      const eventToDelete = await this.findOne(id);
      const deletedEvent = await this.prisma.event.delete({ where: { id } });
      await this.audit.log({
        action: 'DELETE',
        entityType: 'EVENT',
        entityId: id,
        adminEmail,
        details: { title: eventToDelete.title },
      });
      return deletedEvent;
    } catch {
      throw new NotFoundException(`Event ${id} not found`);
    }
  }
}
