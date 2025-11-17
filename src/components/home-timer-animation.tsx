'use client'

import { useEffect, useState } from 'react'
import { useLingui } from '@/hooks/use-lingui-stub'

const avatars = [
	{ color: 'bg-primary', name: 'CO' },
	{ color: 'bg-secondary ', name: 'NV' },
	{ color: 'bg-accent', name: 'EX' },
	{ color: 'bg-foreground text-background', name: 'TS' },
]

type TimerState = {
	mode: 'focus' | 'break'
	timeRemaining: number
}

const FOCUS_DURATION = 45
const BREAK_DURATION = 7.5

export function HomeTimerAnimation() {
	const [timerState, setTimerState] = useState<TimerState>({
		mode: 'focus',
		timeRemaining: FOCUS_DURATION,
	})
	const { t } = useLingui()

	const progress =
		(((timerState.mode === 'focus' ? FOCUS_DURATION : BREAK_DURATION) -
			timerState.timeRemaining) /
			(timerState.mode === 'focus' ? FOCUS_DURATION : BREAK_DURATION)) *
		100

	useEffect(() => {
		// Countdown timer
		const timerInterval = setInterval(() => {
			setTimerState((prev) => {
				if (prev.timeRemaining <= 0) {
					// Switch between focus and break
					const newMode = prev.mode === 'focus' ? 'break' : 'focus'
					const newTime = newMode === 'focus' ? FOCUS_DURATION : BREAK_DURATION
					return { mode: newMode, timeRemaining: newTime }
				}
				return { ...prev, timeRemaining: prev.timeRemaining - 1 }
			})
		}, 1000)

		return () => {
			clearInterval(timerInterval)
		}
	}, [])

	const minutes = Math.floor(timerState.timeRemaining)
	const seconds = Math.floor((timerState.timeRemaining / 60) % 60)

	return (
		<div className="relative flex w-full max-w-md flex-col items-center gap-2">
			{/* Central timer circle */}
			<div className="relative">
				{/* Progress ring */}
				<svg className="-rotate-90 h-80 w-80 transform" viewBox="0 0 200 200">
					{/* Background circle */}
					<circle
						cx="100"
						cy="100"
						r="85"
						fill="none"
						stroke="currentColor"
						strokeWidth="6"
						className="text-muted"
					/>

					<circle
						cx="100"
						cy="100"
						r="85"
						fill="none"
						stroke="currentColor"
						strokeWidth="6"
						strokeLinecap="round"
						strokeDasharray={`${2 * Math.PI * 85}`}
						strokeDashoffset={`${2 * Math.PI * 85 * (1 - progress / 100)}`}
						className="text-primary transition-all duration-1000 ease-linear"
					/>
				</svg>

				<div className="absolute inset-0 flex flex-col items-center justify-center">
					<div className="flex h-48 w-48 flex-col items-center justify-center rounded-full border border-border bg-card">
						<div className="font-bold font-mono text-5xl text-foreground tabular-nums">
							{minutes === 0 ? (
								'00:00'
							) : (
								<>
									{String(minutes).padStart(2, '0')}:
									{String(seconds).padStart(2, '0')}
								</>
							)}
						</div>
						<div className="mt-1 font-medium text-muted-foreground text-sm">
							{timerState.mode === 'focus' ? t`Focus Cycle` : t`Break Time`}
						</div>
					</div>
				</div>
			</div>

			<div className="-space-x-3 flex items-center">
				{avatars.map((avatar, index) => (
					<div
						key={index}
						className="relative transition-all duration-300 hover:z-10 hover:scale-110"
						style={{
							animation: `gentle-float 9s ease-in-out infinite`,
							animationDelay: `${index * 0.6}s`,
						}}
					>
						<div
							className={`h-14 w-14 select-none rounded-full ${avatar.color} flex items-center justify-center border-4 border-background font-semibold text-base`}
						>
							{avatar.name}
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
