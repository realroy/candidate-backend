import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
} from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

import { GetCommentByAppointmentIdService } from './get-comment-by-appointment-id.service';
import {
  CreateCommentService,
  UnsupportedCommentOwnerableError,
} from './create-comment.service';
import { GetCommentOwnableService } from './get-comment-ownable.service';

import { toNumber } from './app.transformer';

import type { Appointment, Comment } from '@prisma/client';
import { User } from './app.decorator';
import { CurrentUser } from './app.type';

export class GetCommentsParams {
  @IsNumber()
  @Transform(toNumber)
  id: Appointment['id'];
}

export class CreateCommentParams {
  @IsNumber()
  @Transform(toNumber)
  id: Comment['id'];
}

export class CreateCommentDTO {
  @IsString()
  text: Comment['text'];
}

@Controller('appointments/:id/comments')
export class AppointmentsCommentsController {
  constructor(
    private readonly createCommentService: CreateCommentService,
    private readonly getCommentByAppointmentIdService: GetCommentByAppointmentIdService,
    private readonly getCommentOwnableService: GetCommentOwnableService,
  ) {}

  @Get()
  async getComments(@Param() params: GetCommentsParams) {
    const comments = await this.getCommentByAppointmentIdService.call({
      appointmentId: +params.id,
    });

    const responses = [];

    for (let i = 0; i < comments.length; i++) {
      const { commentOwnableId, commentOwnableType, ...comment } = comments[i];

      if (!commentOwnableId || !commentOwnableType) {
        continue;
      }

      const commentOwnable = await this.getCommentOwnableService.call({
        id: commentOwnableId,
        type: commentOwnableType,
      });

      responses.push({
        ...comment,
        commentOwnable,
      });
    }

    return responses;
  }

  @Post()
  async createComment(
    @User() currentUser: CurrentUser,
    @Param() params: CreateCommentParams,
    @Body() body: CreateCommentDTO,
  ) {
    try {
      const candidateId =
        currentUser.role === 'Candidate' ? currentUser.id : undefined;
      const adminId = currentUser.role === 'Admin' ? currentUser.id : undefined;

      const { commentOwnableId, commentOwnableType, ...comment } =
        await this.createCommentService.call({
          appointmentId: +params.id,
          text: body.text,
          candidateId,
          adminId,
        });

      const commentOwnable = await this.getCommentOwnableService.call({
        id: commentOwnableId,
        type: commentOwnableType,
      });

      return {
        ...comment,
        commentOwnable,
      };
    } catch (error) {
      if (error instanceof UnsupportedCommentOwnerableError) {
        throw new BadRequestException(error.message);
      }

      throw new InternalServerErrorException(error.message);
    }
  }
}
