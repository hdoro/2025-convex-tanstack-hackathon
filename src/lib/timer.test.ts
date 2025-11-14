import { Duration } from 'effect'
import { describe, expect, it } from 'vitest'
import { type Timer, type TimerEvent, Timestamp } from './schemas'
import { computeTimerState } from './timer'

describe('Timer State Computation', () => {
	const baseTime = Timestamp.make(1000000) // Base timestamp for consistent testing
	const workDuration = Duration.minutes(40)
	const breakDuration = Duration.minutes(5)

	function createTimer(events: TimerEvent[], version: number = 0): Timer {
		return {
			duration: workDuration,
			events,
			version,
		}
	}

	function createEvent(
		type: TimerEvent['type'],
		timestamp: number = baseTime,
	): TimerEvent {
		return { type, timestamp: Timestamp.make(timestamp) }
	}

	describe('Initial State', () => {
		it('should return paused state with full duration when no events exist', () => {
			const timer = createTimer([])
			const state = computeTimerState({
				timer,
				phaseDuration: workDuration,
				now: baseTime,
			})

			expect(state.state).toBe('paused')
			expect(state.remaining).toBe(Duration.toMillis(workDuration))
			expect(state.elapsed).toBe(0)
		})
	})

	describe('Started Timer', () => {
		it('should compute running state after start event', () => {
			const timer = createTimer([createEvent('started', baseTime)])
			const state = computeTimerState({
				timer,
				phaseDuration: workDuration,
				now: baseTime + 1000,
			})

			expect(state.state).toBe('running')
			expect(state.elapsed).toBe(1000)
			expect(state.remaining).toBe(Duration.toMillis(workDuration) - 1000)
		})

		it('should handle work phase duration correctly', () => {
			const timer = createTimer([createEvent('started', baseTime)])
			const halfWork = Duration.toMillis(workDuration) / 2
			const state = computeTimerState({
				timer,
				phaseDuration: workDuration,
				now: baseTime + halfWork,
			})

			expect(state.state).toBe('running')
			expect(state.elapsed).toBe(halfWork)
			expect(state.remaining).toBe(halfWork)
		})

		it('should handle break phase duration correctly', () => {
			const timer = createTimer([createEvent('started', baseTime)])
			const halfBreak = Duration.toMillis(breakDuration) / 2
			const state = computeTimerState({
				timer,
				phaseDuration: breakDuration,
				now: baseTime + halfBreak,
			})

			expect(state.state).toBe('running')
			expect(state.elapsed).toBe(halfBreak)
			expect(state.remaining).toBe(halfBreak)
		})
	})

	describe('Paused Timer', () => {
		it('should compute paused state after pause event', () => {
			const events = [
				createEvent('started', baseTime),
				createEvent('paused', baseTime + 5000),
			]
			const timer = createTimer(events)
			const state = computeTimerState({
				timer,
				phaseDuration: workDuration,
				now: baseTime + 10000,
			})

			expect(state.state).toBe('paused')
			expect(state.elapsed).toBe(5000)
			expect(state.remaining).toBe(Duration.toMillis(workDuration) - 5000)
		})

		it('should not accumulate time while paused', () => {
			const events = [
				createEvent('started', baseTime),
				createEvent('paused', baseTime + 5000),
			]
			const timer = createTimer(events)
			const state1 = computeTimerState({
				timer,
				phaseDuration: workDuration,
				now: baseTime + 10000,
			})
			const state2 = computeTimerState({
				timer,
				phaseDuration: workDuration,
				now: baseTime + 20000,
			})

			expect(state1.elapsed).toBe(5000)
			expect(state2.elapsed).toBe(5000) // Should be the same
		})
	})

	describe('Resumed Timer', () => {
		it('should accumulate time correctly after resume', () => {
			const events = [
				createEvent('started', baseTime),
				createEvent('paused', baseTime + 5000),
				createEvent('resumed', baseTime + 10000),
			]
			const timer = createTimer(events)
			const state = computeTimerState({
				timer,
				phaseDuration: workDuration,
				now: baseTime + 15000,
			})

			expect(state.state).toBe('running')
			expect(state.elapsed).toBe(10000) // 5s before pause + 5s after resume
			expect(state.remaining).toBe(Duration.toMillis(workDuration) - 10000)
		})

		it('should handle multiple pause/resume cycles', () => {
			const events = [
				createEvent('started', baseTime),
				createEvent('paused', baseTime + 5000),
				createEvent('resumed', baseTime + 10000),
				createEvent('paused', baseTime + 15000),
				createEvent('resumed', baseTime + 20000),
			]
			const timer = createTimer(events)
			const state = computeTimerState({
				timer,
				phaseDuration: workDuration,
				now: baseTime + 25000,
			})

			expect(state.state).toBe('running')
			expect(state.elapsed).toBe(15000) // 5s + 5s + 5s = 15s
			expect(state.remaining).toBe(Duration.toMillis(workDuration) - 15000)
		})
	})

	describe('Completed Timer', () => {
		it('should return completed state when duration is reached', () => {
			const events = [createEvent('started', baseTime)]
			const timer = createTimer(events)
			const fullDuration = Duration.toMillis(workDuration)
			const state = computeTimerState({
				timer,
				phaseDuration: workDuration,
				now: baseTime + fullDuration + 1000,
			})

			expect(state.state).toBe('completed')
			expect(state.remaining).toBe(0)
			expect(state.elapsed).toBe(fullDuration)
		})

		it('should cap elapsed time at phase duration', () => {
			const events = [createEvent('started', baseTime)]
			const timer = createTimer(events)
			const fullDuration = Duration.toMillis(workDuration)
			const state = computeTimerState({
				timer,
				phaseDuration: workDuration,
				now: baseTime + fullDuration + 5000,
			})

			expect(state.elapsed).toBe(fullDuration) // Should not exceed phase duration
		})
	})

	describe('Skipped Timer', () => {
		it('should return completed state immediately on skip', () => {
			const events = [createEvent('skipped', baseTime)]
			const timer = createTimer(events)
			const state = computeTimerState({
				timer,
				phaseDuration: workDuration,
				now: baseTime + 1000,
			})

			expect(state.state).toBe('completed')
			expect(state.remaining).toBe(0)
			expect(state.elapsed).toBe(Duration.toMillis(workDuration))
		})

		it('should ignore previous events when skip occurs', () => {
			const events = [
				createEvent('started', baseTime),
				createEvent('paused', baseTime + 5000),
				createEvent('resumed', baseTime + 10000),
				createEvent('skipped', baseTime + 15000),
			]
			const timer = createTimer(events)
			const state = computeTimerState({
				timer,
				phaseDuration: workDuration,
				now: baseTime + 20000,
			})

			expect(state.state).toBe('completed')
			expect(state.elapsed).toBe(Duration.toMillis(workDuration))
		})
	})

	describe('Edge Cases', () => {
		it('should handle pause without start', () => {
			const events = [createEvent('paused', baseTime)]
			const timer = createTimer(events)
			const state = computeTimerState({
				timer,
				phaseDuration: workDuration,
				now: baseTime + 1000,
			})

			expect(state.state).toBe('paused')
			expect(state.elapsed).toBe(0)
		})

		it('should handle resume without start', () => {
			const events = [createEvent('resumed', baseTime)]
			const timer = createTimer(events)
			const state = computeTimerState({
				timer,
				phaseDuration: workDuration,
				now: baseTime + 1000,
			})

			expect(state.state).toBe('running')
			expect(state.elapsed).toBe(1000)
		})

		it('should handle multiple pause events', () => {
			const events = [
				createEvent('started', baseTime),
				createEvent('paused', baseTime + 5000),
				createEvent('paused', baseTime + 10000), // Extra pause
			]
			const timer = createTimer(events)
			const state = computeTimerState({
				timer,
				phaseDuration: workDuration,
				now: baseTime + 15000,
			})

			expect(state.state).toBe('paused')
			expect(state.elapsed).toBe(5000)
		})

		it('should handle zero duration', () => {
			const timer = createTimer([createEvent('started', baseTime)])
			const zeroDuration = Duration.millis(0)
			const state = computeTimerState({
				timer,
				phaseDuration: zeroDuration,
				now: baseTime + 1000,
			})

			expect(state.state).toBe('completed')
			expect(state.remaining).toBe(0)
			expect(state.elapsed).toBe(0)
		})
	})

	describe('Real-world Scenarios', () => {
		it('should handle typical work cycle with interruptions', () => {
			// User starts work, gets interrupted, resumes, then completes
			const events = [
				createEvent('started', baseTime), // Start 40-min work session
				createEvent(
					'paused',
					baseTime + Duration.toMillis(Duration.minutes(10)),
				), // Pause after 10 min
				createEvent(
					'resumed',
					baseTime + Duration.toMillis(Duration.minutes(15)),
				), // Resume after 5 min break
				createEvent(
					'paused',
					baseTime + Duration.toMillis(Duration.minutes(25)),
				), // Pause after 10 more min
				createEvent(
					'resumed',
					baseTime + Duration.toMillis(Duration.minutes(30)),
				), // Resume after 5 min break
			]
			const timer = createTimer(events)
			const state = computeTimerState({
				timer,
				phaseDuration: workDuration,
				now: baseTime + Duration.toMillis(Duration.minutes(35)),
			})

			expect(state.state).toBe('running')
			expect(state.elapsed).toBe(Duration.toMillis(Duration.minutes(25))) // 10 + 10 + 5 = 25 min of actual work
			expect(state.remaining).toBe(Duration.toMillis(Duration.minutes(15))) // 15 min remaining
		})

		it('should handle short break cycle', () => {
			const events = [createEvent('started', baseTime)]
			const timer = createTimer(events)
			const state = computeTimerState({
				timer,
				phaseDuration: breakDuration,
				now: baseTime + Duration.toMillis(Duration.minutes(3)),
			})

			expect(state.state).toBe('running')
			expect(state.elapsed).toBe(Duration.toMillis(Duration.minutes(3)))
			expect(state.remaining).toBe(Duration.toMillis(Duration.minutes(2)))
		})

		it('should handle micro-sessions', () => {
			// Very short 1-minute sessions for testing
			const microDuration = Duration.minutes(1)
			const events = [
				createEvent('started', baseTime),
				createEvent('paused', baseTime + 30000), // Pause at 30 seconds
				createEvent('resumed', baseTime + 45000), // Resume at 45 seconds
			]
			const timer = createTimer(events)
			const state = computeTimerState({
				timer,
				phaseDuration: microDuration,
				now: baseTime + 55000,
			}) // Check at 55 seconds

			expect(state.state).toBe('running')
			expect(state.elapsed).toBe(40000) // 30s + 10s = 40s
			expect(state.remaining).toBe(20000) // 20s remaining
		})
	})
})
