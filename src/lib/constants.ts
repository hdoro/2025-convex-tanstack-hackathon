import { Duration } from 'effect'
import type { Room } from './schemas'

export const ENV = {
	CONVEX_URL: import.meta.env.VITE_CONVEX_URL,
	CONVEX_SITE_URL: import.meta.env.VITE_CONVEX_SITE_URL,
}

export const DEFAULT_CYCLE_DURATION: Room['cycleDuration'] =
	Duration.minutes(45)
export const DEFAULT_BREAK_DURATION: Room['breakDuration'] =
	Duration.minutes(7.5)
