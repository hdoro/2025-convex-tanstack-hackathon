import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed')({
	beforeLoad: ({ context, location }) => {
		if (!context.userId) {
			throw redirect({ to: '/auth', search: { redirect: location.href } })
		}
	},
})
