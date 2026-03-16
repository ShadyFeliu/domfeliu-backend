import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Mock bcrypt
vi.mock('bcrypt', () => ({
  compare: vi.fn(),
  hash: vi.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const mockAdmin = {
    id: 'admin-1',
    email: 'admin@domfeliu.com',
    password: 'hashed-password',
    profileImage: null,
    bio: 'Test bio',
    presskitUrl: null,
    createdAt: new Date(),
  };

  const mockPrismaService = {
    adminUser: {
      findUnique: vi.fn().mockResolvedValue(mockAdmin),
      findFirst: vi.fn().mockResolvedValue(mockAdmin),
      update: vi.fn().mockResolvedValue(mockAdmin),
    },
  };

  const mockJwtService = {
    signAsync: vi.fn().mockResolvedValue('mock-jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should throw UnauthorizedException if admin not found', async () => {
      mockPrismaService.adminUser.findUnique.mockResolvedValueOnce(null);
      await expect(
        service.login({ email: 'none@test.com', password: 'any' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password invalid', async () => {
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);
      await expect(
        service.login({ email: 'admin@domfeliu.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return accessToken if credentials are valid', async () => {
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
      const result = await service.login({
        email: 'admin@domfeliu.com',
        password: 'correct',
      });
      expect(result).toEqual({ accessToken: 'mock-jwt-token' });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(jwtService.signAsync).toHaveBeenCalled();
    });
  });

  describe('validateAdmin', () => {
    it('should return admin details if payload sub exists', async () => {
      const result = await service.validateAdmin({
        sub: 'admin-1',
        email: 'admin@domfeliu.com',
      });
      expect(result).toEqual({
        id: 'admin-1',
        email: 'admin@domfeliu.com',
        profileImage: null,
        bio: 'Test bio',
        presskitUrl: null,
      });
    });

    it('should return null if admin not found', async () => {
      mockPrismaService.adminUser.findUnique.mockResolvedValueOnce(null);
      const result = await service.validateAdmin({
        sub: 'non-existent',
        email: 'none@test.com',
      });
      expect(result).toBeNull();
    });
  });

  describe('getArtistProfile', () => {
    it('should return the first admin profile', async () => {
      const result = await service.getArtistProfile();
      expect(result).toEqual({
        profileImage: null,
        bio: 'Test bio',
        presskitUrl: null,
      });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.adminUser.findFirst).toHaveBeenCalled();
    });
  });
});
