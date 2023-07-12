import { Controller, Param, Post } from '@nestjs/common';

import { SaveAppointmentByCandidateService } from './save-appointment-by-candidate.service';

@Controller('appointments/:id')
export class AppointmentsSaveController {
  constructor(
    private readonly saveAppointmentByCandidateService: SaveAppointmentByCandidateService,
  ) {}

  @Post('save')
  create(@Param('id') id: string) {
    return this.saveAppointmentByCandidateService.call({
      appointmentId: +id,
      candidateId: 1,
    });
  }
}
