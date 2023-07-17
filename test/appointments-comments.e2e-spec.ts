import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { AppModule } from './../src/app.module';
import prisma from './../src/tests/helpers/prisma';
import { generateToken } from './../src/tests/helpers/generate-token';

import type { Admin, Appointment, Candidate } from '@prisma/client';

describe('AppointmentsCommentsController (e2e)', () => {
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

  describe('/appointments/:id/comments (GET)', async () => {
    it('return 200 with all comments in appooint', async () => {
      const commnets = await prisma.comment.createMany({
        data: [
          {
            appointmentId: appointment.id,
            commentOwnableId: candidate1.id,
            commentOwnableType: 'Candidate',
            text: 'comment#1',
          },
          {
            appointmentId: appointment.id,
            commentOwnableId: admin.id,
            commentOwnableType: 'Admin',
            text: 'comment#2',
          },
        ],
      });

      const { statusCode, body } = await request(app.getHttpServer())
        .get(`/appointments/${appointment.id}/comments`)
        .set('Authorization', `Bearer ${candidate1Token}`);

      expect(statusCode).toBe(200);
      expect(body).toHaveLength(commnets.count);
    });
  });

  describe('/appointments/:id/comments (POST)', async () => {
    it('return 201 when comment created by candidate', async () => {
      const { statusCode } = await request(app.getHttpServer())
        .post(`/appointments/${appointment.id}/comments`)
        .set('Authorization', `Bearer ${candidate1Token}`)
        .send({
          text: 'Comment#1',
        });

      expect(statusCode).toBe(201);
    });

    it('return 201 when comment created by admin', async () => {
      const { statusCode } = await request(app.getHttpServer())
        .post(`/appointments/${appointment.id}/comments`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ text: 'Comment#1' });

      expect(statusCode).toBe(201);
    });
  });
});
