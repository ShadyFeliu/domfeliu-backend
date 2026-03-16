import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { ContactService } from './contact.service.js';
import { CreateContactDto } from './dto/contact.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import type { ContactMessage } from '@prisma/client';

@Controller()
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  // Public endpoint
  @Post('contact')
  async create(@Body() dto: CreateContactDto): Promise<{ message: string }> {
    return this.contactService.create(dto);
  }

  // Admin endpoints
  @UseGuards(JwtAuthGuard)
  @Get('admin/contacts')
  async findAll(): Promise<ContactMessage[]> {
    return this.contactService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/contacts/unread-count')
  async countUnread(): Promise<{ count: number }> {
    const count = await this.contactService.countUnread();
    return { count };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/contacts/:id/read')
  async markAsRead(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<ContactMessage> {
    const admin = req.user as { email: string };
    return this.contactService.markAsRead(id, admin.email);
  }

  @Delete('admin/contacts/:id')
  async remove(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<ContactMessage> {
    const admin = req.user as { email: string };
    return this.contactService.remove(id, admin.email);
  }
}
