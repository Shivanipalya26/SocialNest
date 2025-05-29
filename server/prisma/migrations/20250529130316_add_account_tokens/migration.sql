-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "access_token_iv" TEXT,
ADD COLUMN     "access_token_secret_iv" TEXT,
ADD COLUMN     "expires_at" INTEGER,
ADD COLUMN     "refresh_token_iv" TEXT,
ADD COLUMN     "token_type" TEXT;
