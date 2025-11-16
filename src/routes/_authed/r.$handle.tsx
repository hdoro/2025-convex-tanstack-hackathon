import { api } from '@db/_generated/api'
import { useQuery } from '@rjdellecese/confect/react'
import { createFileRoute } from '@tanstack/react-router'
import { Option } from 'effect'
import LoadingScreen from '@/components/loading-screen'
import NotFoundScreen from '@/components/not-found-screen'
import { GetRoomByHandleArgs, GetRoomByHandleResult } from '@/lib/schemas'

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

	console.log(query)
	return Option.match(query, {
		onNone: () => <LoadingScreen />,
		onSome: (result) =>
			Option.match(result, {
				onNone: () => <NotFoundScreen />,
				onSome: (room) => <div>Room! {room.handle}</div>,
			}),
	})
}
