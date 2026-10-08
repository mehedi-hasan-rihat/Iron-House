-- CreateTable
CREATE TABLE "membership_comments" (
    "id" TEXT NOT NULL,
    "membershipId" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "membership_comments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "membership_comments" ADD CONSTRAINT "membership_comments_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "memberships"("id") ON DELETE CASCADE ON UPDATE CASCADE;
