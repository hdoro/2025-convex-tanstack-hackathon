import { ConvexBetterAuthProvider } from '@convex-dev/better-auth/react'
import {
	fetchSession,
	getCookieName,
} from '@convex-dev/better-auth/react-start'
import type { ConvexQueryClient } from '@convex-dev/react-query'
import { useLingui } from '@lingui/react'
import { TanStackDevtools } from '@tanstack/react-devtools'
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
	useRouteContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { createServerFn } from '@tanstack/react-start'
import { getCookie, getRequest } from '@tanstack/react-start/server'
import type { ConvexReactClient } from 'convex/react'
import type { PropsWithChildren } from 'react'
import { SettingsMenu } from '@/components/settings-menu'
import { authClient } from '@/lib/auth-client'
import Providers from '@/providers/providers'
import ThemeProvider from '@/providers/theme-provider'
import StoreDevtools from '../lib/demo-store-devtools'
import appCss from '../styles.css?url'

// Get auth information for SSR using available cookies
const fetchAuth = createServerFn({ method: 'GET' }).handler(async () => {
	const { createAuth } = await import('../../convex/auth')
	const { session } = await fetchSession(getRequest())
	const sessionCookieName = getCookieName(createAuth)
	const token = getCookie(sessionCookieName)
	return {
		userId: session?.user.id,
		token,
	}
})

export const Route = createRootRouteWithContext<{
	convexClient: ConvexReactClient
	convexQueryClient: ConvexQueryClient
}>()({
	head: () => ({
		meta: [
			{
				charSet: 'utf-8',
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			{
				title: 'TanStack Start Starter',
			},
		],
		links: [
			{
				rel: 'stylesheet',
				href: appCss,
			},
		],
	}),

	beforeLoad: async (ctx) => {
		// all queries, mutations and action made with TanStack Query will be
		// authenticated by an identity token.
		const { userId, token } = await fetchAuth()
		// During SSR only (the only time serverHttpClient exists),
		// set the auth token to make HTTP queries with.
		if (token) {
			ctx.context.convexQueryClient.serverHttpClient?.setAuth(token)
		}
		return { userId, token }
	},

	component: RootComponent,
})

function RootComponent() {
	const context = useRouteContext({ from: Route.id })
	return (
		<ConvexBetterAuthProvider
			client={context.convexClient}
			authClient={authClient}
		>
			<Providers>
				<RootDocument>
					<Outlet />
				</RootDocument>
			</Providers>
		</ConvexBetterAuthProvider>
	)
}

function RootDocument(props: PropsWithChildren) {
	const { i18n } = useLingui()
	return (
		<html lang={i18n.locale}>
			<head>
				<HeadContent />
			</head>
			<body>
				<ThemeProvider>
					<SettingsMenu />
					{props.children}
					<TanStackDevtools
						config={{
							position: 'bottom-right',
						}}
						plugins={[
							{
								name: 'Tanstack Router',
								render: <TanStackRouterDevtoolsPanel />,
							},
							StoreDevtools,
						]}
					/>
					<Scripts />
				</ThemeProvider>
			</body>
		</html>
	)
}
