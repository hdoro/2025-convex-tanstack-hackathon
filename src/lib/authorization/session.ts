import * as Context from 'effect/Context'
import type { SupportedLocale, UserId, UserProfile } from '../schemas'

export type ActiveUserSession = {
	readonly userId: UserId
	readonly status: 'active'
	readonly userProfile: UserProfile
	readonly locale: SupportedLocale
}

export type InactiveUserSession = {
	readonly userId: UserId
	readonly status: 'inactive'
	readonly locale: SupportedLocale
}

export type UserSession = ActiveUserSession | InactiveUserSession | null

export class CurrentSession extends Context.Tag('CurrentSession')<
	CurrentSession,
	UserSession
>() {}
