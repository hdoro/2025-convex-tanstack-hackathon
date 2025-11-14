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
import { isSupportedLocale } from '@/lib/i18n/i18n'
import { LOCALE_LABELS } from '@/lib/labels'
import { SupportedLocale } from '@/lib/schemas'
import { isValidTheme, themes } from '@/lib/themes'
import { useLocale } from '@/providers/localization-provider'
import { useTheme } from '@/providers/theme-provider'

export function SettingsMenu() {
	const { t } = useLingui()
	const { locale, setLocale } = useLocale()
	const { theme, setTheme } = useTheme()
	return (
		<Menubar>
			<MenubarMenu>
				<MenubarTrigger>{t`Language`}</MenubarTrigger>
				<MenubarContent>
					<MenubarRadioGroup
						value={locale}
						onValueChange={(newLocale) =>
							isSupportedLocale(newLocale) && setLocale(newLocale)
						}
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
						onValueChange={(newTheme) =>
							isValidTheme(newTheme) && setTheme(newTheme)
						}
					>
						{Object.entries(themes).map(([preset, { label }]) => (
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
