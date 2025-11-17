import {
	fetchSession,
	getCookieName,
} from '@convex-dev/better-auth/react-start'
import type { ConvexQueryClient } from '@convex-dev/react-query'
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
import NotFoundScreen from '@/components/not-found-screen'
import { getRandomItemFromArray } from '@/lib/arrays'
import { THEME_COOKIE_KEY } from '@/lib/constants'
import { isValidTheme, type Theme, themes } from '@/lib/themes'
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

const fetchTheme = createServerFn({ method: 'GET' }).handler(async () => {
	const storedTheme = getCookie(THEME_COOKIE_KEY)

	if (storedTheme && isValidTheme(storedTheme)) return storedTheme

	return getRandomItemFromArray(Object.keys(themes)) as Theme
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
				title: 'Fokua',
			},
		],
		links: [
			{
				rel: 'stylesheet',
				href: appCss,
			},
			{ rel: 'icon', href: '/favicon.ico' },
		],
	}),

	beforeLoad: async (ctx) => {
		// all queries, mutations and action made with TanStack Query will be
		// authenticated by an identity token.
		const [{ userId, token }, theme] = await Promise.all([
			fetchAuth(),
			fetchTheme(),
		] as const)

		// During SSR only (the only time serverHttpClient exists),
		// set the auth token to make HTTP queries with.
		if (token) {
			ctx.context.convexQueryClient.serverHttpClient?.setAuth(token)
		}

		return { userId, token, theme }
	},
	notFoundComponent: NotFoundScreen,

	component: RootComponent,
})

function RootComponent() {
	const context = useRouteContext({ from: Route.id })
	return (
		<Providers convexClient={context.convexQueryClient.convexClient}>
			<RootDocument theme={context.theme}>
				<Outlet />
			</RootDocument>
		</Providers>
	)
}

function RootDocument(props: PropsWithChildren<{ theme: Theme }>) {
	return (
		<html lang={'en'}>
			<head>
				<HeadContent />
			</head>
			<body>
				<ThemeProvider theme={props.theme}>
					{props.children}
					<TanStackDevtools
						config={{
							position: 'bottom-left',
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
