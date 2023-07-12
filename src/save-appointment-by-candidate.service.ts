import { Injectable } from '@nestjs/common';

import { PrismaLib } from './prisma.lib';

import type { Appointment, Candidate } from '@prisma/client';
import type { BaseService } from './base-service.interface';

type Input = {
  candidateId: Candidate['id'];
  appointmentId: Appointment['id'];
};

@Injectable()
export class SaveAppointmentByCandidateService implements BaseService {
  constructor(private readonly prisma: PrismaLib) {}

  async call(input: Input) {
    const candidateAppointment = await this.prisma.candidateAppointment.create({
      data: {
        appointmentId: input.appointmentId,
        candidateId: input.candidateId,
      },
    });

    return candidateAppointment;
  }
}
