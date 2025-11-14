import type { PropsWithChildren } from 'react'
import AppConvexProvider from './convex-provider'
import LocalizationProvider from './localization-provider'

export default function Providers(props: PropsWithChildren) {
	return (
		<LocalizationProvider>
			<AppConvexProvider>{props.children}</AppConvexProvider>
		</LocalizationProvider>
	)
}
