import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { AuthService } from './auth.service.js';
import { GetUser } from './decorators/get-user.decorator.js';
import { LoginDto } from './dto/login.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    const { accessToken } = await this.authService.login(loginDto);

    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true, // Required for sameSite: 'none'
      sameSite: 'none',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    return { message: 'Logged in successfully' };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) response: Response): { message: string } {
    response.clearCookie('accessToken', {
      httpOnly: true,
      secure: true, // Required for sameSite: 'none'
      sameSite: 'none',
      path: '/',
    });
    return { message: 'Logged out successfully' };
  }

  @Get('validate')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  validate() {
    return { ok: true };
  }

  @Patch('profile')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @GetUser('id') adminId: string,
    @Body() updateDto: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(adminId, updateDto);
  }

  @Get('artist')
  @HttpCode(HttpStatus.OK)
  async getArtist() {
    return this.authService.getArtistProfile();
  }
}
