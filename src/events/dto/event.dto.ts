import { IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  readonly title!: string;

  @IsDateString()
  readonly date!: string;

  @IsString()
  readonly venue!: string;

  @IsString()
  readonly city!: string;

  @IsString()
  readonly country!: string;

  @IsString()
  @IsOptional()
  readonly ticketUrl?: string;

  @IsString()
  @IsOptional()
  readonly imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  readonly isPublished?: boolean;
}

export class UpdateEventDto {
  @IsString()
  @IsOptional()
  readonly title?: string;

  @IsDateString()
  @IsOptional()
  readonly date?: string;

  @IsString()
  @IsOptional()
  readonly venue?: string;

  @IsString()
  @IsOptional()
  readonly city?: string;

  @IsString()
  @IsOptional()
  readonly country?: string;

  @IsString()
  @IsOptional()
  readonly ticketUrl?: string;

  @IsString()
  @IsOptional()
  readonly imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  readonly isPublished?: boolean;
}
