/*
  Warnings:

  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Weight` table. If the table is not empty, all the data it contains will be lost.

  The production database has drifted from the migration history (the
  Weight foreign key is missing there), so every statement is guarded
  with IF EXISTS to drop whatever subset of these objects is present.
*/
-- DropForeignKey
ALTER TABLE IF EXISTS "Weight" DROP CONSTRAINT IF EXISTS "Weight_userId_fkey";

-- DropTable
DROP TABLE IF EXISTS "Image";

-- DropTable
DROP TABLE IF EXISTS "Post";

-- DropTable
DROP TABLE IF EXISTS "Weight";
