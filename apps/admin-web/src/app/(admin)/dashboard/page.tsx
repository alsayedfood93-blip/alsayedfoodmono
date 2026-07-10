"use client";

import Link from "next/link";
import { useGetDashboardQuery } from "@/store/api";
import { Card } from "@/components/ui";
import { BottleIcon, StarIcon, TagIcon, GridIcon } from "@/components/icons";

export default function DashboardPage() {
  const { data, isLoading, isError } = useGetDashboardQuery();

  const stats = [
    {
      label: "Total Categories",
      value: data?.totalCategories,
      icon: TagIcon,
      href: "/categories",
    },
    {
      label: "Total Products",
      value: data?.totalProducts,
      icon: BottleIcon,
      href: "/products",
    },
    {
      label: "Active Products",
      value: data?.activeProducts,
      icon: GridIcon,
      href: "/products",
    },
    {
      label: "Featured Products",
      value: data?.featuredProducts,
      icon: StarIcon,
      href: "/products",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">
        Overview of your ALSAYED website content.
      </p>

      {isError && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          Unable to load dashboard data. Please ensure the API is running.
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href}>
            <Card className="transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-4 text-3xl font-bold text-ink">
                {isLoading ? "—" : (value ?? 0)}
              </p>
              <p className="mt-1 text-sm text-muted">{label}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-ink">Quick actions</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/categories"
              className="rounded-lg border border-ink/15 px-4 py-2.5 text-sm font-semibold text-ink hover:border-brand-300 hover:text-brand-700"
            >
              Manage categories
            </Link>
            <Link
              href="/products"
              className="rounded-lg border border-ink/15 px-4 py-2.5 text-sm font-semibold text-ink hover:border-brand-300 hover:text-brand-700"
            >
              Manage products
            </Link>
            <Link
              href="/content/hero"
              className="rounded-lg border border-ink/15 px-4 py-2.5 text-sm font-semibold text-ink hover:border-brand-300 hover:text-brand-700"
            >
              Edit hero
            </Link>
            <Link
              href="/settings"
              className="rounded-lg border border-ink/15 px-4 py-2.5 text-sm font-semibold text-ink hover:border-brand-300 hover:text-brand-700"
            >
              Site settings
            </Link>
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-ink">About</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Changes you make here are saved to the ALSAYED API and appear on the
            customer website. Use the navigation to manage categories, products,
            hero content, the CEO message and your site settings.
          </p>
        </Card>
      </div>
    </div>
  );
}
