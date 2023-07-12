import { Injectable } from '@nestjs/common';

import { PrismaLib } from './prisma.lib';

import type { Candidate } from '@prisma/client';
import type { BaseService } from './base-service.interface';

type Input = {
  candidateId: Candidate['id'];
  limit: number;
  cursor?: Candidate['id'];
};

@Injectable()
export class GetAppointmentsForCandidateService implements BaseService {
  constructor(private readonly prisma: PrismaLib) {}

  async call(input: Input) {
    const appointments = await this.prisma.appointment.findMany({
      ...(!!input.cursor && {
        cursor: {
          id: input.cursor,
        },
        skip: input.limit,
      }),
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
        deletedAt: null,
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
