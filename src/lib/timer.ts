import { Duration } from 'effect'
import { type Timer, type TimerEvent, Timestamp } from './schemas'

export interface TimerState {
	state: 'running' | 'paused' | 'completed'
	remaining: number
	elapsed: number
}

export function computeTimerState({
	timer,
	phaseDuration,
	now = Date.now(),
}: {
	timer: Timer
	phaseDuration: Duration.Duration
	now?: number
}): TimerState {
	if (timer.events.length === 0) {
		return {
			state: 'paused',
			remaining: Duration.toMillis(phaseDuration),
			elapsed: 0,
		}
	}

	let totalElapsed = 0
	let isRunning = false
	let lastStartTime = 0

	for (const event of timer.events) {
		switch (event.type) {
			case 'started':
				lastStartTime = event.timestamp
				isRunning = true
				break
			case 'paused':
				if (isRunning && lastStartTime > 0) {
					totalElapsed += event.timestamp - lastStartTime
					isRunning = false
					lastStartTime = 0
				}
				break
			case 'resumed':
				lastStartTime = event.timestamp
				isRunning = true
				break
			case 'skipped':
				// Skip to next phase, treat as completed
				return {
					state: 'completed',
					remaining: 0,
					elapsed: Duration.toMillis(phaseDuration),
				}
		}
	}

	// Add current running time if still running
	if (isRunning && lastStartTime > 0) {
		totalElapsed += now - lastStartTime
	}

	const phaseDurationMs = Duration.toMillis(phaseDuration)
	const remaining = Math.max(0, phaseDurationMs - totalElapsed)
	const elapsed = Math.min(phaseDurationMs, totalElapsed)

	return {
		state: remaining > 0 ? (isRunning ? 'running' : 'paused') : 'completed',
		remaining,
		elapsed,
	}
}

export function createTimerEvent(type: TimerEvent['type']): TimerEvent {
	return {
		type,
		timestamp: Timestamp.make(Date.now()),
	}
}
