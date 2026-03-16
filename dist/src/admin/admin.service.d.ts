import { PrismaService } from '../prisma/prisma.service.js';
export declare class AdminService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getStats(): Promise<{
        tracks: {
            total: number;
            published: number;
            latest: {
                id: string;
                createdAt: Date;
                title: string;
                artist: string;
                audioUrl: string;
                coverUrl: string | null;
                spotifyUrl: string | null;
                soundcloudUrl: string | null;
                order: number;
                isPublished: boolean;
                updatedAt: Date;
            } | null;
        };
        events: {
            total: number;
            upcoming: number;
            latest: {
                id: string;
                createdAt: Date;
                venue: string;
                title: string;
                isPublished: boolean;
                updatedAt: Date;
                date: Date;
                city: string;
                country: string;
                ticketUrl: string | null;
                imageUrl: string | null;
            } | null;
        };
        messages: {
            total: number;
            unread: number;
            latest: {
                name: string;
                id: string;
                email: string;
                createdAt: Date;
                subject: string;
                message: string;
                isRead: boolean;
            } | null;
        };
        gallery: {
            total: number;
            images: number;
            videos: number;
        };
        venues: {
            total: number;
        };
    }>;
}
