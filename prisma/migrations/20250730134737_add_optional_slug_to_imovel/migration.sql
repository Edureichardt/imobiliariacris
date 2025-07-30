/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Imovel` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Imovel" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Imovel_slug_key" ON "Imovel"("slug");
