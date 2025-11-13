import { defineSchema, defineTable, Id } from '@rjdellecese/confect/server'
import { Schema } from 'effect'

// Timer event types for event-sourced timer
const TimerEvent = Schema.Struct({
	type: Schema.Literal('started', 'paused', 'resumed', 'skipped'),
	timestamp: Schema.Positive,
})

// Timer with event-sourced state
const Timer = Schema.Struct({
	id: Schema.String,
	duration: Schema.Positive,
	currentPhase: Schema.Literal('work', 'break'),
	initialDuration: Schema.Number, // for current phase in ms
	events: Schema.Array(TimerEvent),
	version: Schema.Positive, // for optimistic locking
})

// Session intention questions
const SessionIntention = Schema.Struct({
	accomplish: Schema.optional(Schema.String),
	important: Schema.optional(Schema.String),
	complete: Schema.optional(Schema.String),
	risks: Schema.optional(Schema.String),
	measureable: Schema.optional(Schema.Literal('concrete', 'subjective')),
})

// Session debrief questions
const SessionDebrief = Schema.Struct({
	accomplished: Schema.optional(Schema.String),
	comparison: Schema.optional(Schema.String),
	boggedDown: Schema.optional(Schema.String),
	wentWell: Schema.optional(Schema.String),
	takeaways: Schema.optional(Schema.String),
})

// Cycle intention questions
const CycleIntention = Schema.Struct({
	accomplish: Schema.String, // required
	howToStart: Schema.optional(Schema.String),
	hazards: Schema.optional(Schema.String),
	energyLevel: Schema.Literal('low', 'mid', 'high'), // required
	moraleLevel: Schema.Literal('low', 'mid', 'high'), // required
})

// Cycle debrief questions
const CycleDebrief = Schema.Struct({
	completedTarget: Schema.Literal('yes', 'no'), // required
	noteworthy: Schema.optional(Schema.String),
	distractions: Schema.optional(Schema.String),
	improvements: Schema.optional(Schema.String),
})

const Room = Schema.Struct({
	createdBy: Schema.optional(Id.Id('users')),
	timer: Timer,
	cycleDuration: Schema.Positive, // in ms, default 40min
	breakDuration: Schema.Positive, // in ms, default 7.5min
	visibility: Schema.Literal('private', 'public'),
})

const Session = Schema.Struct({
	userId: Id.Id('users'),
	roomId: Id.Id('rooms'),
	startedAt: Schema.Number,
	status: Schema.Literal('active', 'completed'),
	intention: Schema.optional(SessionIntention),
	debrief: Schema.optional(SessionDebrief),
})

const Cycle = Schema.Struct({
	sessionId: Id.Id('sessions'),
	startedAt: Schema.Number,
	endedAt: Schema.optional(Schema.Number),
	duration: Schema.Positive, // actual duration in ms
	intention: Schema.optional(CycleIntention),
	debrief: Schema.optional(CycleDebrief),
})

const UserProfile = Schema.Struct({
	name: Schema.optional(Schema.String),
	avatar: Schema.optional(Schema.String),
})

export const confectSchema = defineSchema({
	// Rooms with permanent shareable spaces
	rooms: defineTable(Room)
		.index('by_createdBy', ['createdBy'])
		.index('by_visibility', ['visibility']),

	// User sessions (personal to each user)
	sessions: defineTable(Session)
		.index('by_userId', ['userId'])
		.index('by_roomId', ['roomId'])
		.index('by_status', ['status'])
		.index('by_userRoom', ['userId', 'roomId']),

	// Work/break cycles within sessions
	cycles: defineTable(Cycle).index('by_sessionId', ['sessionId']),

	userProfiles: defineTable(UserProfile),
})

export default confectSchema.convexSchemaDefinition
