-- AlterTable
ALTER TABLE "customer" ADD COLUMN     "disabled_at" TIMESTAMP(3),
ADD COLUMN     "is_disabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "metadata" JSONB;
