import type { Id } from '@db/_generated/dataModel'
import { Effect } from 'effect'
import type {
	ActiveUserSession,
	InactiveUserSession,
	Room,
	UserSession,
} from '../schemas'
import { allow, deny, orFail, policy } from './policy.internal'

export * from './policy.internal'

const require = <T extends UserSession>(
	guard: (session: UserSession) => session is T,
) => policy((session) => (guard(session) ? allow(session) : deny()))

export function isSignedOut(session: UserSession): session is null {
	return session === null
}

export function isInactiveUser(
	session: UserSession,
): session is InactiveUserSession {
	return !!session && session.status === 'inactive'
}

export function isActiveUser(
	session: UserSession,
): session is ActiveUserSession {
	return !!session && session.status === 'active'
}

export const requireSignedOut = require(isSignedOut)

export const requireInactiveUser = require(isInactiveUser)

export const requireActiveUser = require(isActiveUser)

export const requireRoomOwner = (room: Room) =>
	policy((session) => {
		if (room.createdBy !== session?.userId) return deny("Isn't the room owner")

		return allow(room)
	})

export const requireEditableRoom = (room: Room & { _id: Id<'rooms'> }) =>
	policy(() =>
		Effect.gen(function* () {
			yield* orFail(requireActiveUser)

			// Only the owner can edit the room
			yield* orFail(requireRoomOwner(room))
			return allow(room)
		}),
	)
