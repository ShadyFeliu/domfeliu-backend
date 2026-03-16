import { AppService } from './app.service.js';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getStatus(): Promise<{
        status: string;
        database: string;
        version: string;
        environment: string;
        uptime: number;
    }>;
}
