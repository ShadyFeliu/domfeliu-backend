import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const now = new Date();

    const [
      trackCount,
      publishedTrackCount,
      lastTrack,
      eventCount,
      upcomingEventCount,
      lastEvent,
      messageCount,
      unreadMessageCount,
      lastMessage,
      galleryCount,
      imageCount,
      videoCount,
      venueCount,
    ] = await Promise.all([
      this.prisma.track.count(),
      this.prisma.track.count({ where: { isPublished: true } }),
      this.prisma.track.findFirst({ orderBy: { createdAt: 'desc' } }),
      this.prisma.event.count(),
      this.prisma.event.count({
        where: { date: { gte: now }, isPublished: true },
      }),
      this.prisma.event.findFirst({ orderBy: { createdAt: 'desc' } }),
      this.prisma.contactMessage.count(),
      this.prisma.contactMessage.count({ where: { isRead: false } }),
      this.prisma.contactMessage.findFirst({ orderBy: { createdAt: 'desc' } }),
      this.prisma.galleryItem.count(),
      this.prisma.galleryItem.count({ where: { type: 'image' } }),
      this.prisma.galleryItem.count({ where: { type: 'video' } }),
      this.prisma.venue.count(),
    ]);

    return {
      tracks: {
        total: trackCount,
        published: publishedTrackCount,
        latest: lastTrack,
      },
      events: {
        total: eventCount,
        upcoming: upcomingEventCount,
        latest: lastEvent,
      },
      messages: {
        total: messageCount,
        unread: unreadMessageCount,
        latest: lastMessage,
      },
      gallery: {
        total: galleryCount,
        images: imageCount,
        videos: videoCount,
      },
      venues: {
        total: venueCount,
      },
    };
  }
}
