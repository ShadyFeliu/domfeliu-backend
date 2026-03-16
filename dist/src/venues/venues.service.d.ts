import { PrismaService } from '../prisma/prisma.service.js';
import { CreateVenueDto, UpdateVenueDto } from './dto/venue.dto.js';
import { Venue } from './entities/venue.entity.js';
import { AuditService } from '../audit/audit.service.js';
export declare class VenuesService {
    private readonly prisma;
    private readonly audit;
    constructor(prisma: PrismaService, audit: AuditService);
    findAll(): Promise<Venue[]>;
    findOne(id: string): Promise<Venue>;
    create(dto: CreateVenueDto, adminEmail: string): Promise<Venue>;
    update(id: string, dto: UpdateVenueDto, adminEmail: string): Promise<Venue>;
    remove(id: string, adminEmail: string): Promise<Venue>;
}
