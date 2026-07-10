"use client";

import { forwardRef } from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  loading?: boolean;
};

export function Button({
  variant = "primary",
  loading,
  className = "",
  children,
  disabled,
  ...rest
}: ButtonProps) {
  const styles: Record<string, string> = {
    primary: "bg-brand-600 text-white hover:bg-brand-700",
    secondary:
      "border border-ink/15 bg-white text-ink hover:border-brand-300 hover:text-brand-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "text-ink-soft hover:bg-brand-50 hover:text-brand-700",
  };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

const inputBase =
  "w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input({ className = "", ...rest }, ref) {
  return <input ref={ref} className={`${inputBase} ${className}`} {...rest} />;
});

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className = "", ...rest }, ref) {
  return (
    <textarea ref={ref} className={`${inputBase} ${className}`} {...rest} />
  );
});

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className = "", children, ...rest }, ref) {
  return (
    <select ref={ref} className={`${inputBase} ${className}`} {...rest}>
      {children}
    </select>
  );
});

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-ink/10 bg-white p-5 shadow-[0_1px_2px_rgba(19,32,26,0.04)] ${className}`}
    >
      {children}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3"
    >
      <span
        className={`relative h-6 w-11 rounded-full transition-colors ${
          checked ? "bg-brand-600" : "bg-ink/20"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-[22px]" : "translate-x-0.5"
          }`}
        />
      </span>
      <span className="text-sm font-medium text-ink">{label}</span>
    </button>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "green" | "amber";
}) {
  const styles: Record<string, string> = {
    neutral: "bg-ink/5 text-ink-soft",
    green: "bg-brand-100 text-brand-700",
    amber: "bg-amber-100 text-amber-700",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[tone]}`}
    >
      {children}
    </span>
  );
}
