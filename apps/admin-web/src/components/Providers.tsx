"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { ToastProvider } from "./toast";
import { AuthBootstrap } from "./AuthBootstrap";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ToastProvider>
        <AuthBootstrap>{children}</AuthBootstrap>
      </ToastProvider>
    </Provider>
  );
}
