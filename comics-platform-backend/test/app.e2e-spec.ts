import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import type { Server } from 'http';
import { AppModule } from '../src/app.module';

describe('Comics (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    const loginRes: { body: { accessToken: string } } = await request(
      app.getHttpServer() as unknown as Server,
    )
      .post('/auth/login')
      .send({
        username: 'test',
        password: 'Test100#',
      });

    jwtToken = loginRes.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it("should show concrete user's comics", async () => {
    return request(app.getHttpServer() as unknown as Server)
      .get('/comics/own-comics')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);
  });
});
