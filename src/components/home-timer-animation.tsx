'use client'

import { useEffect, useState } from 'react'

export function HomeTimerAnimation() {
	const [progress, setProgress] = useState(0)
	const [time, setTime] = useState(25 * 60) // 25 minutes in seconds

	const avatars = [
		{ color: 'bg-blue-500', name: 'JS' },
		{ color: 'bg-purple-500', name: 'AM' },
		{ color: 'bg-pink-500', name: 'SK' },
		{ color: 'bg-indigo-500', name: 'TR' },
	]

	useEffect(() => {
		// Animate progress
		const progressInterval = setInterval(() => {
			setProgress((prev) => (prev + 0.2) % 100)
		}, 50)

		// Countdown timer
		const timerInterval = setInterval(() => {
			setTime((prev) => {
				if (prev <= 0) return 25 * 60
				return prev - 1
			})
		}, 1000)

		return () => {
			clearInterval(progressInterval)
			clearInterval(timerInterval)
		}
	}, [])

	const minutes = Math.floor(time / 60)
	const seconds = time % 60

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
						className="text-primary transition-all duration-300"
					/>
				</svg>

				<div className="absolute inset-0 flex flex-col items-center justify-center">
					<div className="flex h-48 w-48 flex-col items-center justify-center rounded-full border border-border bg-card shadow-lg">
						<div className="font-bold font-mono text-5xl text-foreground tabular-nums">
							{String(minutes).padStart(2, '0')}:
							{String(seconds).padStart(2, '0')}
						</div>
						<div className="mt-1 font-medium text-muted-foreground text-sm">
							Focus Cycle
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
							className={`h-14 w-14 select-none rounded-full ${avatar.color} flex items-center justify-center border-4 border-background font-semibold text-base text-white shadow-lg`}
						>
							{avatar.name}
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
