# 20Scoops Backend Exercise

This is a simple NestJS web application where clients can get, create, update, and delete the users.

## Requirements

- Able to get single and multiple users, create, update, and delete users. All requests must be accompanied with an Authorization header with the value "20scoop" with the exception of GET requests.
- Checking the authorization header value must be done with middleware.
- Soft delete is implemented.
- Provided user's data must be validation (with yup).

## Tools suggested

- TypeScript
- NestJS framework
- MongoDB
- Docker & Docker compose

## Resources

- [TypeScript Basic Syntax](https://www.tutorialspoint.com/typescript/typescript_basic_syntax.htm)
- [NestJS Documentation](https://docs.nestjs.com/)
- [NestJS Course for Beginners](https://www.youtube.com/watch?v=GHTA143_b-s)

## Action plans

- Create a working environment with Docker and Docker Compose.
- Build User schema.
- Create a User module with CRUD controllers and services.
- Write tests for user module

## Getting started

Run below command to start the development server

```shell
docker-compose up [-d]
```
