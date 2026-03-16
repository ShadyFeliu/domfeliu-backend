import type { Request } from 'express';
import { TracksService } from './tracks.service.js';
import { CreateTrackDto, UpdateTrackDto } from './dto/track.dto.js';
import type { Track } from '@prisma/client';
export declare class TracksController {
    private readonly tracksService;
    constructor(tracksService: TracksService);
    findAllPublished(): Promise<Track[]>;
    findOne(id: string): Promise<Track>;
    findAll(): Promise<Track[]>;
    create(dto: CreateTrackDto, req: Request): Promise<Track>;
    update(id: string, dto: UpdateTrackDto, req: Request): Promise<Track>;
    remove(id: string, req: Request): Promise<Track>;
}
