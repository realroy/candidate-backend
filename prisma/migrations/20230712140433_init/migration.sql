-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('TO_DO', 'IN_PROGRESS', 'DONE');

-- CreateEnum
CREATE TYPE "CommentOwnableType" AS ENUM ('ADMIN', 'CANDIDATE');

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "profileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "profileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'TO_DO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateAppointment" (
    "id" SERIAL NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "appointmentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CandidateAppointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "appointmentId" INTEGER NOT NULL,
    "comment_ownable_id" INTEGER NOT NULL,
    "comment_ownable_type" "CommentOwnableType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_name_key" ON "Candidate"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_name_key" ON "Appointment"("name");

-- CreateIndex
CREATE INDEX "status" ON "Appointment"("status");

-- CreateIndex
CREATE INDEX "candidateId" ON "CandidateAppointment"("candidateId");

-- CreateIndex
CREATE INDEX "appointmentId" ON "CandidateAppointment"("appointmentId");

-- CreateIndex
CREATE UNIQUE INDEX "CandidateAppointment_candidateId_appointmentId_key" ON "CandidateAppointment"("candidateId", "appointmentId");

-- AddForeignKey
ALTER TABLE "CandidateAppointment" ADD CONSTRAINT "CandidateAppointment_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateAppointment" ADD CONSTRAINT "CandidateAppointment_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "admin_commentOwnableId" FOREIGN KEY ("comment_ownable_id") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "candidate_commentOwnableId" FOREIGN KEY ("comment_ownable_id") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
