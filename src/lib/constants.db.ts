export function parseCurrentConvexEnvironment() {
	if (process.env.NODE_ENV === 'test') return 'test'

	if (process.env.CONVEX_ENV !== 'production') return 'development'

	return 'production'
}

const WEB_URLS = {
	production: process.env.VITE_WEB_URL_PROD as string,
	development: process.env.VITE_WEB_URL_DEV as string,
	local: process.env.VITE_WEB_URL_LOCAL as string,
} as const

export const DB_TRUSTED_ORIGINS = (() => {
	if (parseCurrentConvexEnvironment() === 'production')
		return [WEB_URLS.production, 'wileo://']

	return [WEB_URLS.production, WEB_URLS.development, WEB_URLS.local, 'wileo://']
})()
