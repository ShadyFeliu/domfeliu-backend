import type { Request } from 'express';
import { VenuesService } from './venues.service.js';
import { CreateVenueDto, UpdateVenueDto } from './dto/venue.dto.js';
import { Venue } from './entities/venue.entity.js';
export declare class VenuesController {
    private readonly venuesService;
    constructor(venuesService: VenuesService);
    findAll(): Promise<Venue[]>;
    findOne(id: string): Promise<Venue>;
    create(createVenueDto: CreateVenueDto, req: Request): Promise<Venue>;
    update(id: string, updateVenueDto: UpdateVenueDto, req: Request): Promise<Venue>;
    remove(id: string, req: Request): Promise<Venue>;
}
