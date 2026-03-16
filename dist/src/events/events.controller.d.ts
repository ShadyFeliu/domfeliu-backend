import type { Request } from 'express';
import { EventsService } from './events.service.js';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto.js';
import type { Event } from '@prisma/client';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    findAllPublished(): Promise<Event[]>;
    findOne(id: string): Promise<Event>;
    findAll(): Promise<Event[]>;
    create(dto: CreateEventDto, req: Request): Promise<Event>;
    update(id: string, dto: UpdateEventDto, req: Request): Promise<Event>;
    remove(id: string, req: Request): Promise<Event>;
}
