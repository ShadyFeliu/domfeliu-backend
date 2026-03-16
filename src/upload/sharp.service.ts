import { Injectable, InternalServerErrorException } from '@nestjs/common';
import sharp from 'sharp';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SharpService {
  private readonly uploadPath = join(process.cwd(), 'uploads');

  async optimize(
    file: Express.Multer.File,
  ): Promise<{ filename: string; url: string }> {
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
    } catch (error) {
      console.error('Error optimizing image:', error);
      throw new InternalServerErrorException('Error processing image');
    }
  }
}
