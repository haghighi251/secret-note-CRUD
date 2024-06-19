<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A software project designed to implement a Secret Note API</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

A software project designed to implement a Secret Note API, featuring a common CRUD pattern that allows users to securely create, read, update, and delete encrypted notes. This API is built using NestJS and supports encrypted data storage, ensuring that each note remains confidential and is only accessible in its decrypted form through secure API endpoints.

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

You also can run the application by running the Docker container. To do this you just need to run the command below:

```bash
# --build flag just for the first time!
$ docker-compose up --build
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Project Structure

### Root directory
```bash
contexts # To keep different contexts like note
shared # To keep different parts which could be used in all parts of the application
```

### Root shared directory
```bash
domain # To keep shared domain parts like exceptions
infrastructure # To keep shared infrastructure parts like database, interceptors, pipes, etc 
```

### contexts directory
```bash
contexts # To keep different contexts like note
shared # To keep different parts which are shared in the contexts
```

Each context has its own application, infrastructure, and domain directory to keep different parts of that specific context like mappers, controllers, usecases, etc.


## Git structure

There are two different branches. The first branch is production, the second branch is development. I made feature branch locally which will be added to the development branch with all commits(linier) and from the development branch will be merged into production branch for each separated functionality which contains all commits in single commit(squash). In this way we will have a more cleaner production branch so if something gets wrong in the production we are simply able to revert to the last version with one single revert command.

I didn't add a demo branch because I think these two branches are enough for a simple code challenge.

## Documentation for Secret Note Management System

### Overview
This project implements a secure API for managing secret notes. The system ensures that notes are encrypted before being stored in a MongoDB database and decrypted when retrieved(depends to the entry request). The API follows a clean architecture, separating concerns into controllers, services, and use cases.

### Components

#### 1. Controller

Purpose: Handles incoming HTTP requests for creating secret notes.

Key Features:
- Uses `ZodValidationPipe` for validating incoming data against the `CreateSecretNoteDto`.
- Maps exceptions to HTTP responses, providing meaningful error information to the client.

#### 2. Use Case (CreateSecretNoteUseCase)

Purpose: Implements the application logic for creating a secret note.

Responsibilities:
- Coordinates with `SecretNoteService` to handle the creation of a note.
- Manages application-level exceptions and rethrows them with contextual information.

#### 3.Service (SecretNoteService)

Purpose: Manages interactions with the MongoDB database and encrypts notes before saving.

Key Operations:
- Validates and parses DTOs using Zod.
- Encrypts the note data.
- Maps DTOs to database models using `SecretNoteMapper`.
- Saves encrypted notes to MongoDB.

## Configurations

### Zod Validation

Purpose: Validates incoming data structures to ensure they meet the API's expectations before processing.

Implementation: 
- Integrated through a custom `ZodValidationPipe` which is applied at the controller level to check and parse incoming `CreateSecretNoteDto` objects.

### NestJS Pipes

Purpose: Used for validating and transforming incoming request data before it reaches the controller handler.

Setup: Applied at the route handler level using `@UsePipes()` decorator.

## Testing Strategy Documentation

This project adopts a robust testing strategy that includes both unit tests and end-to-end (E2E) tests, ensuring that both individual components function as expected and that the system works as a whole from an end user’s perspective.

### Unit Tests

- Purpose: Unit tests are designed to test individual pieces of code in isolation, primarily focusing on small functions or modules. The goal is to ensure that each part performs as expected independently of others.

- Location: Unit tests are located next to their respective source files in the src directory, following the convention of naming test files with a .spec.ts suffix. This proximity helps in maintaining and navigating related source and test files.

Example Structure:

```bash
src/
├── contexts/
    ├── secret-notes/
        ├── domain/
            ├── services/
                ├── secret-note.service.ts
                ├── secret-note.service.spec.ts
