import { ConvexBetterAuthProvider } from '@convex-dev/better-auth/react'
import { ConvexQueryClient } from '@convex-dev/react-query'
import { authClient } from '@/lib/auth-client'
import { ENV } from '@/lib/constants'

const convexQueryClient = new ConvexQueryClient(ENV.CONVEX_URL)

export default function AppConvexProvider({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<ConvexBetterAuthProvider
			client={convexQueryClient.convexClient}
			authClient={authClient}
		>
			{children}
		</ConvexBetterAuthProvider>
	)
}
