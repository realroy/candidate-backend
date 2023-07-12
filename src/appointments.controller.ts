import { Controller, Get, Param, Patch, Query } from '@nestjs/common';

import { GetAppointmentsForCandidateService } from './get-appointments-for-candidate.service';
import { GetAppointmentForCandidateService } from './get-appointment-for-candidate.service';
import { UpdateAppointmentByAdminService } from './update-appointment-by-admin.service';

import type { Appointment } from '@prisma/client';

export class UpdateAppointmentsBodyDto {
  name: Appointment['name'];
  description: Appointment['description'];
  status: Appointment['status'];
}

export class IndexAppointmentsQueryDto {
  limit: number;
  cursor?: Appointment['id'];
}

@Controller('appointments')
export class AppointmentsController {
  constructor(
    private readonly getAppointmentsForCandidateService: GetAppointmentsForCandidateService,
    private readonly getAppointmentForCandidateService: GetAppointmentForCandidateService,
    private readonly updateAppointmentByAdminService: UpdateAppointmentByAdminService,
  ) {}

  @Get()
  index(@Query() query: IndexAppointmentsQueryDto) {
    return this.getAppointmentsForCandidateService.call({
      candidateId: 1,
      ...query,
    });
  }

  @Get('/:id')
  show(@Param('id') id: string) {
    return this.getAppointmentForCandidateService.call({ appointmentId: +id });
  }

  @Patch('/:id')
  update(@Param('id') id: string, body: UpdateAppointmentsBodyDto) {
    return this.updateAppointmentByAdminService.call({
      appointment: {
        id: +id,
        ...body,
      },
    });
  }
}
