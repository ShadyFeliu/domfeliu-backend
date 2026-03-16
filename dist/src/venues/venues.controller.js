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
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, } from '@nestjs/common';
import { VenuesService } from './venues.service.js';
import { CreateVenueDto, UpdateVenueDto } from './dto/venue.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
let VenuesController = class VenuesController {
    venuesService;
    constructor(venuesService) {
        this.venuesService = venuesService;
    }
    findAll() {
        return this.venuesService.findAll();
    }
    findOne(id) {
        return this.venuesService.findOne(id);
    }
    create(createVenueDto, req) {
        const admin = req.user;
        return this.venuesService.create(createVenueDto, admin.email);
    }
    update(id, updateVenueDto, req) {
        const admin = req.user;
        return this.venuesService.update(id, updateVenueDto, admin.email);
    }
    remove(id, req) {
        const admin = req.user;
        return this.venuesService.remove(id, admin.email);
    }
};
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VenuesController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VenuesController.prototype, "findOne", null);
__decorate([
    Post(),
    UseGuards(JwtAuthGuard),
    __param(0, Body()),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateVenueDto, Object]),
    __metadata("design:returntype", Promise)
], VenuesController.prototype, "create", null);
__decorate([
    Patch(':id'),
    UseGuards(JwtAuthGuard),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateVenueDto, Object]),
    __metadata("design:returntype", Promise)
], VenuesController.prototype, "update", null);
__decorate([
    Delete(':id'),
    UseGuards(JwtAuthGuard),
    __param(0, Param('id')),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VenuesController.prototype, "remove", null);
VenuesController = __decorate([
    Controller('venues'),
    __metadata("design:paramtypes", [VenuesService])
], VenuesController);
export { VenuesController };
//# sourceMappingURL=venues.controller.js.map