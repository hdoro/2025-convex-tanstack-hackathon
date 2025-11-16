import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_signed-out')({
	beforeLoad: ({ context }) => {
		if (context.userId) {
			throw redirect({ to: '/' })
		}
	},
})
