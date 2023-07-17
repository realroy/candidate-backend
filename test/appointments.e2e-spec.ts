import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { AppModule } from './../src/app.module';
import prisma from './../src/tests/helpers/prisma';
import { generateToken } from './../src/tests/helpers/generate-token';

import type { Admin, AppointmentStatus, Candidate } from '@prisma/client';

describe('AppointmentsController (e2e)', () => {
  let app: INestApplication;
  let admin: Admin;
  let candidate1: Candidate;

  let adminToken: string;
  let candidate1Token: string;

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
          profileUrl: '',
        },
      }),
      prisma.candidate.create({
        data: {
          name: 'candidate1',
        },
      }),
    ]);

    admin = responses[0];
    adminToken = generateToken({
      id: admin.id,
      role: 'Admin',
    });

    candidate1 = responses[1];
    candidate1Token = generateToken({
      id: candidate1.id,
      role: 'Candidate',
    });

    await prisma.appointment.createMany({
      data: Array.from({ length: 20 }, (_, index) => index + 1).map((n) => ({
        name: `Appointment#${n}`,
        description: `Description#${n}`,
        creatorId: admin.id,
      })),
    });
  });

  describe('/appointments (GET)', () => {
    it('should response with 200 status and exact appoitments size', async () => {
      const { statusCode, body } = await request(app.getHttpServer())
        .get('/appointments?limit=10')
        .set('Authorization', `Bearer ${candidate1Token}`);

      expect(statusCode).toBe(200);
      expect(body).toHaveLength(10);
    });

    it('should response with 200 status and exact appoitments size when receive cursor', async () => {
      const firstResponse = await request(app.getHttpServer())
        .get('/appointments?limit=19')
        .set('Authorization', `Bearer ${candidate1Token}`);

      const lastAppointment = firstResponse.body.at(-1);

      const { statusCode, body } = await request(app.getHttpServer()).get(
        `/appointments?limit=10&cursor=${lastAppointment.id}`,
      );

      expect(statusCode).toBe(200);
      expect(body).toHaveLength(1);
    });
  });

  describe('/appointments/:id (GET)', () => {
    it('should response 404 when receive non exist id', async () => {
      const { statusCode } = await request(app.getHttpServer())
        .get(`/appointments/${-1}`)
        .set('Authorization', `Bearer ${candidate1Token}`);

      expect(statusCode).toBe(404);
    });

    it('should response 200 when receive exist id', async () => {
      const appointment = await prisma.appointment.findFirst({
        select: { id: true },
      });

      const { statusCode, body } = await request(app.getHttpServer())
        .get(`/appointments/${appointment.id}`)
        .set('Authorization', `Bearer ${candidate1Token}`);

      expect(statusCode).toBe(200);
      expect(body.id).toBe(appointment.id);
    });
  });

  describe('/appointments/:id (PATCH)', () => {
    it('should response 404 when receive non exist id', async () => {
      const { statusCode } = await request(app.getHttpServer())
        .patch(`/appointments/${-1}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(statusCode).toBe(404);
    });

    it('should response 200 when admin update status from TO_DO to DONE', async () => {
      const appointment = await prisma.appointment.findFirst();

      const { statusCode, body } = await request(app.getHttpServer())
        .patch(`/appointments/${appointment.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'DONE' as AppointmentStatus });

      expect(statusCode).toBe(200);
      expect(body).toMatchObject({
        id: appointment.id,
        name: appointment.name,
        description: appointment.description,
        status: 'DONE',
      });
    });

    it('should response 403 when candidate update appointment', async () => {
      const appointment = await prisma.appointment.findFirst();

      const { statusCode } = await request(app.getHttpServer())
        .patch(`/appointments/${appointment.id}`)
        .set('Authorization', `Bearer ${candidate1}`)
        .send({ status: 'DONE' as AppointmentStatus });

      expect(statusCode).toBe(403);
    });
  });
});
