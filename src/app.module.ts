import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';

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
import { GetAppointmentsForAdminService } from './get-appointments-for-admin';

import { PrismaExceptionFilter } from './prisma-exception.filter';

@Module({
  imports: [],
  controllers: [
    AppController,
    AppointmentsCommentsController,
    AppointmentsSaveController,
    AppointmentsController,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () => new ValidationPipe({ transform: true }),
    },
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionFilter,
    },
    AppService,
    CreateCommentService,
    GetAppointmentForCandidateService,
    GetAppointmentsForAdminService,
    GetAppointmentsForCandidateService,
    GetCommentByAppointmentIdService,
    PrismaLib,
    SaveAppointmentByCandidateService,
    UpdateAppointmentByAdminService,
  ],
})
export class AppModule {}
