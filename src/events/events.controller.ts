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
import { EventsService } from './events.service.js';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import type { Event } from '@prisma/client';

@Controller()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('events')
  async findAllPublished(): Promise<Event[]> {
    return this.eventsService.findAllPublished();
  }

  @Get('events/:id')
  async findOne(@Param('id') id: string): Promise<Event> {
    return this.eventsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/events')
  async findAll(): Promise<Event[]> {
    return this.eventsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/events')
  async create(
    @Body() dto: CreateEventDto,
    @Req() req: Request,
  ): Promise<Event> {
    const admin = req.user as { email: string };
    return this.eventsService.create(dto, admin.email);
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/events/:id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
    @Req() req: Request,
  ): Promise<Event> {
    const admin = req.user as { email: string };
    return this.eventsService.update(id, dto, admin.email);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/events/:id')
  async remove(@Param('id') id: string, @Req() req: Request): Promise<Event> {
    const admin = req.user as { email: string };
    return this.eventsService.remove(id, admin.email);
  }
}
