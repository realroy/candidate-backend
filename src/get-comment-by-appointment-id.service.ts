import { Injectable } from '@nestjs/common';

import { PrismaLib } from './prisma.lib';

import type { Appointment } from '@prisma/client';
import type { BaseService } from './base-service.interface';

type Input = {
  appointmentId: Appointment['id'];
};

@Injectable()
export class GetCommentByAppointmentIdService implements BaseService {
  constructor(private readonly prisma: PrismaLib) {}

  async call(input: Input) {
    const comments = await this.prisma.comment.findMany({
      select: {
        id: true,
        text: true,
        createdAt: true,
        updatedAt: true,
        commentOwnableId: true,
        commentOwnableType: true,
      },
      where: {
        appointmentId: input.appointmentId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return comments;
  }
}
