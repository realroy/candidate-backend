import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

import { GetAppointmentsForAdminService } from './get-appointments-for-admin';
import { GetAppointmentsForCandidateService } from './get-appointments-for-candidate.service';
import { GetAppointmentForCandidateService } from './get-appointment-for-candidate.service';
import { UpdateAppointmentByAdminService } from './update-appointment-by-admin.service';

import { toNumber } from './app.transformer';

import type { Appointment } from '@prisma/client';
import { User } from './app.decorator';
import { CurrentUser } from './app.type';

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
    private readonly getAppointmentsForAdminService: GetAppointmentsForAdminService,
    private readonly getAppointmentForCandidateService: GetAppointmentForCandidateService,
    private readonly updateAppointmentByAdminService: UpdateAppointmentByAdminService,
  ) {}

  @Get()
  getAppointments(
    @User() currentUser: CurrentUser,
    @Query() query: GetAppointmentsQuery,
  ) {
    if (currentUser.role === 'CANDIDATE') {
      return this.getAppointmentsForCandidateService.call({
        candidateId: currentUser.id,
        ...query,
      });
    }

    if (currentUser.role === 'ADMIN') {
      return this.getAppointmentsForAdminService.call({
        adminId: currentUser.id,
        ...query,
      });
    }

    throw new UnauthorizedException(
      'Only candidates and admins can get appointments',
    );
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
    @User() currentUser: CurrentUser,
    @Param() params: UpdateAppointmentParams,
    @Body() body: UpdateAppointmentDTO,
  ) {
    if (currentUser.role !== 'ADMIN') {
      throw new UnauthorizedException('Only admins can update appointments');
    }

    return this.updateAppointmentByAdminService.call({
      appointment: {
        id: params.id,
        ...body,
      },
    });
  }
}
