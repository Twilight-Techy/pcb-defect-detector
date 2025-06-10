-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Prediction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "imageUrl" TEXT NOT NULL,
    "inferenceTime" REAL NOT NULL,
    "modelUsed" TEXT NOT NULL,
    "rawResponse" JSONB NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Prediction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DetectedDefect" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "predictionId" TEXT NOT NULL,
    "className" TEXT NOT NULL,
    "confidence" REAL NOT NULL,
    "x" REAL NOT NULL,
    "y" REAL NOT NULL,
    "width" REAL NOT NULL,
    "height" REAL NOT NULL,
    CONSTRAINT "DetectedDefect_predictionId_fkey" FOREIGN KEY ("predictionId") REFERENCES "Prediction" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
