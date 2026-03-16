import { PrismaService } from './prisma/prisma.service.js';
export declare class AppService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getStatus(): Promise<{
        status: string;
        database: string;
        version: string;
        environment: string;
        uptime: number;
    }>;
}
