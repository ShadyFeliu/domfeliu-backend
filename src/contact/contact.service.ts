import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateContactDto } from './dto/contact.dto.js';
import type { ContactMessage } from '@prisma/client';

import { AuditService } from '../audit/audit.service.js';

@Injectable()
export class ContactService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async create(dto: CreateContactDto): Promise<{ message: string }> {
    await this.prisma.contactMessage.create({ data: dto });
    return { message: 'Mensaje enviado correctamente' };
  }

  async findAll(): Promise<ContactMessage[]> {
    return await this.prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string, adminEmail: string): Promise<ContactMessage> {
    const msg: ContactMessage | null =
      await this.prisma.contactMessage.findUnique({ where: { id } });
    if (!msg) {
      throw new NotFoundException(`Message ${id} not found`);
    }

    const updatedMsg = await this.prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });

    await this.audit.log({
      action: 'UPDATE',
      entityType: 'CONTACT',
      entityId: id,
      adminEmail,
      details: { action: 'MARK_AS_READ', name: msg.name },
    });

    return updatedMsg;
  }

  async remove(id: string, adminEmail: string): Promise<ContactMessage> {
    const msg: ContactMessage | null =
      await this.prisma.contactMessage.findUnique({ where: { id } });
    if (!msg) {
      throw new NotFoundException(`Message ${id} not found`);
    }

    const deletedMsg = await this.prisma.contactMessage.delete({
      where: { id },
    });

    await this.audit.log({
      action: 'DELETE',
      entityType: 'CONTACT',
      entityId: id,
      adminEmail,
      details: { name: msg.name, email: msg.email },
    });

    return deletedMsg;
  }

  async countUnread(): Promise<number> {
    return await this.prisma.contactMessage.count({
      where: { isRead: false },
    });
  }
}
