import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({ component: App })

function App() {
	const navigate = useNavigate()
	async function logIn() {
		console.log('HERE')
		// const user = await authClient.signIn.anonymous()
		navigate({ to: '/create-room' })
	}
	return (
		<div>
			@TODO
			<Button onClick={logIn}>Log in</Button>
		</div>
	)
}
