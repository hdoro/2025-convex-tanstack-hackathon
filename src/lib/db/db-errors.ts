import type { Id, TableNames } from '@db/_generated/dataModel'
import { Data } from 'effect'

export class NotFoundError extends Data.TaggedError('NotFoundError')<{
	docId?: Id<TableNames>
	handle?: string
}> {}

export class ForbiddenError extends Data.TaggedError('ForbiddenError')<{
	message?: string | undefined
}> {}

export class GetUserIdentityError extends Data.TaggedError(
	'GetUserIdentityError',
)<{
	error: unknown
}> {}
