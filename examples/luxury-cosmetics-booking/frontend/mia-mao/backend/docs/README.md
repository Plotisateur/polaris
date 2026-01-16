[![Express Logo](https://i.cloudup.com/zfY6lL7eFa-3000x3000.png)](http://expressjs.com/)

  Fast, unopinionated, minimalist web framework for [node](http://nodejs.org).

  [![NPM Version][npm-image]][npm-url]


## Description

Node.js boilerplate using typescript, express, typeorm, postgresql, jest and more !

## Installation

```bash
# Install dependencies
$ yarn

# Create local env file => This command must only be ran in local
$ cp .env.local.rc .env.rc

# Create prod env file => This command must only be ran in prod
$ cp .env.prod.rc .env.rc
```

## Running the app

/!\ Don't forget to change the TYPEORM_URL value to match your local database (.env.local.rc)

```bash
# Start database and execute migartion
$ docker-compose up -d
$ yarn migration:run
$ yarn start:dev # Run this command only in local
$ yarn start # Run this command only in prod
$ docker-compose down (/!\ Run this command only when you want to delete the database)

```

## Swagger
To run the sswagger documentation locally, you need to run these 2 commands:
```
$ yarn swagger-build
$ yarn start:dev
```

## Test

```bash
# unit tests
$ yarn test

# test coverage
$ yarn test:coverage
```

## Migrations

```bash
# Generate a migration
$ yarn migration:generate -n YourMigrationName

# Run all pending migrations
$ yarn migration:run
```


[ci-image]: https://img.shields.io/github/workflow/status/expressjs/express/ci/master.svg?label=linux
[ci-url]: https://github.com/expressjs/express/actions?query=workflow%3Aci
[npm-image]: https://img.shields.io/npm/v/express.svg
[npm-url]: https://npmjs.org/package/express

