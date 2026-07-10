"use client";

import { useState } from "react";
import type { HeroContentDto } from "@alsayed/shared-types";
import { useGetHeroQuery, useUpdateHeroMutation } from "@/store/api";
import { Button, Card, Field, Input, Textarea, Toggle } from "@/components/ui";
import { useToast } from "@/components/toast";
import { getErrorMessage } from "@/lib/errors";

export default function HeroContentPage() {
  const { data, isLoading } = useGetHeroQuery();

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold tracking-tight text-ink">
        Hero Content
      </h1>
      <p className="mt-1 text-sm text-muted">
        The main headline and call-to-action shown at the top of the homepage.
      </p>

      <Card className="mt-6">
        {isLoading ? (
          <p className="text-muted">Loading…</p>
        ) : (
          <HeroForm key={data?.updatedAt ?? "new"} initial={data ?? null} />
        )}
      </Card>
    </div>
  );
}

function HeroForm({ initial }: { initial: HeroContentDto | null }) {
  const [updateHero, { isLoading: saving }] = useUpdateHeroMutation();
  const { notify } = useToast();

  const [form, setForm] = useState({
    eyebrow: initial?.eyebrow ?? "",
    title: initial?.title ?? "",
    highlightedText: initial?.highlightedText ?? "",
    description: initial?.description ?? "",
    primaryButtonText: initial?.primaryButtonText ?? "",
    primaryButtonLink: initial?.primaryButtonLink ?? "",
    secondaryButtonText: initial?.secondaryButtonText ?? "",
    secondaryButtonLink: initial?.secondaryButtonLink ?? "",
    isActive: initial?.isActive ?? true,
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await updateHero(form).unwrap();
      notify("Hero content saved.", "success");
    } catch (err) {
      notify(getErrorMessage(err), "error");
    }
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Field label="Eyebrow" hint="Small label above the headline.">
          <Input
            value={form.eyebrow}
            onChange={(e) => set("eyebrow", e.target.value)}
          />
        </Field>
      </div>
      <Field label="Title">
        <Input
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          required
        />
      </Field>
      <Field label="Highlighted text" hint="Shown in green.">
        <Input
          value={form.highlightedText}
          onChange={(e) => set("highlightedText", e.target.value)}
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Description">
          <Textarea
            rows={3}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </Field>
      </div>
      <Field label="Primary button text">
        <Input
          value={form.primaryButtonText}
          onChange={(e) => set("primaryButtonText", e.target.value)}
        />
      </Field>
      <Field label="Primary button link">
        <Input
          value={form.primaryButtonLink}
          onChange={(e) => set("primaryButtonLink", e.target.value)}
        />
      </Field>
      <Field label="Secondary button text">
        <Input
          value={form.secondaryButtonText}
          onChange={(e) => set("secondaryButtonText", e.target.value)}
        />
      </Field>
      <Field label="Secondary button link">
        <Input
          value={form.secondaryButtonLink}
          onChange={(e) => set("secondaryButtonLink", e.target.value)}
        />
      </Field>
      <div className="sm:col-span-2">
        <Toggle
          checked={form.isActive}
          onChange={(v) => set("isActive", v)}
          label="Active"
        />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" loading={saving}>
          Save Hero Content
        </Button>
      </div>
    </form>
  );
}
