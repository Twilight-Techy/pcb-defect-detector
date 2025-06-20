-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Completed', 'Failed');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('None', 'Low', 'Medium', 'High', 'Critical');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Analysis" (
    "id" TEXT NOT NULL,
    "pcbName" TEXT NOT NULL,
    "analyzedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "numberOfDefects" INTEGER NOT NULL DEFAULT 0,
    "severity" "Severity" NOT NULL,
    "status" "Status" NOT NULL,
    "processingTime" DOUBLE PRECISION NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "technical" TEXT NOT NULL,
    "labelVisualization" TEXT NOT NULL,
    "dotVisualization" TEXT NOT NULL,
    "rawResponse" JSONB NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetectedDefect" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "repairSteps" JSONB NOT NULL,
    "requiredTools" JSONB NOT NULL,
    "estimatedRepairTime" TEXT NOT NULL,
    "severity" "Severity" NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "analysisId" TEXT NOT NULL,

    CONSTRAINT "DetectedDefect_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetectedDefect" ADD CONSTRAINT "DetectedDefect_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
