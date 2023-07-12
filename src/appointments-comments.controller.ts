import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { GetCommentByAppointmentIdService } from './get-comment-by-appointment-id.service';
import { CreateCommentService } from './create-comment.service';

export class CreateAppointmentsCommentsBodyDto {
  text: string;
}

@Controller('appointments/:id/comments')
export class AppointmentsCommentsController {
  constructor(
    private readonly createCommentService: CreateCommentService,
    private readonly getCommentByAppointmentIdService: GetCommentByAppointmentIdService,
  ) {}

  @Get()
  index(@Param('id') id: string) {
    return this.getCommentByAppointmentIdService.call({ appointmentId: +id });
  }

  @Post()
  create(
    @Param('id') id: string,
    @Body() body: CreateAppointmentsCommentsBodyDto,
  ) {
    return this.createCommentService.call({
      appointmentId: +id,
      candidateId: 1,
      text: body.text,
    });
  }
}
