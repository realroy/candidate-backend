import { Injectable } from '@nestjs/common';

import { PrismaLib } from './prisma.lib';

import type { Comment } from '@prisma/client';
import type { BaseService } from './base-service.interface';

type Input = {
  id: Comment['commentOwnableId'];
  type: Comment['commentOwnableType'];
};

@Injectable()
export class GetCommentOwnableService implements BaseService {
  constructor(private readonly prisma: PrismaLib) {}

  async call(input: Input) {
    if (input.type === 'Admin') {
      const admin = await this.prisma.admin.findFirstOrThrow({
        select: {
          id: true,
          name: true,
          profileUrl: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
        where: {
          id: input.id,
          deletedAt: null,
        },
      });

      return admin;
    }

    if (input.type === 'Candidate') {
      const candidate = await this.prisma.candidate.findFirstOrThrow({
        select: {
          id: true,
          name: true,
          profileUrl: true,
          createdAt: true,
          updatedAt: true,
        },
        where: {
          id: input.id,
          deletedAt: null,
        },
      });

      return candidate;
    }

    return null;
  }
}
