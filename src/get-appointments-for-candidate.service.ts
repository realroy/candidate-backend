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
      take: input.limit,
      ...(!!input.cursor && {
        cursor: {
          id: input.cursor,
        },
        skip: 0,
        take: input.limit,
      }),
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        creator: {
          select: {
            profileUrl: true,
            name: true,
          },
        },
      },
      orderBy: {
        id: 'desc',
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

    const nextAppointment = await this.prisma.appointment.findMany({
      select: {
        id: true,
      },
      cursor: {
        id: appointments.at(-1).id,
      },
      take: 2,
      orderBy: {
        id: 'desc',
      },
    });

    if (nextAppointment.length === 1) {
      return {
        data: appointments,
        hasNext: false,
        cursor: null,
      };
    }

    return {
      data: appointments,
      hasNext: true,
      cursor: nextAppointment.at(1).id,
    };
  }
}
