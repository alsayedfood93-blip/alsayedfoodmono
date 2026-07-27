import { BadRequestException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_SIZE_BYTES,
} from './media.constants';

/**
 * Multi-file image upload interceptor (memory storage + MIME/size checks).
 */
export function ImagesUploadInterceptor(field = 'images', maxCount = 10) {
  return FilesInterceptor(field, maxCount, {
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
