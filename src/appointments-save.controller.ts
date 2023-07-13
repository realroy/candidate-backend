import { Controller, Param, Post } from '@nestjs/common';
import { IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

import { toNumber } from './app.transformer';
import { SaveAppointmentByCandidateService } from './save-appointment-by-candidate.service';

import type { CandidateAppointment } from '@prisma/client';

export class CreateAppointmentSaveParams {
  @IsNumber()
  @Transform(toNumber)
  id: CandidateAppointment['id'];
}

@Controller('appointments/:id/save')
export class AppointmentsSaveController {
  constructor(
    private readonly saveAppointmentByCandidateService: SaveAppointmentByCandidateService,
  ) {}

  @Post()
  createAppointmentSave(@Param() params: CreateAppointmentSaveParams) {
    return this.saveAppointmentByCandidateService.call({
      appointmentId: params.id,
      candidateId: 1,
    });
  }
}
