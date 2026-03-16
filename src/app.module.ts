import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { TracksModule } from './tracks/tracks.module.js';
import { EventsModule } from './events/events.module.js';
import { GalleryModule } from './gallery/gallery.module.js';
import { ContactModule } from './contact/contact.module.js';
import { UploadModule } from './upload/upload.module.js';
import { VenuesModule } from './venues/venues.module.js';
import { AdminModule } from './admin/admin.module.js';
import { AuditModule } from './audit/audit.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 60, // 60 requests per minute
      },
    ]),
    PrismaModule,
    AuthModule,
    TracksModule,
    EventsModule,
    GalleryModule,
    ContactModule,
    UploadModule,
    VenuesModule,
    AdminModule,
    AuditModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
