import type z from 'zod'

import type { ExtractRequestBodyType, ExtractRequestParametersType, HttpParam, RequestHandler } from './types'

/**
 * Type alias for a zod validator that validates a param object of a specific kind
 * for a given operation
 */
export type ParamValidator<PathOperation, Param extends HttpParam> = z.ZodType<
	ExtractRequestParametersType<PathOperation, Param>
>

/**
 * Type alias for a zod validator that validates the body object for a given operation
 */
export type BodyValidator<PathOperation> = z.ZodType<
	ExtractRequestBodyType<PathOperation>
>

// TODO: support async parsing ?
export function validateRequestParamsMiddleware<PathOperation>(
	pathValidator?: ParamValidator<PathOperation, 'path'>,
	queryValidator?: ParamValidator<PathOperation, 'query'>,
	headerValidator?: ParamValidator<PathOperation, 'header'>,
	bodyValidator?: BodyValidator<PathOperation>,
): RequestHandler<PathOperation> {
	return (req, res, next) => {
		try {
			if (pathValidator) {
				res.locals.path = pathValidator.parse(req.params)
			}
			if (queryValidator) {
				res.locals.query = queryValidator.parse(req.query)
			}
			if (headerValidator) {
				res.locals.header = headerValidator.parse(req.headers)
			}
			if (bodyValidator) {
				res.locals.body = bodyValidator.parse(req.body)
			}
			next()
		} catch (e) {
			next(e)
		}
	}
}
