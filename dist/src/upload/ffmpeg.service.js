var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var FfmpegService_1;
import { Injectable, Logger } from '@nestjs/common';
import ffmpeg from 'fluent-ffmpeg';
import { join, dirname, extname, basename } from 'path';
let FfmpegService = FfmpegService_1 = class FfmpegService {
    logger = new Logger(FfmpegService_1.name);
    async optimizeAudio(inputPath) {
        const outputDir = dirname(inputPath);
        const outputFileName = `optimized-${basename(inputPath, extname(inputPath))}.mp3`;
        const outputPath = join(outputDir, outputFileName);
        return new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .toFormat('mp3')
                .audioBitrate('256k')
                .audioFilters('loudnorm')
                .on('start', (commandLine) => {
                this.logger.log(`Spawned Ffmpeg with command: ${commandLine}`);
            })
                .on('error', (err) => {
                this.logger.error(`An error occurred: ${err.message}`);
                reject(err);
            })
                .on('end', () => {
                this.logger.log('Processing finished !');
                resolve(outputPath);
            })
                .save(outputPath);
        });
    }
    async getDuration(path) {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(path, (err, metadata) => {
                if (err) {
                    return reject(err instanceof Error ? err : new Error(String(err)));
                }
                resolve(metadata.format.duration || 0);
            });
        });
    }
};
FfmpegService = FfmpegService_1 = __decorate([
    Injectable()
], FfmpegService);
export { FfmpegService };
//# sourceMappingURL=ffmpeg.service.js.map