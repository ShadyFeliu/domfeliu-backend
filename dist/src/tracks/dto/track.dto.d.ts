export declare class CreateTrackDto {
    readonly title: string;
    readonly artist?: string;
    readonly audioUrl: string;
    readonly coverUrl?: string;
    readonly spotifyUrl?: string;
    readonly soundcloudUrl?: string;
    readonly order?: number;
    readonly isPublished?: boolean;
}
declare const UpdateTrackDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateTrackDto>>;
export declare class UpdateTrackDto extends UpdateTrackDto_base {
}
export {};
