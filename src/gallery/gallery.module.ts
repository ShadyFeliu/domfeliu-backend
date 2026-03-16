import { Module } from '@nestjs/common';
import { GalleryService } from './gallery.service.js';
import { GalleryController } from './gallery.controller.js';

@Module({
  controllers: [GalleryController],
  providers: [GalleryService],
})
export class GalleryModule {}
