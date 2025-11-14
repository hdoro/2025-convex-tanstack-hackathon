import { useLingui } from '@lingui/react/macro'
import { createFileRoute } from '@tanstack/react-router'
import { CYCLE_DEBRIEF_LABELS } from '@/lib/labels'

export const Route = createFileRoute('/')({ component: App })

function App() {
	const { t } = useLingui()
	return <div>{t(CYCLE_DEBRIEF_LABELS.completedTarget)}</div>
}
