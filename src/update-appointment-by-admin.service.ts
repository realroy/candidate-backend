import { Injectable } from '@nestjs/common';

import type { Appointment } from '@prisma/client';

import type { BaseService } from './base-service.interface';
import { PrismaLib } from './prisma.lib';

type Input = {
  appointment: {
    id: Appointment['id'];
    name?: Appointment['name'];
    description?: Appointment['description'];
    status?: Appointment['status'];
  };
};

@Injectable()
export class UpdateAppointmentByAdminService implements BaseService {
  constructor(private readonly prisma: PrismaLib) {}

  async call(input: Input) {
    const { id, ...appointment } = input.appointment;

    const updatedAppointment = await this.prisma.appointment.update({
      where: {
        id,
      },
      data: {
        ...appointment,
      },
    });

    return updatedAppointment;
  }
}
