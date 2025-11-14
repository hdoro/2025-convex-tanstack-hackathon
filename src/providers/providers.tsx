import type { PropsWithChildren } from 'react'
import LocalizationProvider from './localization-provider'

export default function Providers(props: PropsWithChildren) {
	return <LocalizationProvider>{props.children}</LocalizationProvider>
}
