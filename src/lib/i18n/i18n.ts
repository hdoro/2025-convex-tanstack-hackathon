import { i18n } from '@lingui/core'
import { Schema } from 'effect'
import { SupportedLocale } from '../schemas'

export const isLocaleValid = (locale: string) =>
	Schema.is(SupportedLocale)(locale)

export const DEFAULT_LOCALE: SupportedLocale = 'en'

/**
 * We do a dynamic import of just the catalog that we need
 */
export async function dynamicActivate(locale: string) {
	if (!isLocaleValid(locale)) return

	const { messages } = await import(`../../locales/${locale}/messages.po`)
	i18n.load(locale, messages)
	i18n.activate(locale)
}
