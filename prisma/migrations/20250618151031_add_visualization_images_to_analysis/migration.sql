/*
  Warnings:

  - Added the required column `dotVisualization` to the `Analysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `labelVisualization` to the `Analysis` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Analysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pcbName" TEXT NOT NULL,
    "analyzedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "numberOfDefects" INTEGER NOT NULL DEFAULT 0,
    "severity" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "processingTime" REAL NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "technical" TEXT NOT NULL,
    "labelVisualization" TEXT NOT NULL,
    "dotVisualization" TEXT NOT NULL,
    "rawResponse" JSONB NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Analysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Analysis" ("analyzedAt", "id", "imageUrl", "numberOfDefects", "overview", "pcbName", "processingTime", "rawResponse", "severity", "status", "technical", "userId") SELECT "analyzedAt", "id", "imageUrl", "numberOfDefects", "overview", "pcbName", "processingTime", "rawResponse", "severity", "status", "technical", "userId" FROM "Analysis";
DROP TABLE "Analysis";
ALTER TABLE "new_Analysis" RENAME TO "Analysis";
CREATE TABLE "new_DetectedDefect" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "repairSteps" JSONB NOT NULL,
    "requiredTools" JSONB NOT NULL,
    "estimatedRepairTime" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "x" REAL NOT NULL,
    "y" REAL NOT NULL,
    "width" REAL NOT NULL,
    "height" REAL NOT NULL,
    "confidence" REAL NOT NULL,
    "analysisId" TEXT NOT NULL,
    CONSTRAINT "DetectedDefect_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_DetectedDefect" ("analysisId", "confidence", "description", "estimatedRepairTime", "height", "id", "location", "name", "repairSteps", "requiredTools", "severity", "width", "x", "y") SELECT "analysisId", "confidence", "description", "estimatedRepairTime", "height", "id", "location", "name", "repairSteps", "requiredTools", "severity", "width", "x", "y" FROM "DetectedDefect";
DROP TABLE "DetectedDefect";
ALTER TABLE "new_DetectedDefect" RENAME TO "DetectedDefect";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
