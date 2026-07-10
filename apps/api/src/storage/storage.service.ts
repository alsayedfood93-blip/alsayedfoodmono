import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import { isAbsolute, join, normalize, resolve, sep } from 'path';
import {
  ALLOWED_IMAGE_MIME_TYPES,
  MEDIA_DOMAINS,
  MediaDomain,
  UPLOAD_PUBLIC_PREFIX,
} from './media.constants';

/**
 * Backend-hosted image storage.
 *
 * Files are written to a configurable persistent upload root and served as
 * public static assets under {@link UPLOAD_PUBLIC_PREFIX}. Only RELATIVE
 * paths (e.g. `/uploads/products/<uuid>.png`) are ever persisted to the
 * database — never absolute production URLs.
 */
@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private readonly uploadRoot: string;

  constructor(private readonly config: ConfigService) {
    const configured = this.config.get<string>('UPLOAD_ROOT', './uploads');
    this.uploadRoot = isAbsolute(configured)
      ? configured
      : resolve(process.cwd(), configured);
  }

  async onModuleInit(): Promise<void> {
    await fs.mkdir(this.uploadRoot, { recursive: true });
    await Promise.all(
      MEDIA_DOMAINS.map((domain) =>
        fs.mkdir(join(this.uploadRoot, domain), { recursive: true }),
      ),
    );
    this.logger.log(`Upload root ready at ${this.uploadRoot}`);
  }

  getUploadRoot(): string {
    return this.uploadRoot;
  }

  /**
   * Persist an uploaded image to a domain directory and return the relative
   * public path to store in the database.
   */
  async saveImage(
    domain: MediaDomain,
    file: Express.Multer.File,
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException('No image file was provided.');
    }

    const extension = ALLOWED_IMAGE_MIME_TYPES[file.mimetype];
    if (!extension) {
      throw new BadRequestException(
        `Unsupported image type "${file.mimetype}". Allowed types: ${Object.keys(
          ALLOWED_IMAGE_MIME_TYPES,
        ).join(', ')}.`,
      );
    }

    // Collision-resistant physical filename — never trust the client name.
    const filename = `${domain}-${randomUUID()}.${extension}`;
    const domainDir = join(this.uploadRoot, domain);
    await fs.mkdir(domainDir, { recursive: true });

    const destination = join(domainDir, filename);
    await fs.writeFile(destination, file.buffer);

    return `${UPLOAD_PUBLIC_PREFIX}/${domain}/${filename}`;
  }

  /**
   * Replace an existing image: store the new one, then safely remove the old
   * file if it is no longer referenced.
   */
  async replaceImage(
    domain: MediaDomain,
    file: Express.Multer.File,
    previousPath?: string | null,
  ): Promise<string> {
    const newPath = await this.saveImage(domain, file);
    if (previousPath && previousPath !== newPath) {
      await this.deleteByPublicPath(previousPath);
    }
    return newPath;
  }

  /**
   * Delete a stored image by its relative public path. Protects against path
   * traversal by ensuring the resolved target stays within the upload root.
   */
  async deleteByPublicPath(publicPath?: string | null): Promise<void> {
    if (!publicPath) {
      return;
    }

    if (!publicPath.startsWith(`${UPLOAD_PUBLIC_PREFIX}/`)) {
      this.logger.warn(`Refusing to delete non-upload path: ${publicPath}`);
      return;
    }

    const relative = normalize(
      publicPath.slice(`${UPLOAD_PUBLIC_PREFIX}/`.length),
    ).replace(/^(\.\.(\/|\\|$))+/, '');

    const target = resolve(this.uploadRoot, relative);
    const rootWithSep = this.uploadRoot.endsWith(sep)
      ? this.uploadRoot
      : this.uploadRoot + sep;

    if (!target.startsWith(rootWithSep)) {
      this.logger.warn(`Path traversal attempt blocked: ${publicPath}`);
      return;
    }

    try {
      await fs.unlink(target);
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      if (err.code !== 'ENOENT') {
        this.logger.error(`Failed to delete ${target}`, err);
      }
    }
  }
}
