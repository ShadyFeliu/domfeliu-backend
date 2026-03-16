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
import { TracksService } from './tracks.service.js';
import { CreateTrackDto, UpdateTrackDto } from './dto/track.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
let TracksController = class TracksController {
    tracksService;
    constructor(tracksService) {
        this.tracksService = tracksService;
    }
    async findAllPublished() {
        return this.tracksService.findAllPublished();
    }
    async findOne(id) {
        return this.tracksService.findOne(id);
    }
    async findAll() {
        return this.tracksService.findAll();
    }
    async create(dto, req) {
        const admin = req.user;
        return this.tracksService.create(dto, admin.email);
    }
    async update(id, dto, req) {
        const admin = req.user;
        return this.tracksService.update(id, dto, admin.email);
    }
    async remove(id, req) {
        const admin = req.user;
        return this.tracksService.remove(id, admin.email);
    }
};
__decorate([
    Get('tracks'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TracksController.prototype, "findAllPublished", null);
__decorate([
    Get('tracks/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TracksController.prototype, "findOne", null);
__decorate([
    UseGuards(JwtAuthGuard),
    Get('admin/tracks'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TracksController.prototype, "findAll", null);
__decorate([
    UseGuards(JwtAuthGuard),
    Post('admin/tracks'),
    __param(0, Body()),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateTrackDto, Object]),
    __metadata("design:returntype", Promise)
], TracksController.prototype, "create", null);
__decorate([
    UseGuards(JwtAuthGuard),
    Put('admin/tracks/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateTrackDto, Object]),
    __metadata("design:returntype", Promise)
], TracksController.prototype, "update", null);
__decorate([
    UseGuards(JwtAuthGuard),
    Delete('admin/tracks/:id'),
    __param(0, Param('id')),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TracksController.prototype, "remove", null);
TracksController = __decorate([
    Controller(),
    __metadata("design:paramtypes", [TracksService])
], TracksController);
export { TracksController };
//# sourceMappingURL=tracks.controller.js.map