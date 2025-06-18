-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DetectedDefect" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "repairSteps" JSONB NOT NULL,
    "requiredTools" JSONB NOT NULL,
    "estimatedRepairTime" TEXT NOT NULL DEFAULT 'Unknown',
    "severity" TEXT NOT NULL,
    "x" REAL NOT NULL,
    "y" REAL NOT NULL,
    "width" REAL NOT NULL,
    "height" REAL NOT NULL,
    "confidence" REAL NOT NULL,
    "analysisId" TEXT NOT NULL,
    CONSTRAINT "DetectedDefect_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_DetectedDefect" ("analysisId", "confidence", "description", "height", "id", "location", "name", "repairSteps", "requiredTools", "severity", "width", "x", "y") SELECT "analysisId", "confidence", "description", "height", "id", "location", "name", "repairSteps", "requiredTools", "severity", "width", "x", "y" FROM "DetectedDefect";
DROP TABLE "DetectedDefect";
ALTER TABLE "new_DetectedDefect" RENAME TO "DetectedDefect";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
