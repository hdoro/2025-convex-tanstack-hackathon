import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_signed-out/auth')({
	component: RouteComponent,
})

function RouteComponent() {
	return <div>Hello "/_signed-out/auth"!</div>
}
