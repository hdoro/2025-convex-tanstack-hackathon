import { CurrentSession } from '@/lib/authorization/current-session'
import { dbEffect } from '@/lib/db/db-effect'
import {
	GetCurrentUserProfileArgs,
	GetCurrentUserProfileReturn,
} from '@/lib/schemas'
import { query } from './confect'

export const getCurrentProfile = query({
	args: GetCurrentUserProfileArgs,
	returns: GetCurrentUserProfileReturn,
	handler: () => dbEffect(CurrentSession),
})
