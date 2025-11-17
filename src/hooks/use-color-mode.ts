import { useEffect, useState } from 'react'

export type ColorMode = 'light' | 'dark'

export function useColorMode(): ColorMode {
	const [colorMode, setColorMode] = useState<ColorMode>(() => {
		if (typeof window === 'undefined') return 'light'
		return window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'dark'
			: 'light'
	})

	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

		const handleChange = (e: MediaQueryListEvent) => {
			setColorMode(e.matches ? 'dark' : 'light')
		}

		mediaQuery.addEventListener('change', handleChange)

		return () => mediaQuery.removeEventListener('change', handleChange)
	}, [])

	return colorMode
}
