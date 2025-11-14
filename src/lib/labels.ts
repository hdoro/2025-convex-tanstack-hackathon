import { type MacroMessageDescriptor, msg } from '@lingui/core/macro'
import type {
	CycleDebrief,
	CycleIntention,
	SessionDebrief,
	SessionIntention,
} from './schemas'

export const CYCLE_DEBRIEF_LABELS: Record<
	keyof CycleDebrief,
	MacroMessageDescriptor
> = {
	completedTarget: msg`Completed cycle's target?`,
	noteworthy: msg`Anything noteworthy?`,
	distractions: msg`Any distractions?`,
	improvements: msg`Things to improve for next cycle?`,
}

export const CYCLE_INTENTIONS_LABELS: Record<
	keyof CycleIntention,
	MacroMessageDescriptor
> = {
	energyLevel: msg`Your energy and alertness`,
	moraleLevel: msg`Confidence and morale`,
	goal: msg`Your goal for the cycle`,
	hazards: msg`Any hazards or risks present?`,
	howToStart: msg`How will you start tackling the goal(s)?`,
}

export const SESSION_DEBRIEF_LABELS: Record<
	keyof SessionDebrief,
	MacroMessageDescriptor
> = {
	accomplished: msg`What did you get done in this session?`,
	comparison: msg`How did this compare to your normal work output?`,
	boggedDown: msg`Did you get bogged down? Where?`,
	takeaways: msg`Any other takeaways? Lessons to share with others?`,
	wentWell: msg`What went well? How can you replicate this in the future?`,
}

export const SESSION_INTENTIONS_LABELS: Record<
	keyof SessionIntention,
	MacroMessageDescriptor
> = {
	goal: msg`What are you trying to accomplish?`,
	importance: msg`Why is this important and valuable?`,
	completionCriteria: msg`How will you know this is complete?`,
	risks: msg`Any risks/hazards?`,
	measurability: msg`Is this concrete or subjective?`,
}
