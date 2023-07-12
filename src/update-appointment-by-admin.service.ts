import { Injectable } from '@nestjs/common';

import type { Appointment } from '@prisma/client';

import type { BaseService } from './base-service.interface';
import { PrismaLib } from './prisma.lib';

type Input = {
  appointment: Omit<
    Appointment,
    'updatedAt' | 'createdAt' | 'deletedAt' | 'creatorId'
  >;
};

@Injectable()
export class UpdateAppointmentByAdminService implements BaseService {
  constructor(private readonly prisma: PrismaLib) {}

  call(input: Input) {
    const { id, ...appointment } = input.appointment;

    return this.prisma.appointment.update({
      where: {
        id,
      },
      data: {
        ...appointment,
      },
    });
  }
}
