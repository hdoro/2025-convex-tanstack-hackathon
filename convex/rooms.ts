import { Effect, Schema } from 'effect'
import { DEFAULT_BREAK_DURATION, DEFAULT_CYCLE_DURATION } from '@/lib/constants'
import { createRoomHandle } from '@/lib/handles'
import {
	CreateRoomArgs,
	CreateRoomResult,
	Timer,
	UpdateRoomArgs,
	UserId,
} from '@/lib/schemas'
import { ConfectMutationCtx, mutation } from './confect'

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
					version: 0,
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
			// @TODO get current

			return null
		}),
})
