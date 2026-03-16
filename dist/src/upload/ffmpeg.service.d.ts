export declare class FfmpegService {
    private readonly logger;
    optimizeAudio(inputPath: string): Promise<string>;
    getDuration(path: string): Promise<number>;
}
