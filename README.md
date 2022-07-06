# 20Scoops Backend Exercise

This is a simple NestJS web application where clients can get, create, update, and delete the users.

## Requirements

- [x] Able to get single and multiple users, create, update, and delete users. All requests must be accompanied with an Authorization header with the value "20scoop" with the exception of GET requests.
- [x] Checking the authorization header value must be done with middleware.
- [x] Soft delete is implemented.
- [x] Provided user's data must be validated (with yup).

## Tools suggested

- [x] TypeScript
- [x] NestJS framework
- [x] MongoDB
- [x] Docker & Docker compose

## Action plans

- Create a working environment with Docker and Docker Compose.
- Build User schema.
- Create a User module with CRUD controllers and services.
- Implement authorization middleware.
- Write e2e tests for user module.

## Getting started

Run below command to start the development server

```shell
docker-compose up [-d]
```

To stop the development server, run

```shell
docker-compose down [-v] # Add -v to remove volumes attached to containers
```

To run e2e tests, run

```shell
yarn test:e2e
```

## Resources

- [TypeScript Basic Syntax](https://www.tutorialspoint.com/typescript/typescript_basic_syntax.htm)
- [NestJS Documentation](https://docs.nestjs.com/)
- [NestJS Course for Beginners](https://www.youtube.com/watch?v=GHTA143_b-s)
