import type { CSSProperties } from 'react'
import type { ColorMode } from '@/hooks/use-color-mode'
import { type DefaultThemePreset, defaultThemePresets } from './theme-presets'

export function themePresetToCssCustomProperties(
	themePreset: DefaultThemePreset,
	colorMode: ColorMode,
): CSSProperties {
	const theme = defaultThemePresets[themePreset]
	const prefixedVariables = Object.entries(theme.styles[colorMode]).map(
		([key, value]) => [`--${key}`, value],
	)

	return Object.fromEntries(prefixedVariables)
}
