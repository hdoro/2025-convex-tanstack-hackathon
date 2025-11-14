import { Id } from '@rjdellecese/confect/server'
import { Schema } from 'effect'

export const UserId = Schema.String.pipe(Schema.brand('auth/UserId'))
export type UserId = typeof UserId.Type

// Timer event types for event-sourced timer
export const TimerEvent = Schema.Struct({
	type: Schema.Literal('started', 'paused', 'resumed', 'skipped'),
	timestamp: Schema.Positive,
})
export type TimerEvent = typeof TimerEvent.Type

// Timer with event-sourced state
export const Timer = Schema.Struct({
	duration: Schema.Positive,
	events: Schema.Array(TimerEvent),
	version: Schema.Positive, // for optimistic locking
})
export type Timer = typeof Timer.Type

// Session intention questions
export const SessionIntention = Schema.Struct({
	goal: Schema.String,
	importance: Schema.optional(Schema.String),
	completionCriteria: Schema.optional(Schema.String),
	risks: Schema.optional(Schema.String),
	measurability: Schema.optional(Schema.Literal('concrete', 'subjective')),
})
export type SessionIntention = typeof SessionIntention.Type

// Session debrief questions
export const SessionDebrief = Schema.Struct({
	accomplished: Schema.optional(Schema.String),
	comparison: Schema.optional(Schema.String),
	boggedDown: Schema.optional(Schema.String),
	wentWell: Schema.optional(Schema.String),
	takeaways: Schema.optional(Schema.String),
})
export type SessionDebrief = typeof SessionDebrief.Type

// Cycle intention questions
export const CycleIntention = Schema.Struct({
	goal: Schema.String, // required
	howToStart: Schema.optional(Schema.String),
	hazards: Schema.optional(Schema.String),
	energyLevel: Schema.Literal('low', 'medium', 'high'), // required
	moraleLevel: Schema.Literal('low', 'medium', 'high'), // required
})
export type CycleIntention = typeof CycleIntention.Type

// Cycle debrief questions
export const CycleDebrief = Schema.Struct({
	completedTarget: Schema.Literal('yes', 'no'), // required
	noteworthy: Schema.optional(Schema.String),
	distractions: Schema.optional(Schema.String),
	improvements: Schema.optional(Schema.String),
})
export type CycleDebrief = typeof CycleDebrief.Type

export const Room = Schema.Struct({
	createdBy: UserId,
	currentPhase: Schema.Literal('work', 'break'),
	timer: Timer,
	cycleDuration: Schema.Positive, // in ms, default 40min
	breakDuration: Schema.Positive, // in ms, default 7.5min
	visibility: Schema.Literal('private', 'public'),
})
export type Room = typeof Room.Type

export const Session = Schema.Struct({
	userId: UserId,
	roomId: Id.Id('rooms'),
	startedAt: Schema.Date,
	status: Schema.Literal('active', 'completed'),
	intention: Schema.optional(SessionIntention),
	debrief: Schema.optional(SessionDebrief),
})
export type Session = typeof Session.Type

export const Cycle = Schema.Struct({
	sessionId: Id.Id('sessions'),
	startedAt: Schema.Date,
	endedAt: Schema.Date,
	intention: Schema.optional(CycleIntention),
	debrief: Schema.optional(CycleDebrief),
})
export type Cycle = typeof Cycle.Type

export const UserProfile = Schema.Struct({
	userId: UserId,
	name: Schema.optional(Schema.String),
	avatar: Schema.optional(Schema.String),
})
export type UserProfile = typeof UserProfile.Type
