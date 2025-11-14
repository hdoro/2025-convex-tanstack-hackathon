import { defineConfig } from '@lingui/cli'

export default defineConfig({
	sourceLocale: 'en',
	locales: ['en', 'pt', 'es'],
	catalogs: [
		{
			path: '<rootDir>/src/locales/{locale}/messages',
			include: ['src'],
		},
	],
})
