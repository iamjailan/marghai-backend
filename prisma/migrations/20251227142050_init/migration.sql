-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "id" SET DEFAULT (concat('cus_', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "Job" ALTER COLUMN "id" SET DEFAULT (concat('job_', gen_random_uuid()))::TEXT;
