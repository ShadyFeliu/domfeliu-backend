var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import sharp from 'sharp';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
let SharpService = class SharpService {
    uploadPath = join(process.cwd(), 'uploads');
    async optimize(file) {
        try {
            const filename = `${uuidv4()}.webp`;
            const outputPath = join(this.uploadPath, filename);
            await sharp(file.buffer)
                .resize({
                width: 1920,
                withoutEnlargement: true,
                fit: 'inside',
            })
                .webp({ quality: 80 })
                .toFile(outputPath);
            return {
                filename,
                url: `/uploads/${filename}`,
            };
        }
        catch (error) {
            console.error('Error optimizing image:', error);
            throw new InternalServerErrorException('Error processing image');
        }
    }
};
SharpService = __decorate([
    Injectable()
], SharpService);
export { SharpService };
//# sourceMappingURL=sharp.service.js.map