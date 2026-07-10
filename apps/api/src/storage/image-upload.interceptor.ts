import { BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_SIZE_BYTES,
} from './media.constants';

/**
 * Reusable image upload interceptor. Files are buffered in memory (the
 * catalog is small) and validated for MIME type and size before the
 * StorageService writes them to the persistent disk with a safe filename.
 */
export function ImageUploadInterceptor(field = 'image') {
  return FileInterceptor(field, {
    storage: memoryStorage(),
    limits: { fileSize: MAX_IMAGE_SIZE_BYTES },
    fileFilter: (_req, file, callback) => {
      if (!ALLOWED_IMAGE_MIME_TYPES[file.mimetype]) {
        callback(
          new BadRequestException(`Unsupported image type "${file.mimetype}".`),
          false,
        );
        return;
      }
      callback(null, true);
    },
  });
}
