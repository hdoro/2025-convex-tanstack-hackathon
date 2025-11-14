import { Duration } from 'effect'
import type { Room } from './schemas'

export const DEFAULT_CYCLE_DURATION: Room['cycleDuration'] =
	Duration.minutes(45)
export const DEFAULT_BREAK_DURATION: Room['breakDuration'] =
	Duration.minutes(7.5)

export const THEME_COOKIE_KEY = 'theme'
export const LOCALE_COOKIE_KEY = 'locale'
