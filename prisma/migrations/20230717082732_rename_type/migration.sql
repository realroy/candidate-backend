/*
  Warnings:

  - The values [ADMIN,CANDIDATE] on the enum `CommentOwnableType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CommentOwnableType_new" AS ENUM ('Admin', 'Candidate');
ALTER TABLE "Comment" ALTER COLUMN "commentOwnableType" TYPE "CommentOwnableType_new" USING ("commentOwnableType"::text::"CommentOwnableType_new");
ALTER TYPE "CommentOwnableType" RENAME TO "CommentOwnableType_old";
ALTER TYPE "CommentOwnableType_new" RENAME TO "CommentOwnableType";
DROP TYPE "CommentOwnableType_old";
COMMIT;
