import { Effect, Option } from 'effect'
import { getCtxWithQueries } from '../db/get-ctx-with-queries'
import type { ActiveUserSession, InactiveUserSession } from '../schemas'
import { SupportedLocale, type UserId } from '../schemas'

const TOKEN_SUB_CLAIM_DIVIDER = '|'

export const fetchCurrentSession = Effect.fn('fetchCurrentSession')(
	function* () {
		const { db, auth } = yield* getCtxWithQueries

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
