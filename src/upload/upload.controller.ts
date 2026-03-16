import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { diskStorage, memoryStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { Express } from 'express';
import { SharpService } from './sharp.service.js';
import { FfmpegService } from './ffmpeg.service.js';
import { promises as fs } from 'fs';

const storage = diskStorage({
  destination: './uploads',
  filename: (_req, file, cb) => {
    const ext = extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

const audioFilter = (
  _req: unknown,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
): void => {
  const allowedMimes = [
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/mp4',
    'audio/webm',
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestException('Only audio files are allowed'), false);
  }
};

const imageFilter = (
  _req: unknown,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
): void => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestException('Only image files are allowed'), false);
  }
};

const documentFilter = (
  _req: unknown,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
): void => {
  const allowedMimes = ['application/pdf'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestException('Only PDF files are allowed'), false);
  }
};

@Controller('admin/upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  private readonly logger = new Logger(UploadController.name);

  constructor(
    private readonly sharpService: SharpService,
    private readonly ffmpegService: FfmpegService,
  ) {}

  @Post('audio')
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      fileFilter: audioFilter,
      limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    }),
  )
  async uploadAudio(@UploadedFile() file: Express.Multer.File): Promise<{
    url: string;
    filename: string;
    originalName: string;
  }> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      const inputPath = file.path;
      const outputPath = await this.ffmpegService.optimizeAudio(inputPath);
      const optimizedFilename = join(outputPath).split(/[\\/]/).pop() || '';

      // Delete original file to save space
      await fs.unlink(inputPath);

      return {
        url: `/uploads/${optimizedFilename}`,
        filename: optimizedFilename,
        originalName: file.originalname,
      };
    } catch (error) {
      this.logger.error(
        `Failed to optimize audio: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      return {
        url: `/uploads/${file.filename}`,
        filename: file.filename,
        originalName: file.originalname,
      };
    }
  }

  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: imageFilter,
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File): Promise<{
    url: string;
    filename: string;
  }> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const { filename, url } = await this.sharpService.optimize(file);

    return {
      url,
      filename,
    };
  }

  @Post('document')
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      fileFilter: documentFilter,
      limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
    }),
  )
  uploadDocument(@UploadedFile() file: Express.Multer.File): {
    url: string;
    filename: string;
    originalName: string;
  } {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return {
      url: `/uploads/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
    };
  }
}
