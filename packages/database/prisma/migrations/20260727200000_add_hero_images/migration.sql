-- CreateTable
CREATE TABLE "hero_images" (
    "id" SERIAL NOT NULL,
    "heroId" INTEGER NOT NULL,
    "imagePath" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hero_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "hero_images_heroId_sortOrder_idx" ON "hero_images"("heroId", "sortOrder");

-- AddForeignKey
ALTER TABLE "hero_images" ADD CONSTRAINT "hero_images_heroId_fkey" FOREIGN KEY ("heroId") REFERENCES "hero_content"("id") ON DELETE CASCADE ON UPDATE CASCADE;
