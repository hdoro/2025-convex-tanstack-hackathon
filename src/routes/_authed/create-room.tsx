import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/create-room')({
	component: RouteComponent,
})

function RouteComponent() {
	return <div>Hello "/_authed/create-room"!</div>
}
