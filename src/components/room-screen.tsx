import { api } from '@db/_generated/api'
import { useMutation, useQuery } from '@rjdellecese/confect/react'
import { Effect, Option } from 'effect'
import { useEffect } from 'react'
import {
	GetActiveSessionArgs,
	GetActiveSessionResult,
	type RoomWithId,
	UpsertActiveSessionArgs,
	UpsertActiveSessionResult,
} from '@/lib/schemas'
import SessionIntentionsForm from './forms/session-intentions-form'
import LoadingScreen from './loading-screen'

export default function RoomScreen(props: { room: RoomWithId }) {
	const roomId = props.room._id
	const activeSession = useQuery({
		query: api.sessions.getActiveSession,
		args: GetActiveSessionArgs,
		returns: GetActiveSessionResult,
	})({ roomId })
	const upsertActiveSession = useMutation({
		mutation: api.sessions.upsertActiveSession,
		args: UpsertActiveSessionArgs,
		returns: UpsertActiveSessionResult,
	})

	useEffect(() => {
		if (Option.isNone(activeSession) || !!activeSession.value) return

		upsertActiveSession({ roomId }).pipe(Effect.runPromise)
	}, [activeSession, upsertActiveSession, roomId])

	if (Option.isNone(activeSession) || !activeSession.value)
		return <LoadingScreen />

	return (
		<div>
			<SessionIntentionsForm session={activeSession.value} />
		</div>
	)
}
