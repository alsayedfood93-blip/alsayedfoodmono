import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AdminDto } from "@alsayed/shared-types";
import { REFRESH_TOKEN_KEY } from "@/lib/config";

export interface AuthState {
  accessToken: string | null;
  admin: AdminDto | null;
  /** bootstrapping = restoring a session on first load. */
  status: "bootstrapping" | "authenticated" | "unauthenticated";
}

const initialState: AuthState = {
  accessToken: null,
  admin: null,
  status: "bootstrapping",
};

export function getStoredRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function storeRefreshToken(token: string | null): void {
  if (typeof window === "undefined") return;
  if (token) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken?: string;
        admin?: AdminDto | null;
      }>,
    ) {
      state.accessToken = action.payload.accessToken;
      if (action.payload.admin !== undefined) {
        state.admin = action.payload.admin;
      }
      state.status = "authenticated";
      if (action.payload.refreshToken) {
        storeRefreshToken(action.payload.refreshToken);
      }
    },
    setAdmin(state, action: PayloadAction<AdminDto>) {
      state.admin = action.payload;
      state.status = "authenticated";
    },
    setUnauthenticated(state) {
      state.accessToken = null;
      state.admin = null;
      state.status = "unauthenticated";
      storeRefreshToken(null);
    },
  },
});

export const { setCredentials, setAdmin, setUnauthenticated } =
  authSlice.actions;
export default authSlice.reducer;
