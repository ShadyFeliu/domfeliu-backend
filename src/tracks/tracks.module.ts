import { Module } from '@nestjs/common';
import { TracksService } from './tracks.service.js';
import { TracksController } from './tracks.controller.js';

@Module({
  controllers: [TracksController],
  providers: [TracksService],
})
export class TracksModule {}
