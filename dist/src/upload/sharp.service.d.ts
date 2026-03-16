export declare class SharpService {
    private readonly uploadPath;
    optimize(file: Express.Multer.File): Promise<{
        filename: string;
        url: string;
    }>;
}
