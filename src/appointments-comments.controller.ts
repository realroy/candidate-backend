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
  ) {}

  @Get()
  getComments(@Param() params: GetCommentsParams) {
    return this.getCommentByAppointmentIdService.call({
      appointmentId: +params.id,
    });
  }

  @Post()
  async createComment(
    @User() currentUser: CurrentUser,
    @Param() params: CreateCommentParams,
    @Body() body: CreateCommentDTO,
  ) {
    try {
      const candidateId =
        currentUser.role === 'CANDIDATE' ? currentUser.id : undefined;
      const adminId = currentUser.role === 'ADMIN' ? currentUser.id : undefined;

      const comment = await this.createCommentService.call({
        appointmentId: +params.id,
        text: body.text,
        candidateId,
        adminId,
      });

      return comment;
    } catch (error) {
      if (error instanceof UnsupportedCommentOwnerableError) {
        throw new BadRequestException(error.message);
      }

      throw new InternalServerErrorException(error.message);
    }
  }
}
