-- CreateTable
CREATE TABLE "DefaultSplittingOptions" (
    "groupId" TEXT NOT NULL PRIMARY KEY,
    "splitMode" "SplitMode" NOT NULL DEFAULT 'EVENLY',
    "paidFor" JSONB,
    CONSTRAINT "DefaultSplittingOptions_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
