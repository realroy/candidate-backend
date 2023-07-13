import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppointmentsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/appointments (GET)', () => {
    it('return 200', () => {
      return request(app.getHttpServer())
        .get('/appointments?limit=10')
        .expect(200);
    });
  });

  describe('/appointments/:id (GET)', () => {
    it('return 404 when receive non exist id', () => {
      return request(app.getHttpServer())
        .get(`/appointments/${-1}`)
        .expect(404);
    });
  });
});
