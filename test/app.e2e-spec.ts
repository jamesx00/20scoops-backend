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
      .expect(200)
      .expect((response) => response.body == []);
  });

  it('/GET users with existing users', () => {
    createUser(userModel);

    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect(
        (response) => response.body.length > 0,
      );
  });

  it('/GET users with deleted users', () => {
    createUser(userModel, { deleted: true });

    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect((response) => response.body == []);
  });

  it('/GET users:identificationNumber', () => {
    createUser(userModel);

    return request(app.getHttpServer())
      .get('/users/0001')
      .expect(200);
  });

  it('/GET users:identificationNumber with non-existing user', () => {
    return request(app.getHttpServer())
      .get('/users/00XX')
      .expect(404);
  });

  it('/GET users:identificationNumber with deleted user', () => {
    const identificationNumber = '0001';
    createUser(userModel, {
      identificationNumber: identificationNumber,
      deleted: true,
    });

    return request(app.getHttpServer())
      .get(`/users/${identificationNumber}`)
      .expect(404);
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

  it('/POST users with valid Authorization header and duplicated identification number', () => {
    const identificationNumber = '0001';
    createUser(userModel, {
      identificationNumber: identificationNumber,
    });

    return request(app.getHttpServer())
      .post('/users')
      .send({
        identificationNumber:
          identificationNumber,
        firstName: 'name',
        lastName: '',
      })
      .set(
        'Authorization',
        VALID_AUTHORIZATION_VALUE,
      )
      .expect(400);
  });

  it('/POST users with valid Authorization header and strip attribute delete', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        identificationNumber: '0001',
        firstName: 'name',
        lastName: 'lastname',
        deleted: true,
      })
      .set(
        'Authorization',
        VALID_AUTHORIZATION_VALUE,
      )
      .expect(
        (response) =>
          response.body.deleted == false,
      );
  });

  it('/POST users/yup with valid Authorization header and without identification number', () => {
    return request(app.getHttpServer())
      .post('/users/yup')
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

  it('/POST users/yup with valid Authorization header and without first name', () => {
    return request(app.getHttpServer())
      .post('/users/yup')
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

  it('/POST users/yup with valid Authorization header and without last name', () => {
    return request(app.getHttpServer())
      .post('/users/yup')
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

  it('/POST users/yup with valid Authorization header and empty identification number', () => {
    return request(app.getHttpServer())
      .post('/users/yup')
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

  it('/POST users/yup with valid Authorization header and empty first name', () => {
    return request(app.getHttpServer())
      .post('/users/yup')
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

  it('/POST users/yup with valid Authorization header and empty last name', () => {
    return request(app.getHttpServer())
      .post('/users/yup')
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

  it('/POST users/yup with valid Authorization header and strip attribute delete', () => {
    return request(app.getHttpServer())
      .post('/users/yup')
      .send({
        identificationNumber: '0001',
        firstName: 'name',
        lastName: 'lastname',
        deleted: true,
      })
      .set(
        'Authorization',
        VALID_AUTHORIZATION_VALUE,
      )
      .expect(
        (response) =>
          response.body.deleted == false,
      );
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

  it('/PATCH users:identificationNumber with valid Authorization header and non-existing user', () => {
    return request(app.getHttpServer())
      .patch('/users/0001')
      .set(
        'Authorization',
        VALID_AUTHORIZATION_VALUE,
      )
      .expect(404);
  });

  it('/PATCH users:identificationNumber with valid Authorization header and deleted user', () => {
    createUser(userModel, { deleted: true });

    return request(app.getHttpServer())
      .patch('/users/0001')
      .set(
        'Authorization',
        VALID_AUTHORIZATION_VALUE,
      )
      .expect(404);
  });

  it('/PATCH users:identificationNumber with valid Authorization header and valid value', () => {
    createUser(userModel);

    return request(app.getHttpServer())
      .patch('/users/0001')
      .send({
        firstName: 'New First Name',
      })
      .set(
        'Authorization',
        VALID_AUTHORIZATION_VALUE,
      )
      .expect(
        (response) =>
          response.body.firstNamae ==
          'New First Name',
      )
      .expect(200);
  });

  it('/PATCH users:identificationNumber with valid Authorization header and invalid value', () => {
    createUser(userModel);

    return request(app.getHttpServer())
      .patch('/users/0001')
      .send({
        firstName: '',
      })
      .set(
        'Authorization',
        VALID_AUTHORIZATION_VALUE,
      )
      .expect(400);
  });

  it('/PATCH users:identificationNumber with valid Authorization header and identification number as data', () => {
    createUser(userModel);

    return request(app.getHttpServer())
      .patch('/users/0001')
      .send({
        identificationNumber: '0002',
      })
      .set(
        'Authorization',
        VALID_AUTHORIZATION_VALUE,
      )
      .expect(
        (response) =>
          response.body.identificationNumber ==
          '0001',
      );
  });

  it('/PATCH users:identificationNumber with valid Authorization header and deleted as data', () => {
    createUser(userModel);

    return request(app.getHttpServer())
      .patch('/users/0001')
      .send({
        deleted: true,
      })
      .set(
        'Authorization',
        VALID_AUTHORIZATION_VALUE,
      )
      .expect(
        (response) =>
          response.body.deleted == false,
      );
  });

  it('/PATCH users:identificationNumber check dateUpdated change', () => {
    const newUser = createUser(userModel);
    const originalUpdatedTime =
      newUser.dateUpdated;

    return request(app.getHttpServer())
      .patch('/users/0001')
      .send({
        firstName: 'FirstName',
      })
      .set(
        'Authorization',
        VALID_AUTHORIZATION_VALUE,
      )
      .expect(
        (response) =>
          response.body.dateUpdated !=
          originalUpdatedTime,
      );
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

  it('/DELETE users:identificationNumber with valid Authorization header and valid user', () => {
    createUser(userModel);

    return request(app.getHttpServer())
      .delete('/users/0001')
      .set(
        'Authorization',
        VALID_AUTHORIZATION_VALUE,
      )
      .expect(200);
  });

  it('/DELETE users:identificationNumber with valid Authorization header and non-existing user', () => {
    return request(app.getHttpServer())
      .delete('/users/0001')
      .set(
        'Authorization',
        VALID_AUTHORIZATION_VALUE,
      )
      .expect(404);
  });

  it('/DELETE users:identificationNumber with valid Authorization header and deleted user', () => {
    createUser(userModel, {
      deleted: true,
    });

    return request(app.getHttpServer())
      .delete('/users/0001')
      .set(
        'Authorization',
        VALID_AUTHORIZATION_VALUE,
      )
      .expect(404);
  });

  it('/POST users/restore/:identificationNumber without Authorization header', () => {
    return request(app.getHttpServer())
      .post('/users/restore/0001')
      .expect(403);
  });

  it('/POST users/restore/:identificationNumber with invalid Authorization header', () => {
    return request(app.getHttpServer())
      .post('/users/restore/0001')
      .set(
        'Authorization',
        INVALID_AUTHORIZATION_VALUE,
      )
      .expect(403);
  });

  it('/POST users/restore/:identificationNumber with valid Authorization header and deleted user', () => {
    createUser(userModel, {
      deleted: true,
    });

    return request(app.getHttpServer())
      .post('/users/restore/0001')
      .set(
        'Authorization',
        VALID_AUTHORIZATION_VALUE,
      )
      .expect(200);
  });

  it('/POST users/restore/:identificationNumber with valid Authorization header and non-existing user', () => {
    return request(app.getHttpServer())
      .post('/users/restore/0001')
      .set(
        'Authorization',
        VALID_AUTHORIZATION_VALUE,
      )
      .expect(404);
  });

  it('/POST users/restore/:identificationNumber with valid Authorization header and live user', () => {
    createUser(userModel);

    return request(app.getHttpServer())
      .post('/users/restore/0001')
      .set(
        'Authorization',
        VALID_AUTHORIZATION_VALUE,
      )
      .expect(404);
  });

  afterEach(async () => {
    await app.close();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});

// Not sure what type of UserModel and the returned user is
function createUser(
  userModel,
  data?: object,
): any {
  let userData = {
    identificationNumber: '0001',
    firstName: 'John',
    lastName: 'Doe',
  };

  if (data == undefined) {
    data = {};
  }

  userData = { ...userData, ...data };

  const user = userModel({ ...userData });
  return user.save();
}
