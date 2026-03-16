export declare class CreateEventDto {
    readonly title: string;
    readonly date: string;
    readonly venue: string;
    readonly city: string;
    readonly country: string;
    readonly ticketUrl?: string;
    readonly imageUrl?: string;
    readonly isPublished?: boolean;
}
export declare class UpdateEventDto {
    readonly title?: string;
    readonly date?: string;
    readonly venue?: string;
    readonly city?: string;
    readonly country?: string;
    readonly ticketUrl?: string;
    readonly imageUrl?: string;
    readonly isPublished?: boolean;
}
