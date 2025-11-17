import {
	Menubar,
	MenubarContent,
	MenubarMenu,
	MenubarRadioGroup,
	MenubarRadioItem,
	MenubarTrigger,
} from '@/components/ui/menubar'
import { isValidTheme, themes } from '@/lib/themes'
import { useTheme } from '@/providers/theme-provider'

export function SettingsMenu() {
	const { theme, setTheme } = useTheme()
	return (
		<Menubar>
			<MenubarMenu>
				<MenubarTrigger>{`Theme`}</MenubarTrigger>
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
