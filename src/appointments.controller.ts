import { Controller, Get } from '@nestjs/common';

import { GetAppointmentForCandidateService } from './get-appointments-for-candidate.service';

@Controller('appointments')
export class AppointmentsController {
  constructor(
    private readonly getAppointmentForCandidateService: GetAppointmentForCandidateService,
  ) {}

  @Get()
  index() {
    return this.getAppointmentForCandidateService.call({ candidateId: 1 });
  }
}
