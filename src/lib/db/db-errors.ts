import type { Id, TableNames } from '@db/_generated/dataModel'
import { Data } from 'effect'
import type { MacroMessageDescriptor } from '@/hooks/use-lingui-stub'

export class NotFoundError extends Data.TaggedError('NotFoundError')<{
	docId?: Id<TableNames>
	handle?: string
}> {}

export class ForbiddenError extends Data.TaggedError('ForbiddenError')<{
	message?: MacroMessageDescriptor | undefined
}> {}

export class InvalidCtxError extends Data.TaggedError('InvalidCtxError')<{}> {}

export class GetUserIdentityError extends Data.TaggedError(
	'GetUserIdentityError',
)<{
	error: unknown
}> {}
