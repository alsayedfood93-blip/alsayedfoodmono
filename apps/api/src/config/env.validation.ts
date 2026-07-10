import { plainToInstance } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';

export enum NodeEnv {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsOptional()
  @IsString()
  NODE_ENV: string = NodeEnv.Development;

  @IsInt()
  @Min(1)
  @Max(65535)
  PORT: number = 3002;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL!: string;

  @IsString()
  @IsNotEmpty()
  WEB_ORIGIN: string = 'http://localhost:3000';

  @IsString()
  @IsNotEmpty()
  ADMIN_WEB_ORIGIN: string = 'http://localhost:3001';

  @IsString()
  @IsNotEmpty()
  JWT_ACCESS_SECRET!: string;

  /** Access token lifetime in seconds. */
  @IsInt()
  @Min(60)
  JWT_ACCESS_EXPIRES_IN: number = 900;

  /** Refresh session lifetime in days. */
  @IsInt()
  @Min(1)
  JWT_REFRESH_EXPIRES_IN_DAYS: number = 30;

  /** Filesystem root for uploaded images (relative or absolute). */
  @IsString()
  @IsNotEmpty()
  UPLOAD_ROOT: string = './uploads';
}

export function validateEnv(config: Record<string, unknown>) {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validated, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const messages = errors
      .map((error) => Object.values(error.constraints ?? {}).join(', '))
      .join('; ');
    throw new Error(`Invalid environment configuration: ${messages}`);
  }

  return validated;
}
