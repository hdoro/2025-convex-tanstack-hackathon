import {
	getRequest,
	getRequestHeader,
	setResponseHeader,
} from '@tanstack/react-start/server'
import { parse, serialize } from 'cookie-es'

import { DEFAULT_LOCALE, dynamicActivate, isLocaleValid } from './i18n'

function getLocaleFromRequest() {
	const request = getRequest()
	const cookie = parse(getRequestHeader('Cookie') ?? '')

	if (request) {
		const url = new URL(request.url)
		const queryLocale = url.searchParams.get('locale') ?? ''

		if (isLocaleValid(queryLocale)) {
			setResponseHeader(
				'Set-Cookie',
				serialize('locale', queryLocale, {
					maxAge: 30 * 24 * 60 * 60,
					path: '/',
				}),
			)

			return queryLocale
		}
	}

	if (cookie.locale && isLocaleValid(cookie.locale)) {
		return cookie.locale
	}

	setResponseHeader(
		'Set-Cookie',
		serialize('locale', DEFAULT_LOCALE, {
			maxAge: 30 * 24 * 60 * 60,
			path: '/',
		}),
	)

	return DEFAULT_LOCALE
}

export async function setupLocaleFromRequest() {
	await dynamicActivate(getLocaleFromRequest())
}
