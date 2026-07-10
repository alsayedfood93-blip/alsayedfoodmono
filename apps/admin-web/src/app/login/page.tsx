"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCredentials, setAdmin } from "@/store/authSlice";
import { useLoginMutation } from "@/store/api";
import { Button, Card, Field, Input } from "@/components/ui";
import { DropletMark } from "@/components/icons";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const status = useAppSelector((s) => s.auth.status);
  const [login, { isLoading }] = useLoginMutation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const result = await login({ username, password }).unwrap();
      dispatch(
        setCredentials({
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          admin: result.admin,
        }),
      );
      dispatch(setAdmin(result.admin));
      router.replace("/dashboard");
    } catch (err) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        "Login failed. Check your credentials and try again.";
      setError(Array.isArray(message) ? message.join(", ") : message);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-brand-50 to-[#f4f6f4] px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <DropletMark className="h-11 w-11 text-brand-600" />
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink">
            ALSAYED Admin
          </h1>
          <p className="mt-1 text-sm text-muted">
            Sign in to manage your website content
          </p>
        </div>
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="Username" htmlFor="username">
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </Field>
            <Field label="Password" htmlFor="password">
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </Field>
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}
            <Button type="submit" loading={isLoading} className="w-full">
              Sign In
            </Button>
          </form>
        </Card>
        <p className="mt-4 text-center text-xs text-muted">
          Development login: admin / Admin123!
        </p>
      </div>
    </div>
  );
}
