# @polaris/e2e-api

An express router wrapper, leveraging typescript-openapi generated types to provide full type safety and runtime validation for express routes.

Part of the L'Oréal Polaris Framework.

## Prerequisites

You need an [openapi-typescript](https://openapi-ts.dev/) type file to use this library.
Follow the steps in [Setup](https://openapi-ts.dev/introduction#setup) to get started.

## Installation

```bash
npm install @polaris/e2e-api
```

## Usage

### Using the wrapper

1. Create an openApi router instance, using your openapi-typescript types.

```typescript
import { createOpenApiRouter } from "@polaris/e2e-api";
import { paths } from "./openapi-typescript.d.ts";

export const apiRouter = createOpenApiRouter<paths>();
```

2. Mount your router onto your express app

```typescript
import express from "express";
import { apiRouter } from "./router";

const app = express();

app.use(express.json());

// Mount the actual express router via the `router` property
app.use(apiRouter.router);

app.listen(3000, () => {
  console.log(`Server ready at: http://localhost:3000`);
});
```

3. Implement the routes defined by your specification. The router's api loosely matches express's api, but the second argument is an object containing the handlers and zod validators.

```typescript
// this library uses the express param format and not the openapi format, so
// `/users/:userId` is valid but `/users/{userId}` is not.
apiRouter.get("/users/:userId", {
  // The router will force you to provide validators for the data your declared in the spec.
  queryValidator: z.object({ "my-query-param": z.enum(["value1", "value2"]) }),
  headerValidator: z.object({ "my-header": z.string() })
  pathValidator: z.object({ userId: z.number() }),

  // You can optionally provide a list of middlewares to run before your main handler
  // Middlewares are ran in the order provided
  middlewares: [authMiddleware(), loggingMiddleware()]

  // The handler should only handle successful requests. Use error handling middleware for error scenarios.
  handler: async (_req, res) => {
    // Validated data is accessible in the `res.locals` object.
    const { userId } = res.locals.path;

    const user = await usersRepository.getUserById(userId);

    // The router also knows the return body for your request, and it will help you make
    // sure what you return matches the spec.
    res.status(200).json({ user });
  },
});
```

### Generating an openapi specification from zod schemas

Optionally, you can choose to generate your openapi specification from existing zod-schemas, augmented with metadata
for the spec. To do this, `@polaris/e2e-api` exports the `generateOpenApiFile` function,
which will take in a `ZodOpenApiObject` and a path as inputs to generate a full openapi specification
at the location of your choosing.

Example:

```typescript
import type { ZodOpenApiObject } from '@polaris/e2e-api'

import path from 'node:path'

import { generateOpenApiFile } from '@polaris/e2e-api'

const zodOpenApiObject = {
	openapi: '3.1.1',
	info: {
		title: 'Orion Experience API',
		version: '0.0.5',
		description: 'Consume the Beauty Experience APIs (such as Create Analysis / Read Analysis / Patch Analysis / Create Prescription ... etc.)',
	},
	servers: [
		{
			url: 'http://localhost:9741',
			description: 'Local development server',
		},
	],
	paths: {
		'/users/{userId}': {
			get: {
				operationId: 'getUserById',
				summary: 'Get a token',
				requestParams: {
					path: z.object({
            userId: z.number().meta({
              id: "userId"
              description: "The id for a user"
              example: "123"
            })
          }),
				},
				responses: {
					200: {
						description: '200 OK',
						content: {
							'application/json': {
								schema: z.object({
                  userId: z.number()
                  name: z.string()
                  email: z.string()
                }),
							},
						},
					},
				},
			},
		},
	},
} satisfies ZodOpenApiObject

// The openapi.json file will be generated at ${cwd}/generated/openapi.json
generateOpenApiFile(path.join(path.resolve(), 'generated/openapi.json'), zodOpenApiObject)
```

For more information on the available fields in the `ZodOpenApiObject`, check out
[`zod-openapi`'s README](https://github.com/samchungy/zod-openapi)

### Advanced use cases

#### Declaring routes the 'normal' way

You can still access the base express router in the wrapper via the `router` property.
From there, define routes as you normally would.

```typescript
openApiRouter.router.get("/users/:userId", (req, res) => {
  const { userId } = req.params;
  const user = await usersRepository.getUserById(Number(userId));
  res.status(200).json({ user });
});
```

> [!Warning]
> This is not recommended for production code, as it bypasses the type safety and runtime validation provided by the router. Only use this if you are prototyping or debugging. If you found a limitation in the library, open an github issue or make a pull request.

#### Separating routes in multiple files

You are free to put route files wherever you'd like, but don't forget to import them when mounting your router, otherwise they won't be evaluated:

```typescript
import express from "express";
import { openApiRouter } from "./router";

import "./getUserByIdRoute";

const app = express();

app.use(express.json());

app.use(openApiRouter.router);

app.listen(3000, () => {
  console.log(`Server ready at: http://localhost:3000`);
});
```

> [!INFO]
> You could also put your routes inside of functions, and call those instead

## Contributing

### Building

1. Install dependencies in the monorepo

```bash
pnpm install
```

2. Build the library

```bash
pnpm build
```
