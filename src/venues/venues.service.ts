import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateVenueDto, UpdateVenueDto } from './dto/venue.dto.js';
import { Venue } from './entities/venue.entity.js';

import { AuditService } from '../audit/audit.service.js';

@Injectable()
export class VenuesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async findAll(): Promise<Venue[]> {
    return this.prisma.venue.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string): Promise<Venue> {
    const venue = await this.prisma.venue.findUnique({
      where: { id },
    });

    if (!venue) {
      throw new NotFoundException(`Venue ${id} not found`);
    }
    return venue;
  }

  async create(dto: CreateVenueDto, adminEmail: string): Promise<Venue> {
    const venue = await this.prisma.venue.create({
      data: dto,
    });
    await this.audit.log({
      action: 'CREATE',
      entityType: 'VENUE',
      entityId: venue.id,
      adminEmail,
      details: { name: venue.name },
    });
    return venue;
  }

  async update(
    id: string,
    dto: UpdateVenueDto,
    adminEmail: string,
  ): Promise<Venue> {
    try {
      const venue = await this.prisma.venue.update({
        where: { id },
        data: dto,
      });
      await this.audit.log({
        action: 'UPDATE',
        entityType: 'VENUE',
        entityId: venue.id,
        adminEmail,
        details: dto,
      });
      return venue;
    } catch {
      throw new NotFoundException(`Venue ${id} not found`);
    }
  }

  async remove(id: string, adminEmail: string): Promise<Venue> {
    try {
      const venueToDelete = await this.findOne(id);
      const deletedVenue = await this.prisma.venue.delete({
        where: { id },
      });
      await this.audit.log({
        action: 'DELETE',
        entityType: 'VENUE',
        entityId: id,
        adminEmail,
        details: { name: venueToDelete.name },
      });
      return deletedVenue;
    } catch {
      throw new NotFoundException(`Venue ${id} not found`);
    }
  }
}
