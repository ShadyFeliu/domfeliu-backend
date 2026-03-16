export declare class CreateGalleryItemDto {
    readonly type: 'image' | 'video';
    readonly url: string;
    readonly caption?: string;
    readonly order?: number;
}
declare const UpdateGalleryItemDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateGalleryItemDto>>;
export declare class UpdateGalleryItemDto extends UpdateGalleryItemDto_base {
}
export {};
