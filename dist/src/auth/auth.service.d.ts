import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';
import type { LoginDto } from './dto/login.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import type { JwtPayload } from './interfaces/jwt-payload.interface.js';
import { AuditService } from '../audit/audit.service.js';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly audit;
    constructor(prisma: PrismaService, jwtService: JwtService, audit: AuditService);
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
    }>;
    validateAdmin(payload: JwtPayload): Promise<{
        id: string;
        email: string;
        profileImage: string | null;
        bio: string | null;
        presskitUrl: string | null;
    } | null>;
    updateProfile(adminId: string, updateDto: UpdateProfileDto): Promise<{
        id: string;
        email: string;
        profileImage: string | null;
        bio: string | null;
        presskitUrl: string | null;
    }>;
    getArtistProfile(): Promise<{
        profileImage: string | null;
        bio: string | null;
        presskitUrl: string | null;
    }>;
}
