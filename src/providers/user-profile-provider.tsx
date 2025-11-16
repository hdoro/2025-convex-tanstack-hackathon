import { api } from '@db/_generated/api'
import { useQuery } from '@rjdellecese/confect/react'
import type { PropsWithChildren } from 'react'
import {
	GetCurrentUserProfileArgs,
	GetCurrentUserProfileReturn,
} from '@/lib/schemas'

export default function UserProfileProvider(props: PropsWithChildren) {
	const userProfile = useQuery({
		query: api.userProfiles.getCurrentProfile,
		args: GetCurrentUserProfileArgs,
		returns: GetCurrentUserProfileReturn,
	})({})
	console.log({ userProfile })
	return <>{props.children}</>
}