```
Key Technologies: 

These tests leverage Jest as the testing framework, utilizing features such as mocks and spies to isolate dependencies.

### End-to-End (E2E) Tests

- Purpose: E2E tests verify the system’s behavior from start to finish. They are intended to simulate user behavior and interactions to ensure all integrated parts of the application work together correctly.

- Location: E2E tests are maintained in the test directory at the root of the project. This separation from unit tests helps in distinguishing between testing scopes and managing dependencies specific to E2E testing.

#### Example Structure:

```bash
test/
├── contexts/
    ├── secret-notes/
        ├── application
            ├── secret-note.controller.spec.ts
```

Key Technologies: 

E2E tests use Jest alongside NestJS Testing Utilities and often interact with the full application, databases, and other services. They may include setup scripts for environment simulation, such as database seeding or mock external services.

#### Running Tests

- Unit Tests: Run with `pnpm run test:unit`, which executes all .spec.ts files across the src directory.

- E2E Tests: Executed separately using npm run `pnpm run test:e2e` to avoid interference with unit tests and to handle potentially different setup requirements, such as environment configurations or database handling.

### Best Practices
- Continuous Integration: Both unit and E2E tests are integrated into the CI/CD pipeline to ensure tests are automatically run in different environments, preventing regressions.
- Code Coverage: Strive for high code coverage in unit tests while ensuring E2E tests cover critical user journeys and edge cases.
- Mocking and Isolation: Critical for unit testing to ensure no external changes affect the outcomes. E2E tests, however, should interact with real implementations as much as possible.

## HTTP methods to interact with the server:

### End point

- http://localhost:3000/secret-notes

### POST requests
- To add a new note.

Here is an example of how to interact with the server:
```bash
{
  "id": "102320",
  "title": "My Secret Note",
  "note": "This is a secret note.",
  "userId": "user123"
}
```
As the response you have to get a 201 HTTP response status code with the body of the result like below:
```bash
{
    "note": "b7b3994e035104cc71788b75e865b37507779b8f94be221bd2219a0c05248a34",
    "id": "102320",
    "title": "My Secret Note",
    "tags": [],
    "userId": "user123",
    "isEncrypted": true,
    "version": 1,
    "_id": "6672e58f4164202c8c7dee1e",
    "createdAt": "2024-06-19T14:05:03.426Z",
    "updatedAt": "2024-06-19T14:05:03.426Z",
    "__v": 0
}
```

### Get request to get all notes

- Just a request to the server. 

Here is an example of the expected response: 

```bash
[
    {
        "id": "12345",
        "title": "My Secret Note",
        "userId": "user123",
        "createdAt": "2024-06-19T14:20:11.775Z"
    },
    {
        "id": "123466",
        "title": "Another Note",
        "userId": "user123",
        "createdAt": "2024-06-19T14:21:15.005Z"
    },
    ...
]
```

### Get request to get one single decrypted note

- Send a request to `/secret-notes/{id}` like `http://localhost:3000/secret-notes/123466`

Here is an example of the expected response: 

```bash
    {
    "note": "This is a secret note.",
    "id": "123466",
    "title": "My Secret Note",
    "tags": [],
    "userId": "user123",
    "isEncrypted": true,
    "version": 1,
    "createdAt": "2024-06-17T22:29:15.005Z",
    "updatedAt": "2024-06-17T22:29:15.005Z"
}
```

### Get request to get one single encrypted note

- Send a request to `/secret-notes/{id}?encrypted=true` like `http://localhost:3000/secret-notes/123466?encrypted=true`

Here is an example of the expected response: 

```bash
    {
    "note": "b7b3994e035104cc71788b75e865b37507779b8f94be221bd2219a0c05248a34",
    "id": "123466",
    "title": "My Secret Note",
    "tags": [],
    "userId": "user123",
    "isEncrypted": true,
    "version": 1,
    "createdAt": "2024-06-17T22:29:15.005Z",
    "updatedAt": "2024-06-17T22:29:15.005Z"
}
```








## License

Nest is [MIT licensed](LICENSE).
