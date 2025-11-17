import { Id } from '@rjdellecese/confect/server'
import { Schema } from 'effect'

export const SupportedLocale = Schema.Literal('en', 'es', 'pt')
export type SupportedLocale = typeof SupportedLocale.Type

export const UserId = Schema.String.pipe(Schema.brand('auth/UserId'))
export type UserId = typeof UserId.Type

export const Timestamp = Schema.Positive.pipe(Schema.brand('Timestamp'))
export type Timestamp = typeof Timestamp.Type

// Timer event types for event-sourced timer
export const TimerEvent = Schema.Struct({
	type: Schema.Literal('started', 'paused', 'resumed', 'skipped'),
	timestamp: Timestamp,
})
export type TimerEvent = typeof TimerEvent.Type

// Timer with event-sourced state
export const Timer = Schema.Struct({
	duration: Schema.Duration,
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
	handle: Schema.String,
	currentPhase: Schema.Literal('work', 'break'),
	timer: Timer,
	cycleDuration: Schema.Duration,
	breakDuration: Schema.Duration,
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
	userId: UserId,
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

// ===============
// SESSION
// ===============

export const ActiveUserSession = Schema.Struct({
	userId: UserId,
	status: Schema.Literal('active'),
	userProfile: UserProfile,
	locale: SupportedLocale,
})
export type ActiveUserSession = typeof ActiveUserSession.Type

export const InactiveUserSession = Schema.Struct({
	userId: UserId,
	status: Schema.Literal('inactive'),
	locale: SupportedLocale,
})
export type InactiveUserSession = typeof InactiveUserSession.Type

export const UserSession = Schema.Union(
	ActiveUserSession,
	InactiveUserSession,
	Schema.Null,
)
export type UserSession = typeof UserSession.Type

// ===============
// ENDPOINTS
// ===============

export const CreateRoomArgs = Schema.Struct({})
export const CreateRoomResult = Schema.Struct({
	handle: Room.fields.handle,
})
export const UpdateRoomArgs = Schema.Struct({
	...Room.omit('createdBy', 'handle').fields,
	id: Id.Id('rooms'),
})
export const GetRoomByHandleArgs = Room.pick('handle')
export const GetRoomByHandleResult = Schema.Option(Room)

export const GetCurrentUserProfileArgs = Schema.Struct({})
export const GetCurrentUserProfileReturn = UserSession
