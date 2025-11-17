import { ConfectMutationCtx, ConfectQueryCtx } from '@db/confect'
import { Effect, Option } from 'effect'
import { SupportedLocale, type UserId } from '../schemas'
import type { ActiveUserSession, InactiveUserSession } from './session'

const TOKEN_SUB_CLAIM_DIVIDER = '|'

export const fetchCurrentSession = Effect.fn('fetchCurrentSession')(
	function* () {
		const queryCtx = yield* Effect.serviceOption(ConfectQueryCtx)
		const mutationCtx = yield* Effect.serviceOption(ConfectMutationCtx)

		const ctx = Option.isSome(queryCtx)
			? queryCtx.value
			: Option.isSome(mutationCtx)
				? mutationCtx.value
				: null

		if (!ctx) return yield* Effect.fail(new Error('Neither service available'))

		const { db, auth } = ctx
		const identityResult = yield* auth.getUserIdentity()

		if (Option.isNone(identityResult)) return null

		const [userId] = identityResult.value.subject.split(
			TOKEN_SUB_CLAIM_DIVIDER,
		) as [UserId]

		const userProfile = yield* db
			.query('userProfiles')
			.withIndex('by_userId', (q) => q.eq('userId', userId))
			.unique()

		if (Option.isNone(userProfile))
			return {
				userId,
				status: 'inactive',
				locale: SupportedLocale.literals[0],
			} satisfies InactiveUserSession

		return {
			userId,
			status: 'active',
			userProfile: userProfile.value,
			locale: SupportedLocale.literals[0],
		} satisfies ActiveUserSession
	},
)
