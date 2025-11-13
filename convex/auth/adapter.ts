import { createApi } from '@convex-dev/better-auth'
import { createAuth } from '../auth'
import authSchema from './schema'

export const {
	create,
	findOne,
	findMany,
	updateOne,
	updateMany,
	deleteOne,
	deleteMany,
} = createApi(authSchema, createAuth)
