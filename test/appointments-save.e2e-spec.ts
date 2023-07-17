import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { AppModule } from './../src/app.module';
import prisma from './../src/tests/helpers/prisma';

import type { Admin } from '@prisma/client';

describe('AppointmentsSaveController (e2e)', () => {
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
      },
    });
  });

  it('/appointments/:id/save (POST)', async () => {
    const appointment = await prisma.appointment.create({
      data: {
        name: 'Appoitment#1',
        creatorId: admin.id,
      },
    });

    const { statusCode } = await request(app.getHttpServer()).post(
      `/appointments/${appointment.id}/save`,
    );

    expect(statusCode).toBe(201);
  });
});
