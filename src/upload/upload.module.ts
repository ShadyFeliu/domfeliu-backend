import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller.js';
import { SharpService } from './sharp.service.js';
import { FfmpegService } from './ffmpeg.service.js';

@Module({
  controllers: [UploadController],
  providers: [SharpService, FfmpegService],
  exports: [SharpService, FfmpegService],
})
export class UploadModule {}
