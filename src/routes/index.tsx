import { createFileRoute, Link } from '@tanstack/react-router'
import { HomeTimerAnimation } from '@/components/home-timer-animation'
import { Button } from '@/components/ui/button'
import { useLingui } from '@/hooks/use-lingui-stub'

export const Route = createFileRoute('/')({ component: App })

function App() {
	const { t } = useLingui()

	return (
		<main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
			<div className="absolute inset-0 bg-background" />

			<div className="container relative z-10 mx-auto px-4 py-16 md:py-24">
				<div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
					{/* Left column - Copy */}
					<div className="space-y-8 text-center lg:text-left">
						<div className="space-y-4">
							<h1 className="text-balance font-bold text-4xl text-muted-foreground tracking-tight md:text-5xl lg:text-7xl">
								{t`Go beyond solo,`}
								<br />
								<span className="text-foreground">flow together</span>
							</h1>
							<p className="max-w-2xl text-pretty text-lg text-muted-foreground leading-relaxed md:text-xl">
								{t`Work in focused cycles with others and keep each other on track.
								Clarify your goals with simple questions. Stay accountable.
								Reach flow state.`}
							</p>
						</div>

						<div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
							<Button size="lg" asChild>
								<Link to="/create-room">{t`Start Session`}</Link>
							</Button>
							{/*<Button size="lg" variant="outline">
								{t`Join Session`}
							</Button>*/}
						</div>
					</div>

					{/* Right column - Timer Animation */}
					<div className="flex justify-center lg:justify-end">
						<HomeTimerAnimation />
					</div>
				</div>
			</div>
		</main>
	)
}
