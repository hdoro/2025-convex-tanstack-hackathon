import { ConfectMutationCtx, ConfectQueryCtx } from '@db/confect'
import { Effect, Option } from 'effect'
import { InvalidCtxError } from './db-errors'

export const getCtxWithQueries = Effect.gen(function* () {
	const queryCtx = yield* Effect.serviceOption(ConfectQueryCtx)
	const mutationCtx = yield* Effect.serviceOption(ConfectMutationCtx)

	const ctx = Option.isSome(queryCtx)
		? queryCtx.value
		: Option.isSome(mutationCtx)
			? mutationCtx.value
			: null

	if (!ctx) return yield* Effect.fail(new InvalidCtxError())

	return ctx
})
