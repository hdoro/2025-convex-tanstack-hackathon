import type { ConvexReactClient } from 'convex/react'
import type { PropsWithChildren } from 'react'
import AppConvexProvider from './convex-provider'
import UserProfileProvider from './user-profile-provider'

export default function Providers(
	props: PropsWithChildren<{
		convexClient: ConvexReactClient
	}>,
) {
	return (
		<AppConvexProvider convexClient={props.convexClient}>
			<UserProfileProvider>{props.children}</UserProfileProvider>
		</AppConvexProvider>
	)
}
