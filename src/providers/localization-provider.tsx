import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import type { PropsWithChildren } from 'react'
import { DEFAULT_LOCALE, dynamicActivate, isLocaleValid } from '@/lib/i18n/i18n'
import type { SupportedLocale } from '@/lib/schemas'

function isSupportedLocale(
	locale: string | undefined | null,
): locale is SupportedLocale {
	return typeof locale === 'string' && isLocaleValid(locale)
}

// @TODO: strategy to pull in user's locales
dynamicActivate(
	(Array.isArray(i18n.locales)
		? i18n.locales
		: [i18n.locales || DEFAULT_LOCALE]
	).find((l) => isSupportedLocale(l)) || DEFAULT_LOCALE,
)

export default function LocalizationProvider(props: PropsWithChildren) {
	return <I18nProvider i18n={i18n}>{props.children}</I18nProvider>
}
