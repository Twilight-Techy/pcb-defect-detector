/*
  Warnings:

  - Added the required column `description` to the `DetectedDefect` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `DetectedDefect` table without a default value. This is not possible if the table is not empty.

*/
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
    "severity" TEXT NOT NULL,
    "x" REAL NOT NULL,
    "y" REAL NOT NULL,
    "width" REAL NOT NULL,
    "height" REAL NOT NULL,
    "confidence" REAL NOT NULL,
    "analysisId" TEXT NOT NULL,
    CONSTRAINT "DetectedDefect_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_DetectedDefect" ("analysisId", "confidence", "height", "id", "name", "repairSteps", "requiredTools", "severity", "width", "x", "y") SELECT "analysisId", "confidence", "height", "id", "name", "repairSteps", "requiredTools", "severity", "width", "x", "y" FROM "DetectedDefect";
DROP TABLE "DetectedDefect";
ALTER TABLE "new_DetectedDefect" RENAME TO "DetectedDefect";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
