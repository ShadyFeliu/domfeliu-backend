var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var UploadController_1;
import { Controller, Post, UseGuards, UseInterceptors, UploadedFile, BadRequestException, Logger, } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { diskStorage, memoryStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
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
const audioFilter = (_req, file, cb) => {
    const allowedMimes = [
        'audio/mpeg',
        'audio/wav',
        'audio/ogg',
        'audio/mp4',
        'audio/webm',
    ];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new BadRequestException('Only audio files are allowed'), false);
    }
};
const imageFilter = (_req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new BadRequestException('Only image files are allowed'), false);
    }
};
const documentFilter = (_req, file, cb) => {
    const allowedMimes = ['application/pdf'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new BadRequestException('Only PDF files are allowed'), false);
    }
};
let UploadController = UploadController_1 = class UploadController {
    sharpService;
    ffmpegService;
    logger = new Logger(UploadController_1.name);
    constructor(sharpService, ffmpegService) {
        this.sharpService = sharpService;
        this.ffmpegService = ffmpegService;
    }
    async uploadAudio(file) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }
        try {
            const inputPath = file.path;
            const outputPath = await this.ffmpegService.optimizeAudio(inputPath);
            const optimizedFilename = join(outputPath).split(/[\\/]/).pop() || '';
            await fs.unlink(inputPath);
            return {
                url: `/uploads/${optimizedFilename}`,
                filename: optimizedFilename,
                originalName: file.originalname,
            };
        }
        catch (error) {
            this.logger.error(`Failed to optimize audio: ${error instanceof Error ? error.message : String(error)}`);
            return {
                url: `/uploads/${file.filename}`,
                filename: file.filename,
                originalName: file.originalname,
            };
        }
    }
    async uploadImage(file) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }
        const { filename, url } = await this.sharpService.optimize(file);
        return {
            url,
            filename,
        };
    }
    uploadDocument(file) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }
        return {
            url: `/uploads/${file.filename}`,
            filename: file.filename,
            originalName: file.originalname,
        };
    }
};
__decorate([
    Post('audio'),
    UseInterceptors(FileInterceptor('file', {
        storage,
        fileFilter: audioFilter,
        limits: { fileSize: 50 * 1024 * 1024 },
    })),
    __param(0, UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadAudio", null);
__decorate([
    Post('image'),
    UseInterceptors(FileInterceptor('file', {
        storage: memoryStorage(),
        fileFilter: imageFilter,
        limits: { fileSize: 10 * 1024 * 1024 },
    })),
    __param(0, UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadImage", null);
__decorate([
    Post('document'),
    UseInterceptors(FileInterceptor('file', {
        storage,
        fileFilter: documentFilter,
        limits: { fileSize: 20 * 1024 * 1024 },
    })),
    __param(0, UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], UploadController.prototype, "uploadDocument", null);
UploadController = UploadController_1 = __decorate([
    Controller('admin/upload'),
    UseGuards(JwtAuthGuard),
    __metadata("design:paramtypes", [SharpService,
        FfmpegService])
], UploadController);
export { UploadController };
//# sourceMappingURL=upload.controller.js.map