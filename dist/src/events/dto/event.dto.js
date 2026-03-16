var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';
export class CreateEventDto {
    title;
    date;
    venue;
    city;
    country;
    ticketUrl;
    imageUrl;
    isPublished;
}
__decorate([
    IsString(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "title", void 0);
__decorate([
    IsDateString(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "date", void 0);
__decorate([
    IsString(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "venue", void 0);
__decorate([
    IsString(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "city", void 0);
__decorate([
    IsString(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "country", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "ticketUrl", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "imageUrl", void 0);
__decorate([
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], CreateEventDto.prototype, "isPublished", void 0);
export class UpdateEventDto {
    title;
    date;
    venue;
    city;
    country;
    ticketUrl;
    imageUrl;
    isPublished;
}
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateEventDto.prototype, "title", void 0);
__decorate([
    IsDateString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateEventDto.prototype, "date", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateEventDto.prototype, "venue", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateEventDto.prototype, "city", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateEventDto.prototype, "country", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateEventDto.prototype, "ticketUrl", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateEventDto.prototype, "imageUrl", void 0);
__decorate([
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], UpdateEventDto.prototype, "isPublished", void 0);
//# sourceMappingURL=event.dto.js.map