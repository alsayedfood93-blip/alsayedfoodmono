import type { AuthenticatedAdmin } from '../auth/auth.types';

declare global {
  namespace Express {
    interface Request {
      admin?: AuthenticatedAdmin;
    }
  }
}

export {};
