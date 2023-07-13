import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { AppModule } from './../src/app.module';
import prisma from './../src/tests/helpers/prisma';
import { Admin, Appointment, AppointmentStatus } from '@prisma/client';

describe('AppointmentsController (e2e)', () => {
  let app: INestApplication;
  let admin: Admin;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    admin = await prisma.admin.create({
      data: {
        name: 'admin',
        email: 'foo@bar.com',
        profileUrl: '',
      },
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
      const { statusCode, body } = await request(app.getHttpServer()).get(
        '/appointments?limit=10',
      );

      expect(statusCode).toBe(200);
      expect(body).toHaveLength(10);
    });

    it('should response with 200 status and exact appoitments size when receive cursor', async () => {
      const firstResponse = await request(app.getHttpServer()).get(
        '/appointments?limit=19',
      );

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
      const { statusCode } = await request(app.getHttpServer()).get(
        `/appointments/${-1}`,
      );

      expect(statusCode).toBe(404);
    });

    it('should response 200 when receive exist id', async () => {
      const appointment = await prisma.appointment.findFirst({
        select: { id: true },
      });

      const { statusCode, body } = await request(app.getHttpServer()).get(
        `/appointments/${appointment.id}`,
      );

      expect(statusCode).toBe(200);
      expect(body.id).toBe(appointment.id);
    });
  });

  describe('/appointments/:id (PATCH)', () => {
    it('should response 404 when receive non exist id', async () => {
      const { statusCode } = await request(app.getHttpServer()).patch(
        `/appointments/${-1}`,
      );

      expect(statusCode).toBe(404);
    });

    it('should response 200 when update status from TO_DO to DONE', async () => {
      const appointment = await prisma.appointment.findFirst();

      const { statusCode, body } = await request(app.getHttpServer())
        .patch(`/appointments/${appointment.id}`)
        .send({ status: 'DONE' as AppointmentStatus });

      expect(statusCode).toBe(200);
      expect(body).toMatchObject({
        id: appointment.id,
        name: appointment.name,
        description: appointment.description,
        status: 'DONE',
      });
    });
  });
});
