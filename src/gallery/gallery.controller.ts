import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { GalleryService } from './gallery.service.js';
import {
  CreateGalleryItemDto,
  UpdateGalleryItemDto,
} from './dto/gallery.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import type { GalleryItem } from '@prisma/client';

@Controller()
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get('gallery')
  async findAll(): Promise<GalleryItem[]> {
    return this.galleryService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/gallery')
  async create(
    @Body() dto: CreateGalleryItemDto,
    @Req() req: Request,
  ): Promise<GalleryItem> {
    const admin = req.user as { email: string };
    return this.galleryService.create(dto, admin.email);
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/gallery/:id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateGalleryItemDto,
    @Req() req: Request,
  ): Promise<GalleryItem> {
    const admin = req.user as { email: string };
    return this.galleryService.update(id, dto, admin.email);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/gallery/:id')
  async remove(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<GalleryItem> {
    const admin = req.user as { email: string };
    return this.galleryService.remove(id, admin.email);
  }
}
