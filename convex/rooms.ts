import { Effect, Option, Schema } from 'effect'
import { Policies } from '@/lib/authorization'
import { DEFAULT_BREAK_DURATION, DEFAULT_CYCLE_DURATION } from '@/lib/constants'
import { dbEffect } from '@/lib/db/db-effect'
import { createRoomHandle } from '@/lib/handles'
import {
	CreateRoomArgs,
	CreateRoomResult,
	GetRoomByHandleArgs,
	GetRoomByHandleResult,
	Timer,
	UpdateRoomArgs,
} from '@/lib/schemas'
import { ConfectMutationCtx, ConfectQueryCtx, mutation, query } from './confect'

export const create = mutation({
	args: CreateRoomArgs,
	returns: CreateRoomResult,
	handler: () =>
		dbEffect(
			Effect.gen(function* () {
				const { db } = yield* ConfectMutationCtx
				const session = yield* Policies.orFail(Policies.requireActiveUser)

				const handle = createRoomHandle()
				yield* db.insert('rooms', {
					breakDuration: DEFAULT_BREAK_DURATION,
					cycleDuration: DEFAULT_CYCLE_DURATION,
					createdBy: session.userId,
					currentPhase: 'work',
					handle,
					timer: Timer.make({
						duration: DEFAULT_BREAK_DURATION,
						events: [],
						version: 1,
					}),
					visibility: 'private',
				})

				return { handle }
			}),
		),
})

export const update = mutation({
	args: UpdateRoomArgs,
	returns: Schema.Null,
	handler: ({ id, ...toUpdate }) =>
		dbEffect(
			Effect.gen(function* () {
				const { db } = yield* ConfectMutationCtx

				const room = yield* db.get(id)
				if (Option.isNone(room)) return null

				yield* Policies.orFail(Policies.requireReadableRoom(room.value))

				yield* db.patch(id, toUpdate)

				return null
			}),
		),
})

export const getByHandle = query({
	args: GetRoomByHandleArgs,
	returns: GetRoomByHandleResult,
	handler: ({ handle }) =>
		dbEffect(
			Effect.gen(function* () {
				const { db } = yield* ConfectQueryCtx
				const room = yield* db
					.query('rooms')
					.withIndex('by_handle', (q) => q.eq('handle', handle))
					.unique()

				if (Option.isNone(room)) return Option.none()

				yield* Policies.orFail(Policies.requireReadableRoom(room.value))
				return room
			}),
		),
})
