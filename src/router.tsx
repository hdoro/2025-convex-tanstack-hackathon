import { ConvexQueryClient } from '@convex-dev/react-query'
import { createRouter } from '@tanstack/react-router'
import { ConvexReactClient } from 'convex/react'
import { ENV } from './lib/constants.client'
// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
export const getRouter = () => {
	const convex = new ConvexReactClient(ENV.CONVEX_URL, {
		unsavedChangesWarning: false,
	})
	const convexQueryClient = new ConvexQueryClient(convex)

	const router = createRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreloadStaleTime: 0,
		context: { convexClient: convex, convexQueryClient },
	})

	return router
}
