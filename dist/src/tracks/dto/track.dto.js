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
import { IsString, IsOptional, IsBoolean, IsInt, Min } from 'class-validator';
export class CreateTrackDto {
    title;
    artist;
    audioUrl;
    coverUrl;
    spotifyUrl;
    soundcloudUrl;
    order;
    isPublished;
}
__decorate([
    IsString(),
    __metadata("design:type", String)
], CreateTrackDto.prototype, "title", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateTrackDto.prototype, "artist", void 0);
__decorate([
    IsString(),
    __metadata("design:type", String)
], CreateTrackDto.prototype, "audioUrl", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateTrackDto.prototype, "coverUrl", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateTrackDto.prototype, "spotifyUrl", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateTrackDto.prototype, "soundcloudUrl", void 0);
__decorate([
    IsInt(),
    Min(0),
    IsOptional(),
    __metadata("design:type", Number)
], CreateTrackDto.prototype, "order", void 0);
__decorate([
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], CreateTrackDto.prototype, "isPublished", void 0);
export class UpdateTrackDto extends PartialType(CreateTrackDto) {
}
//# sourceMappingURL=track.dto.js.map