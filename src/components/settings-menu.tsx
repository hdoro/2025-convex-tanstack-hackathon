import { useLingui } from '@lingui/react/macro'
import {
	Menubar,
	MenubarContent,
	MenubarMenu,
	MenubarRadioGroup,
	MenubarRadioItem,
	MenubarSeparator,
	MenubarTrigger,
} from '@/components/ui/menubar'
import { dynamicActivate } from '@/lib/i18n/i18n'
import { LOCALE_LABELS } from '@/lib/labels'
import { SupportedLocale } from '@/lib/schemas'
import { defaultThemePresets, isValidThemePreset } from '@/lib/theme-presets'
import { useTheme } from '@/providers/theme-provider'

export function SettingsMenu() {
	const { t, i18n } = useLingui()
	const { theme, setTheme } = useTheme()
	return (
		<Menubar>
			<MenubarMenu>
				<MenubarTrigger>{t`Language`}</MenubarTrigger>
				<MenubarContent>
					<MenubarRadioGroup
						value={i18n.locale}
						onValueChange={(locale) => dynamicActivate(locale)}
					>
						{SupportedLocale.literals.map((locale) => (
							<MenubarRadioItem key={locale} value={locale}>
								{LOCALE_LABELS[locale]}
							</MenubarRadioItem>
						))}
					</MenubarRadioGroup>
					<MenubarSeparator />
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger>{t`Theme`}</MenubarTrigger>
				<MenubarContent>
					<MenubarRadioGroup
						value={theme}
						onValueChange={(theme) =>
							isValidThemePreset(theme) && setTheme(theme)
						}
					>
						{Object.entries(defaultThemePresets).map(([preset, { label }]) => (
							<MenubarRadioItem key={preset} value={preset}>
								{label}
							</MenubarRadioItem>
						))}
					</MenubarRadioGroup>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	)
}
