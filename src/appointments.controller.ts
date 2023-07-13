import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

import { GetAppointmentsForCandidateService } from './get-appointments-for-candidate.service';
import { GetAppointmentForCandidateService } from './get-appointment-for-candidate.service';
import { UpdateAppointmentByAdminService } from './update-appointment-by-admin.service';

import { toNumber } from './app.transformer';

import type { Appointment } from '@prisma/client';

export class UpdateAppointmentDTO {
  @IsOptional()
  @IsString()
  name?: Appointment['name'];

  @IsOptional()
  @IsString()
  description?: Appointment['description'];

  @IsOptional()
  @IsIn(['DONE', 'IN_PROGRESS', 'TO_DO'] as Appointment['status'][])
  status?: Appointment['status'];
}

export class GetAppointmentsQuery {
  @IsNumber()
  @Transform(toNumber)
  limit: number;

  @IsOptional()
  @IsNumber()
  @Transform(toNumber)
  cursor?: Appointment['id'];
}

export class GetAppointmentParams {
  @IsNumber()
  @Transform(toNumber)
  id: Appointment['id'];
}

export class UpdateAppointmentParams {
  @IsNumber()
  @Transform(toNumber)
  id: Appointment['id'];
}

@Controller('appointments')
export class AppointmentsController {
  constructor(
    private readonly getAppointmentsForCandidateService: GetAppointmentsForCandidateService,
    private readonly getAppointmentForCandidateService: GetAppointmentForCandidateService,
    private readonly updateAppointmentByAdminService: UpdateAppointmentByAdminService,
  ) {}

  @Get()
  getAppointments(@Query() query: GetAppointmentsQuery) {
    return this.getAppointmentsForCandidateService.call({
      candidateId: 1,
      ...query,
    });
  }

  @Get(':id')
  getAppointment(
    @Param()
    params: GetAppointmentParams,
  ) {
    return this.getAppointmentForCandidateService.call({
      appointmentId: params.id,
    });
  }

  @Patch(':id')
  updateAppointment(
    @Param() params: UpdateAppointmentParams,
    @Body() body: UpdateAppointmentDTO,
  ) {
    return this.updateAppointmentByAdminService.call({
      appointment: {
        id: params.id,
        ...body,
      },
    });
  }
}
