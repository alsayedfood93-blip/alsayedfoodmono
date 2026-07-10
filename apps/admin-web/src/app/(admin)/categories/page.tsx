"use client";

import { useState } from "react";
import type { CategoryDto } from "@alsayed/shared-types";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/store/api";
import { resolveImageUrl } from "@/lib/config";
import { Badge, Button, Card, Field, Input, Textarea, Toggle } from "@/components/ui";
import { ImageField } from "@/components/ImageField";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useToast } from "@/components/toast";
import { PlusIcon } from "@/components/icons";
import { getErrorMessage } from "@/lib/errors";

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: deleting }] = useDeleteCategoryMutation();
  const { notify } = useToast();

  const [editing, setEditing] = useState<CategoryDto | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [toDelete, setToDelete] = useState<CategoryDto | null>(null);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }
  function openEdit(category: CategoryDto) {
    setEditing(category);
    setFormOpen(true);
  }

  async function handleDelete() {
    if (!toDelete) return;
    try {
      await deleteCategory(toDelete.id).unwrap();
      notify(`Deleted "${toDelete.title}".`, "success");
      setToDelete(null);
    } catch (err) {
      notify(getErrorMessage(err), "error");
      setToDelete(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            Categories
          </h1>
          <p className="mt-1 text-sm text-muted">
            Manage beverage categories shown on the website.
          </p>
        </div>
        <Button onClick={openCreate}>
          <PlusIcon className="h-4 w-4" />
          New Category
        </Button>
      </div>

      <Card className="mt-6 overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-ink/10 bg-brand-50/50 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Slug</th>
                <th className="px-4 py-3 font-semibold">Products</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Sort</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted">
                    Loading…
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted">
                    No categories yet. Create your first one.
                  </td>
                </tr>
              ) : (
                categories.map((c) => (
                  <tr key={c.id} className="hover:bg-brand-50/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 flex-none items-center justify-center overflow-hidden rounded-lg bg-brand-50">
                          {resolveImageUrl(c.imagePath) ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={resolveImageUrl(c.imagePath)!}
                              alt={c.title}
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <span className="text-xs text-muted">—</span>
                          )}
                        </div>
                        <span className="font-semibold text-ink">
                          {c.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted">{c.slug}</td>
                    <td className="px-4 py-3">{c.productCount ?? 0}</td>
                    <td className="px-4 py-3">
                      {c.isActive ? (
                        <Badge tone="green">Active</Badge>
                      ) : (
                        <Badge>Inactive</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">{c.sortOrder}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button variant="secondary" onClick={() => openEdit(c)}>
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => setToDelete(c)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {formOpen && (
        <CategoryFormModal
          category={editing}
          onClose={() => setFormOpen(false)}
          onSubmit={async (formData) => {
            try {
              if (editing) {
                await updateCategory({ id: editing.id, body: formData }).unwrap();
                notify("Category updated.", "success");
              } else {
                await createCategory(formData).unwrap();
                notify("Category created.", "success");
              }
              setFormOpen(false);
            } catch (err) {
              notify(getErrorMessage(err), "error");
            }
          }}
        />
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Delete category"
        message={`Are you sure you want to delete "${toDelete?.title}"? Categories with products cannot be deleted.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}

function CategoryFormModal({
  category,
  onClose,
  onSubmit,
}: {
  category: CategoryDto | null;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
}) {
  const [title, setTitle] = useState(category?.title ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [isActive, setIsActive] = useState(category?.isActive ?? true);
  const [sortOrder, setSortOrder] = useState(String(category?.sortOrder ?? 0));
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    fd.append("title", title);
    if (slug) fd.append("slug", slug);
    fd.append("description", description);
    fd.append("isActive", String(isActive));
    fd.append("sortOrder", sortOrder || "0");
    if (image) fd.append("image", image);
    await onSubmit(fd);
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-ink">
          {category ? "Edit Category" : "New Category"}
        </h2>
        <form onSubmit={submit} className="mt-5 flex flex-col gap-4">
          <Field label="Title" htmlFor="title">
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Field>
          <Field label="Slug" hint="Leave blank to auto-generate from title.">
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
          </Field>
          <Field label="Description">
            <Textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>
          <Field label="Sort order">
            <Input
              type="number"
              min={0}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            />
          </Field>
          <Toggle checked={isActive} onChange={setIsActive} label="Active" />
          <ImageField
            currentPath={category?.imagePath}
            onChange={setImage}
          />
          <div className="mt-2 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {category ? "Save Changes" : "Create Category"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
