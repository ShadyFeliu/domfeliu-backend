import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { VenuesService } from './venues.service.js';
import { CreateVenueDto, UpdateVenueDto } from './dto/venue.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { Venue } from './entities/venue.entity.js';

@Controller('venues')
export class VenuesController {
  constructor(private readonly venuesService: VenuesService) {}

  @Get()
  findAll(): Promise<Venue[]> {
    return this.venuesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Venue> {
    return this.venuesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createVenueDto: CreateVenueDto,
    @Req() req: Request,
  ): Promise<Venue> {
    const admin = req.user as { email: string };
    return this.venuesService.create(createVenueDto, admin.email);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateVenueDto: UpdateVenueDto,
    @Req() req: Request,
  ): Promise<Venue> {
    const admin = req.user as { email: string };
    return this.venuesService.update(id, updateVenueDto, admin.email);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() req: Request): Promise<Venue> {
    const admin = req.user as { email: string };
    return this.venuesService.remove(id, admin.email);
  }
}
