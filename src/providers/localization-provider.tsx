import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { createServerFn } from '@tanstack/react-start'
import { setResponseHeader } from '@tanstack/react-start/server'
import { Schema } from 'effect'
import {
	createContext,
	type PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from 'react'
import { dynamicActivate } from '@/lib/i18n/i18n'
import { serializeLocaleCookie } from '@/lib/i18n/i18n.server'
import { SupportedLocale } from '@/lib/schemas'

const LocaleContext = createContext<{
	locale: SupportedLocale
	setLocale: (locale: SupportedLocale) => Promise<void>
}>({ locale: 'en', setLocale: async () => {} })

export const useLocale = () => useContext(LocaleContext)

export default function LocalizationProvider(
	props: PropsWithChildren<{ locale: SupportedLocale }>,
) {
	const [locale, setLocale] = useState<SupportedLocale>(props.locale)

	async function onLocaleChange(locale: SupportedLocale) {
		setLocale(locale)
		setLocaleCookie({ data: { locale } })
		dynamicActivate(locale)
	}

	useEffect(() => {
		dynamicActivate(props.locale)
	}, [props.locale])

	return (
		<I18nProvider i18n={i18n}>
			<LocaleContext.Provider value={{ locale, setLocale: onLocaleChange }}>
				{props.children}
			</LocaleContext.Provider>
		</I18nProvider>
	)
}

export const setLocaleCookie = createServerFn({ method: 'POST' })
	.inputValidator(
		Schema.standardSchemaV1(
			Schema.Struct({
				locale: SupportedLocale,
			}),
		),
	)
	.handler(async ({ data: { locale } }) => {
		setResponseHeader('Set-Cookie', serializeLocaleCookie(locale))

		return { success: true }
	})
