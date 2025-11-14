import type { ConvexReactClient } from 'convex/react'
import type { PropsWithChildren } from 'react'
import type { SupportedLocale } from '@/lib/schemas'
import AppConvexProvider from './convex-provider'
import LocalizationProvider from './localization-provider'

export default function Providers(
	props: PropsWithChildren<{
		convexClient: ConvexReactClient
		locale: SupportedLocale
	}>,
) {
	return (
		<LocalizationProvider locale={props.locale}>
			<AppConvexProvider convexClient={props.convexClient}>
				{props.children}
			</AppConvexProvider>
		</LocalizationProvider>
	)
}
