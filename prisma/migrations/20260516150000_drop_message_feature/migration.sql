-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT IF EXISTS "Message_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT IF EXISTS "Message_filiereId_fkey";

-- DropTable
DROP TABLE IF EXISTS "Message";
