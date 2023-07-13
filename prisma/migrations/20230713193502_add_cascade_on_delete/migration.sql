-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "CandidateAppointment" DROP CONSTRAINT "CandidateAppointment_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "CandidateAppointment" DROP CONSTRAINT "CandidateAppointment_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_appointmentId_fkey";

-- AlterTable
ALTER TABLE "Appointment" ALTER COLUMN "creatorId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "CandidateAppointment" ALTER COLUMN "candidateId" DROP NOT NULL,
ALTER COLUMN "appointmentId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "appointmentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateAppointment" ADD CONSTRAINT "CandidateAppointment_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateAppointment" ADD CONSTRAINT "CandidateAppointment_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
