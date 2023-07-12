/*
  Warnings:

  - You are about to drop the column `comment_ownable_id` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `comment_ownable_type` on the `Comment` table. All the data in the column will be lost.
  - Added the required column `commentOwnableId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `commentOwnableType` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "admin_commentOwnableId";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "candidate_commentOwnableId";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "comment_ownable_id",
DROP COLUMN "comment_ownable_type",
ADD COLUMN     "commentOwnableId" INTEGER NOT NULL,
ADD COLUMN     "commentOwnableType" "CommentOwnableType" NOT NULL;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "admin_commentOwnableId" FOREIGN KEY ("commentOwnableId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "candidate_commentOwnableId" FOREIGN KEY ("commentOwnableId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
