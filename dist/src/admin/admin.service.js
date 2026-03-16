var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStats() {
        const now = new Date();
        const [trackCount, publishedTrackCount, lastTrack, eventCount, upcomingEventCount, lastEvent, messageCount, unreadMessageCount, lastMessage, galleryCount, imageCount, videoCount, venueCount,] = await Promise.all([
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
};
AdminService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], AdminService);
export { AdminService };
//# sourceMappingURL=admin.service.js.map