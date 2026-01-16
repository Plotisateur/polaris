import type { ZodOpenApiObject } from 'zod-openapi'

import type {
	ExtractResponseType,
	HttpMethod,
	MethodHandler,
	NormalizeOpenApiTsPaths,
	OpenApiRouter,
	Paths,
	RequestHandler,
	ResponseLocals,
} from './types'

import fs from 'node:fs'

import express from 'express'
import YAML from 'yaml'
import { createDocument } from 'zod-openapi'

import { validateRequestParamsMiddleware } from './validation'

/**
 * The wrapper function, which will accept openApi type safe arguments and mount
 * the necessary data onto an actual express router.
 * If needed, the original and unsafe router can be accessed with the public router
 * property.
 *
 * @returns {OpenApiRouter} An object containing the express router and type-safe method handlers
 */
function createOpenApiRouter<
	OpenApiTsPaths extends object,
>(): OpenApiRouter<OpenApiTsPaths> {
	// Instantiate the express router on which we will mount the routes.
	const router = express.Router()

	// Given an HTTP method and a path, create a handler for this method.
	function createMethodHandler<Method extends HttpMethod>(
		method: Method,
	): MethodHandler<NormalizeOpenApiTsPaths<OpenApiTsPaths>, Method> {
		return (path, args) => {
			const { handler, middlewares } = args

			// The validators may or may not be present in the args object, depending on
			// if the corresponding field is defined in the spec.
			// This allows us to not allow providing validators when there is nothing
			// to validate, and to require them when they are needed.
			const pathValidator =
        'pathValidator' in args ? args.pathValidator : undefined
			const queryValidator =
        'queryValidator' in args ? args.queryValidator : undefined
			const headerValidator =
        'headerValidator' in args ? args.headerValidator : undefined
			const bodyValidator =
        'bodyValidator' in args ? args.bodyValidator : undefined

			router[method](
				path,
				validateRequestParamsMiddleware(
					pathValidator,
					queryValidator,
					headerValidator,
					bodyValidator,
				),
				...(middlewares ?? []),
				handler,
			)
		}
	}

	return {
		router,
		get: createMethodHandler('get'),
		post: createMethodHandler('post'),
		patch: createMethodHandler('patch'),
		put: createMethodHandler('put'),
		delete: createMethodHandler('delete'),
	}
}

/**
 * Given a path, a zod-openapi object and an output format, generate the openapi specification
 * at the given location
 *
 * @param outputPath The absolute path where the output file will be generated
 * @param zodOpenApiObject The zod-openapi object that will be passed as an argument to the zod-openapi createDocument function
 * @param format The format in which to generate the file, either JSON or YAML
 */
function generateOpenApiFile(
	outputPath: string,
	zodOpenApiObject: ZodOpenApiObject,
	format: 'JSON' | 'YAML' = 'JSON',
) {
	const openApiObject = createDocument(zodOpenApiObject)

	const openApiObjectString = format === 'JSON'
		? JSON.stringify(openApiObject)
		: YAML.stringify(openApiObject)

	fs.writeFileSync(outputPath, openApiObjectString)
}

export {
	createOpenApiRouter,
	generateOpenApiFile,
}

export type {
	ExtractResponseType,
	MethodHandler,
	OpenApiRouter,
	Paths,
	RequestHandler,
	ResponseLocals,
	ZodOpenApiObject,
}
