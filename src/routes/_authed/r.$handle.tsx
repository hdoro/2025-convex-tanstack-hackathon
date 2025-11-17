import { api } from '@db/_generated/api'
import { useMutation, useQuery } from '@rjdellecese/confect/react'
import { createFileRoute } from '@tanstack/react-router'
import { Option, Schema } from 'effect'
import LoadingScreen from '@/components/loading-screen'
import NotFoundScreen from '@/components/not-found-screen'
import { Button } from '@/components/ui/button'
import {
	AskToJoinRoomArgs,
	GetRoomByHandleArgs,
	GetRoomByHandleResult,
} from '@/lib/schemas'

export const Route = createFileRoute('/_authed/r/$handle')({
	component: RouteComponent,
})

function RouteComponent() {
	const { handle } = Route.useParams()
	const query = useQuery({
		query: api.rooms.getByHandle,
		args: GetRoomByHandleArgs,
		returns: GetRoomByHandleResult,
	})({ handle })
	const askToJoin = useMutation({
		args: AskToJoinRoomArgs,
		returns: Schema.Null,
		mutation: api.rooms.askToJoin,
	})

	console.log(query)
	return Option.match(query, {
		onNone: () => <LoadingScreen />,
		onSome: (result) => {
			if (!result) return <NotFoundScreen />

			if (result.access === 'denied') return <div>Access denied</div>
			if (result.access === 'pending') return <div>Waiting for access...</div>
			if (result.access === 'not-requested')
				return (
					<div>
						{' '}
						<Button onClick={() => askToJoin({ handle })}>Ask to join</Button>
					</div>
				)

			if (result.access === 'allowed') return <div>You're into the room</div>
			return null
		},
	})
}
