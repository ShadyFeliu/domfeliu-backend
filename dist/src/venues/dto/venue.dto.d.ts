export declare class CreateVenueDto {
    name: string;
    city: string;
}
declare const UpdateVenueDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateVenueDto>>;
export declare class UpdateVenueDto extends UpdateVenueDto_base {
}
export {};
