import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { AppModule } from './../src/app.module';
import prisma from './../src/tests/helpers/prisma';
import { generateToken } from './../src/tests/helpers/generate-token';

import type { Admin, Appointment, Candidate } from '@prisma/client';

describe('AppointmentsSaveController (e2e)', () => {
  let app: INestApplication;
  let admin: Admin;
  let adminToken: string;
  let candidate1: Candidate;
  let candidate1Token: string;
  let appointment: Appointment;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    const responses = await Promise.all([
      prisma.admin.create({
        data: {
          name: 'admin',
          email: 'foo@bar.com',
        },
      }),
      prisma.candidate.create({
        data: {
          name: 'candidate1',
        },
      }),
    ]);

    admin = responses[0];
    adminToken = generateToken({ id: admin.id, role: 'Admin' });

    candidate1 = responses[1];
    candidate1Token = generateToken({ id: candidate1.id, role: 'Candidate' });

    appointment = await prisma.appointment.create({
      data: {
        name: 'Appoitment#1',
        creatorId: admin.id,
      },
    });
  });

  describe('/appointments/:id/save (POST)', async () => {
    it('return 404 when cannot find appointment with given id', async () => {
      const { statusCode } = await request(app.getHttpServer())
        .post(`/appointments/${-1}/save`)
        .set('Authorization', `Bearer ${candidate1Token}`);

      expect(statusCode).toBe(404);
    });

    it('return 201 when candidate save appointment', async () => {
      const { statusCode } = await request(app.getHttpServer())
        .post(`/appointments/${appointment.id}/save`)
        .set('Authorization', `Bearer ${candidate1Token}`);

      expect(statusCode).toBe(201);
    });

    it('return 403 when admin save appointment', async () => {
      const { statusCode } = await request(app.getHttpServer())
        .post(`/appointments/${appointment.id}/save`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(statusCode).toBe(403);
    });
  });
});
