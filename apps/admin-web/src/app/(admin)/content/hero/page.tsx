"use client";

import { useEffect, useMemo, useState } from "react";
import type { HeroContentDto, HeroImageDto } from "@alsayed/shared-types";
import {
  useDeleteHeroImageMutation,
  useGetHeroQuery,
  useReorderHeroImagesMutation,
  useUpdateHeroMutation,
  useUploadHeroImagesMutation,
} from "@/store/api";
import { Button, Card, Field, Input, Textarea, Toggle } from "@/components/ui";
import { useToast } from "@/components/toast";
import { getErrorMessage } from "@/lib/errors";
import { resolveImageUrl } from "@/lib/config";

export default function HeroContentPage() {
  const { data, isLoading } = useGetHeroQuery();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          Hero Content
        </h1>
        <p className="mt-1 text-sm text-muted">
          The main headline, call-to-action, and cinematic background slides on
          the homepage.
        </p>
      </div>

      <Card>
        {isLoading ? (
          <p className="text-muted">Loading…</p>
        ) : (
          <HeroForm key={data?.updatedAt ?? "new"} initial={data ?? null} />
        )}
      </Card>

      <Card>
        {isLoading ? (
          <p className="text-muted">Loading…</p>
        ) : (
          <HeroImagesManager
            key={`images-${data?.images?.map((i) => i.id).join("-") ?? "none"}-${data?.updatedAt ?? "new"}`}
            images={data?.images ?? []}
          />
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
      const body = new FormData();
      body.append("eyebrow", form.eyebrow);
      body.append("title", form.title);
      body.append("highlightedText", form.highlightedText);
      body.append("description", form.description);
      body.append("primaryButtonText", form.primaryButtonText);
      body.append("primaryButtonLink", form.primaryButtonLink);
      body.append("secondaryButtonText", form.secondaryButtonText);
      body.append("secondaryButtonLink", form.secondaryButtonLink);
      body.append("isActive", String(form.isActive));
      await updateHero(body).unwrap();
      notify("Hero content saved.", "success");
    } catch (err) {
      notify(getErrorMessage(err), "error");
    }
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <h2 className="text-base font-semibold text-ink">Headline & CTAs</h2>
        <p className="mt-0.5 text-xs text-muted">
          Description copy is shown below the heading on the public site.
        </p>
      </div>
      <div className="sm:col-span-2">
        <Field label="Eyebrow" hint="Small badge label above the headline.">
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
      <Field label="Highlighted text" hint="Shown in brand green.">
        <Input
          value={form.highlightedText}
          onChange={(e) => set("highlightedText", e.target.value)}
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Description" hint="Editable marketing copy under the heading.">
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

type DraftItem =
  | { kind: "existing"; image: HeroImageDto }
  | { kind: "new"; key: string; file: File; preview: string };

function HeroImagesManager({ images }: { images: HeroImageDto[] }) {
  const [uploadHeroImages, { isLoading: uploading }] =
    useUploadHeroImagesMutation();
  const [deleteHeroImage, { isLoading: deleting }] =
    useDeleteHeroImageMutation();
  const [reorderHeroImages, { isLoading: reordering }] =
    useReorderHeroImagesMutation();
  const [updateHero, { isLoading: savingBatch }] = useUpdateHeroMutation();
  const { notify } = useToast();

  const [items, setItems] = useState<DraftItem[]>(() =>
    images.map((image) => ({ kind: "existing", image })),
  );
  const [pendingDeleteIds, setPendingDeleteIds] = useState<number[]>([]);

  useEffect(() => {
    return () => {
      for (const item of items) {
        if (item.kind === "new") URL.revokeObjectURL(item.preview);
      }
    };
    // Only revoke on unmount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const busy = uploading || deleting || reordering || savingBatch;
  const hasPendingNew = useMemo(
    () => items.some((item) => item.kind === "new"),
    [items],
  );
  const hasPendingDeletes = pendingDeleteIds.length > 0;
  const orderChanged = useMemo(() => {
    const currentIds = items
      .filter((item): item is Extract<DraftItem, { kind: "existing" }> => item.kind === "existing")
      .map((item) => item.image.id);
    const originalIds = images.map((image) => image.id);
    if (currentIds.length !== originalIds.length) return true;
    return currentIds.some((id, index) => id !== originalIds[index]);
  }, [items, images]);

  const dirty = hasPendingNew || hasPendingDeletes || orderChanged;

  function move(index: number, direction: -1 | 1) {
    setItems((prev) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= prev.length) return prev;
      const copy = [...prev];
      const [removed] = copy.splice(index, 1);
      copy.splice(nextIndex, 0, removed);
      return copy;
    });
  }

  function removeAt(index: number) {
    setItems((prev) => {
      const target = prev[index];
      if (!target) return prev;
      if (target.kind === "existing") {
        setPendingDeleteIds((ids) =>
          ids.includes(target.image.id) ? ids : [...ids, target.image.id],
        );
      } else {
        URL.revokeObjectURL(target.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  }

  function onPickFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    const next: DraftItem[] = Array.from(fileList).map((file) => ({
      kind: "new" as const,
      key: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
    }));
    setItems((prev) => [...prev, ...next]);
  }

  async function saveChanges() {
    try {
      const existingInDraft = items
        .filter(
          (item): item is Extract<DraftItem, { kind: "existing" }> =>
            item.kind === "existing",
        )
        .map((item) => item.image.id);
      const newFiles = items
        .filter(
          (item): item is Extract<DraftItem, { kind: "new" }> =>
            item.kind === "new",
        )
        .map((item) => item.file);

      if (pendingDeleteIds.length || orderChanged) {
        const formData = new FormData();
        if (pendingDeleteIds.length) {
          formData.append("deleteImageIds", JSON.stringify(pendingDeleteIds));
        }
        if (existingInDraft.length) {
          formData.append("imageOrder", JSON.stringify(existingInDraft));
        }
        await updateHero(formData).unwrap();
      }

      if (newFiles.length) {
        const uploadData = new FormData();
        for (const file of newFiles) {
          uploadData.append("images", file);
        }
        const result = await uploadHeroImages(uploadData).unwrap();

        const newIds = result.images
          .filter((image) => !existingInDraft.includes(image.id))
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((image) => image.id);

        let newIndex = 0;
        const fullOrder: number[] = [];
        for (const item of items) {
          if (item.kind === "existing") {
            fullOrder.push(item.image.id);
          } else {
            const id = newIds[newIndex++];
            if (id !== undefined) fullOrder.push(id);
          }
        }

        const currentOrder = result.images.map((image) => image.id);
        if (
          fullOrder.length === currentOrder.length &&
          fullOrder.some((id, index) => id !== currentOrder[index])
        ) {
          await reorderHeroImages({ orderedIds: fullOrder }).unwrap();
        }
      }

      notify("Hero background images saved.", "success");
    } catch (err) {
      notify(getErrorMessage(err), "error");
    }
  }

  async function deleteNow(id: number) {
    try {
      await deleteHeroImage(id).unwrap();
      notify("Image deleted.", "success");
    } catch (err) {
      notify(getErrorMessage(err), "error");
    }
  }

  async function moveAndPersist(index: number, direction: -1 | 1) {
    const next = [...items];
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= next.length) return;
    const [removed] = next.splice(index, 1);
    next.splice(nextIndex, 0, removed);
    setItems(next);

    // If the list still only has existing images and nothing else pending,
    // persist reorder immediately for snappier admin UX.
    const onlyExisting =
      next.every((item) => item.kind === "existing") &&
      pendingDeleteIds.length === 0;
    if (!onlyExisting) return;

    try {
      await reorderHeroImages({
        orderedIds: next.map(
          (item) => (item as Extract<DraftItem, { kind: "existing" }>).image.id,
        ),
      }).unwrap();
    } catch (err) {
      notify(getErrorMessage(err), "error");
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-ink">
          Hero Background Images
        </h2>
        <p className="mt-0.5 text-xs text-muted">
          Fullscreen cinematic slides. Upload multiple images, preview, reorder,
          and delete. They crossfade on the homepage every 6 seconds.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-ink/15 bg-brand-50/40 px-4 py-8 text-center text-sm text-muted">
          No background images yet. Upload landscapes, cityscapes, or brand
          photography to power the hero slider.
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((item, index) => {
            const preview =
              item.kind === "existing"
                ? resolveImageUrl(item.image.imagePath)
                : item.preview;
            const label =
              item.kind === "existing"
                ? `Image #${item.image.id}`
                : item.file.name;

            return (
              <li
                key={
                  item.kind === "existing" ? `ex-${item.image.id}` : item.key
                }
                className="flex items-center gap-3 rounded-xl border border-ink/10 bg-white p-3"
              >
                <div className="h-20 w-32 flex-none overflow-hidden rounded-lg bg-brand-50">
                  {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={preview}
                      alt={label}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted">
                      Missing
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">
                    {label}
                  </p>
                  <p className="text-xs text-muted">
                    {item.kind === "new"
                      ? "New upload (unsaved)"
                      : `Sort position ${index + 1}`}
                  </p>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row">
                  <Button
                    type="button"
                    variant="secondary"
                    className="px-2.5 py-1.5 text-xs"
                    disabled={busy || index === 0}
                    onClick={() => {
                      if (
                        items.every((i) => i.kind === "existing") &&
                        pendingDeleteIds.length === 0
                      ) {
                        void moveAndPersist(index, -1);
                      } else {
                        move(index, -1);
                      }
                    }}
                  >
                    Up
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="px-2.5 py-1.5 text-xs"
                    disabled={busy || index === items.length - 1}
                    onClick={() => {
                      if (
                        items.every((i) => i.kind === "existing") &&
                        pendingDeleteIds.length === 0
                      ) {
                        void moveAndPersist(index, 1);
                      } else {
                        move(index, 1);
                      }
                    }}
                  >
                    Down
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    className="px-2.5 py-1.5 text-xs"
                    disabled={busy}
                    onClick={() => {
                      if (
                        item.kind === "existing" &&
                        items.every((i) => i.kind === "existing") &&
                        pendingDeleteIds.length === 0 &&
                        !hasPendingNew
                      ) {
                        void deleteNow(item.image.id);
                      } else {
                        removeAt(index);
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-ink/15 bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:border-brand-300">
          Upload images
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
            multiple
            className="hidden"
            disabled={busy}
            onChange={(e) => {
              onPickFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
        <Button
          type="button"
          loading={busy}
          disabled={!dirty}
          onClick={() => void saveChanges()}
        >
          Save image changes
        </Button>
      </div>
    </div>
  );
}
