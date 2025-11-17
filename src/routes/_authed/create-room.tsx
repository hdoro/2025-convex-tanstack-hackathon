import { api } from '@db/_generated/api'
import { useMutation } from '@rjdellecese/confect/react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Effect } from 'effect'
import { useEffect } from 'react'
import LoadingScreen from '@/components/loading-screen'
import { CreateRoomArgs, CreateRoomResult } from '@/lib/schemas'

export const Route = createFileRoute('/_authed/create-room')({
	component: RouteComponent,
})

function RouteComponent() {
	const createRoom = useMutation({
		mutation: api.rooms.create,
		args: CreateRoomArgs,
		returns: CreateRoomResult,
	})
	const navigate = useNavigate()

	// biome-ignore lint: let's only run this on mount
	useEffect(() => {
		createRoom({}).pipe(
			Effect.tap((room) => {
				navigate({
					to: '/r/$handle',
					params: { handle: room.handle },
					replace: true,
				})
			}),
			Effect.runPromise,
		)
	}, [])

	return <LoadingScreen />
}
