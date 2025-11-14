import type { CSSProperties } from 'react'
import type { ColorMode } from '@/hooks/use-color-mode'
import { type Theme, themes } from './themes'

export function themePresetToCssCustomProperties(
	theme: Theme,
	colorMode: ColorMode,
): CSSProperties {
	const themeConfig = themes[theme]
	const prefixedVariables = Object.entries(themeConfig.styles[colorMode]).map(
		([key, value]) => [`--${key}`, value],
	)

	return Object.fromEntries(prefixedVariables)
}
