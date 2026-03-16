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
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req, } from '@nestjs/common';
import { EventsService } from './events.service.js';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
let EventsController = class EventsController {
    eventsService;
    constructor(eventsService) {
        this.eventsService = eventsService;
    }
    async findAllPublished() {
        return this.eventsService.findAllPublished();
    }
    async findOne(id) {
        return this.eventsService.findOne(id);
    }
    async findAll() {
        return this.eventsService.findAll();
    }
    async create(dto, req) {
        const admin = req.user;
        return this.eventsService.create(dto, admin.email);
    }
    async update(id, dto, req) {
        const admin = req.user;
        return this.eventsService.update(id, dto, admin.email);
    }
    async remove(id, req) {
        const admin = req.user;
        return this.eventsService.remove(id, admin.email);
    }
};
__decorate([
    Get('events'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "findAllPublished", null);
__decorate([
    Get('events/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "findOne", null);
__decorate([
    UseGuards(JwtAuthGuard),
    Get('admin/events'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "findAll", null);
__decorate([
    UseGuards(JwtAuthGuard),
    Post('admin/events'),
    __param(0, Body()),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateEventDto, Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "create", null);
__decorate([
    UseGuards(JwtAuthGuard),
    Put('admin/events/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateEventDto, Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "update", null);
__decorate([
    UseGuards(JwtAuthGuard),
    Delete('admin/events/:id'),
    __param(0, Param('id')),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "remove", null);
EventsController = __decorate([
    Controller(),
    __metadata("design:paramtypes", [EventsService])
], EventsController);
export { EventsController };
//# sourceMappingURL=events.controller.js.map