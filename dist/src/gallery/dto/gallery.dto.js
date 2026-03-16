var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsInt, Min, IsIn } from 'class-validator';
export class CreateGalleryItemDto {
    type;
    url;
    caption;
    order;
}
__decorate([
    IsString(),
    IsIn(['image', 'video']),
    __metadata("design:type", String)
], CreateGalleryItemDto.prototype, "type", void 0);
__decorate([
    IsString(),
    __metadata("design:type", String)
], CreateGalleryItemDto.prototype, "url", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateGalleryItemDto.prototype, "caption", void 0);
__decorate([
    IsInt(),
    Min(0),
    IsOptional(),
    __metadata("design:type", Number)
], CreateGalleryItemDto.prototype, "order", void 0);
export class UpdateGalleryItemDto extends PartialType(CreateGalleryItemDto) {
}
//# sourceMappingURL=gallery.dto.js.map