var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service.js';
let AppService = class AppService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStatus() {
        let dbStatus = 'Disconnected';
        try {
            await this.prisma.$queryRaw `SELECT 1`;
            dbStatus = 'Online';
        }
        catch (error) {
            console.error('Database connection failed', error);
        }
        return {
            status: 'ok',
            database: dbStatus,
            version: '2.0.0',
            environment: process.env.NODE_ENV || 'development',
            uptime: process.uptime(),
        };
    }
};
AppService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], AppService);
export { AppService };
//# sourceMappingURL=app.service.js.map