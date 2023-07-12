import { Injectable } from '@nestjs/common';

import { PrismaLib } from './prisma.lib';

import type { Candidate } from '@prisma/client';

type GetAppointmentForCandidateServiceInput = {
  candidateId: Candidate['id'];
};

@Injectable()
export class GetAppointmentForCandidateService {
  constructor(private readonly prisma: PrismaLib) {}
  async call(input: GetAppointmentForCandidateServiceInput) {
    const appointments = await this.prisma.appointment.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        createdAt: true,
        candidateAppointments: {
          select: {
            candidateId: true,
          },
        },
        creator: {
          select: {
            profileUrl: true,
            name: true,
          },
        },
      },
      where: {
        candidateAppointments: {
          every: {
            candidateId: {
              not: {
                equals: input.candidateId,
              },
            },
          },
        },
      },
    });

    return appointments;
  }
}
