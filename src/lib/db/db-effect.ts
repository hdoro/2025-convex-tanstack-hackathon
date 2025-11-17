import { ConvexError } from 'convex/values'
import { Effect, Layer, Logger, LogLevel } from 'effect'
import { fetchCurrentSession } from '../authorization/fetch-current-session'
import { CurrentSession } from '../authorization/session'
import { parseCurrentConvexEnvironment } from '../constants.db'
import type { ForbiddenError, NotFoundError } from './db-errors'

const MINIMUM_LOG_LEVEL = (() => {
	const environment = parseCurrentConvexEnvironment()

	if (environment === 'test') return LogLevel.None

	if (process.env.LOG_LEVEL === 'DEBUG') return LogLevel.Debug

	return LogLevel.Info
})()

export const dbEffect = <A, E, R>(
	effect: Effect.Effect<
		A,
		E | ForbiddenError | NotFoundError,
		R | CurrentSession
	>,
) =>
	effect.pipe(
		Effect.provide(
			Layer.effect(
				CurrentSession,
				fetchCurrentSession().pipe(
					Logger.withMinimumLogLevel(MINIMUM_LOG_LEVEL),
				),
			),
		),
		Effect.catchTag('ForbiddenError', () =>
			Effect.die(new ConvexError({ kind: 'authorization' })),
		),
		Effect.catchTag('NotFoundError', () =>
			Effect.die(new ConvexError({ kind: 'not-found' })),
		),
		// Log unknown error for visibility
		Effect.tapError((error) => Effect.logError(error)),
		Logger.withMinimumLogLevel(MINIMUM_LOG_LEVEL),
	)
