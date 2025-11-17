import { createServerFn } from '@tanstack/react-start'
import { setResponseHeader } from '@tanstack/react-start/server'
import { serialize } from 'cookie-es'
import { Schema } from 'effect'
import {
	createContext,
	type PropsWithChildren,
	useContext,
	useState,
} from 'react'
import { ThemeSelector } from '@/components/theme-selector'
import { THEME_COOKIE_KEY } from '@/lib/constants'
import { themePresetToCssCustomProperties } from '@/lib/theme-helpers'
import { Theme } from '@/lib/themes'

const ThemeContext = createContext<{
	theme: Theme
	setTheme: (theme: Theme) => Promise<void>
}>({ theme: 'amber-minimal', setTheme: async () => {} })

export const useTheme = () => useContext(ThemeContext)

export default function ThemeProvider(
	props: PropsWithChildren<{ theme: Theme }>,
) {
	const [theme, setTheme] = useState<Theme>(props.theme)

	async function onThemeChange(theme: Theme) {
		setTheme(theme)
		try {
			setThemeCookie({ data: { theme } })
		} catch (error) {
			console.error('Failed setting theme cookie', error)
		}
	}
	return (
		<ThemeContext.Provider value={{ theme, setTheme: onThemeChange }}>
			{props.children}

			<ThemeSelector />
			{/* biome-ignore lint: this is the best way to do SSR-ready theming */}
			<style dangerouslySetInnerHTML={{ __html: getDarkModeStyles(theme) }} />
		</ThemeContext.Provider>
	)
}

function getDarkModeStyles(theme: Theme) {
	return `
	:root {
      ${Object.entries(themePresetToCssCustomProperties(theme, 'light'))
				.map(([key, value]) => `${key}: ${value};`)
				.join('\n')}
    }
	@media (prefers-color-scheme: dark) {
    :root {
      ${Object.entries(themePresetToCssCustomProperties(theme, 'dark'))
				.map(([key, value]) => `${key}: ${value};`)
				.join('\n')}
    }
  }`
}

export const setThemeCookie = createServerFn({ method: 'POST' })
	.inputValidator(
		Schema.standardSchemaV1(
			Schema.Struct({
				theme: Theme,
			}),
		),
	)
	.handler(async ({ data: { theme } }) => {
		setResponseHeader(
			'Set-Cookie',
			serialize(THEME_COOKIE_KEY, theme, {
				sameSite: true,
				secure: true,
				path: '/',
			}),
		)

		return { success: true }
	})
