import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsInt, Min, IsIn } from 'class-validator';

export class CreateGalleryItemDto {
  @IsString()
  @IsIn(['image', 'video'])
  readonly type!: 'image' | 'video';

  @IsString()
  readonly url!: string;

  @IsString()
  @IsOptional()
  readonly caption?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  readonly order?: number;
}

export class UpdateGalleryItemDto extends PartialType(CreateGalleryItemDto) {}
