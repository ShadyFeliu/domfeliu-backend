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
import { TracksService } from './tracks.service.js';
import { CreateTrackDto, UpdateTrackDto } from './dto/track.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import type { Track } from '@prisma/client';

@Controller()
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  // Public endpoints
  @Get('tracks')
  async findAllPublished(): Promise<Track[]> {
    return this.tracksService.findAllPublished();
  }

  @Get('tracks/:id')
  async findOne(@Param('id') id: string): Promise<Track> {
    return this.tracksService.findOne(id);
  }

  // Admin endpoints
  @UseGuards(JwtAuthGuard)
  @Get('admin/tracks')
  async findAll(): Promise<Track[]> {
    return this.tracksService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/tracks')
  async create(
    @Body() dto: CreateTrackDto,
    @Req() req: Request,
  ): Promise<Track> {
    const admin = req.user as { email: string };
    return this.tracksService.create(dto, admin.email);
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/tracks/:id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTrackDto,
    @Req() req: Request,
  ): Promise<Track> {
    const admin = req.user as { email: string };
    return this.tracksService.update(id, dto, admin.email);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/tracks/:id')
  async remove(@Param('id') id: string, @Req() req: Request): Promise<Track> {
    const admin = req.user as { email: string };
    return this.tracksService.remove(id, admin.email);
  }
}
