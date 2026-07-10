"use client";

import { useEffect } from "react";
import type { AdminDto, AuthTokensDto } from "@alsayed/shared-types";
import { API_BASE_URL } from "@/lib/config";
import { useAppDispatch } from "@/store/hooks";
import {
  getStoredRefreshToken,
  setAdmin,
  setCredentials,
  setUnauthenticated,
} from "@/store/authSlice";

/**
 * Restores an admin session on first load by exchanging the persisted refresh
 * token for a fresh access token, then loading the admin profile.
 */
export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let cancelled = false;

    async function restore() {
      const refreshToken = getStoredRefreshToken();
      if (!refreshToken) {
        dispatch(setUnauthenticated());
        return;
      }
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/admin/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
        if (!res.ok) throw new Error("refresh failed");
        const tokens = (await res.json()) as AuthTokensDto;
        if (cancelled) return;
        dispatch(
          setCredentials({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          }),
        );

        const meRes = await fetch(`${API_BASE_URL}/api/auth/admin/me`, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        });
        if (meRes.ok && !cancelled) {
          const admin = (await meRes.json()) as AdminDto;
          dispatch(setAdmin(admin));
        }
      } catch {
        if (!cancelled) dispatch(setUnauthenticated());
      }
    }

    void restore();
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  return <>{children}</>;
}
