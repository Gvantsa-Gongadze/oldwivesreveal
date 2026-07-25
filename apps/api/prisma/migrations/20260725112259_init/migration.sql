-- CreateTable
CREATE TABLE "reveals" (
    "id" TEXT NOT NULL,
    "fatherBirthDate" DATE NOT NULL,
    "motherBirthDate" DATE NOT NULL,
    "reckonDate" DATE NOT NULL,
    "fatherRemainderYears" DOUBLE PRECISION NOT NULL,
    "fatherAngleDeg" DOUBLE PRECISION NOT NULL,
    "fatherAgeYears" DOUBLE PRECISION NOT NULL,
    "motherRemainderYears" DOUBLE PRECISION NOT NULL,
    "motherAngleDeg" DOUBLE PRECISION NOT NULL,
    "motherAgeYears" DOUBLE PRECISION NOT NULL,
    "newerParent" TEXT NOT NULL,
    "motherOlder" BOOLEAN NOT NULL,
    "result" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reveals_pkey" PRIMARY KEY ("id")
);
