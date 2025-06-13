/*
  Warnings:

  - You are about to drop the `Prediction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `className` on the `DetectedDefect` table. All the data in the column will be lost.
  - You are about to drop the column `predictionId` on the `DetectedDefect` table. All the data in the column will be lost.
  - Added the required column `analysisId` to the `DetectedDefect` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `DetectedDefect` table without a default value. This is not possible if the table is not empty.
  - Added the required column `repairSteps` to the `DetectedDefect` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requiredTools` to the `DetectedDefect` table without a default value. This is not possible if the table is not empty.
  - Added the required column `severity` to the `DetectedDefect` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Prediction";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Analysis" (
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
    "rawResponse" JSONB NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Analysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DetectedDefect" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
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
INSERT INTO "new_DetectedDefect" ("confidence", "height", "id", "width", "x", "y") SELECT "confidence", "height", "id", "width", "x", "y" FROM "DetectedDefect";
DROP TABLE "DetectedDefect";
ALTER TABLE "new_DetectedDefect" RENAME TO "DetectedDefect";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
