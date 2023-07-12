import {
  BadRequestException,
  Body,
  Controller,
  Get,
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
    @Param() params: CreateCommentParams,
    @Body() body: CreateCommentDTO,
  ) {
    const comment = await this.createCommentService
      .call({
        appointmentId: +params.id,
        candidateId: 1,
        text: body.text,
      })
      .catch((err) => {
        if (err instanceof UnsupportedCommentOwnerableError) {
          throw new BadRequestException(err.message);
        }

        throw err;
      });

    return comment;
  }
}
