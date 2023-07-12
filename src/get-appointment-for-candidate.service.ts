import { Injectable } from '@nestjs/common';

import { PrismaLib } from './prisma.lib';

import type { Appointment } from '@prisma/client';
import type { BaseService } from './base-service.interface';

type Input = {
  appointmentId: Appointment['id'];
};

@Injectable()
export class GetAppointmentForCandidateService implements BaseService {
  constructor(private readonly prisma: PrismaLib) {}

  async call(input: Input) {
    const appointment = await this.prisma.appointment.findFirstOrThrow({
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        createdAt: true,
        comments: {
          select: {
            id: true,
            text: true,
            createdAt: true,
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
        id: input.appointmentId,
        deletedAt: null,
      },
    });

    return appointment;
  }
}
