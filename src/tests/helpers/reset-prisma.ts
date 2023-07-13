import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async () => {
  await prisma.$transaction([
    prisma.admin.deleteMany(),
    prisma.appointment.deleteMany(),
    prisma.candidate.deleteMany(),
    prisma.candidateAppointment.deleteMany(),
    prisma.comment.deleteMany(),
  ]);
};
