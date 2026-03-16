var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req, } from '@nestjs/common';
import { ContactService } from './contact.service.js';
import { CreateContactDto } from './dto/contact.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
let ContactController = class ContactController {
    contactService;
    constructor(contactService) {
        this.contactService = contactService;
    }
    async create(dto) {
        return this.contactService.create(dto);
    }
    async findAll() {
        return this.contactService.findAll();
    }
    async countUnread() {
        const count = await this.contactService.countUnread();
        return { count };
    }
    async markAsRead(id, req) {
        const admin = req.user;
        return this.contactService.markAsRead(id, admin.email);
    }
    async remove(id, req) {
        const admin = req.user;
        return this.contactService.remove(id, admin.email);
    }
};
__decorate([
    Post('contact'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateContactDto]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "create", null);
__decorate([
    UseGuards(JwtAuthGuard),
    Get('admin/contacts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "findAll", null);
__decorate([
    UseGuards(JwtAuthGuard),
    Get('admin/contacts/unread-count'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "countUnread", null);
__decorate([
    UseGuards(JwtAuthGuard),
    Patch('admin/contacts/:id/read'),
    __param(0, Param('id')),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "markAsRead", null);
__decorate([
    Delete('admin/contacts/:id'),
    __param(0, Param('id')),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "remove", null);
ContactController = __decorate([
    Controller(),
    __metadata("design:paramtypes", [ContactService])
], ContactController);
export { ContactController };
//# sourceMappingURL=contact.controller.js.map