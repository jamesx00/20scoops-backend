# 20Scoops Backend Exercise

This is a simple NestJS web application where clients can get, create, update, and delete the users.

## Requirements

- Able to get single and multiple users, create, update, and delete users. All requests must be accompanied with an Authorization header with the value "20scoop" with the exception of GET requests.
- Checking the authorization header value must be done with middleware.
- Soft delete is implemented.
- Provided user's data must be validation (with yup).

User schema _\*required_

- \*identification number: _primary key, unique, auto generated?_
- \*first name: _string_
- \*last name: _string_
- personal history: _string_
- \*date created: _datetime, default: now_
- \*date updated: _datetime_
- \*deleted: _bool, default: false_
- date deleted: _datetime_

## Tools suggested

- TypeScript
- NestJS framework
- MongoDB
- Docker & Docker compose

## Additional tools

- Prisma - ORM

## Resources

- [TypeScript Basic Syntax](https://www.tutorialspoint.com/typescript/typescript_basic_syntax.htm)
- [NestJS Documentation](https://docs.nestjs.com/)
- [NestJS Course for Beginners](https://www.youtube.com/watch?v=GHTA143_b-s)
- [How to implement soft delete with prisma](https://www.prisma.io/docs/concepts/components/prisma-client/middleware/soft-delete-middleware)

## Action plans

- [x] Create a working environment with Docker and Docker Compose.
- [ ] Build User schema.
- [ ] Create a User module with CRUD controllers and services.
- [ ] Write tests for user module

## Getting started

Run below command to start the development server

```shell
docker-compose up [-d]
```

## Additional notes

### Prisma

`yarn add -D prisma` adds the prisma cli for development
`yarn add @prisma/client` adds the prisma client
