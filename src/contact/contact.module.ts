import { Module } from '@nestjs/common';
import { ContactService } from './contact.service.js';
import { ContactController } from './contact.controller.js';

@Module({
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
