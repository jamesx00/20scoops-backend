import {
  Test,
  TestingModule,
} from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import 'dotenv/config';
import mongoose from 'mongoose';
import { UserSchema } from '../src/user/schemas/user.schema';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let userModel;

  const VALID_AUTHORIZATION_VALUE =
    process.env.TWENTY_SCOOPS_AUTH_SECRET;

  const INVALID_AUTHORIZATION_VALUE =
    'INVALID_AUTH';

  beforeAll(async () => {
    await mongoose.connect(
      process.env.DATABASE_URL,
    );
    userModel = mongoose.model(
      'User',
      UserSchema,
    );
  });

  beforeEach(async () => {
    const users = await userModel.remove({});

    const moduleFixture: TestingModule =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true }),
    ),
      await app.init();
  });

  it('/GET users', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200);
  });

  it('/GET users:identificationNumber without Authorization header', () => {
    const user = userModel({
      identificationNumber: '0001',
      firstName: 'Name',
      lastName: 'LastName',
    });
    user.save();

    return request(app.getHttpServer())
      .get('/users/0001')
      .expect(200);
  });

  it('/POST users without Authorization header', () => {
    return request(app.getHttpServer())
      .post('/users')
      .expect(403);
  });

  it('/POST users with invalid Authorization header', () => {
    return request(app.getHttpServer())
      .post('/users')
      .set(
        'Authorization',
        INVALID_AUTHORIZATION_VALUE,
      )
      .expect(403);
  });

  it('/POST users with valid Authorization header and valid body', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        identificationNumber: '0001',
        firstName: 'name',
        lastName: 'name',
      })
      .set(
        'Authorization',
        VALID_AUTHORIZATION_VALUE,
      )
      .expect(201);
  });

  it('/POST users with valid Authorization header and without identification number', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        firstName: 'name',
        lastName: 'name',
      })
      .set(
        'Authorization',
        VALID_AUTHORIZATION_VALUE,
      )
      .expect(400);
  });

  it('/POST users with valid Authorization header and without first name', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        identificationNumber: '0001',
        lastName: 'name',
      })
      .set(
        'Authorization',
        VALID_AUTHORIZATION_VALUE,
      )
      .expect(400);
  });

  it('/POST users with valid Authorization header and without last name', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        identificationNumber: '0001',
        firstName: 'name',
      })
      .set(
        'Authorization',
        VALID_AUTHORIZATION_VALUE,
      )
      .expect(400);
  });

  it('/POST users with valid Authorization header and empty identification number', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        identificationNumber: '',
        firstName: 'name',
        lastName: 'name',
      })
      .set(
        'Authorization',
        VALID_AUTHORIZATION_VALUE,
      )
      .expect(400);
  });

  it('/POST users with valid Authorization header and empty first name', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        identificationNumber: '0001',
        firstName: '',
        lastName: 'name',
      })
      .set(
        'Authorization',
        VALID_AUTHORIZATION_VALUE,
      )
      .expect(400);
  });

  it('/POST users with valid Authorization header and empty last name', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        identificationNumber: '0001',
        firstName: 'name',
        lastName: '',
      })
      .set(
        'Authorization',
        VALID_AUTHORIZATION_VALUE,
      )
      .expect(400);
  });

  it('/PATCH users:identificationNumber without Authorization header', () => {
    return request(app.getHttpServer())
      .patch('/users/0001')
      .expect(403);
  });

  it('/PATCH users:identificationNumber with invalid Authorization header', () => {
    return request(app.getHttpServer())
      .patch('/users/0001')
      .set(
        'Authorization',
        INVALID_AUTHORIZATION_VALUE,
      )
      .expect(403);
  });

  it('/DELETE users:identificationNumber without Authorization header', () => {
    return request(app.getHttpServer())
      .delete('/users/0001')
      .expect(403);
  });

  it('/DELETE users:identificationNumber with invalid Authorization header', () => {
    return request(app.getHttpServer())
      .delete('/users/0001')
      .set(
        'Authorization',
        INVALID_AUTHORIZATION_VALUE,
      )
      .expect(403);
  });

  afterEach(async () => {
    await app.close();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});

function makeId(length: number): string {
  let result = '';

  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  const charactersLength = characters.length;

  for (var i = 0; i < length; i++) {
    result += characters.charAt(
      Math.floor(
        Math.random() * charactersLength,
      ),
    );
  }

  return result;
}
