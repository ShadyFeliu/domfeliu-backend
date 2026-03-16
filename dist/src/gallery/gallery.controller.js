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
import { GalleryService } from './gallery.service.js';
import { CreateGalleryItemDto, UpdateGalleryItemDto, } from './dto/gallery.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
let GalleryController = class GalleryController {
    galleryService;
    constructor(galleryService) {
        this.galleryService = galleryService;
    }
    async findAll() {
        return this.galleryService.findAll();
    }
    async create(dto, req) {
        const admin = req.user;
        return this.galleryService.create(dto, admin.email);
    }
    async update(id, dto, req) {
        const admin = req.user;
        return this.galleryService.update(id, dto, admin.email);
    }
    async remove(id, req) {
        const admin = req.user;
        return this.galleryService.remove(id, admin.email);
    }
};
__decorate([
    Get('gallery'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GalleryController.prototype, "findAll", null);
__decorate([
    UseGuards(JwtAuthGuard),
    Post('admin/gallery'),
    __param(0, Body()),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateGalleryItemDto, Object]),
    __metadata("design:returntype", Promise)
], GalleryController.prototype, "create", null);
__decorate([
    UseGuards(JwtAuthGuard),
    Put('admin/gallery/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateGalleryItemDto, Object]),
    __metadata("design:returntype", Promise)
], GalleryController.prototype, "update", null);
__decorate([
    UseGuards(JwtAuthGuard),
    Delete('admin/gallery/:id'),
    __param(0, Param('id')),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GalleryController.prototype, "remove", null);
GalleryController = __decorate([
    Controller(),
    __metadata("design:paramtypes", [GalleryService])
], GalleryController);
export { GalleryController };
//# sourceMappingURL=gallery.controller.js.map