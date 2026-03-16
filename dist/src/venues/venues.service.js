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
let VenuesService = class VenuesService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async findAll() {
        return this.prisma.venue.findMany({
            orderBy: { name: 'asc' },
        });
    }
    async findOne(id) {
        const venue = await this.prisma.venue.findUnique({
            where: { id },
        });
        if (!venue) {
            throw new NotFoundException(`Venue ${id} not found`);
        }
        return venue;
    }
    async create(dto, adminEmail) {
        const venue = await this.prisma.venue.create({
            data: dto,
        });
        await this.audit.log({
            action: 'CREATE',
            entityType: 'VENUE',
            entityId: venue.id,
            adminEmail,
            details: { name: venue.name },
        });
        return venue;
    }
    async update(id, dto, adminEmail) {
        try {
            const venue = await this.prisma.venue.update({
                where: { id },
                data: dto,
            });
            await this.audit.log({
                action: 'UPDATE',
                entityType: 'VENUE',
                entityId: venue.id,
                adminEmail,
                details: dto,
            });
            return venue;
        }
        catch {
            throw new NotFoundException(`Venue ${id} not found`);
        }
    }
    async remove(id, adminEmail) {
        try {
            const venueToDelete = await this.findOne(id);
            const deletedVenue = await this.prisma.venue.delete({
                where: { id },
            });
            await this.audit.log({
                action: 'DELETE',
                entityType: 'VENUE',
                entityId: id,
                adminEmail,
                details: { name: venueToDelete.name },
            });
            return deletedVenue;
        }
        catch {
            throw new NotFoundException(`Venue ${id} not found`);
        }
    }
};
VenuesService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        AuditService])
], VenuesService);
export { VenuesService };
//# sourceMappingURL=venues.service.js.map