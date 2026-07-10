"use client";

import { useState } from "react";
import type { ProductDto } from "@alsayed/shared-types";
import {
  useGetProductsQuery,
  useGetCategoriesQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "@/store/api";
import { resolveImageUrl } from "@/lib/config";
import {
  Badge,
  Button,
  Card,
  Field,
  Input,
  Select,
  Textarea,
  Toggle,
} from "@/components/ui";
import { ImageField } from "@/components/ImageField";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useToast } from "@/components/toast";
import { PlusIcon } from "@/components/icons";
import { getErrorMessage } from "@/lib/errors";

export default function ProductsPage() {
  const { data: products = [], isLoading } = useGetProductsQuery();
  const { data: categories = [] } = useGetCategoriesQuery();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();
  const { notify } = useToast();

  const [editing, setEditing] = useState<ProductDto | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [toDelete, setToDelete] = useState<ProductDto | null>(null);

  async function handleDelete() {
    if (!toDelete) return;
    try {
      await deleteProduct(toDelete.id).unwrap();
      notify(`Deleted "${toDelete.title}".`, "success");
    } catch (err) {
      notify(getErrorMessage(err), "error");
    }
    setToDelete(null);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            Products
          </h1>
          <p className="mt-1 text-sm text-muted">
            Manage the beverages in your catalog.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          disabled={categories.length === 0}
        >
          <PlusIcon className="h-4 w-4" />
          New Product
        </Button>
      </div>

      {categories.length === 0 && (
        <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Create at least one category before adding products.
        </p>
      )}

      <Card className="mt-6 overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-ink/10 bg-brand-50/50 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Size</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Featured</th>
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
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted">
                    No products yet.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-brand-50/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 flex-none items-center justify-center overflow-hidden rounded-lg bg-brand-50">
                          {resolveImageUrl(p.imagePath) ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={resolveImageUrl(p.imagePath)!}
                              alt={p.title}
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <span className="text-xs text-muted">—</span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-ink">{p.title}</p>
                          <p className="text-xs text-muted">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {p.category?.title ?? "—"}
                    </td>
                    <td className="px-4 py-3">{p.size ?? "—"}</td>
                    <td className="px-4 py-3">
                      {p.isActive ? (
                        <Badge tone="green">Active</Badge>
                      ) : (
                        <Badge>Inactive</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {p.isFeatured ? <Badge tone="amber">Featured</Badge> : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setEditing(p);
                            setFormOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => setToDelete(p)}
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
        <ProductFormModal
          product={editing}
          categories={categories}
          onClose={() => setFormOpen(false)}
          onSubmit={async (formData) => {
            try {
              if (editing) {
                await updateProduct({ id: editing.id, body: formData }).unwrap();
                notify("Product updated.", "success");
              } else {
                await createProduct(formData).unwrap();
                notify("Product created.", "success");
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
        title="Delete product"
        message={`Are you sure you want to delete "${toDelete?.title}"?`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}

function ProductFormModal({
  product,
  categories,
  onClose,
  onSubmit,
}: {
  product: ProductDto | null;
  categories: { id: number; title: string }[];
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
}) {
  const [title, setTitle] = useState(product?.title ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [size, setSize] = useState(product?.size ?? "");
  const [price, setPrice] = useState(
    product?.price != null ? String(product.price) : "",
  );
  const [ingredients, setIngredients] = useState(
    product?.ingredients.join(", ") ?? "",
  );
  const [categoryId, setCategoryId] = useState(
    String(product?.categoryId ?? categories[0]?.id ?? ""),
  );
  const [isActive, setIsActive] = useState(product?.isActive ?? true);
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);
  const [sortOrder, setSortOrder] = useState(String(product?.sortOrder ?? 0));
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    fd.append("title", title);
    if (slug) fd.append("slug", slug);
    fd.append("description", description);
    fd.append("size", size);
    if (price) fd.append("price", price);
    fd.append("ingredients", ingredients);
    fd.append("categoryId", categoryId);
    fd.append("isActive", String(isActive));
    fd.append("isFeatured", String(isFeatured));
    fd.append("sortOrder", sortOrder || "0");
    if (image) fd.append("image", image);
    await onSubmit(fd);
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-ink">
          {product ? "Edit Product" : "New Product"}
        </h2>
        <form onSubmit={submit} className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Title" htmlFor="ptitle">
            <Input
              id="ptitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Field>
          <Field label="Slug" hint="Leave blank to auto-generate.">
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
          </Field>
          <Field label="Category">
            <Select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Size" hint="e.g. 330ml, 1.5L">
            <Input value={size} onChange={(e) => setSize(e.target.value)} />
          </Field>
          <Field label="Price" hint="Whole number (legacy integer).">
            <Input
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
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
          <div className="sm:col-span-2">
            <Field label="Description">
              <Textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field
              label="Ingredients"
              hint="Comma-separated (e.g. Water, Sugar, Flavour)."
            >
              <Input
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
              />
            </Field>
          </div>
          <div className="flex items-center gap-6 sm:col-span-2">
            <Toggle checked={isActive} onChange={setIsActive} label="Active" />
            <Toggle
              checked={isFeatured}
              onChange={setIsFeatured}
              label="Featured"
            />
          </div>
          <div className="sm:col-span-2">
            <ImageField currentPath={product?.imagePath} onChange={setImage} />
          </div>
          <div className="mt-2 flex justify-end gap-3 sm:col-span-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {product ? "Save Changes" : "Create Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
