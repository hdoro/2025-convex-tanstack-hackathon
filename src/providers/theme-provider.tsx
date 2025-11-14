import {
	createContext,
	type PropsWithChildren,
	useContext,
	useState,
} from 'react'
import { useColorMode } from '@/hooks/use-color-mode'
import { getRandomItemFromArray } from '@/lib/arrays'
import { THEME_STORAGE_KEY } from '@/lib/constants'
import { themePresetToCssCustomProperties } from '@/lib/theme-helpers'
import {
	type DefaultThemePreset,
	defaultThemePresets,
	isValidThemePreset,
} from '@/lib/theme-presets'

// @TODO: solution that works in SSR (cookie, not local storage; follow example of the solution we land on for lingui)
const initialTheme = (() => {
	if (typeof window !== 'undefined' && !!localStorage) {
		const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
		if (savedTheme && isValidThemePreset(savedTheme)) return savedTheme
	}
	return getRandomItemFromArray(
		Object.keys(defaultThemePresets),
	) as DefaultThemePreset
})()

const ThemeContext = createContext<{
	theme: DefaultThemePreset
	setTheme: (theme: DefaultThemePreset) => void
}>({ theme: initialTheme, setTheme: () => {} })

export const useTheme = () => useContext(ThemeContext)

export default function ThemeProvider(props: PropsWithChildren) {
	const [theme, setTheme] = useState<DefaultThemePreset>(initialTheme)
	const colorMode = useColorMode()
	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			<div
				className="contents"
				style={themePresetToCssCustomProperties(theme, colorMode)}
			>
				{props.children}
			</div>
		</ThemeContext.Provider>
	)
}
