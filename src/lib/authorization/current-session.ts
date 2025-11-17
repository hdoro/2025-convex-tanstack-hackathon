import * as Context from 'effect/Context'
import type { UserSession } from '../schemas'

export class CurrentSession extends Context.Tag('CurrentSession')<
	CurrentSession,
	UserSession
>() {}
