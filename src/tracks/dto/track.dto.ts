import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsBoolean, IsInt, Min } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  readonly title!: string;

  @IsString()
  @IsOptional()
  readonly artist?: string;

  @IsString()
  readonly audioUrl!: string;

  @IsString()
  @IsOptional()
  readonly coverUrl?: string;

  @IsString()
  @IsOptional()
  readonly spotifyUrl?: string;

  @IsString()
  @IsOptional()
  readonly soundcloudUrl?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  readonly order?: number;

  @IsBoolean()
  @IsOptional()
  readonly isPublished?: boolean;
}

export class UpdateTrackDto extends PartialType(CreateTrackDto) {}
