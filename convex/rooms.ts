import { Effect, Option, Schema } from 'effect'
import { DEFAULT_BREAK_DURATION, DEFAULT_CYCLE_DURATION } from '@/lib/constants'
import { createRoomHandle } from '@/lib/handles'
import {
	CreateRoomArgs,
	CreateRoomResult,
	GetRoomByHandleArgs,
	GetRoomByHandleResult,
	Timer,
	UpdateRoomArgs,
	UserId,
} from '@/lib/schemas'
import { ConfectMutationCtx, ConfectQueryCtx, mutation, query } from './confect'

export const create = mutation({
	args: CreateRoomArgs,
	returns: CreateRoomResult,
	handler: () =>
		Effect.gen(function* () {
			const { db } = yield* ConfectMutationCtx

			const handle = createRoomHandle()
			yield* db.insert('rooms', {
				breakDuration: DEFAULT_BREAK_DURATION,
				cycleDuration: DEFAULT_CYCLE_DURATION,
				createdBy: UserId.make('@TODO get current user'),
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
})

export const update = mutation({
	args: UpdateRoomArgs,
	returns: Schema.Null,
	handler: ({ id, ...toUpdate }) =>
		Effect.gen(function* () {
			const { db } = yield* ConfectMutationCtx
			yield* db.patch(id, toUpdate)
			// @TODO get current user and ensure only the creator can modify the room

			return null
		}),
})

export const getByHandle = query({
	args: GetRoomByHandleArgs,
	returns: GetRoomByHandleResult,
	handler: ({ handle }) =>
		Effect.gen(function* () {
			const { db, auth } = yield* ConfectQueryCtx
			const room = yield* db
				.query('rooms')
				.withIndex('by_handle', (q) => q.eq('handle', handle))
				.unique()

			const identity = yield* auth.getUserIdentity()
			console.log(identity)

			return room
		}).pipe(Effect.catchAll(() => Effect.succeed(Option.none()))),
})
