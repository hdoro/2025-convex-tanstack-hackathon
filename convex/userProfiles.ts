import { Effect, Option } from 'effect'
import {
	GetCurrentUserProfileArgs,
	GetCurrentUserProfileReturn,
	type UserId,
} from '@/lib/schemas'
import { ConfectQueryCtx, query } from './confect'

const TOKEN_SUB_CLAIM_DIVIDER = '|'

export const getCurrentProfile = query({
	args: GetCurrentUserProfileArgs,
	returns: GetCurrentUserProfileReturn,
	handler: () =>
		Effect.gen(function* () {
			const { db, auth } = yield* ConfectQueryCtx

			const identityResult = yield* auth.getUserIdentity()
			console.log({ identity: identityResult })

			if (Option.isNone(identityResult)) return Option.none()

			const [userId] = identityResult.value.subject.split(
				TOKEN_SUB_CLAIM_DIVIDER,
			) as [UserId]

			const userProfile = yield* db
				.query('userProfiles')
				.withIndex('by_userId', (q) => q.eq('userId', userId))
				.unique()

			return userProfile
		}),
})
