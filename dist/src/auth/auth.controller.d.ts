import type { Response } from 'express';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto, response: Response): Promise<{
        message: string;
    }>;
    logout(response: Response): {
        message: string;
    };
    validate(): {
        ok: boolean;
    };
    updateProfile(adminId: string, updateDto: UpdateProfileDto): Promise<{
        id: string;
        email: string;
        profileImage: string | null;
        bio: string | null;
        presskitUrl: string | null;
    }>;
    getArtist(): Promise<{
        profileImage: string | null;
        bio: string | null;
        presskitUrl: string | null;
    }>;
}
