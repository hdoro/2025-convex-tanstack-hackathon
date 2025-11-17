import { defineSchema, defineTable } from '@rjdellecese/confect/server'
import { Cycle, Room, RoomAccess, Session, UserProfile } from '@/lib/schemas'

export const confectSchema = defineSchema({
	// Rooms with permanent shareable spaces
	rooms: defineTable(Room)
		.index('by_createdBy', ['createdBy'])
		.index('by_handle', ['handle']),

	roomsAccess: defineTable(RoomAccess)
		.index('by_roomId_userId', ['roomId', 'userId'])
		.index('by_userId', ['userId']),

	// User sessions (personal to each user)
	sessions: defineTable(Session)
		.index('by_userId', ['userId'])
		.index('by_roomId', ['roomId'])
		.index('by_status', ['status'])
		.index('by_userRoom', ['userId', 'roomId']),

	// Work/break cycles within sessions
	cycles: defineTable(Cycle)
		.index('by_sessionId', ['sessionId'])
		.index('by_userId', ['userId']),

	userProfiles: defineTable(UserProfile).index('by_userId', ['userId']),
})

export default confectSchema.convexSchemaDefinition
