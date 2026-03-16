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
let ContactService = class ContactService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async create(dto) {
        await this.prisma.contactMessage.create({ data: dto });
        return { message: 'Mensaje enviado correctamente' };
    }
    async findAll() {
        return await this.prisma.contactMessage.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async markAsRead(id, adminEmail) {
        const msg = await this.prisma.contactMessage.findUnique({ where: { id } });
        if (!msg) {
            throw new NotFoundException(`Message ${id} not found`);
        }
        const updatedMsg = await this.prisma.contactMessage.update({
            where: { id },
            data: { isRead: true },
        });
        await this.audit.log({
            action: 'UPDATE',
            entityType: 'CONTACT',
            entityId: id,
            adminEmail,
            details: { action: 'MARK_AS_READ', name: msg.name },
        });
        return updatedMsg;
    }
    async remove(id, adminEmail) {
        const msg = await this.prisma.contactMessage.findUnique({ where: { id } });
        if (!msg) {
            throw new NotFoundException(`Message ${id} not found`);
        }
        const deletedMsg = await this.prisma.contactMessage.delete({
            where: { id },
        });
        await this.audit.log({
            action: 'DELETE',
            entityType: 'CONTACT',
            entityId: id,
            adminEmail,
            details: { name: msg.name, email: msg.email },
        });
        return deletedMsg;
    }
    async countUnread() {
        return await this.prisma.contactMessage.count({
            where: { isRead: false },
        });
    }
};
ContactService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        AuditService])
], ContactService);
export { ContactService };
//# sourceMappingURL=contact.service.js.map