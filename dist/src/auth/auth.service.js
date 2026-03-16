var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { unlink } from 'fs/promises';
import { join, basename } from 'path';
import { AuditService } from '../audit/audit.service.js';
let AuthService = class AuthService {
    prisma;
    jwtService;
    audit;
    constructor(prisma, jwtService, audit) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.audit = audit;
    }
    async login(loginDto) {
        const admin = await this.prisma.adminUser.findUnique({
            where: { email: loginDto.email },
        });
        if (!admin) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, admin.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = { sub: admin.id, email: admin.email };
        const accessToken = await this.jwtService.signAsync(payload);
        await this.audit.log({
            action: 'LOGIN',
            entityType: 'ADMIN',
            entityId: admin.id,
            adminEmail: admin.email,
        });
        return { accessToken };
    }
    async validateAdmin(payload) {
        const admin = (await this.prisma.adminUser.findUnique({
            where: { id: payload.sub },
        }));
        if (!admin) {
            return null;
        }
        return {
            id: admin.id,
            email: admin.email,
            profileImage: admin.profileImage,
            bio: admin.bio,
            presskitUrl: admin.presskitUrl,
        };
    }
    async updateProfile(adminId, updateDto) {
        const currentAdmin = (await this.prisma.adminUser.findUnique({
            where: { id: adminId },
        }));
        const data = {};
        if (updateDto.email)
            data.email = updateDto.email;
        if (updateDto.profileImage)
            data.profileImage = updateDto.profileImage;
        if (updateDto.bio !== undefined)
            data.bio = updateDto.bio;
        if (updateDto.presskitUrl !== undefined)
            data.presskitUrl = updateDto.presskitUrl;
        if (updateDto.password) {
            data.password = await bcrypt.hash(updateDto.password, 10);
        }
        const oldImage = currentAdmin?.profileImage;
        const oldPresskit = currentAdmin?.presskitUrl;
        const updatedAdmin = (await this.prisma.adminUser.update({
            where: { id: adminId },
            data,
        }));
        await this.audit.log({
            action: 'UPDATE_PROFILE',
            entityType: 'ADMIN',
            entityId: adminId,
            adminEmail: updatedAdmin.email,
            details: {
                emailUpdated: !!updateDto.email,
                passwordUpdated: !!updateDto.password,
                bioUpdated: updateDto.bio !== undefined,
            },
        });
        if (updateDto.profileImage &&
            oldImage &&
            oldImage !== updateDto.profileImage &&
            !oldImage.startsWith('http')) {
            try {
                const filename = basename(oldImage);
                const filePath = join(process.cwd(), 'uploads', filename);
                await unlink(filePath);
                console.log(`✅ Deleted old profile image: ${filePath}`);
            }
            catch (err) {
                console.warn(`⚠️ Could not delete old profile image:`, err);
            }
        }
        if (updateDto.presskitUrl &&
            oldPresskit &&
            oldPresskit !== updateDto.presskitUrl &&
            !oldPresskit.startsWith('http')) {
            try {
                const filename = basename(oldPresskit);
                const filePath = join(process.cwd(), 'uploads', filename);
                await unlink(filePath);
                console.log(`✅ Deleted old presskit PDF: ${filePath}`);
            }
            catch (err) {
                console.warn(`⚠️ Could not delete old presskit PDF:`, err);
            }
        }
        return {
            id: updatedAdmin.id,
            email: updatedAdmin.email,
            profileImage: updatedAdmin.profileImage,
            bio: updatedAdmin.bio,
            presskitUrl: updatedAdmin.presskitUrl,
        };
    }
    async getArtistProfile() {
        const admin = (await this.prisma.adminUser.findFirst());
        return {
            profileImage: admin?.profileImage || null,
            bio: admin?.bio || null,
            presskitUrl: admin?.presskitUrl || null,
        };
    }
};
AuthService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        JwtService,
        AuditService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map