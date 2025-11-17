import { Check, Palette, Search } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useColorMode } from '@/hooks/use-color-mode'
import { useLingui } from '@/hooks/use-lingui-stub'
import { themePresetToCssCustomProperties } from '@/lib/theme-helpers'
import { type Theme, themes } from '@/lib/themes'
import { useTheme } from '@/providers/theme-provider'

const THEMES_ARRAY = Object.entries(themes).map(([theme, config]) => ({
	...config,
	id: theme as Theme,
}))

export function ThemeSelector() {
	const { t } = useLingui()
	const colorMode = useColorMode()
	const [open, setOpen] = useState(false)
	const [search, setSearch] = useState('')
	const { theme: selectedTheme, setTheme } = useTheme()

	const filteredThemes = THEMES_ARRAY.filter((theme) =>
		theme.label.toLowerCase().includes(search.toLowerCase()),
	)

	return (
		<>
			{/* Floating Action Button */}
			<Button
				onClick={() => setOpen(true)}
				size="lg"
				className="fixed right-6 bottom-6 h-14 w-14 rounded-full shadow-lg"
				aria-label="Open theme selector"
			>
				<Palette className="h-6 w-6" />
			</Button>

			{/* Theme Modal */}
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="max-h-[80vh] max-w-4xl p-0">
					<DialogHeader className="p-6 pb-4">
						<DialogTitle className="text-2xl">{t`Choose Your Theme`}</DialogTitle>
						<DialogDescription>
							{t`Select from ${THEMES_ARRAY.length} beautifully crafted themes to personalize your experience`}
						</DialogDescription>
					</DialogHeader>

					{/* Search */}
					<div className="px-6 pb-4">
						<div className="relative">
							<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search themes..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="pl-9"
							/>
						</div>
					</div>

					{/* Theme Grid */}
					<ScrollArea className="h-[calc(80vh-180px)] px-6 pb-6">
						<div className="grid grid-cols-2 gap-3 md:grid-cols-3">
							{filteredThemes.map((theme) => (
								<button
									key={theme.id}
									onClick={() => setTheme(theme.id)}
									className="group relative overflow-hidden rounded-lg border-2 text-left transition-all hover:border-primary hover:shadow-md"
									style={{
										...themePresetToCssCustomProperties(theme.id, colorMode),
										borderColor:
											selectedTheme === theme.id
												? 'hsl(var(--primary))'
												: 'hsl(var(--border))',
									}}
									type="button"
								>
									{/* Color Preview */}
									<div className="flex h-24 overflow-hidden">
										<div className="flex-1 bg-primary" />
										<div className="flex-1 bg-secondary" />
										<div className="flex-1 bg-accent" />
									</div>

									{/* Theme Info */}
									<div className="bg-card p-3">
										<div className="flex items-start justify-between gap-2">
											<div className="min-w-0 flex-1">
												<p className="truncate font-medium text-sm">
													{theme.label}
												</p>
												{/*<p className="truncate text-muted-foreground text-xs">
													{theme.description}
												</p>*/}
											</div>
											{selectedTheme === theme.id && (
												<Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
											)}
										</div>
									</div>
								</button>
							))}
						</div>
					</ScrollArea>
				</DialogContent>
			</Dialog>
		</>
	)
}
