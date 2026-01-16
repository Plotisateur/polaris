import type express from 'express'
import type z from 'zod'

/**
 * All of the HTTP methods supported by the wrapper
 */
export type HttpMethod = 'get' | 'post' | 'patch' | 'delete' | 'put'

/**
 * All of the parameter types, as defined in the OpenAPI specification
 */
export type HttpParam = 'path' | 'query' | 'header' | 'cookie'

/**
 * Type alias to shorten referencing the openapi-typescript paths after normalization to the express param format
 */
export type Paths = NormalizeOpenApiTsPaths<object>

/**
 * Recursively update all paths in the openapi-typescript paths to use the express param format
 */
export type NormalizeOpenApiTsPaths<Paths extends object> = {
	[Path in keyof Paths &
	string as ConvertOpenApiParamsToExpressParams<Path>]: Paths[Path];
}

/**
 * Given a string API path, convert all path parameters inside from the openapi param format
 * (e.g. `/users/{userId}`) to the express param format (e.g. `/users/:userId`)
 */
export type ConvertOpenApiParamsToExpressParams<Path extends string> = [
	Path,
] extends [`${infer Start}{${infer Param}}${infer End}`]
	? `${Start}:${Param}${ConvertOpenApiParamsToExpressParams<End>}`
	: Path

/**
 * Given the full list of possible paths and an HTTP method, extract all the paths
 * implementing that method. (example: finds all the paths that define an operation for the GET method)
 */
export type ExtractPathsWithMethod<
	Paths extends object,
	Method extends HttpMethod,
> = {
	[Path in keyof Paths]: Method extends keyof Paths[Path]
		? [Paths[Path][Method]] extends [never]
				? never
				: Path
		: never;
}[keyof Paths & string]

/**
 * Given the list of paths, a specific path and a method, extract the types for this
 * specific operation
 */
export type PathOperation<
	Paths extends object,
	Path extends keyof Paths,
	Method extends HttpMethod,
> = Method extends keyof Paths[Path] ? Paths[Path][Method] : never

/**
 * Given a PathOperation, extract the response type from any content type
 */
export type ExtractResponseType<PathOperation> = PathOperation extends {
	responses: {
		[key: string]: { content: infer Content }
	}
}
	? Content extends Record<string, infer ResponseType>
		? ResponseType
		: never
	: never

/**
 * Given a PathOperation and a specific param kind (one of cookie, header, query or path),
 * extract the type for this param kind and this operation
 */
export type ExtractRequestParametersType<
	PathOperation,
	Param extends HttpParam,
> = PathOperation extends { parameters: infer Parameters }
	? Param extends keyof Parameters
		? [Parameters[Param]] extends [undefined]
				? never
				: Parameters[Param]
		: never
	: never

/**
 * Given a PathOperation, extract the JSON body type
 */
export type ExtractRequestBodyType<PathOperation> = PathOperation extends { requestBody?: infer RequestBody }
	? RequestBody extends { content: { 'application/json': infer BodyType } }
		? BodyType
		: never
	: never

/**
 * The args object given as a second argument for a methodHandler on the wrapper
 * The handler is an express handler augmented with extracted types from the spec
 * and it's the only argument that's always required
 * You can optionally pass in a list of middlewares to execute before the main handler
 * Param and body validators will be required based on if the associated types
 * were found in the spec
 */
export type OpenApiRouterArgs<PathOperation> = {
	handler: RequestHandler<PathOperation>
	middlewares?: Array<RequestHandler<PathOperation> | express.RequestHandler>
} & ([ExtractRequestParametersType<PathOperation, 'path'>] extends [never]
	? object
	: {
			pathValidator: z.ZodType<
				ExtractRequestParametersType<PathOperation, 'path'>
			>
		}) &
		([ExtractRequestParametersType<PathOperation, 'query'>] extends [never]
			? object
			: {
					queryValidator: z.ZodType<
						ExtractRequestParametersType<PathOperation, 'query'>
					>
				}) &
				([ExtractRequestParametersType<PathOperation, 'header'>] extends [never]
					? object
					: {
							headerValidator: z.ZodType<
								ExtractRequestParametersType<PathOperation, 'header'>
							>
						}) &
						([ExtractRequestBodyType<PathOperation>] extends [never]
							? object
							: {
									bodyValidator: z.ZodType<ExtractRequestBodyType<PathOperation>>
								})

/**
 * An express handler augmented with types from the spec. The response type and
 * the response locals will be properly typed
 */
export type RequestHandler<PathOperation> = (
	req: express.Request,
	res: express.Response<
		ExtractResponseType<PathOperation>,
		ResponseLocals<PathOperation>
	>,
	next: express.NextFunction,
) => void

/**
 * Type augmentation for the express response locals object. This is where the validated
 * params and body will be stored
 */
export type ResponseLocals<PathOperation> = {
	path: ExtractRequestParametersType<PathOperation, 'path'>
	query: ExtractRequestParametersType<PathOperation, 'query'>
	header: ExtractRequestParametersType<PathOperation, 'header'>
	body: ExtractRequestBodyType<PathOperation>
}

/**
 * A type-safe handler for a specific HTTP method and path.
 */
export type MethodHandler<
	Paths extends NormalizeOpenApiTsPaths<object>,
	Method extends HttpMethod,
> = <Path extends ExtractPathsWithMethod<Paths, Method>>(
	path: ConvertOpenApiParamsToExpressParams<Path>,
	args: OpenApiRouterArgs<PathOperation<Paths, Path, Method>>,
) => void

/**
 * The main router object, which provides type-safe handlers for each HTTP method.
 */
export type OpenApiRouter<Paths extends object> = {
	router: express.Router
	get: MethodHandler<NormalizeOpenApiTsPaths<Paths>, 'get'>
	post: MethodHandler<NormalizeOpenApiTsPaths<Paths>, 'post'>
	patch: MethodHandler<NormalizeOpenApiTsPaths<Paths>, 'patch'>
	put: MethodHandler<NormalizeOpenApiTsPaths<Paths>, 'put'>
	delete: MethodHandler<NormalizeOpenApiTsPaths<Paths>, 'delete'>
}
