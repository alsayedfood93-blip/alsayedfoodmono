/**
 * Local development seed.
 *
 * IMPORTANT: This is clearly-labelled DEVELOPMENT data only. It is NOT
 * official ALSAYED production content. Real business data, product images,
 * and copy are provided during the legacy migration and admin workflows.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding ALSAYED development database...");

  // --- Development admin -----------------------------------------------
  const passwordHash = await bcrypt.hash("Admin123!", 10);
  await prisma.admin.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      email: "admin@alsayed.local",
      password: passwordHash,
    },
  });
  console.log("  - admin (username: admin / password: Admin123!) [DEV ONLY]");

  // --- Categories ------------------------------------------------------
  const categoriesData = [
    {
      title: "Mineral Water",
      slug: "mineral-water",
      description: "Pure, refreshing mineral water for everyday hydration.",
      sortOrder: 1,
    },
    {
      title: "Fizzy Drinks",
      slug: "fizzy-drinks",
      description: "Sparkling flavoured beverages crafted for a lively taste.",
      sortOrder: 2,
    },
    {
      title: "Energy Drinks",
      slug: "energy-drinks",
      description: "Bold energy blends to power your day.",
      sortOrder: 3,
    },
    {
      title: "Cola Drinks",
      slug: "cola-drinks",
      description: "Classic cola refreshment with a premium twist.",
      sortOrder: 4,
    },
  ];

  const categoryBySlug: Record<string, number> = {};
  for (const data of categoriesData) {
    const category = await prisma.category.upsert({
      where: { slug: data.slug },
      update: {},
      create: { ...data, isActive: true },
    });
    categoryBySlug[data.slug] = category.id;
  }
  console.log(`  - ${categoriesData.length} categories`);

  // --- Products (development placeholders) -----------------------------
  const productsData = [
    {
      title: "ALSAYED Mineral Water 1.5L",
      slug: "alsayed-mineral-water-1-5l",
      description: "Naturally sourced mineral water in a 1.5L bottle.",
      size: "1.5L",
      price: 1,
      ingredients: ["Purified water", "Natural minerals"],
      categorySlug: "mineral-water",
      isFeatured: true,
      sortOrder: 1,
    },
    {
      title: "Falastin Fizz Orange",
      slug: "falastin-fizz-orange",
      description: "Sparkling orange soda with a bright, citrus flavour.",
      size: "330ml",
      price: 1,
      ingredients: ["Carbonated water", "Orange flavour", "Sugar"],
      categorySlug: "fizzy-drinks",
      isFeatured: true,
      sortOrder: 1,
    },
    {
      title: "Falastin Fizz Lemon",
      slug: "falastin-fizz-lemon",
      description: "Zesty lemon sparkling drink, refreshing and crisp.",
      size: "330ml",
      price: 1,
      ingredients: ["Carbonated water", "Lemon flavour", "Sugar"],
      categorySlug: "fizzy-drinks",
      isFeatured: false,
      sortOrder: 2,
    },
    {
      title: "Gaza Max Energy",
      slug: "gaza-max-energy",
      description: "High-energy blend for an instant boost.",
      size: "250ml",
      price: 2,
      ingredients: ["Carbonated water", "Taurine", "Caffeine", "Sugar"],
      categorySlug: "energy-drinks",
      isFeatured: true,
      sortOrder: 1,
    },
    {
      title: "ALSAYED Cola Classic",
      slug: "alsayed-cola-classic",
      description: "Premium classic cola with a smooth finish.",
      size: "500ml",
      price: 1,
      ingredients: ["Carbonated water", "Cola flavour", "Sugar", "Caffeine"],
      categorySlug: "cola-drinks",
      isFeatured: true,
      sortOrder: 1,
    },
    {
      title: "ALSAYED Cola Zero",
      slug: "alsayed-cola-zero",
      description: "All the classic cola taste with zero sugar.",
      size: "500ml",
      price: 1,
      ingredients: ["Carbonated water", "Cola flavour", "Sweetener", "Caffeine"],
      categorySlug: "cola-drinks",
      isFeatured: false,
      sortOrder: 2,
    },
  ];

  for (const data of productsData) {
    const { categorySlug, ...rest } = data;
    await prisma.product.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        ...rest,
        categoryId: categoryBySlug[categorySlug],
        isActive: true,
      },
    });
  }
  console.log(`  - ${productsData.length} products`);

  // --- Hero content ----------------------------------------------------
  const existingHero = await prisma.heroContent.findFirst();
  if (!existingHero) {
    await prisma.heroContent.create({
      data: {
        eyebrow: "Purpose-driven beverages",
        title: "Every sip",
        highlightedText: "carries meaning.",
        description:
          "Premium beverages crafted with care, delivered with purpose.",
        primaryButtonText: "Explore Products",
        primaryButtonLink: "/products",
        secondaryButtonText: "View Categories",
        secondaryButtonLink: "/#categories",
        isActive: true,
      },
    });
  }
  console.log("  - hero content");

  // --- CEO message -----------------------------------------------------
  const existingCeo = await prisma.ceoMessage.findFirst();
  if (!existingCeo) {
    await prisma.ceoMessage.create({
      data: {
        name: "Malik Saed",
        title: "Founder & CEO",
        description:
          "At Alsayed Food & Beverages, our mission is simple: to deliver premium quality beverages that make a positive difference in people's lives. Every product we create is a reflection of our values — purity, trust, and purpose.",
        isActive: true,
      },
    });
  }
  console.log("  - CEO message");

  // --- Site settings ---------------------------------------------------
  const existingSettings = await prisma.siteSettings.findFirst();
  if (!existingSettings) {
    await prisma.siteSettings.create({
      data: {
        companyName: "ALSAYED Food & Beverages",
        email: "alsayedfood93@gmail.com",
        phone: "+92 303 8555100",
        whatsapp: "+92 303 8555100",
        address: "Karachi, Pakistan",
        facebookUrl: "https://facebook.com/",
        instagramUrl: "https://instagram.com/",
        tiktokUrl: "https://tiktok.com/",
      },
    });
  }
  console.log("  - site settings");

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
