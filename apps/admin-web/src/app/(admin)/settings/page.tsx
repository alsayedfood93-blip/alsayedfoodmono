"use client";

import { useState } from "react";
import type { SiteSettingsDto } from "@alsayed/shared-types";
import {
  useGetSiteSettingsQuery,
  useUpdateSiteSettingsMutation,
} from "@/store/api";
import { Button, Card, Field, Input } from "@/components/ui";
import { ImageField } from "@/components/ImageField";
import { useToast } from "@/components/toast";
import { getErrorMessage } from "@/lib/errors";

export default function SiteSettingsPage() {
  const { data, isLoading } = useGetSiteSettingsQuery();

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold tracking-tight text-ink">
        Site Settings
      </h1>
      <p className="mt-1 text-sm text-muted">
        Company contact details, social links and logo used across the website.
      </p>

      <Card className="mt-6">
        {isLoading || !data ? (
          <p className="text-muted">Loading…</p>
        ) : (
          <SettingsForm key={data.updatedAt} initial={data} />
        )}
      </Card>
    </div>
  );
}

function SettingsForm({ initial }: { initial: SiteSettingsDto }) {
  const [updateSettings, { isLoading: saving }] =
    useUpdateSiteSettingsMutation();
  const { notify } = useToast();

  const [form, setForm] = useState({
    companyName: initial.companyName ?? "",
    email: initial.email ?? "",
    phone: initial.phone ?? "",
    whatsapp: initial.whatsapp ?? "",
    address: initial.address ?? "",
    facebookUrl: initial.facebookUrl ?? "",
    instagramUrl: initial.instagramUrl ?? "",
    tiktokUrl: initial.tiktokUrl ?? "",
  });
  const [logo, setLogo] = useState<File | null>(null);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (logo) fd.append("logo", logo);
    try {
      await updateSettings(fd).unwrap();
      notify("Site settings saved.", "success");
    } catch (err) {
      notify(getErrorMessage(err), "error");
    }
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Field label="Company name">
          <Input
            value={form.companyName}
            onChange={(e) => set("companyName", e.target.value)}
            required
          />
        </Field>
      </div>
      <Field label="Email">
        <Input
          type="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
        />
      </Field>
      <Field label="Phone">
        <Input
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
        />
      </Field>
      <Field label="WhatsApp">
        <Input
          value={form.whatsapp}
          onChange={(e) => set("whatsapp", e.target.value)}
        />
      </Field>
      <Field label="Address">
        <Input
          value={form.address}
          onChange={(e) => set("address", e.target.value)}
        />
      </Field>
      <Field label="Facebook URL" hint="Include https://">
        <Input
          value={form.facebookUrl}
          onChange={(e) => set("facebookUrl", e.target.value)}
        />
      </Field>
      <Field label="Instagram URL" hint="Include https://">
        <Input
          value={form.instagramUrl}
          onChange={(e) => set("instagramUrl", e.target.value)}
        />
      </Field>
      <Field label="TikTok URL" hint="Include https://">
        <Input
          value={form.tiktokUrl}
          onChange={(e) => set("tiktokUrl", e.target.value)}
        />
      </Field>
      <div className="sm:col-span-2">
        <ImageField
          label="Logo"
          currentPath={initial.logoPath}
          onChange={setLogo}
        />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" loading={saving}>
          Save Settings
        </Button>
      </div>
    </form>
  );
}
