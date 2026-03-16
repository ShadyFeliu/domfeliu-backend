import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import type { LoginDto } from './dto/login.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import type { JwtPayload } from './interfaces/jwt-payload.interface.js';
import { unlink } from 'fs/promises';
import { join, basename } from 'path';

interface AdminWithBio {
  id: string;
  email: string;
  password: string;
  profileImage: string | null;
  bio: string | null;
  presskitUrl: string | null;
  createdAt: Date;
}

import { AuditService } from '../audit/audit.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly audit: AuditService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const admin = await this.prisma.adminUser.findUnique({
      where: { email: loginDto.email },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      admin.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { sub: admin.id, email: admin.email };
    const accessToken = await this.jwtService.signAsync(payload);

    await this.audit.log({
      action: 'LOGIN',
      entityType: 'ADMIN',
      entityId: admin.id,
      adminEmail: admin.email,
    });

    return { accessToken };
  }

  async validateAdmin(payload: JwtPayload): Promise<{
    id: string;
    email: string;
    profileImage: string | null;
    bio: string | null;
    presskitUrl: string | null;
  } | null> {
    const admin = (await this.prisma.adminUser.findUnique({
      where: { id: payload.sub },
    })) as AdminWithBio | null;

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

  async updateProfile(
    adminId: string,
    updateDto: UpdateProfileDto,
  ): Promise<{
    id: string;
    email: string;
    profileImage: string | null;
    bio: string | null;
    presskitUrl: string | null;
  }> {
    // Get existing to check for image cleanup
    const currentAdmin = (await this.prisma.adminUser.findUnique({
      where: { id: adminId },
    })) as AdminWithBio | null;

    const data: {
      email?: string;
      password?: string;
      profileImage?: string;
      bio?: string;
      presskitUrl?: string;
    } = {};

    if (updateDto.email) data.email = updateDto.email;
    if (updateDto.profileImage) data.profileImage = updateDto.profileImage;
    if (updateDto.bio !== undefined) data.bio = updateDto.bio;
    if (updateDto.presskitUrl !== undefined)
      data.presskitUrl = updateDto.presskitUrl;
    if (updateDto.password) {
      data.password = await bcrypt.hash(updateDto.password, 10);
    }

    // Capture old image before update
    const oldImage = currentAdmin?.profileImage;
    const oldPresskit = currentAdmin?.presskitUrl;

    const updatedAdmin = (await this.prisma.adminUser.update({
      where: { id: adminId },
      data,
    })) as unknown as AdminWithBio;

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

    // If image changed, cleanup the old one
    if (
      updateDto.profileImage &&
      oldImage &&
      oldImage !== updateDto.profileImage &&
      !oldImage.startsWith('http')
    ) {
      try {
        const filename = basename(oldImage);
        const filePath = join(process.cwd(), 'uploads', filename);
        await unlink(filePath);
        console.log(`✅ Deleted old profile image: ${filePath}`);
      } catch (err) {
        console.warn(`⚠️ Could not delete old profile image:`, err);
      }
    }

    // If presskit changed, cleanup the old one
    if (
      updateDto.presskitUrl &&
      oldPresskit &&
      oldPresskit !== updateDto.presskitUrl &&
      !oldPresskit.startsWith('http')
    ) {
      try {
        const filename = basename(oldPresskit);
        const filePath = join(process.cwd(), 'uploads', filename);
        await unlink(filePath);
        console.log(`✅ Deleted old presskit PDF: ${filePath}`);
      } catch (err) {
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

  async getArtistProfile(): Promise<{
    profileImage: string | null;
    bio: string | null;
    presskitUrl: string | null;
  }> {
    // Return the first admin's profile as the artist profile
    const admin =
      (await this.prisma.adminUser.findFirst()) as AdminWithBio | null;

    return {
      profileImage: admin?.profileImage || null,
      bio: admin?.bio || null,
      presskitUrl: admin?.presskitUrl || null,
    };
  }
}
