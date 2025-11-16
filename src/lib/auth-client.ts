import { convexClient } from '@convex-dev/better-auth/client/plugins'
import { anonymousClient, magicLinkClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import { ENV } from './constants.client'

export const authClient = createAuthClient({
	baseURL: ENV.CONVEX_SITE_URL,
	plugins: [
		convexClient(),
		magicLinkClient(),
		anonymousClient(),
		magicLinkClient(),
	],
})
