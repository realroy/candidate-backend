import { Controller, ForbiddenException, Param, Post } from '@nestjs/common';
import { IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

import { User } from './app.decorator';
import { toNumber } from './app.transformer';
import { SaveAppointmentByCandidateService } from './save-appointment-by-candidate.service';

import type { Appointment } from '@prisma/client';
import type { CurrentUser } from './app.type';

export class CreateAppointmentSaveParams {
  @IsNumber()
  @Transform(toNumber)
  id: Appointment['id'];
}

@Controller('appointments/:id/save')
export class AppointmentsSaveController {
  constructor(
    private readonly saveAppointmentByCandidateService: SaveAppointmentByCandidateService,
  ) {}

  @Post()
  createAppointmentSave(
    @User() currentUser: CurrentUser,
    @Param() params: CreateAppointmentSaveParams,
  ) {
    if (currentUser.role !== 'CANDIDATE') {
      throw new ForbiddenException('Only candidates can save appointments');
    }

    return this.saveAppointmentByCandidateService.call({
      appointmentId: params.id,
      candidateId: currentUser.id,
    });
  }
}
