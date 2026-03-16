import { Injectable, Logger } from '@nestjs/common';
import ffmpeg from 'fluent-ffmpeg';
import { join, dirname, extname, basename } from 'path';

@Injectable()
export class FfmpegService {
  private readonly logger = new Logger(FfmpegService.name);

  async optimizeAudio(inputPath: string): Promise<string> {
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

  async getDuration(path: string): Promise<number> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(path, (err, metadata) => {
        if (err) {
          return reject(err instanceof Error ? err : new Error(String(err)));
        }
        resolve(metadata.format.duration || 0);
      });
    });
  }
}
