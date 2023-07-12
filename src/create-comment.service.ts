import { Injectable } from '@nestjs/common';

import { PrismaLib } from './prisma.lib';

import type { Admin, Appointment, Candidate } from '@prisma/client';
import type { BaseService } from './base-service.interface';

export class UnsupportedCommentOwnerableError extends Error {
  constructor() {
    super('Unsupported comment ownerable');
  }
}

type Input =
  | {
      appointmentId: Appointment['id'];
      adminId: Admin['id'];
      text: string;
    }
  | {
      appointmentId: Appointment['id'];
      candidateId: Candidate['id'];
      text: string;
    };

@Injectable()
export class CreateCommentService implements BaseService {
  constructor(private readonly prisma: PrismaLib) {}

  async call(input: Input) {
    const isCreatedByAdmin = 'adminId' in input;
    const isCreatedByCandidate = 'candidateId' in input;

    if (!isCreatedByAdmin && !isCreatedByCandidate) {
      throw new UnsupportedCommentOwnerableError();
    }

    const comments = await this.prisma.comment.create({
      data: {
        appointmentId: input.appointmentId,
        commentOwnableId: isCreatedByAdmin ? input.adminId : input.candidateId,
        commentOwnableType: isCreatedByAdmin ? 'ADMIN' : 'CANDIDATE',
        text: input.text,
      },
    });

    return comments;
  }
}
