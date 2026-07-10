"use client";

import { useState } from "react";
import type { CeoMessageDto } from "@alsayed/shared-types";
import { useGetCeoQuery, useUpdateCeoMutation } from "@/store/api";
import { Button, Card, Field, Input, Textarea, Toggle } from "@/components/ui";
import { ImageField } from "@/components/ImageField";
import { useToast } from "@/components/toast";
import { getErrorMessage } from "@/lib/errors";

export default function CeoContentPage() {
  const { data, isLoading } = useGetCeoQuery();

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold tracking-tight text-ink">
        CEO Message
      </h1>
      <p className="mt-1 text-sm text-muted">
        The founder message shown on the homepage.
      </p>

      <Card className="mt-6">
        {isLoading ? (
          <p className="text-muted">Loading…</p>
        ) : (
          <CeoForm key={data?.updatedAt ?? "new"} initial={data ?? null} />
        )}
      </Card>
    </div>
  );
}

function CeoForm({ initial }: { initial: CeoMessageDto | null }) {
  const [updateCeo, { isLoading: saving }] = useUpdateCeoMutation();
  const { notify } = useToast();

  const [name, setName] = useState(initial?.name ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [image, setImage] = useState<File | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", name);
    fd.append("title", title);
    fd.append("description", description);
    fd.append("isActive", String(isActive));
    if (image) fd.append("image", image);
    try {
      await updateCeo(fd).unwrap();
      notify("CEO message saved.", "success");
    } catch (err) {
      notify(getErrorMessage(err), "error");
    }
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field label="Name">
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </Field>
      <Field label="Title">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Message">
          <Textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <ImageField
          label="Photo"
          currentPath={initial?.imagePath}
          onChange={setImage}
        />
      </div>
      <div className="sm:col-span-2">
        <Toggle checked={isActive} onChange={setIsActive} label="Active" />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" loading={saving}>
          Save CEO Message
        </Button>
      </div>
    </form>
  );
}
