import { ConvexBetterAuthProvider } from '@convex-dev/better-auth/react'
import type { ConvexReactClient } from 'convex/react'
import type { PropsWithChildren } from 'react'
import { authClient } from '@/lib/auth-client'

export default function AppConvexProvider(
	props: PropsWithChildren<{
		convexClient: ConvexReactClient
	}>,
) {
	return (
		<ConvexBetterAuthProvider
			client={props.convexClient}
			authClient={authClient}
		>
			{props.children}
		</ConvexBetterAuthProvider>
	)
}
