import { createClient } from '@convex-dev/better-auth'
import { components } from '../_generated/api'
import type { DataModel } from '../_generated/dataModel'
import authSchema from './schema'

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel, typeof authSchema>(
	components.auth,
	{
		local: {
			schema: authSchema,
		},
	},
)
