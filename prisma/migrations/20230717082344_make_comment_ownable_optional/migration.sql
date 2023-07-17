-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "admin_commentOwnableId";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "candidate_commentOwnableId";

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "commentOwnableId" DROP NOT NULL,
ALTER COLUMN "commentOwnableType" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "admin_commentOwnableId" FOREIGN KEY ("commentOwnableId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "candidate_commentOwnableId" FOREIGN KEY ("commentOwnableId") REFERENCES "Candidate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
