-- CreateTable
CREATE TABLE "Creditor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "reviewHtml" TEXT NOT NULL,
    "logo" TEXT,
    "applyUrl" TEXT,
    "sourceUrl" TEXT NOT NULL,
    "sourceCapturedAt" DATETIME NOT NULL,
    "verifiedAt" DATETIME,
    "amountMin" INTEGER,
    "amountMax" INTEGER,
    "termMin" INTEGER,
    "termMax" INTEGER,
    "apr" REAL,
    "annualRate" REAL,
    "monthlyFee" REAL,
    "originationPercent" REAL,
    "pricingVerified" BOOLEAN NOT NULL DEFAULT false,
    "example" TEXT,
    "rating" REAL,
    "ratingBasis" TEXT,
    "firstFree" BOOLEAN,
    "fast" BOOLEAN,
    "payout247" BOOLEAN,
    "firstTerms" TEXT,
    "speed" TEXT,
    "requirements" TEXT NOT NULL,
    "documents" TEXT NOT NULL,
    "suitableFor" TEXT NOT NULL,
    "pros" TEXT NOT NULL,
    "cons" TEXT NOT NULL,
    "faq" TEXT NOT NULL,
    "verificationNotes" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "legacyPath" TEXT,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "bodyHtml" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "publishedAt" DATETIME,
    "author" TEXT NOT NULL,
    "image" TEXT,
    "imageAlt" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "ogImage" TEXT,
    "sourceUrl" TEXT,
    "creditorId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Article_creditorId_fkey" FOREIGN KEY ("creditorId") REFERENCES "Creditor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'EDITOR',
    "sessionVersion" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "LoginAttempt" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "count" INTEGER NOT NULL DEFAULT 0,
    "windowStart" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Creditor_slug_key" ON "Creditor"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Article_legacyPath_key" ON "Article"("legacyPath");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
