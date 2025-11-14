import { useLingui } from '@lingui/react'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { createRootRoute, HeadContent, Scripts } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import type { PropsWithChildren } from 'react'
import { SettingsMenu } from '@/components/settings-menu'
import Providers from '@/providers/providers'
import ThemeProvider from '@/providers/theme-provider'
import StoreDevtools from '../lib/demo-store-devtools'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
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

	shellComponent: (props) => (
		<Providers>
			<RootDocument>{props.children}</RootDocument>
		</Providers>
	),
})

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
