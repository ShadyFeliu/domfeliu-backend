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
import { AuditService } from '../audit/audit.service.js';
let EventsService = class EventsService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async findAllPublished() {
        return await this.prisma.event.findMany({
            where: { isPublished: true, date: { gte: new Date() } },
            orderBy: { date: 'asc' },
        });
    }
    async findAll() {
        return await this.prisma.event.findMany({
            orderBy: { date: 'desc' },
        });
    }
    async findOne(id) {
        const event = await this.prisma.event.findUnique({
            where: { id },
        });
        if (!event) {
            throw new NotFoundException(`Event ${id} not found`);
        }
        return event;
    }
    async create(dto, adminEmail) {
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
    async update(id, dto, adminEmail) {
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
        }
        catch {
            throw new NotFoundException(`Event ${id} not found`);
        }
    }
    async remove(id, adminEmail) {
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
        }
        catch {
            throw new NotFoundException(`Event ${id} not found`);
        }
    }
};
EventsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        AuditService])
], EventsService);
export { EventsService };
//# sourceMappingURL=events.service.js.map