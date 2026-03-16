import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { TracksService } from './tracks.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { AuditService } from '../audit/audit.service.js';
import { NotFoundException } from '@nestjs/common';
import * as fs from 'fs/promises';

// Mock fs/promises
vi.mock('fs/promises', () => ({
  unlink: vi.fn().mockResolvedValue(undefined),
}));

describe('TracksService', () => {
  let service: TracksService;
  let prisma: PrismaService;

  const mockTrack = {
    id: 'track-1',
    title: 'Test Track',
    artist: 'Dom Feliu',
    audioUrl: '/uploads/test.mp3',
    coverUrl: null,
    spotifyUrl: null,
    soundcloudUrl: null,
    order: 0,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    track: {
      findMany: vi.fn().mockResolvedValue([mockTrack]),
      findUnique: vi.fn().mockResolvedValue(mockTrack),
      create: vi.fn().mockResolvedValue(mockTrack),
      update: vi.fn().mockResolvedValue(mockTrack),
      delete: vi.fn().mockResolvedValue(mockTrack),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TracksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: AuditService,
          useValue: { log: vi.fn().mockResolvedValue({}) },
        },
      ],
    }).compile();

    service = module.get<TracksService>(TracksService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllPublished', () => {
    it('should return published tracks', async () => {
      const result = await service.findAllPublished();
      expect(result).toEqual([mockTrack]);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.track.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a track if found', async () => {
      const result = await service.findOne('track-1');
      expect(result).toEqual(mockTrack);
    });

    it('should throw NotFoundException if track not found', async () => {
      mockPrismaService.track.findUnique.mockResolvedValueOnce(null);
      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete from database and call unlink for local files', async () => {
      mockPrismaService.track.findUnique.mockResolvedValueOnce(mockTrack);

      const result = await service.remove('track-1', 'admin@test.com');

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.track.delete).toHaveBeenCalledWith({
        where: { id: 'track-1' },
      });
      expect(fs.unlink).toHaveBeenCalled();
      expect(result).toEqual(mockTrack);
    });

    it('should not call unlink if audioUrl is external', async () => {
      const externalTrack = {
        ...mockTrack,
        audioUrl: 'https://example.com/audio.mp3',
      };
      mockPrismaService.track.findUnique.mockResolvedValueOnce(externalTrack);
      mockPrismaService.track.delete.mockResolvedValueOnce(externalTrack);

      await service.remove('track-1', 'admin@test.com');

      expect(fs.unlink).not.toHaveBeenCalled();
    });
  });
});
