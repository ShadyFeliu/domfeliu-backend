import { SharpService } from './sharp.service.js';
import { FfmpegService } from './ffmpeg.service.js';
export declare class UploadController {
    private readonly sharpService;
    private readonly ffmpegService;
    private readonly logger;
    constructor(sharpService: SharpService, ffmpegService: FfmpegService);
    uploadAudio(file: Express.Multer.File): Promise<{
        url: string;
        filename: string;
        originalName: string;
    }>;
    uploadImage(file: Express.Multer.File): Promise<{
        url: string;
        filename: string;
    }>;
    uploadDocument(file: Express.Multer.File): {
        url: string;
        filename: string;
        originalName: string;
    };
}
