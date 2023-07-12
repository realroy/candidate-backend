import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppointmentsCommentsController } from './appointments-comments.controller';
import { AppointmentsSaveController } from './appointments-save.controller';
import { AppointmentsController } from './appointments.controller';

import { PrismaLib } from './prisma.lib';

import { AppService } from './app.service';
import { CreateCommentService } from './create-comment.service';
import { GetAppointmentsForCandidateService } from './get-appointments-for-candidate.service';
import { SaveAppointmentByCandidateService } from './save-appointment-by-candidate.service';
import { GetCommentByAppointmentIdService } from './get-comment-by-appointment-id.service';
import { GetAppointmentForCandidateService } from './get-appointment-for-candidate.service';
import { UpdateAppointmentByAdminService } from './update-appointment-by-admin.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    AppointmentsCommentsController,
    AppointmentsSaveController,
    AppointmentsController,
  ],
  providers: [
    AppService,
    CreateCommentService,
    GetAppointmentForCandidateService,
    GetAppointmentsForCandidateService,
    GetCommentByAppointmentIdService,
    PrismaLib,
    SaveAppointmentByCandidateService,
    UpdateAppointmentByAdminService,
  ],
})
export class AppModule {}
