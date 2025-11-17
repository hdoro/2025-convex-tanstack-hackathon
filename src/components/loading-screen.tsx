import { Spinner } from './ui/spinner'

export default function LoadingScreen() {
	return (
		<div className="flex h-screen w-full items-center justify-center">
			<Spinner className="size-8" />
		</div>
	)
}
