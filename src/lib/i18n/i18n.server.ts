import {
	getRequest,
	getRequestHeader,
	setResponseHeader,
} from '@tanstack/react-start/server'
import { parse, serialize } from 'cookie-es'
import { LOCALE_COOKIE_KEY } from '../constants'
import type { SupportedLocale } from '../schemas'
import { DEFAULT_LOCALE, dynamicActivate, isSupportedLocale } from './i18n'

export function serializeLocaleCookie(locale: SupportedLocale) {
	return serialize(LOCALE_COOKIE_KEY, locale, {
		sameSite: true,
		secure: true,
		// 1 full year
		maxAge: 365 * 24 * 60 * 60,
		path: '/',
	})
}

export function getLocaleFromRequest() {
	const request = getRequest()
	const cookie = parse(getRequestHeader('Cookie') ?? '')

	if (request) {
		const url = new URL(request.url)
		const queryLocale = url.searchParams.get(LOCALE_COOKIE_KEY) ?? ''

		if (isSupportedLocale(queryLocale)) {
			setResponseHeader('Set-Cookie', serializeLocaleCookie(queryLocale))

			return queryLocale
		}
	}

	if (cookie.locale && isSupportedLocale(cookie.locale)) {
		return cookie.locale
	}

	setResponseHeader('Set-Cookie', serializeLocaleCookie(DEFAULT_LOCALE))

	return DEFAULT_LOCALE
}

export async function setupLocaleFromRequest() {
	await dynamicActivate(getLocaleFromRequest())
}
